import { useState } from 'react'
import { TextField, Button } from '@mui/material'
import { useBlogActions } from '../stores/blogStore'
import { useNotificationActions } from '../stores/notificationStore'
import { useNavigate } from 'react-router-dom'

const BlogForm = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const { addBlog } = useBlogActions()
  const { setNotification } = useNotificationActions()
  const navigate = useNavigate()

  const onCreateBlogClick = async e => {
    e.preventDefault()

    try {
      await addBlog({
        title,
        author,
        url,
      })
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotification({
        message: `A new blog ${title} by ${author} added`,
        severity: 'success',
      })
      navigate('/')
    } catch (error) {
      if (error.response.status === 401) {
        // handleLogout()
        navigate('/login')
        setNotification({
          message:
            'You are not logged in or your login has expired. Please log in.',
          severity: 'error',
        })
      } else {
        setNotification({
          message: `Failed to create blog ${title}: ${error.message}`,
          severity: 'error',
        })
      }
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
