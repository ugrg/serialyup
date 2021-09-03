/*
 * Author: ugrg
 * Create Time: 2019/10/25 16:53
 */

import Moment from 'moment';
import { date, moment } from '../src';

describe('moment', () => {
  it('create moment', () => {
    const momentSchema = moment();
    const dateSchema = date();
    const test = new Date();
    return Promise.all([
      momentSchema.validate(Moment('2019-09-09')).then(value => expect(value.isSame('2019-09-09')).toBeTruthy()),
      momentSchema.validate('2019-09-09').then(value => expect(value.isSame('2019-09-09')).toBeTruthy()),
      momentSchema.validate(new Date('2019-09-09 00:00:00')).then(value => expect(value.isSame('2019-09-09')).toBeTruthy()),
      dateSchema.validate(test).then(value => expect(value.valueOf()).toBe(test.valueOf()))
    ]);
  });
  it('transform', async () => {
    const day = Moment('2019-09-09');
    return Promise.all([
      moment().add(1, 'days').validate(day).then(value => expect(value.isSame('2019-09-10', 'days')).toBeTruthy()),
      moment().startOf('month').validate(day).then(value => expect(value.isSame('2019-09-01', 'days')).toBeTruthy()),
      moment().endOf('month').validate(day).then(value => expect(value.isSame('2019-09-30', 'days')).toBeTruthy()),
      moment().format('YYYY-MM-DD').validate(day).then(value => expect(value).toBe('2019-09-09'))
    ]);
  });
  it('isBefore', async () => {
    const left = Moment('2019-09-08');
    const day = Moment('2019-09-09');
    const right = Moment('2019-09-10');
    const MISS = '_MISS_';
    return Promise.all([
      moment().isBefore(left, 'day', MISS).validate(day).catch(error => expect(error).toBe(MISS)),
      moment().isBefore(right, 'day', MISS).validate(day).then(value => expect(value.isSame(day)).toBeTruthy())
    ]);
  });
  it('isSame', async () => {
    const left = Moment('2019-09-08');
    const day = Moment('2019-09-09');
    const right = Moment('2019-09-10');
    const MISS = '_MISS_';
    return Promise.all([
      moment().isSame(left, 'day', MISS).validate(day).catch(error => expect(error).toBe(MISS)),
      moment().isSame(day, 'day', MISS).validate(day).then(value => expect(value.isSame(day)).toBeTruthy()),
      moment().isSame(right, 'day', MISS).validate(day).catch(error => expect(error).toBe(MISS))
    ]);
  });
  it('isAfter', async () => {
    const left = Moment('2019-09-08');
    const day = Moment('2019-09-09');
    const right = Moment('2019-09-10');
    const MISS = '_MISS_';
    return Promise.all([
      moment().isAfter(right, 'day', MISS).validate(day).catch(error => expect(error).toBe(MISS)),
      moment().isAfter(left, 'day', MISS).validate(day).then(value => expect(value.isSame(day)).toBeTruthy())
    ]);
  });
  it('isLeapYear', async () => {
    const MISS = '_MISS_';
    return Promise.all([
      moment().isLeapYear(MISS).validate(Moment([2000, 0, 1])).then(value => expect(value.isSame(Moment('2000-01-01'), 'year')).toBeTruthy()),
      moment().isLeapYear(MISS).validate(Moment([2001, 0, 1])).catch(error => expect(error).toBe(MISS)),
      moment().isLeapYear(MISS).validate(Moment([2100, 0, 1])).catch(error => expect(error).toBe(MISS))
    ]);
  });
  it('isValid', async () => {
    const MISS = '_MISS_';
    const schema = moment().isValid(MISS);
    return Promise.all([
      schema.validate(Moment('2019-09-09')).then(value => expect(value.isSame('2019-09-09', 'days')).toBeTruthy()),
      schema.validate(Moment([2010, 13])).catch(error => expect(error).toBe(MISS)),
      schema.validate(Moment([2010, 10, 31])).catch(error => expect(error).toBe(MISS)),
      schema.validate(Moment([2010, 1, 29])).catch(error => expect(error).toBe(MISS))
    ]);
  });
});
