const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User.model");

const userOne = {
  name: "Mike",
  email: "wechulipaul1@gmail.com",
  password: "56what!"
};

beforeEach(async done => {
  jest.setTimeout(20000);
  await User.deleteMany();
  await new User(userOne).save();
  done();
});

// afterEach(() => {
//   console.log("afterEach");
// });

// beforeAll(()=>{

// })

// afterAll(()=>{

// })

//test for signup
test("should signup a new user", async () => {
  await request(app)
    .post("/api/users/create")
    .send({
      name: "Paul Wechuli",
      email: "wechulipaul@yahoo1.com",
      password: "mysupersecurepass3ord"
    })
    .expect(201);
});

//test for login in with correct password
test("should login existing user", async () => {
  await request(app)
    .post("/api/users/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
});

//test for login failure

test("should not login unauthenticated users", async () => {
  await request(app)
    .post("/api/users/login")
    .send({
      email: userOne.email,
      password: "somefakepassword"
    })
    .expect(401);
});
