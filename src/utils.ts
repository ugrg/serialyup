/*
 * Author: ugrg
 * Create Time: 2019/10/24 18:37
 */
import types from "typechecker";

const { isBoolean, isNumber, isString, isObject: _isObject, isDate, isNull, isUndefined, isFunction } = types;

const isObject = (val: any) => _isObject(val) && !Array.isArray(val);
export { isBoolean, isNumber, isString, isObject, isDate, isNull, isUndefined, isFunction };

export const anyType = (__val?: any) => true;
// Object.entries逆向计算
export const reverseEntries = (entries: any[]) => entries.reduce(
  (result, [key, value]) => Object.assign(result, { [key]: value }),
  {}
);

export const promiseObjectAllSettled = (object: Record<string, any>) => {
  if (!Array.isArray(object) && !isObject(object)) throw new Error("无效参数！");
  const entries = Array.isArray(object) ? object : Object.entries(object);
  const keys = entries.map(([key]) => key);
  const values = entries.map(([__key, value]) => value);
  return Promise.all(
    values.map(task => task
      .then((value: any) => ({ status: "fulfilled", value }))
      .catch((reason: any) => ({ status: "rejected", reason }))
    )).then(results => results.some(({ status }) => status === "rejected")
    ? Promise.reject(reverseEntries(results.map((result, index) => [keys[index], result.reason])))
    : Promise.resolve(reverseEntries(results.map((result, index) => [keys[index], result.value]))));
};
