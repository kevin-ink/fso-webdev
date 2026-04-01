import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

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

  // useEffect(() => {
  //   blogService.getAll().then(blogs => setBlogs(blogs))
  // }, [])

  useEffect(() => {
    async function fetchData() {
      const blogs = await blogService.getAll()
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
  }

  const handleCreateBlog = async newBlog => {
    try {
      const response = await blogService.create(newBlog)
      setBlogs(blogs.concat(response))
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

  const LoginForm = ({ handleLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const onLoginClick = e => {
      e.preventDefault()

      handleLogin(username, password)
      setUsername('')
      setPassword('')
    }

    return (
      <>
        <h2>log in to application</h2>
        <form onSubmit={onLoginClick}>
          <div>
            <label>
              username{' '}
              <input
                type='text'
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              ></input>
            </label>
          </div>
          <div>
            <label>
              password{' '}
              <input
                type='password'
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              ></input>
            </label>
          </div>
          <button type='submit'>login</button>
        </form>
      </>
    )
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

  const errorPopup = () => (
    <div
      style={{
        color: 'red',
        border: '2px solid red',
        borderRadius: '4px',
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#ffe6e6',
      }}
    >
      {errorMessage}
    </div>
  )

  const successPopup = () => (
    <div
      style={{
        color: 'green',
        border: '2px solid green',
        borderRadius: '4px',
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#D3D3D3',
      }}
    >
      {successMessage}
    </div>
  )

  const blogsView = () => (
    <>
      <h2>blogs</h2>
      <p>{user.username} logged in</p>
      <button onClick={handleLogout}>logout</button>
      <Togglable showLabel='create new blog' hideLabel='cancel'>
        <BlogForm handleCreateBlog={handleCreateBlog} />
      </Togglable>
      <div style={{ marginTop: '20px' }}>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map(blog => (
            <Blog
              currentUserId={user.id}
              key={blog.id}
              blog={blog}
              handleDeleteBlog={handleDeleteBlog}
              handleLikeBlog={handleLikeBlog}
            />
          ))}
      </div>
    </>
  )

  return (
    <div>
      {errorMessage && errorPopup()}
      {successMessage && successPopup()}
      {!user && <LoginForm handleLogin={handleLogin} />}
      {user && blogsView()}
    </div>
  )
}

const BlogForm = ({ handleCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const onCreateBlogClick = e => {
    e.preventDefault()
    handleCreateBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={onCreateBlogClick}>
        <div>
          <label>
            title:{' '}
            <input
              type='text'
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author:{' '}
            <input
              type='text'
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url:{' '}
            <input
              type='text'
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button>create</button>
      </form>
    </>
  )
}

export default App
