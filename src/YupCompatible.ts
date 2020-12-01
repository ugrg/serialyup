/*
 * Author: ugrg
 * Create Time: 2019/11/1 13:33
 */
import Schema, { Options } from "./Schema";
import { isObject } from "./utils";

const toInner = (error: any, path: string): { path: string, message: string }[] => {
  if (isObject(error)) {
    return Object.entries(error).reduce(
      (p, [key, value]) => p.concat(toInner(value, [path, key].filter(Boolean).join("."))),
      [] as ReturnType<typeof toInner>
    );
  } else if (Array.isArray(error)) {
    return error.reduce(
      (p, value, index) => p.concat(toInner(value, `${path}[${index}]`)),
      [] as ReturnType<typeof toInner>
    );
  } else if (error === undefined) {
    return [];
  } else {
    return [{ path, message: error }];
  }
};

class ValidationError {
  public name: string;
  public path: string;
  public errors: any[] | string;
  public inner: ReturnType<typeof toInner>;

  constructor (error: any) {
    this.name = "ValidationError";
    this.path = "";
    this.errors = [];
    this.inner = toInner(error, "");
    if (this.inner.length > 0) {
      this.path = this.inner[0].path;
      this.errors = this.inner[0].message;
    }
  }
}

class YupCompatible {
  private schema: Schema;

  constructor (schema: Schema) {
    this.schema = schema;
  }

  validate (values: any, options: Options) {
    return this.schema.validate(values, options).catch(errors => Promise.reject(new ValidationError(errors)));
  }
}

export default YupCompatible;
