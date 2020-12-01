/*
 * Author: ugrg
 * Create Time: 2019/10/24 15:21
 */

import Schema, { SchemaOptions } from "./Schema";
import { isNull, isString, isUndefined } from "./utils";

// eslint-disable-next-line no-control-regex
const rEmail = /^((([a-z]|\d|[!#$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#$%&'*+\-/=?^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)(((((\x20)|\x09)*(\x0d\x0a))?((\x20)|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*((((\x20)|\x09)*(\x0d\x0a))?((\x20)|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
const rUrl = /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!$&'()*+,;=]|:|@)|\/|\?)*)?$/i;

class StringSchema extends Schema {
  constructor (options: SchemaOptions) {
    super(isString, options);
    this.default("");
  }

  /**
   * 进行正则检查
   * @param {RegExp}reg
   * @param {Object<{
   *    message:String,
   *    excludeEmptyString:Boolean,
   *    matchRule:Boolean,
   *    name:String
   * }>|String} options
   * @returns {Schema}
   */
  matches (reg: RegExp, options = {} as string | { message: string, excludeEmptyString?: boolean, matchRule?: boolean, name?: string }) {
    options = isString(options) ? { message: options as string } : options;
    const { message, excludeEmptyString = false, matchRule = true, name = "matches" } = options as Exclude<typeof options, string>;
    return this.test(name, message, (value) => {
      if (excludeEmptyString && (value === null || value === undefined || value === "")) return true;
      return reg.test(value) === matchRule;
    });
  }

  /**
   * 必须选项
   * @param {String}message
   * @param {Array<*>}[options]
   * @returns {Schema}
   */
  required (message: string, options = []) {
    return super.required(message, ([] as any[]).concat(options, ""));
  }

  /**
   * 固定长度检查
   * @param {Number} limit
   * @param {String|Function}[message]
   * @returns {Schema}
   */
  length (limit: number, message = "长度验证失败！") {
    return this.test("limit", message, (value) => isString(value) && value.length === limit);
  }

  /**
   * 最小长度检查
   * @param {Number} limit 最小长度
   * @param {String|Function}[message]
   * @returns {Schema}
   */
  min (limit: number, message = `长度小于${limit}！`) {
    return this.test("limit", message, (value) => isString(value) && value.length >= limit);
  }

  /**
   * 最大长度检查
   * @param {Number}limit
   * @param {String|Function}[message]
   * @returns {Schema}
   */
  max (limit: number, message = `长度大于${limit}！`) {
    return this.test("limit", message, (value) => isString(value) && value.length <= limit);
  }

  /**
   * 邮箱格式检查
   * @param {String|Function}[message]
   * @returns {Schema}
   */
  email (message = "邮箱验证失败！") {
    return this.matches(rEmail, { name: "email", message, excludeEmptyString: true });
  }

  /**
   * 网址格式检查
   * @param {String|Function}[message]
   * @returns {Schema}
   */
  url (message = "URL检查失败！") {
    return this.matches(rUrl, { name: "url", message, excludeEmptyString: true });
  }

  /**
   * 使用空字符串，对空值进行替换
   * @returns {Schema}
   */
  ensure () {
    return this.transform((value) => (isNull(value) || isUndefined(value)) ? "" : value);
  }

  /**
   * 执行小写变换
   * @returns {Schema}
   */
  lowercase () {
    return this.transform((value) => isString(value) ? value.toLowerCase() : value);
  }

  /**
   * 执行大写变换
   * @returns {Schema}
   */
  uppercase () {
    return this.transform((value) => isString(value) ? value.toUpperCase() : value);
  }

  /**
   * 对字符串进行trim
   * @returns {Schema}
   */
  trim () {
    return this.transform((value) => isString(value) ? value.replace(/^\s*(.*?)\s*$/, "$1") : value);
  }
}

export default StringSchema;
