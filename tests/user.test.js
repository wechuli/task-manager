const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User.model");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

// afterEach(() => {
//   console.log("afterEach");
// });

// beforeAll(()=>{

// })

// afterAll(()=>{

// })

//test for signup
test("should signup a new user", async () => {
  const response = await request(app)
    .post("/api/users/create")
    .send({
      name: "Paul Wechuli",
      email: "wechulipaul@yahoo1.com",
      password: "mysupersecurepass3ord"
    })
    .expect(201);

  //Assert that the database was changed correctly
  const user = await User.findById(response.body.newUser._id);
  expect(user).not.toBeNull();

  //Assetions about the response
  expect(response.body).toMatchObject({
    error: false,
    message: "new user created",
    newUser: {
      email: "wechulipaul@yahoo1.com",
      name: "Paul Wechuli"
    },
    token: user.tokens[0].token
  });
  expect(user.password).not.toBe("mysupersecurepass3ord");
});

//test for login in with correct password
test("should login existing user", async () => {
  const response = await request(app)
    .post("/api/users/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
  const user = await User.findById(userOne._id);
  expect(response.body.token).toBe(user.tokens[1].token);
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

test("should get profile for user", async () => {
  await request(app)
    .get("/api/users/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not get profile for unauthenticated user", async () => {
  await request(app)
    .get("/api/users/user/me")
    .send()
    .expect(401);
});

test("should delete account for user", async () => {
  await request(app)
    .delete("/api/users/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  // we expect the user to have been deleted from the database
  const user = await User.findById(userOne._id);

  expect(user).toBeNull();
});

test("should not delete account if user not authenticated", async () => {
  await request(app)
    .delete("/api/users/user/me")
    .send()
    .expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/api/users/user/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOne._id);

  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("should update valid user field", async () => {
  await request(app)
    .patch("/api/users/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Paul Wechuli-updated"
    })
    .expect(200);

  const user = await User.findById(userOne._id);
  expect(user.name).toEqual("Paul Wechuli-updated");
});

test("should not update invalid user field", async () => {
  await request(app)
    .patch("/api/users/user/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "fake location"
    })
    .expect(400);
});


// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated