/*
 * Author: ugrg
 * Create Time: 2019/10/25 15:17
 */

import { isBoolean } from "./utils";
import Schema from "./Schema";

class BooleanSchema extends Schema {
  constructor (options) {
    super(isBoolean, options);
    this.transform((value) => !!value, true);
  }

  /**
   * True检查
   * @param {String|Function}[message]
   */
  isTrue (message = "必需为True") {
    return this.toBe(true, message);
  }

  /**
   * False检查
   * @param {String|Function}[message]
   */
  isFalse (message = "必需为False") {
    return this.toBe(false, message);
  }
}

export default BooleanSchema;
