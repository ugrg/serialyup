/*
 * Author: ugrg
 * Create Time: 2019/10/25 16:36
 */

import { isDate, isString } from "./utils";
import Schema from "./Schema";
import moment from "moment";

class MomentSchema extends Schema {
  constructor (options) {
    super(moment.isMoment, options);
    this.transform((value) => {
      if (isDate(value)) return moment(value);
      if (isString(value)) return moment(value);
      if (moment.isMoment(value)) return value.clone();
      return value;
    }, true);
  }

  add (diff, type) {
    return this.transform((value) => value.add(diff, type));
  }

  subtract (diff, type) {
    return this.transform((value) => value.subtract(diff, type));
  }

  startOf (type) {
    return this.transform((value) => value.startOf(type));
  }

  endOf (type) {
    return this.transform((value) => value.endOf(type));
  }

  format (format) {
    return this.transform((value) => value.format(format));
  }

  isBefore (date, type, message) {
    return this.test("isBefore", message, (value) => value.isBefore(date, type));
  }

  isSame (date, type, message) {
    return this.test("isSame", message, (value) => value.isSame(date, type));
  }

  isAfter (date, type, message) {
    return this.test("isAfter", message, (value) => value.isAfter(date, type));
  }

  isLeapYear (message) {
    return this.test("isLeapYear", message, (value) => value.isLeapYear());
  }

  isValid (message) {
    return this.test("isValid", message, (value) => value.isValid());
  }
}

export default MomentSchema;
