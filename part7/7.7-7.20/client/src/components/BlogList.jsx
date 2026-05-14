import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
} from '@mui/material'
import { useBlogLoading, useBlogs, useBlogActions } from '../stores/blogStore'
import { useEffect } from 'react'

const BlogList = () => {
  const { initialize } = useBlogActions()

  useEffect(() => {
    initialize()
  }, [initialize])

  const blogs = useBlogs()
  const loading = useBlogLoading()

  if (loading)
    return (
      <Box
        sx={{
          p: 2,
          justifyContent: 'center',
          display: 'flex',
          mt: 4,
        }}
      >
        <CircularProgress aria-label='Loading…' />
      </Box>
    )

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>blogs</h2>
      {blogs.length === 0 && (
        <p style={{ fontSize: '18px', color: '#666', fontStyle: 'italic' }}>
          No blogs...
        </p>
      )}
      {blogs.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>title</TableCell>
                <TableCell>author</TableCell>
                <TableCell>user</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs.map(blog => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                  </TableCell>
                  <TableCell>{blog.author}</TableCell>
                  <TableCell>{blog.user.username}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  )
}

export default BlogList
