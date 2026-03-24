const { test, beforeEach, after, describe, before } = require("node:test");
const supertest = require("supertest");
const assert = require("node:assert");
const Blog = require("../../models/blog");
const mongoose = require("mongoose");
const app = require("../../app");
const api = supertest(app);
const helper = require("./test_helper");
const User = require("../../models/user");

describe("testing token authorization", () => {
  let token;
  let user;

  before(async () => {
    const res = await helper.loginAndGetToken(api);
    token = res.token;
    user = res.user;
  });

  beforeEach(async () => {
    const blogsWithUser = helper.initialBlogs.map((blog) => ({
      ...blog,
      user: user._id,
    }));

    await Blog.deleteMany({});
    await Blog.insertMany(blogsWithUser);
  });

  test("blogs are returned without authorization", async () => {
    const res = await api.get("/api/blogs").expect(200);

    assert.strictEqual(res.body.length, helper.initialBlogs.length);
  });

  test("creation of blog succeeds with valid token", async () => {
    const newBlog = {
      title: "A blog by Ulysses",
      url: "http://ulyssesblog.com",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    assert(titles.includes("A blog by Ulysses"));
  });

  test("creation of blog fails with status 401 Unauthorized if no token provided", async () => {
    const newBlog = {
      title: "Another blog by Ulysses",
      url: "http://ulyssesblog2.com",
    };

    await api.post("/api/blogs").send(newBlog).expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(helper.initialBlogs.length, blogsAtEnd.length);
  });

  test("deletion of blog fails with status 401 Unauthorized if user is not the same", async () => {
    const newUser = {
      username: "unauthuser",
      password: "apassword",
    };

    await api.post("/api/users").send(newUser);

    let res = await api.post("/api/login").send(newUser);
    const token = res.body.token;

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    res = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);

    const blogExists = blogsAtEnd.some((blog) => blog.id === blogToDelete.id);
    assert(blogExists);
  });

  test("deletion of blog succeeds with status 204 if user is the same", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

    const blogExists = blogsAtEnd.some((blog) => blog.id === blogToDelete.id);
    assert(!blogExists);
  });

  after(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    await mongoose.connection.close();
  });
});

// describe("basic blog requests (no authorization)", () => {
//   beforeEach(async () => {
//     await Blog.deleteMany({});
//     await Blog.insertMany(helper.initialBlogs);
//   });

//   test("all blogs are returned", async () => {
//     const res = await api.get("/api/blogs");

//     assert.strictEqual(res.body.length, helper.initialBlogs.length);
//   });

//   test("unique identifier of blog posts is `id`", async () => {
//     const res = await api.get("/api/blogs");

//     const blogs = res.body.map((blog) => blog.id);

//     assert(blogs.length > 0);
//   });
// });

// test("a valid blog can be added", async () => {
//   const blogToAdd = {
//     title: "Harry Potter and the Philosopher's Stone",
//     author: "J.K. Rowling",
//     url: "https://www.goodreads.com/book/show/42844155-harry-potter-and-the-philosopher-s-stone",
//   };

//   const res = await api
//     .post("/api/blogs")
//     .send(blogToAdd)
//     .expect(201)
//     .expect("Content-Type", /application\/json/);

//   const blogsAtEnd = await helper.blogsInDb();
//   assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

//   const titles = blogsAtEnd.map((b) => b.title);
//   assert(titles.includes("Harry Potter and the Philosopher's Stone"));
// });

// test("likes property is 0 if not in post request", async () => {
//   const blogToAdd = {
//     title: "Harry Potter and the Philosopher's Stone",
//     author: "J.K. Rowling",
//     url: "https://www.goodreads.com/book/show/42844155-harry-potter-and-the-philosopher-s-stone",
//   };

//   await api
//     .post("/api/blogs")
//     .send(blogToAdd)
//     .expect(201)
//     .expect("Content-Type", /application\/json/);

//   const blogsAtEnd = await helper.blogsInDb();
//   const addedBlog = blogsAtEnd.find((b) => b.title === blogToAdd.title);

//   assert.strictEqual(addedBlog.likes, 0);
// });

// test("respond to missing url or title with 400 bad request", async () => {
//   const badBlogMissingTitle = {
//     author: "J.K. Rowling",
//     url: "https://www.goodreads.com/book/show/42844155-harry-potter-and-the-philosopher-s-stone",
//   };

//   await api.post("/api/blogs").send(badBlogMissingTitle).expect(400);

//   const badBlogMissingURL = {
//     title: "Harry Potter and the Goblet of Fire",
//     author: "J.K. Rowling",
//   };

//   await api.post("/api/blogs").send(badBlogMissingURL).expect(400);

//   const blogsAtEnd = await helper.blogsInDb();
//   assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
// });

// test("a blog can be deleted", async () => {
//   const blogsAtStart = await helper.blogsInDb();
//   const blogToDelete = blogsAtStart[0];

//   await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

//   const blogsAtEnd = await helper.blogsInDb();

//   const ids = blogsAtEnd.map((b) => b.id);

//   assert(!ids.includes(blogToDelete.id));
//   assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
// });

// test("a blog can be updated", async () => {
//   const blogsAtStart = await helper.blogsInDb();
//   let blogToUpdate = blogsAtStart[0];

//   blogToUpdate.title = "New Title";
//   const res = await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate);

//   assert.strictEqual(res.body.title, "New Title");

//   const blogsAtEnd = await helper.blogsInDb();
//   const titles = blogsAtEnd.map((b) => b.title);

//   assert(titles.includes("New Title"));
//   assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
// });
