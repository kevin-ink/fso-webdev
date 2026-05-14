const { test, beforeEach, after, describe } = require("node:test");
const supertest = require("supertest");
const assert = require("node:assert");
const User = require("../../models/user");
const mongoose = require("mongoose");
const app = require("../../app");
const api = supertest(app);
const helper = require("./test_helper");
const bcrypt = require("bcrypt");

after(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("password", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "ulysses",
      password: "wowsosecure",
      name: "Ulyssus Grant",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
});
