/*
 * Author: ugrg
 * Create Time: 2019/10/24 10:25
 */

import { number, string } from "../src";
import { schema } from "../src/";

describe("schema", () => {
  const MESSAGE = "错误信息";
  it("test", async () => {
    const _schema = schema((v) => typeof v === "string");
    return _schema
      .test("功能测试", "错误1", (value) => /f1/.test(value))
      .test("功能测试", "测试2", (value) => /f2/.test(value))
      .test("功能测试", "测试3", (value) => /f3/.test(value))
      .validate("f1/f2").catch(message => expect(message).toBe("测试3"));
  });

  it("oneOf", async () => {
    const _schema = schema().oneOf(["ab", "cd"], MESSAGE);
    const _schemaEquals = schema().oneOf(["ab", "cd"], MESSAGE, (a, b) => a === b);
    return Promise.all([
      _schema.validate("ab").then((value) => expect(value).toBe("ab")),
      _schema.validate("ef").catch((message) => expect(message).toBe(MESSAGE)),
      _schemaEquals.validate("ab").then((value) => expect(value).toBe("ab")),
      _schemaEquals.validate("ef").catch((message) => expect(message).toBe(MESSAGE))
    ]);
  });

  it("notOneOf", async () => {
    const _schema = schema().notOneOf(["ab", "cd"], MESSAGE);
    const _schemaEquals = schema().notOneOf(["ab", "cd"], MESSAGE, (a, b) => a === b);
    return Promise.all([
      _schema.validate("qq").then((value) => expect(value).toBe("qq")),
      _schema.validate("ab").catch((message) => expect(message).toBe(MESSAGE)),
      _schemaEquals.validate("qq").then((value) => expect(value).toBe("qq")),
      _schemaEquals.validate("ab").catch((message) => expect(message).toBe(MESSAGE))
    ]);
  });
  it("required", async () => {
    const _schema = schema().required(MESSAGE);
    return Promise.all([
      _schema.validate({}).then(result => expect(result).toEqual({})),
      _schema.validate(null).catch((message) => expect(message).toBe(MESSAGE)),
      _schema.validate(undefined).catch((message) => expect(message).toBe(MESSAGE)),
      _schema.validate().catch((message) => expect(message).toBe(MESSAGE)),
      _schema.transform(() => "v1").validate("").then(result => expect(result).toBe("v1"))
    ]);
  });
  it("nullAllow", async () => {
    const _schema = schema().nullAllow().required(MESSAGE);
    return Promise.all([
      _schema.validate(null).then((result) => expect(result).toBeNull())
    ]);
  });
  it("oneOfType", async () => {
    const _schema = schema().oneOfType([
      string(),
      number()
    ], MESSAGE);
    return Promise.all([
      _schema.validate("test").then(value => expect(value).toBe("test")),
      _schema.validate(1).then(value => expect(value).toBe(1)),
      _schema.validate(false).catch(message => expect(message).toBe(MESSAGE))
    ]);
  });
  it("oneOfType replace", async () => {
    const _schema = schema().oneOfType([
      string().uppercase(),
      number()
    ], MESSAGE);
    return Promise.all([
      _schema.validate("test").then(value => expect(value).toBe("TEST")),
      _schema.validate(1).then(value => expect(value).toBe(1)),
      _schema.validate(false).catch(message => expect(message).toBe(MESSAGE))
    ]);
  });
});
