import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useField } from '../hooks/useField'
import useUser from '../hooks/useUser'
import { useNotificationActions } from '../stores/notificationStore'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const { reset: resetUsername, ...username } = useField('text')
  const { reset: resetPassword, ...password } = useField('password')
  const { setNotification } = useNotificationActions()
  const navigate = useNavigate()
  const { login, user } = useUser()

  const onLoginClick = async e => {
    e.preventDefault()

    try {
      await login(username.value, password.value)
      resetUsername()
      resetPassword()
      setNotification({
        message: `Logged in as ${username.value}`,
        severity: 'success',
      })
      navigate('/')
    } catch {
      resetPassword()
      setNotification({
        message: 'Invalid username or password',
        severity: 'error',
      })
    }
  }

  if (user) {
    navigate('/')
    return null
  }

  return (
    <>
      <h2>log in to application</h2>
      <form onSubmit={onLoginClick}>
        <div>
          <TextField
            label='Username'
            {...username}
            size='small'
            margin='dense'
          />
        </div>
        <div>
          <TextField
            label='Password'
            {...password}
            size='small'
            margin='dense'
          />
        </div>
        <Button type='submit' variant='contained' size='small' sx={{ mt: 1 }}>
          Login
        </Button>
      </form>
    </>
  )
}

export default LoginForm
