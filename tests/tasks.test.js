const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/Task.model");
const {
  
  userOneId,
  userTwo,
  userTwoId,
  userOne,
  setupDatabase,
  taskOne,
  taskTwo,
  taskThree
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("should create task for user", async () => {
  const response = await request(app)
    .post("/api/tasks/create")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "This is a test task description"
    })
    .expect(201);

  const task = await Task.findById(response.body.newTask._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("should only return tasks for a particular user", async () => {
  const response = await request(app)
    .get("/api/tasks/all")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.tasks.length).toEqual(2);
});

test("should not delete tasks that dont belong to user in the token", async () => {
  const response = await request(app)
    .delete(`/api/tasks/single/${taskTwo._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404);

  //confirm that the task is still in the database
  const task = await Task.findById(taskTwo._id);
  expect(task).not.toBeNull();
});


// Task Test Ideas
//
// Should not create task with invalid description/completed
// Should not update task with invalid description/completed
// Should delete user task
// Should not delete task if unauthenticated
// Should not update other users task
// Should fetch user task by id
// Should not fetch user task by id if unauthenticated
// Should not fetch other users task by id
// Should fetch only completed tasks
// Should fetch only incomplete tasks
// Should sort tasks by description/completed/createdAt/updatedAt
// Should fetch page of tasks