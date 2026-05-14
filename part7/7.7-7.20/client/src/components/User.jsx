import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material'
import { useEffect, useState } from 'react'
import userService from '../services/users'
import { Link } from 'react-router-dom'

const User = ({ username }) => {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await userService.getBlogsByUsername(username)
      setBlogs(blogs)
    }

    if (username) {
      fetchBlogs()
    }
  }, [username])

  return (
    <Card className='blog' sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant='h5' component='div' sx={{ mb: 0.5 }}>
          {username}
        </Typography>

        <Typography sx={{ mb: 1 }} variant='h6'>
          added blogs
        </Typography>
        <List>
          {blogs?.map(blog => (
            <div key={blog.id}>
              <ListItem component={Link} to={`/blogs/${blog.id}`} divider>
                <ListItemText primary={blog.title} />
              </ListItem>
            </div>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default User
