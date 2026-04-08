import {
  Card,
  CardContent,
  Button,
  Typography,
  Link,
  Stack,
} from '@mui/material'

const Blog = ({ blog, handleDeleteBlog, handleLikeBlog, canRemove }) => {
  if (!blog) {
    return null
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
