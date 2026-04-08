const Blog = ({ blog, handleDeleteBlog, handleLikeBlog, canRemove }) => {
  if (!blog) {
    return null
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const pStyle = {
    margin: 0,
  }

  const handleDeleteClick = async e => {
    e.preventDefault()

    await handleDeleteBlog(blog)
  }

  const handleLikeClick = async e => {
    e.preventDefault()
    await handleLikeBlog(blog)
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} by {blog.author}
        {canRemove && <button onClick={handleDeleteClick}>remove</button>}
        <div>
          <p style={pStyle}>{blog.url}</p>
          <div style={pStyle}>
            likes {blog.likes}
            <button onClick={handleLikeClick}>like</button>
          </div>
          <p style={pStyle}>{blog.user.name}</p>
        </div>
      </div>
    </div>
  )
}

export default Blog
