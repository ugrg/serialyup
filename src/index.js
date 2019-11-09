/*
 * Author: ugrg
 * Create Time: 2019/10/24 10:08
 */

import ValidationError from "./ValidationError";
import Schema from "./Schema";
import ObjectSchema from "./ObjectSchema";
import StringSchema from "./StringSchema";
import ArraySchema from "./ArraySchema";
import NumberSchema from "./NumberSchema";
import BooleanSchema from "./BooleanSchema";
import DateSchema from "./DateSchema";
import MomentSchema from "./MomentSchema";
import YupCompatible from "./YupCompatible";

export default Schema;

/**
 * 基础验证对象
 * @param {function}[isType]
 * @param {{
 *   nullAllow:boolean,
 *   undefinedAllow:boolean
 * }}[options]
 * @returns {Schema}
 */
const schema = (isType, options) => new Schema(isType, options);
/**
 * 构造StringSchema
 * @param {{nullAllow:boolean,undefinedAllow:boolean}}[options]
 * @returns {StringSchema}
 */
const string = (options) => new StringSchema(options);

/**
 * 构造NumberSchema
 * @param {{nullAllow:boolean,undefinedAllow:boolean}}[options]
 * @returns {NumberSchema}
 */
const number = (options) => new NumberSchema(options);

/**
 * 构造BooleanSchema
 * @param {{nullAllow:boolean,undefinedAllow:boolean}}[options]
 * @returns {BooleanSchema}
 */
const boolean = (options) => new BooleanSchema(options);

/**
 * 构造ObjectSchema
 * @param {object}[schemas]
 * @param {{nullAllow:boolean,undefinedAllow:boolean,exact:boolean,exactMessage:String}}[options]
 * @returns {ObjectSchema}
 */
const object = (schemas, options) => new ObjectSchema(schemas, options);
/**
 * 构造ArraySchema
 * @param {Schema}[schema]
 * @param {{nullAllow:boolean,undefinedAllow:boolean}}[options]
 * @returns {ArraySchema}
 */
const array = (schema, options) => new ArraySchema(schema, options);

/**
 * 构造DateSchema
 * @param {{nullAllow:boolean,undefinedAllow:boolean}}[options]
 * @returns {DateSchema}
 */
const date = (options) => new DateSchema(options);

/**
 * 构造MomentSchema
 * @param {{nullAllow:boolean,undefinedAllow:boolean}}[options]
 * @returns {MomentSchema}
 */
const moment = (options) => new MomentSchema(options);

export {
  ValidationError,
  YupCompatible,
  Schema,
  ObjectSchema,
  StringSchema,
  ArraySchema,
  schema,
  object,
  array,
  string,
  number,
  boolean,
  date,
  moment
};
