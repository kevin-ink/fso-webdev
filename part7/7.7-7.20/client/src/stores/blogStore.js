import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create(set => ({
  blogs: [],
  loading: true,

  actions: {
    initialize: async () => {
      const blogs = await blogService.getAll()
      set(() => ({ blogs, loading: false }))
    },
    addBlog: async blog => {
      const newBlog = await blogService.create(blog)
      set(state => ({ blogs: [...state.blogs, newBlog] }))
    },
    removeBlog: async id => {
      await blogService.remove(id)
      set(state => ({ blogs: state.blogs.filter(b => b.id !== id) }))
    },
    addLike: async blog => {
      const updatedBlog = await blogService.updateLikes(blog)
      set(state => ({
        blogs: state.blogs.map(b =>
          b.id === updatedBlog.id ? updatedBlog : b
        ),
      }))
    },
  },
}))

export const useBlogs = () =>
  useBlogStore(state => state.blogs).toSorted((a, b) => b.likes - a.likes)

export const useBlogLoading = () => useBlogStore(state => state.loading)

export const useBlogActions = () => useBlogStore(state => state.actions)
