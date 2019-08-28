const request = require("supertest");
const app = require("../src/app");

test("Should signup a new user", async () => {
  await request(app)
    .post("/api/users/create")
    .send({
      name: "Paul Wechuli",
      email: "wechulipaul@yahoo.com",
      password: "mysupersecurepass3ord"
    })
    .expect(201);
});
