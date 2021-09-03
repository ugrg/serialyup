/*
 * Author: ugrg
 * Create Time: 2019/10/25 16:36
 */

import moment, { DurationInputArg1, DurationInputArg2, Moment, MomentInput, unitOfTime } from 'moment';
import Schema, { SchemaOptions } from './Schema';
import { isDate, isString } from './utils';

class MomentSchema extends Schema {
  constructor (options?: SchemaOptions) {
    super(moment.isMoment, options);
    this.transform((value) => {
      if (isDate(value)) return moment(value);
      if (isString(value)) return moment(value);
      if (moment.isMoment(value)) return value.clone();
      return value;
    }, true);
  }

  add (amount: DurationInputArg1, unit: DurationInputArg2) {
    return this.transform((value: Moment) => value.add(amount, unit));
  }

  startOf (type: unitOfTime.StartOf) {
    return this.transform((value: Moment) => value.startOf(type));
  }

  endOf (type: unitOfTime.StartOf) {
    return this.transform((value: Moment) => value.endOf(type));
  }

  format (format: string) {
    return this.transform((value: Moment) => value.format(format));
  }

  isBefore (date: MomentInput, type: unitOfTime.StartOf, message: string) {
    return this.test('isBefore', message, (value) => value.isBefore(date, type));
  }

  isSame (date: MomentInput, type: unitOfTime.StartOf, message: string) {
    return this.test('isSame', message, (value) => value.isSame(date, type));
  }

  isAfter (date: MomentInput, type: unitOfTime.StartOf, message: string) {
    return this.test('isAfter', message, (value) => value.isAfter(date, type));
  }

  isLeapYear (message: string) {
    return this.test('isLeapYear', message, (value) => value.isLeapYear());
  }

  isValid (message: string) {
    return this.test('isValid', message, (value) => value.isValid());
  }
}

export default MomentSchema;
