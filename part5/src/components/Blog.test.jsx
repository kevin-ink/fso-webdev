import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog', () => {
  let handleDeleteBlog
  let handleLikeBlog
  let blog

  beforeEach(() => {
    handleDeleteBlog = vi.fn()
    handleLikeBlog = vi.fn()
    blog = {
      title: 'A Test in the Making',
      author: 'Myself',
      url: 'hiddenbydefault.com',
      likes: 67,
      user: {
        id: 1,
        username: 'testing',
        name: 'Test Maker',
      },
    }
  })

  test('Blog (not the user) renders title, author, likes, and url but hides remove button', () => {
    render(
      <Blog
        blog={blog}
        handleDeleteBlog={handleDeleteBlog}
        handleLikeBlog={handleLikeBlog}
        canRemove={false}
      />
    )

    screen.getByText('A Test in the Making by Myself')
    screen.getByText('hiddenbydefault.com')
    screen.getByText('likes 67')
    const removeButton = screen.queryByText('remove')
    expect(removeButton).toBeNull()
  })

  test('Blog (the user) renders title, author, likes, and url and shows remove button', () => {
    render(
      <Blog
        blog={blog}
        handleDeleteBlog={handleDeleteBlog}
        handleLikeBlog={handleLikeBlog}
        canRemove={true}
      />
    )

    screen.getByText('A Test in the Making by Myself')
    screen.getByText('hiddenbydefault.com')
    screen.getByText('likes 67')
    const removeButton = screen.queryByText('remove')
    expect(removeButton).not.toBeNull()
  })

  test('Blog calls handleLikeBlog twice when like button is clicked twice', async () => {
    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        handleDeleteBlog={handleDeleteBlog}
        handleLikeBlog={handleLikeBlog}
        canRemove={false}
      />
    )

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(handleLikeBlog.mock.calls).toHaveLength(2)
  })
})
