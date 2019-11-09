/*
 * Author: ugrg
 * Create Time: 2019/11/1 13:33
 */
import { isObject } from "./utils";

const toInner = (error, path) => {
  if (isObject(error)) {
    return Object.entries(error).reduce(
      (p, [key, value]) => p.concat(toInner(value, [path, key].filter(Boolean).join("."))),
      []
    );
  } else if (Array.isArray(error)) {
    return error.reduce((p, value, index) => p.concat(toInner(value, `${path}[${index}]`)), []);
  } else if (error === undefined) {
    return [];
  } else {
    return [{ path, message: error }];
  }
};

class ValidationError {
  constructor (error) {
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
  constructor (schema) {
    this.schema = schema;
  }

  validate (values, options) {
    return this.schema.validate(values, options).catch(errors => Promise.reject(new ValidationError(errors)));
  }
}

export default YupCompatible;
