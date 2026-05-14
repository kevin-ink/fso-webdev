import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import { useNotificationActions } from './stores/notificationStore'
import {
  Container,
  AppBar,
  Button,
  Toolbar,
  CircularProgress,
  Box,
} from '@mui/material'
import { ErrorBoundary } from 'react-error-boundary'
import useUser from './hooks/useUser'
import UserContextProvider from './UserContext'
import UserList from './components/UserList'
import User from './components/User'

const App = () => {
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const { setNotification } = useNotificationActions()

  const blogMatch = useMatch('/blogs/:id')
  const blogId = blogMatch?.params.id

  const usernameMatch = useMatch('/users/:username')
  const username = usernameMatch?.params.username

  const handleLogout = () => {
    logout()
    setNotification({ message: 'Logged out successfully', severity: 'success' })
    navigate('/login')
  }

  return (
    <Container>
      <AppBar position='static'>
        <Toolbar>
          <h1 style={{ fontFamily: 'sans-serif' }}>Blog App</h1>
          <div style={{ marginLeft: 'auto' }}>
            <Button color='inherit' component={Link} to='/'>
              blogs
            </Button>
            <Button color='inherit' component={Link} to='/users'>
              users
            </Button>
            {!user && (
              <Button color='inherit' component={Link} to='/login'>
                login
              </Button>
            )}
            {user && (
              <>
                <Button color='inherit' component={Link} to='/create'>
                  new blog
                </Button>
                <Button color='inherit' onClick={handleLogout}>
                  logout
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <ErrorBoundary fallback={<h1>Something went wrong.</h1>}>
        <Notification />
        <Routes>
          <Route
            path='/blogs/:id'
            element={
              blogId ? (
                <Blog blogId={blogId} />
              ) : (
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
            }
          />
          <Route
            path='/users/:username'
            element={
              username ? (
                <User username={username} />
              ) : (
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
            }
          />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/create' element={<BlogForm />} />
          <Route path='/' element={<BlogList />} />
          <Route path='/users' element={<UserList />} />
          <Route path='*' element={<h1>404 - Page not found</h1>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
