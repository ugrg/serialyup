/*
 * Author: ugrg
 * Create Time: 2019/10/25 15:29
 */

import { isDate, isString } from "./utils";
import Schema from "./Schema";
import moment from "moment";

class DateSchema extends Schema {
  constructor (options) {
    super(isDate, options);
    this.transform((value) => {
      if (!isString(value)) return value;
      const date = moment(value);
      return date.isValid() ? date.toDate() : value;
    }, true);
  }

  format (format) {
    return this.transform((value) => {
      if (!format) return value.toISOString();
      return moment(value).format(format);
    });
  }

  /**
   * 最大日期
   * @param {Date}limit
   * @param {String|Function}[message]
   */
  max (limit, message = `不可在${limit.toISOString()}之后！`) {
    return this.test("max", message, (value) => value.valueOf() <= limit.valueOf());
  }

  /**
   * 最小日期
   * @param limit
   * @param message
   */
  min (limit, message = `不可在${limit.toISOString()}之前！`) {
    return this.test("max", message, (value) => value.valueOf() >= limit.valueOf());
  }
}

export default DateSchema;
