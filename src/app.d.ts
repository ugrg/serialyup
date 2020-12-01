declare module "typechecker" {
  type test = (value: any) => boolean
  export const isBoolean: test;
  export const isNumber: test;
  export const isString: test;
  export const isObject: test;
  export const isDate: test;
  export const isNull: test;
  export const isUndefined: test;
  export const isFunction: test;
}
