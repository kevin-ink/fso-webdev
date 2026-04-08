import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ handleCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const onCreateBlogClick = async e => {
    e.preventDefault()

    try {
      await handleCreateBlog({
        title,
        author,
        url,
      })
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <h2>create new blog</h2>
      <form onSubmit={onCreateBlogClick}>
        <div>
          <TextField
            label='Title'
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <TextField
            label='Author'
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <TextField
            label='URL'
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <Button type='submit' variant='contained' style={{ marginTop: 10 }}>
          create
        </Button>
      </form>
    </>
  )
}

export default BlogForm
