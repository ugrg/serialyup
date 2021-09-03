/*
 * Author: ugrg
 * Create Time: 2019/10/24 18:25
 */

import Schema, { Options, SchemaOptions } from './Schema';
import { isObject } from './utils';

class ArraySchema extends Schema {
  private schema: Schema;

  constructor (schema?: Schema | SchemaOptions, options: SchemaOptions = {}) {
    if (!(schema instanceof Schema) && isObject(schema)) {
      [schema, options] = [new Schema(), schema as SchemaOptions];
    }
    super(Array.isArray, options);
    this.schema = schema as Schema;
  }

  of (schema: Schema) {
    this.schema = schema;
    return this;
  }

  validate (values: any[], options = {} as Options) {
    const { path = '', values: orgValues = values } = options;
    return super.validate(values, options).then((values: any[]) => {
      const tasks = values.map((value: any, index: number) => {
        // 合并options
        const _options = Object.assign({}, options, {
          path: [path, `[${index}]`].filter(Boolean).join('.'),
          parent: values,
          values: orgValues
        });
        // 使用schema 对变量进行验证
        return this.schema.validate(value, _options);
      });
      return Promise.all(tasks.map(task => task
        .then(value => ({ status: 'fulfilled', value }))
        .catch(reason => ({ status: 'rejected', reason }))
      )).then(results => results.some(({ status }) => status === 'rejected')
        ? Promise.reject((results as { status: string, reason: any }[]).map(({ reason }) => reason))
        : Promise.resolve((results as { status: string, value: any }[]).map(({ value }) => value)));
    }).catch(error => Promise.reject(error instanceof Error ? error.message : error));
  }
}

export default ArraySchema;
