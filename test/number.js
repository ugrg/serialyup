/*
 * Author: ugrg
 * Create Time: 2019/10/25 14:17
 */
import { number } from "../src";

describe("number", () => {
  const MESSAGE = "错误消息";
  it("min", async () => {
    const schema = number().min(5, MESSAGE);
    return Promise.all([
      schema.validate(10).then(value => expect(value).toBe(10)),
      schema.validate("10").then(value => expect(value).toBe(10)),
      schema.validate(5).then(value => expect(value).toBe(5)),
      schema.validate(4).catch(error => expect(error).toBe(MESSAGE)),
      schema.validate(-1).catch(error => expect(error).toBe(MESSAGE)),
      schema.validate(NaN).catch(error => expect(error).toBe(MESSAGE))
    ]);
  });
  it("max", async () => {
    const schema = number().max(5, MESSAGE);
    return Promise.all([
      schema.validate(1).then(value => expect(value).toBe(1)),
      schema.validate("1").then(value => expect(value).toBe(1)),
      schema.validate(5).then(value => expect(value).toBe(5)),
      schema.validate(10).catch(error => expect(error).toBe(MESSAGE)),
      schema.validate(100).catch(error => expect(error).toBe(MESSAGE)),
      schema.validate(NaN).catch(error => expect(error).toBe(MESSAGE))
    ]);
  });
  it("positive", async () => {
    const schema = number().positive(MESSAGE);
    return Promise.all([
      schema.validate(1).then(value => expect(value).toBe(1)),
      schema.validate("1").then(value => expect(value).toBe(1)),
      schema.validate(0).catch(error => expect(error).toBe(MESSAGE)),
      schema.validate(-1).catch(error => expect(error).toBe(MESSAGE)),
      schema.validate(-100).catch(error => expect(error).toBe(MESSAGE)),
      schema.validate(NaN).catch(error => expect(error).toBe(MESSAGE))
    ]);
  });
  it("negative", async () => {
    const schema = number().negative(MESSAGE);
    return Promise.all([
      schema.validate(-1).then(value => expect(value).toBe(-1)),
      schema.validate("-1").then(value => expect(value).toBe(-1)),
      schema.validate(0).catch(error => expect(error).toBe(MESSAGE)),
      schema.validate(1).catch(error => expect(error).toBe(MESSAGE)),
      schema.validate(1.1).catch(error => expect(error).toBe(MESSAGE)),
      schema.validate(NaN).catch(error => expect(error).toBe(MESSAGE))
    ]);
  });
  it("round", async () => {
    const floor = number().round("floor");
    const ceil = number().round("ceil");
    const round = number().round();
    try {
      number().round("xx");
    } catch (e) {
      expect(e.message).toBe("不支持xx取整算法！");
    }
    return Promise.all([
      floor.validate(1.1).then(value => expect(value).toBe(1)),
      ceil.validate(1.1).then(value => expect(value).toBe(2)),
      round.validate(1.1).then(value => expect(value).toBe(1)),
      round.validate(1.5).then(value => expect(value).toBe(2))
    ]);
  });
  it("required", async () => {
    const schema = number().required(MESSAGE);
    return Promise.all([
      schema.validate(1.1).then(value => expect(value).toBe(1.1)),
      schema.validate("1.1").then(value => expect(value).toBe(1.1)),
      schema.validate(Infinity).then(value => expect(value).toBe(Infinity)),
      schema.validate("").catch(error => expect(error).toBe(MESSAGE)),
      schema.validate("abc").catch(error => expect(error).toBe(MESSAGE)),
      schema.validate(NaN).catch(error => expect(error).toBe(MESSAGE))
    ]);
  });
  it("integer", async () => {
    const schema = number().integer(MESSAGE);
    return Promise.all([
      schema.validate(1).then(value => expect(value).toBe(1)),
      schema.validate("1").then(value => expect(value).toBe(1)),
      schema.validate(1.1).catch(error => expect(error).toBe(MESSAGE)),
      schema.validate("1.1").catch(error => expect(error).toBe(MESSAGE)),
      schema.validate("abc").catch(error => expect(error).toBe(MESSAGE)),
      schema.validate(NaN).catch(error => expect(error).toBe(MESSAGE))
    ]);
  });
});
