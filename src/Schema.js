/*
 * Author: ugrg
 * Create Time: 2019/10/24 10:09
 */
import { isFunction, isNull, isObject, isString, isUndefined } from "./utils";
import { anyType } from "./utils";

import ValidationError from "./ValidationError";

const _TEST_TASKS_ = Symbol("tests");

class Schema {
  /**
   * 基础验证对象
   * @param {function}[isType]
   * @param {{
   *   nullAllow:boolean,
   *   undefinedAllow:boolean
   * }}[options]
   */
  constructor (isType = anyType, options = {}) {
    if (isObject(isType)) [isType, options] = [anyType, isType];
    const { nullAllow = false, undefinedAllow = false, typeMismatch = "类型不匹配！" } = options;
    this._nullAllow = nullAllow;
    this._undefinedAllow = undefinedAllow;
    this._isType = isType;
    this[_TEST_TASKS_] = [];
    this.test("isType", typeMismatch, (value) => (
      this._nullAllow && isNull(value) ||
      this._undefinedAllow && isUndefined(value) ||
      this._isType(value)
    ));
  }

  isType (value) {
    return this._isType(value);
  }

  /**
   * 设置是否允许为null
   * @param {boolean}flg
   * @returns {Schema}
   */
  nullAllow (flg = true) {
    this._nullAllow = flg;
    return this;
  }

  /**
   * 设置是否允许为undefined
   * @param {boolean}flg
   * @returns {Schema}
   */
  undefinedAllow (flg = true) {
    this._undefinedAllow = flg;
    return this;
  }

  /**
   * 添加转换过滤器
   * @param {Function}convert 转换函数
   * @param {Boolean}[prev] 是否前置转换
   * @returns {Schema}
   */
  transform (convert, prev = false) {
    if (!isFunction(convert)) throw new Error("无法添加转换器！");
    this[_TEST_TASKS_][prev ? "unshift" : "push"]((value, options) => {
      return Promise.resolve(convert(value)).then((value) => [value, options]);
    });
    return this;
  }

  /**
   * 新建检查点
   * @param {String}[name]  检查原因
   * @param {String|Function}[message] 未通过提示
   * @param {Function}test  检查方法
   *    执行异步等待，return true则表示通过检测，return false,则表示未通过，中断检测，并报异常
   * @param {boolean}prev 前置检查点
   * @returns {Schema}
   */
  test (name, message, test, prev = false) {
    if (isFunction(name)) [name, message] = [null, name];
    if (isFunction(message) && !test) [message, test] = [null, message];
    if (!isFunction(test)) throw new Error("无法添加检查点！");
    this[_TEST_TASKS_][prev ? "unshift" : "push"]((value, options) => {
      return Promise.resolve(test(value, options)).then((flg) => {
        if (!flg) throw new ValidationError(message, options.path, name);
        return [value, options];
      });
    });
    return this;
  }

  /**
   * 执行检查
   * @param {*}[values]
   * @param {object}[options]
   * @returns {Promise<>}
   */
  validate (values, options) {
    return this[_TEST_TASKS_].reduce(
      (p, fn) => p.then(([value, _options]) => fn(value, _options)),
      Promise.resolve([values, Object.assign({ value: values }, options)])
    ).then(([value]) => value)
      .catch(error => Promise.reject(error instanceof Error ? error.message : error));
  }

  /**
   * 联合检查
   * @param {String|Array}keys
   * @param {{
   *  is:Function|*,
   *  [then]:Schema,
   *  [otherwise]:Schema
   * }}builder
   * @returns {Schema}
   */
  when (keys, builder) {
    this[_TEST_TASKS_].push((value, options = {}) => {
      const { parent = {} } = options;
      const { is, then, otherwise } = builder;
      const tests = Array.isArray(keys) ? keys.map(key => parent[key]) : parent[keys];

      // 计算is是否匹配成功
      const isThen = (isFunction(is) && is(tests)) ||
        (Array.isArray(tests) && Array.isArray(is) && tests.every((test, i) => test === is[i])) ||
        (Array.isArray(tests) && !Array.isArray(is) && tests.every((test) => test === is)) ||
        tests === is;

      if (isThen && then instanceof Schema) {
        // 如果is验证成功，且then是一个有效的Schema，则执行then
        return Promise.resolve(then.validate(value, options)).then(value => [value, options]);
      } else if (!isThen && otherwise instanceof Schema) {
        // 如果is验证失败，且otherwise是一个有效的Schema，则执行otherwise
        return Promise.resolve(otherwise.validate(value, options)).then(value => [value, options]);
      } else return [value, options];
    });
    return this;
  }

  /**
   * 类型枚举检查
   * @param {Array<Schema>}types
   * @param {String|Function}[message]
   */
  oneOfType (types, message = "未知类型！") {
    this[_TEST_TASKS_].push((value, options = {}) => {
      const type = types.reduce((p, t) => t.isType(value) ? t : p, null);
      if (type === null) throw new ValidationError(message, options.path || "", "oneOfType");
      return Promise.resolve(type.validate(value, options)).then(newValue => [newValue, options]);
    });
    return this;
  }

  /**
   * 非空判定
   * @param {String|Function}[message]
   * @param {Array<*>}options
   * @returns {Schema}
   */
  required (message = "不可为空！", options = []) {
    if (!this._nullAllow) options.push(null);
    if (!this._undefinedAllow) options.push(undefined);
    return this.notOneOf(options, message, "required");
  }

  /**
   * 枚举检查
   * @param {Array<*>|*}items
   * @param {String|Function}[message]
   * @param {Function}[equals]
   * @param {String}[name]
   * @returns {Schema}
   */
  oneOf (items = [], message = "未知值！", equals, name = "oneOf") {
    if (isString(equals)) [equals, name] = [undefined, equals];
    items = [].concat(items);
    const _setItems = new Set(items);
    let has = equals
      ? (value) => items.some((item) => equals(item, value))
      : (value) => _setItems.has(value);
    return this.test(name, message, has);
  }

  /**
   * 反向枚举检查
   * @param {Array<*>|*}items
   * @param {String|Function}[message]
   * @param {Function}[equals]
   * @param {String}[name]
   * @returns {Schema}
   */
  notOneOf (items, message = "禁用值！", equals, name = "notOneOf") {
    if (isString(equals)) [equals, name] = [undefined, equals];
    items = [].concat(items);
    const _setItems = new Set(items);
    let has = equals
      ? (value) => !items.some((item) => equals(item, value))
      : (value) => !_setItems.has(value);
    return this.test(name, message, has);
  }

  strip () {
    return this.transform(() => undefined);
  }

  // 清除从value值
  remove () {
    return this.transform(() => undefined);
  }

  /**
   * 设置默认值
   * @param {*}value
   * @returns {Schema}
   */
  default (value) {
    return this.transform((org) => {
      if (!this._nullAllow && isNull(org)) return value;
      if (!this._undefinedAllow && isUndefined(org)) return value;
      return org;
    }, true);
  }

  /**
   * 必须是
   * @param {*}value
   * @param {String|Function}[message]
   */
  toBe (value, message = `必须是${value}`) {
    return this.oneOf(value, message, "toBe");
  }

  /**
   * 级联验证
   * @param {Schema}schema
   * @returns {Schema}
   */
  concat (schema) {
    this[_TEST_TASKS_].push((value, options) => {
      return Promise.resolve(schema.validate(value, options)).then((value) => [value, options]);
    });
    return this;
  }

  /**
   * 复制一个自己
   */
  clone () {
    const clone = Object.create(this);
    clone[_TEST_TASKS_] = [].concat(this[_TEST_TASKS_]);
    return clone;
  }
}

export default Schema;
