/*
 * Author: ugrg
 * Create Time: 2019/10/24 16:16
 */

import Schema from "./Schema";
import ValidationError from "./ValidationError";
import { promiseObjectAllSettled, isObject } from "./utils";

class ObjectSchema extends Schema {
  constructor (schemas, options = {}) {
    const { exact = false, exactMessage, ...others } = options;
    super(isObject, others);
    this.schemas = schemas;
    this._exact = exact;
    this._exactMessage = exactMessage || "含有未知属性！";
  }

  /**
   * 宽容检查
   * @param {Schema|Object<{:Schema}>}schemas
   * @returns {ObjectSchema}
   */
  shape (schemas) {
    if (schemas instanceof ObjectSchema) schemas = schemas.schemas;
    this.schemas = schemas;
    this._exact = false;
    return this;
  }

  /**
   * 严格检查
   * @param {Schema|Object<{:Schema}>}schemas
   * @param {String|Function}[message]
   * @returns {ObjectSchema}
   */
  exact (schemas, message = "含有未被允许的属性") {
    if (schemas instanceof ObjectSchema) schemas = schemas.schemas;
    this.schemas = schemas;
    this._exact = true;
    this._exactMessage = message || this._exactMessage;
    return this;
  }

  /**
   * 执行检查
   * @param {object}values
   * @param {object}[options]
   * @returns {Promise<>}
   */
  validate (values, options = {}) {
    const { path = "", values: orgValues = values } = options;
    return super.validate(values, options).then((values) => {
      // 生成非验证字段集合
      const reserveValues = Object.entries(values).filter(([key]) => this.schemas.hasOwnProperty(key));
      if (this._exact && reserveValues.length > 0)
        throw new ValidationError(this._exactMessage, path, "exact");
      return promiseObjectAllSettled(Object.entries(this.schemas).map(([key, schema]) => {
        const _options = Object.assign({}, options, {
          path: [path, key].filter(Boolean).join("."),
          parent: values,
          values: orgValues
        });
        return [key, schema.validate(values[key], _options)];
      }));
    }).catch(error => Promise.reject(error instanceof Error ? error.message : error));
  }
}

export default ObjectSchema;
