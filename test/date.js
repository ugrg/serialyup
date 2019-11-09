/*
 * Author: ugrg
 * Create Time: 2019/10/29 8:30
 */

import { date, schema, string } from "../src";

describe("date", () => {
  const test = new Date("2019-09-09 00:00:00");
  it("create", async () => {
    const schema = date();
    return Promise.all([
      schema.validate(test).then(value => expect(value.valueOf()).toBe(test.valueOf())),
      schema.validate("2019-09-09 00:00:00").then(value => expect(value.valueOf()).toBe(test.valueOf()))
    ]);
  });
  it("format", async () => {
    return Promise.all([
      date().format("DD-MM-YYYY").validate(test).then(value => expect(value).toBe("09-09-2019")),
      date().format().validate(test).then(value => expect(value).toBe("2019-09-08T16:00:00.000Z"))
    ]);
  });
  it("max", async () => {
    const schema = date().max(new Date("2019-10-01"), "miss max").min(new Date("2019-09-01"), "miss min");
    return Promise.all([
      schema.validate(new Date("2019-09-02")).then(value => expect(value.valueOf()).toBe(new Date("2019-09-02").valueOf())),
      schema.validate(new Date("2019-08-01")).catch(error => expect(error).toBe("miss min")),
      schema.validate(new Date("2019-10-02")).catch(error => expect(error).toBe("miss max"))
    ]);
  });
});
