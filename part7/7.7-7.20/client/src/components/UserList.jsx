import { Link } from 'react-router-dom'
import { useEffect } from 'react'
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
import { useUsers, useUserLoading, useUserActions } from '../stores/userStore'

const UserList = () => {
  const users = useUsers()
  const loading = useUserLoading()
  const { initialize } = useUserActions()

  useEffect(() => {
    initialize()
  }, [initialize])

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
      <h2>users</h2>
      {users.length === 0 && (
        <p style={{ fontSize: '18px', color: '#666', fontStyle: 'italic' }}>
          No users...
        </p>
      )}
      {users.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>name</TableCell>
                <TableCell>username</TableCell>
                <TableCell>blogs created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link to={`/users/${user.username}`}>{user.name}</Link>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.blogs.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  )
}

export default UserList
