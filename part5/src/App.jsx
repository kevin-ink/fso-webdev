import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import BlogList from './components/BlogList'
import { useNotification } from './components/useNotification'
import Notification from './components/Notification'
import { Container, AppBar, Button, Toolbar } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      return user
    }
    return null
  })
  const navigate = useNavigate()
  const { notification, showNotification } = useNotification()

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find(b => b.id === match.params.id) : null

  // useEffect(() => {
  //   blogService.getAll().then(blogs => setBlogs(blogs))
  // }, [])

  useEffect(() => {
    async function fetchData() {
      const blogs = await blogService.getAll()
      // console.log(blogs)
      setBlogs(blogs)
    }
    fetchData()
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      navigate('/')
    } catch {
      showNotification('Wrong credentials', 'error')
      throw new Error('Wrong credentials')
    }
  }

  const handleLikeBlog = async blog => {
    try {
      const response = await blogService.updateLikes({
        ...blog,
        user: blog.user.id,
        likes: blog.likes + 1,
      })
      setBlogs(prev => prev.map(b => (b.id === blog.id ? response : b)))
    } catch (error) {
      if (error.response.status === 401) {
        handleLogout()
        navigate('/login')
        showNotification(
          'You are not logged in or your login has expired. Please log in.',
          'error'
        )
      } else {
        showNotification(
          `Failed to like blog ${blog.title}: ${error.message}`,
          'error'
        )
      }
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    navigate('/')
  }

  const handleCreateBlog = async newBlog => {
    try {
      const response = await blogService.create(newBlog)
      setBlogs(blogs.concat(response))
      showNotification(
        `A new blog ${newBlog.title} by ${newBlog.author} added`,
        'success'
      )
      navigate('/')
    } catch (error) {
      if (error.response.status === 401) {
        handleLogout()
        navigate('/login')
        showNotification(
          'You are not logged in or your login has expired. Please log in.',
          'error'
        )
      } else {
        showNotification(
          `Failed to create blog ${newBlog.title}: ${error.message}`,
          'error'
        )
      }
    }
  }

  const handleDeleteBlog = async blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(prev => prev.filter(b => b.id !== blog.id))
        showNotification(
          `Blog ${blog.title} by ${blog.author} removed`,
          'success'
        )
        navigate('/')
      } catch (error) {
        if (error.response.status === 401) {
          showNotification(
            'You are not logged in or your login has expired. Please log in.',
            'error'
          )
          handleLogout()
          navigate('/login')
        } else {
          showNotification(
            `Failed to delete blog ${blog.title}: ${error.message}`,
            'error'
          )
        }
      }
    }
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
      <Notification notification={notification} />

      <Routes>
        <Route
          path='/blogs/:id'
          element={
            <Blog
              blog={blog}
              handleDeleteBlog={handleDeleteBlog}
              handleLikeBlog={handleLikeBlog}
              canRemove={user && blog && user.username === blog.user.username}
            />
          }
        />
        <Route
          path='/login'
          element={<LoginForm handleLogin={handleLogin} />}
        />
        <Route
          path='/create'
          element={<BlogForm handleCreateBlog={handleCreateBlog} />}
        />
        <Route
          path='/'
          element={
            <BlogList
              blogs={blogs}
              handleDeleteBlog={handleDeleteBlog}
              handleLikeBlog={handleLikeBlog}
            />
          }
        />
      </Routes>
    </Container>
  )
}

export default App
