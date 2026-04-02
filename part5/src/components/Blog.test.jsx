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

  test('Blog renders title and author but not url or likes by default', () => {
    render(
      <Blog
        blog={blog}
        handleDeleteBlog={handleDeleteBlog}
        handleLikeBlog={handleLikeBlog}
        currentUserId={1}
      />
    )

    const element = screen.getByText('A Test in the Making by Myself')
    const url = screen.queryByText('hiddenbydefault.com')
    expect(url).toBeNull()
    const likes = screen.queryByText('67')
    expect(likes).toBeNull()
  })

  test('Blog renders url and likes after button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        handleDeleteBlog={handleDeleteBlog}
        handleLikeBlog={handleLikeBlog}
        currentUserId={1}
      />
    )

    const button = screen.getByText('show')
    await user.click(button)
    const url = screen.getByText('hiddenbydefault.com', { exact: false })
    const likes = screen.getByText('67', { exact: false })
  })

  test('Blog calls handleLikeBlog twice when like button is clicked twice', async () => {
    const user = userEvent.setup()

    render(
      <Blog
        blog={blog}
        handleDeleteBlog={handleDeleteBlog}
        handleLikeBlog={handleLikeBlog}
        currentUserId={1}
      />
    )

    const showButton = screen.getByText('show')
    await user.click(showButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(handleLikeBlog.mock.calls).toHaveLength(2)
  })
})
