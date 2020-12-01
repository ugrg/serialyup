/*
 * Author: ugrg
 * Create Time: 2019/10/25 10:46
 */

import Schema, { SchemaOptions } from "./Schema";
import { isNumber, isString } from "./utils";

class NumberSchema extends Schema {
  constructor (options: SchemaOptions) {
    super(isNumber, options);
    this.transform((value) => isString(value) ? parseFloat(value) : value, true);
  }

  /**
   * 最小值检查
   * @param {Number}limit
   * @param {String|Function}[message]
   * @returns {Schema}
   */
  min (limit: number, message = `小于${limit}`) {
    return this.test("min", message, (value) => value >= limit);
  }

  /**
   * 最大值检查
   * @param {Number}limit
   * @param {String|Function}[message]
   * @returns {Schema}
   */
  max (limit: number, message = `大于${limit}`) {
    return this.test("max", message, (value) => value <= limit);
  }

  /**
   * 正数数检查
   * @param {String|Function}[message]
   * @returns {Schema}
   */
  positive (message = "必须为正数！") {
    return this.test("positive", message, (value) => value > 0);
  }

  /**
   * 负数检查
   * @param {String|Function}[message]
   * @returns {Schema}
   */
  negative (message = "必须为负数！") {
    return this.test("negative", message, (value) => value < 0);
  }

  /**
   * 整型验证
   * @param message
   * @returns {Schema}
   */
  integer (message = "必须整数！") {
    return this.test("integer", message, (value) => Number.isInteger(value));
  }

  /**
   * 取整
   * @param {"floor"|"ceil"|"round"}[fn]
   */
  round (fn = "round" as "floor" | "ceil" | "round") {
    if (!new Set(["floor", "ceil", "round"]).has(fn)) {
      throw new Error(`不支持${fn}取整算法！`);
    }
    return this.transform((value) => Math[fn](value));
  }

  /**
   * 必须选项
   * @param {String}message
   * @param {Array<*>}[options]
   * @returns {*}
   */
  required (message: string, options = []) {
    return super.required(message, ([] as any[]).concat(options, NaN));
  }
}

export default NumberSchema;
