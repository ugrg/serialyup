/*
 * Author: ugrg
 * Create Time: 2019/10/25 15:23
 */

import { boolean, string } from "../src";

describe("boolean", () => {
  const MESSAGE = "错误消息";
  it("create", () => {
    const schema = boolean();
    return Promise.all([
      schema.validate(true).then(value => expect(value).toBeTruthy()),
      schema.validate(1).then(value => expect(value).toBeTruthy()),
      schema.validate(false).then(value => expect(value).toBeFalsy()),
      schema.validate(NaN).then(value => expect(value).toBeFalsy()),
      schema.validate().then(value => expect(value).toBeFalsy())
    ]);
  });
  it("isTrue", () => {
    const schema = boolean().isTrue(MESSAGE);
    return Promise.all([
      schema.validate(true).then(value => expect(value).toBeTruthy()),
      schema.validate(1).then(value => expect(value).toBeTruthy()),
      schema.validate(false).catch(error => expect(error).toBe(MESSAGE))
    ]);
  });
  it("isFalse", () => {
    const schema = boolean().isFalse();
    return Promise.all([
      schema.validate(false).then(value => expect(value).toBeFalsy()),
      schema.validate(true).catch(error => expect(error).toBe("必需为False"))
    ]);
  });
  it("concat", () => {
    const schemaBoolean = boolean().isTrue("a");
    const schemaString = string().uppercase().toBe("A", "string to be A").concat(schemaBoolean);
    return Promise.all([
      schemaString.validate("a").then(value => expect(value).toBeTruthy()),
      schemaString.validate("B").catch(error => expect(error).toBe("string to be A"))
    ]);
  });
  it("clone", () => {
    const schemaBoolean = boolean().isTrue("a");
    const schemaString = string().uppercase().toBe("A", "string to be");
    const schemaStringClone = schemaString.clone();
    schemaString.concat(schemaBoolean);
    return Promise.all([
      schemaString.validate("a").then(value => expect(value).toBeTruthy()),
      schemaStringClone.validate("a").then(value => expect(value).toBe("A"))
    ]);
  });
});
