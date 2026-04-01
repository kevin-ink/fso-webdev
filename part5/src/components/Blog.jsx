import { useState } from 'react'

const Blog = ({ blog, handleDeleteBlog, handleLikeBlog, currentUserId }) => {
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

  const handleDeleteClick = e => {
    e.preventDefault()
    handleDeleteBlog(blog)
  }

  const handleLikeClick = e => {
    e.preventDefault()
    handleLikeBlog(blog)
  }

  const [visible, setVisible] = useState(false)

  return (
    <div style={blogStyle}>
      <div>
        {`${blog.title} by ${blog.author}  `}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'show'}
        </button>
        {'     '}
        {currentUserId === blog.user._id && (
          <button onClick={handleDeleteClick}>remove</button>
        )}
        {visible && (
          <div>
            <p style={pStyle}>{blog.url}</p>
            <div style={pStyle}>
              likes {blog.likes} {'     '}
              <button onClick={handleLikeClick}>like</button>
            </div>
            <p style={pStyle}>{blog.user.name}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
