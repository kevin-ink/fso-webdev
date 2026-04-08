import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (!notification) return null
  const { message, type } = notification

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={type}>
      <span>{message}</span>
    </Alert>
  )
}

export default Notification
