import { create } from 'zustand'

const useNotificationStore = create(set => ({
  message: null,
  severity: 'info',

  actions: {
    setNotification: ({ message, severity = 'info' }) => {
      set(() => ({ message, severity }))
      setTimeout(() => {
        set(() => ({ message: null, severity: 'info' }))
      }, 5000)
    },
  },
}))

export const useNotificationActions = () =>
  useNotificationStore(state => state.actions)

export const useNotification = () => {
  const message = useNotificationStore(state => state.message)
  const severity = useNotificationStore(state => state.severity)
  return { message, severity }
}
