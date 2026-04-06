import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      return user
    }
    return null
  })
  const blogFormRef = useRef()

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
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
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
      setErrorMessage(`failed to like blog ${blog.title}: ${error.message}`)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleLogout = e => {
    e.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
    loginService.setToken(null)
  }

  const handleCreateBlog = async newBlog => {
    try {
      const response = await blogService.create(newBlog)
      setBlogs(blogs.concat(response))
      blogFormRef.current.toggleVisibility()
      setSuccessMessage(
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      )
      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)
    } catch {
      setErrorMessage('failed to create blog')
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleDeleteBlog = async blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(prev => prev.filter(b => b.id !== blog.id))
      } catch (error) {
        let message = `Failed to delete blog ${blog.title}: ${error.message}`

        if (error.response.status === 401) {
          message = `You are not authorized to delete the blog ${blog.title}`
        }

        setErrorMessage(message)
        setTimeout(() => {
          setErrorMessage('')
        }, 5000)
      }
    }
  }

  const Popup = ({ message, type }) => {
    const styles = {
      color: type === 'error' ? 'red' : 'green',
      border: `2px solid ${type === 'error' ? 'red' : 'green'}`,
      borderRadius: '4px',
      padding: '10px',
      marginBottom: '10px',
      backgroundColor: type === 'error' ? '#ffe6e6' : '#D3D3D3',
    }

    return <div style={styles}>{message}</div>
  }

  // const errorPopup = () => (
  //   <div
  //     style={{
  //       color: 'red',
  //       border: '2px solid red',
  //       borderRadius: '4px',
  //       padding: '10px',
  //       marginBottom: '10px',
  //       backgroundColor: '#ffe6e6',
  //     }}
  //   >
  //     {errorMessage}
  //   </div>
  // )

  // const successPopup = () => (
  //   <div
  //     style={{
  //       color: 'green',
  //       border: '2px solid green',
  //       borderRadius: '4px',
  //       padding: '10px',
  //       marginBottom: '10px',
  //       backgroundColor: '#D3D3D3',
  //     }}
  //   >
  //     {successMessage}
  //   </div>
  // )

  return (
    <div>
      {errorMessage && <Popup message={errorMessage} type='error' />}
      {successMessage && <Popup message={successMessage} type='success' />}
      {!user && <LoginForm handleLogin={handleLogin} />}
      {user && (
        <>
          <h2>blogs</h2>
          <p>{user.username} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <Togglable
            showLabel='create new blog'
            hideLabel='cancel'
            ref={blogFormRef}
          >
            <BlogForm handleCreateBlog={handleCreateBlog} />
          </Togglable>
          <div style={{ marginTop: '20px' }}>
            {[...blogs]
              .sort((a, b) => b.likes - a.likes)
              .map(blog => (
                <Blog
                  canRemove={blog.user.username === user.username}
                  key={blog.id}
                  blog={blog}
                  handleDeleteBlog={handleDeleteBlog}
                  handleLikeBlog={handleLikeBlog}
                />
              ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App
