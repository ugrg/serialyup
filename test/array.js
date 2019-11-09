/*
 * Author: ugrg
 * Create Time: 2019/10/24 19:59
 */

import { array, string, object } from "../src/";

describe("array", () => {
  const setup = () => array().of(string().matches(/v1/, "失败"));
  it("new", async () => {
    const schema = array(string().matches(/v1/, "失败"));
    const test = ["v1", "v1"];
    return Promise.all([
      schema.validate(test).then((result) => expect(result).toEqual(test)),
      schema.validate(["v2"]).catch(([error]) => expect(error).toBe("失败"))
    ]);
  });
  it("of", async () => {
    const schema = setup();
    const test = ["v1", "v1"];
    return schema.validate(test).then((result) => expect(result).toEqual(test));
  });
  it("of object", async () => {
    const schema = array(object({
      v1: string().required("not has v1"),
      v2: string().required("not has v2")
    }));
    return Promise.all([
      schema.validate([{ v1: "1", v2: "2" }]).then(result => expect(result).toEqual([{ v1: "1", v2: "2" }])),
      schema.validate([{ v1: "1" }]).catch(([{ v2: error }]) => expect(error).toBe("not has v2"))
    ]);
  });
  it("object array", async () => {
    const schema = object({
      v1: array(object({ v2: string().required("not has v2") }))
    });
    return schema.validate({ v1: [{ v3: 0 }] }).catch(({ v1: [{ v2: error }] }) => expect(error).toBe("not has v2"));
  });
  it("object array test", async () => {
    const schema = object({
      v1: array(object({ v2: string().test("test false", "is false", () => false) }))
    });
    return schema.validate({ v1: [{ v3: 0 }] }).catch(({ v1: [{ v2: error }] }) => expect(error).toBe("is false"));
  });
});
