import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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

  const handleLogin = async e => {
    e.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = e => {
    e.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  const handleCreateBlog = async e => {
    e.preventDefault()
    const newBlog = { title, author, url }

    try {
      const response = await blogService.create(newBlog)
      setBlogs(blogs.concat(response))
      setUrl('')
      setAuthor('')
      setTitle('')
      setSuccessMessage(`a new blog ${title} by ${author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch {
      setErrorMessage('failed to create blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
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
      {blogForm()}
      <div style={{ marginTop: '20px' }}>
        {blogs.map(blog => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </>
  )

  const blogForm = () => (
    <>
      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
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

  return (
    <div>
      {errorMessage && errorPopup()}
      {successMessage && successPopup()}
      {!user && loginForm()}
      {user && <>{blogsView()}</>}
    </div>
  )
}

export default App
