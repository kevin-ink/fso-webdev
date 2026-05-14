import { create } from 'zustand'
import userService from '../services/users'

const useUserStore = create(set => ({
  users: [],
  loading: true,

  actions: {
    initialize: async () => {
      const users = await userService.getAll()
      set(() => ({ users, loading: false }))
    },
  },
}))

export const useUsers = () => useUserStore(state => state.users)
export const useUserLoading = () => useUserStore(state => state.loading)
export const useUserActions = () => useUserStore(state => state.actions)
