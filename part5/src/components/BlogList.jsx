import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'

const BlogList = ({ blogs }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>blogs</h2>
      {sortedBlogs.length === 0 && <p>no blogs...</p>}
      {sortedBlogs.length > 0 && (
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
              {sortedBlogs.map(blog => (
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
