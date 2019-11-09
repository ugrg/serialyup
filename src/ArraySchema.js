/*
 * Author: ugrg
 * Create Time: 2019/10/24 18:25
 */

import Schema from "./Schema";
import { isObject } from "./utils";

class ArraySchema extends Schema {
  constructor (schema, options = {}) {
    if (!(schema instanceof Schema) && isObject(schema)) {
      [schema, options] = [new Schema(), schema];
    }
    super(Array.isArray, options);
    this.schema = schema;
  }

  of (schema) {
    this.schema = schema;
    return this;
  }

  validate (values, options = {}) {
    const { path = "", values: orgValues = values } = options;
    return super.validate(values, options).then((values) => {
      const tasks = values.map((value, index) => {
        // 合并options
        const _options = Object.assign({}, options, {
          path: [path, `[${index}]`].filter(Boolean).join("."),
          parent: values,
          values: orgValues
        });
        // 使用schema 对变量进行验证
        return this.schema.validate(value, _options);
      });
      return Promise.all(tasks.map(task => task
        .then(value => ({ status: "fulfilled", value }))
        .catch(reason => ({ status: "rejected", reason }))
      )).then(results => results.some(({ status }) => "rejected" === status)
        ? Promise.reject(results.map(({ reason }) => reason))
        : Promise.resolve(results.map(({ value }) => value)));
    }).catch(error => Promise.reject(error instanceof Error ? error.message : error));
  }
}

export default ArraySchema;
