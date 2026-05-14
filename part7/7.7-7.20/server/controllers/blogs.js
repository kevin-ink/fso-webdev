const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });

  response.json(blogs);
});

blogsRouter.post("/", middleware.authExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);

  await user.save();
  await savedBlog.populate("user", { username: 1, name: 1 });
  response.status(201).json(savedBlog);
});

blogsRouter.delete(
  "/:id",
  middleware.authExtractor,
  async (request, response) => {
    const user = request.user;
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }

    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      user.blogs = user.blogs.filter((b) => b.toString() !== request.params.id);
      await user.save();
      response.status(204).end();
    } else {
      response.status(403).json({ error: "unauthorized delete" });
    }
  },
);

blogsRouter.put("/:id", middleware.authExtractor, async (request, response) => {
  const requestUser = request.user;
  const { title, author, url, likes, user } = request.body;
  let blogToUpdate = await Blog.findById(request.params.id);

  if (!blogToUpdate) {
    return response.status(404).end();
  }

  if (blogToUpdate.user.toString() !== user) {
    return response.status(403).end();
  }

  if (blogToUpdate.user.toString() === requestUser._id.toString()) {
    Object.assign(blogToUpdate, { title, author, url, likes });
    const updatedBlog = await blogToUpdate.save();
    await updatedBlog.populate("user", { username: 1, name: 1 });
    return response.json(updatedBlog);
  }

  Object.assign(blogToUpdate, { title, author, url, likes });
  const updatedBlog = await blogToUpdate.save();
  await updatedBlog.populate("user", { username: 1, name: 1 });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
