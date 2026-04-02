import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
  let handleCreateBlog

  beforeEach(() => {
    handleCreateBlog = vi.fn()
  })

  test('calls handleCreateBlog with right details', async () => {
    render(<BlogForm handleCreateBlog={handleCreateBlog} />)

    const user = userEvent.setup()

    const inputs = screen.getAllByRole('textbox')
    expect(inputs).toHaveLength(3)

    await user.type(inputs[0], 'New Agent')
    await user.type(inputs[1], 'Miks')
    await user.type(inputs[2], 'www.valorantiscool.com')

    const expectedObj = {
      title: 'New Agent',
      author: 'Miks',
      url: 'www.valorantiscool.com',
    }

    const submitButton = screen.getByText('create')
    await user.click(submitButton)

    expect(handleCreateBlog.mock.calls).toHaveLength(1)
    expect(handleCreateBlog).toHaveBeenCalledWith(expectedObj)
  })
})
