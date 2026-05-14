import { Alert } from '@mui/material'
import { useNotification } from '../stores/notificationStore'

const Notification = () => {
  const { message, severity } = useNotification()

  if (!message) return null

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={severity}>
      <span>{message}</span>
    </Alert>
  )
}

export default Notification
