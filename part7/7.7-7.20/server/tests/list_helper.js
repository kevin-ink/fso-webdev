const blog = require("../models/blog");
const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let likes = 0;
  blogs.forEach((blog) => {
    likes += blog.likes;
  });
  return likes;
};

const favoriteBlog = (blogs) => {
  let mostLikedBlog = blogs[0];
  blogs.forEach((blog) => {
    if (blog.likes >= mostLikedBlog.likes) {
      mostLikedBlog = blog;
    }
  });
  return mostLikedBlog;
};

const mostBlogs = (blogs) =>
  _(blogs)
    .countBy("author")
    .map((blogs, author) => ({ author, blogs }))
    .maxBy("blogs");

const mostLikedAuthor = (blogs) =>
  _(blogs)
    .groupBy("author")
    .map((blogs, author) => ({
      author,
      likes: _.sumBy(blogs, "likes"),
    }))
    .maxBy("likes");

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikedAuthor,
};
