import { useState } from 'react'

const BlogForm = ({ handleCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const onCreateBlogClick = e => {
    e.preventDefault()
    handleCreateBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h2>create new blog</h2>
      <form onSubmit={onCreateBlogClick}>
        <div>
          <label>
            title:{' '}
            <input
              type='text'
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author:{' '}
            <input
              type='text'
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url:{' '}
            <input
              type='text'
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button>create</button>
      </form>
    </>
  )
}

export default BlogForm
