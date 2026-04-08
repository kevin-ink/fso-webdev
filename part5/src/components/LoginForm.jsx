import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onLoginClick = async e => {
    e.preventDefault()

    setPassword('')

    try {
      await handleLogin(username, password)
      setUsername('')
      setPassword('')
    } catch (error) {
      if (error.message === 'wrong credentials') {
        setPassword('')
      }
    }
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

export default LoginForm
