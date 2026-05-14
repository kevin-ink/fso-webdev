const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("./list_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

const listWithOneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
];

const listWithMultipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Not Latest",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars 2",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

describe("total likes", () => {
  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("when list has multiple blogs, equals likes of all blogs summed", () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs);
    assert.strictEqual(result, 50);
  });
});

describe("favorite blog", () => {
  test("when given list of multiple blogs, favorite blog equals latest most liked blog in list", () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs);

    const blog = {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0,
    };

    assert.deepStrictEqual(result, blog);
  });

  test("when given a list with only one blog, favorite blog is that blog", () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);

    const blog = {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    };

    assert.deepStrictEqual(result, blog);
  });
});

describe("most blogs", () => {
  test("when given list of multiple blogs, most blog equals the author with most blogs", () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs);

    const ans = {
      author: "Robert C. Martin",
      blogs: 4,
    };

    assert.deepStrictEqual(result, ans);
  });

  test("when given list of one blog, most blog equals that blog's author and 1 blog", () => {
    const result = listHelper.mostBlogs(listWithOneBlog);

    const ans = {
      author: "Edsger W. Dijkstra",
      blogs: 1,
    };

    assert.deepStrictEqual(result, ans);
  });
});

describe("most liked author", () => {
  test("multiple blogs", () => {
    const res = listHelper.mostLikedAuthor(listWithMultipleBlogs);

    const ans = {
      author: "Edsger W. Dijkstra",
      likes: 29,
    };

    assert.deepStrictEqual(res, ans);
  });

  test("one blog", () => {
    const res = listHelper.mostLikedAuthor(listWithOneBlog);

    const ans = {
      author: "Edsger W. Dijkstra",
      likes: 5,
    };

    assert.deepStrictEqual(res, ans);
  });
});
