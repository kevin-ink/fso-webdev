import { useState } from 'react'

export const useNotification = (duration = 5000) => {
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })

    setTimeout(() => {
      setNotification(null)
    }, duration)
  }

  return {
    notification,
    showNotification,
  }
}
