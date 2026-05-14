import {
  Card,
  CardContent,
  Button,
  Typography,
  Link,
  Stack,
} from '@mui/material'
import { useBlogActions } from '../stores/blogStore'
import { useNotificationActions } from '../stores/notificationStore'
import { useNavigate } from 'react-router-dom'
import useUser from '../hooks/useUser'

const Blog = ({ blog }) => {
  const { addLike, removeBlog } = useBlogActions()
  const { setNotification } = useNotificationActions()
  const { user } = useUser()
  const navigate = useNavigate()

  if (!blog) return null

  const handleDeleteClick = async e => {
    e.preventDefault()
    try {
      await removeBlog(blog.id)
      setNotification({
        message: `Blog '${blog.title}' deleted`,
        severity: 'success',
      })
      navigate('/')
    } catch (error) {
      if (error.response.status === 401) {
        setNotification({
          message:
            'You are not logged in or your login has expired. Please log in.',
          severity: 'error',
        })
        // handleLogout()
        navigate('/login')
      } else {
        setNotification({
          message: `Failed to delete blog '${blog.title}' : ${error.message}`,
          severity: 'error',
        })
      }
    }
  }

  const handleLikeClick = async e => {
    e.preventDefault()

    try {
      await addLike(blog)
    } catch (error) {
      if (error.response.status === 401) {
        setNotification({
          message:
            'You are not logged in or your login has expired. Please log in.',
          severity: 'error',
        })
        // handleLogout()
        navigate('/login')
      } else {
        setNotification({
          message: `Failed to like blog '${blog.title}' : ${error.message}`,
          severity: 'error',
        })
      }
    }
  }

  const canRemove = user && blog.user && user.username === blog.user.username

  return (
    <Card className='blog' sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant='h5' component='div' sx={{ mb: 0.5 }}>
          {blog.title}
        </Typography>

        <Typography color='textSecondary' sx={{ mb: 1 }}>
          by {blog.author}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <Link href={blog.url} target='_blank' rel='noopener noreferrer'>
            {blog.url}
          </Link>
        </Typography>

        <Typography color='textSecondary' sx={{ mb: 1 }}>
          added by {blog.user?.name || 'unknown'}
        </Typography>

        <Typography sx={{ mb: 1 }}>{blog.likes} likes</Typography>

        {/* buttons row */}
        <Stack direction='row' spacing={1}>
          <Button onClick={handleLikeClick} variant='outlined' size='small'>
            like
          </Button>

          {canRemove && (
            <Button
              onClick={handleDeleteClick}
              variant='outlined'
              size='small'
              color='error'
            >
              remove
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Blog
