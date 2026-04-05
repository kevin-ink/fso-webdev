const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Astro Astra',
        username: 'astrologian',
        password: 'ilikeraiding',
      },
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('log in to application')

    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('astrologian')
      await page.getByLabel('password').fill('ilikeraiding')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('astrologian logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('astrologian')
      await page.getByLabel('password').fill('ilikeraidingquestionmark')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong credentials')).toBeVisible()
      await expect(page.getByText('astrologian logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('astrologian')
      await page.getByLabel('password').fill('ilikeraiding')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('How to Play Astrologian')
      await page.getByLabel('author').fill('An Astro Main')
      await page.getByLabel('url').fill('astroastra.com/learn')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(
        page
          .locator('.blog')
          .getByText('How to Play Astrologian by An Astro Main')
      ).toBeVisible()
      await expect(page.getByRole('button', { name: 'show' })).toBeVisible()
      await expect(page.getByText('url', { exact: false })).not.toBeVisible()
      await expect(page.getByText('likes', { exact: false })).not.toBeVisible()
    })

    describe('there is initially a blog', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByLabel('title').fill('How to Play Astrologian')
        await page.getByLabel('author').fill('An Astro Main')
        await page.getByLabel('url').fill('astroastra.com/learn')
        await page.getByRole('button', { name: 'create' }).click()
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'show' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog can be deleted by the user who created it', async ({
        page,
      }) => {
        await page.getByRole('button', { name: 'show' }).click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(
          page
            .locator('.blog')
            .getByText('How to Play Astrologian by An Astro Main')
        ).not.toBeVisible()
      })

      test('a blog cannot be deleted by another user', async ({
        page,
        request,
      }) => {
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Warrior of Light',
            username: 'warrioroflight',
            password: 'ilikeraidingtoo',
          },
        })
        await page.getByRole('button', { name: 'logout' }).click()
        await page.getByLabel('username').fill('warrioroflight')
        await page.getByLabel('password').fill('ilikeraidingtoo')
        await page.getByRole('button', { name: 'login' }).click()
        await page.getByRole('button', { name: 'show' }).click()
        await expect(
          page.getByRole('button', { name: 'remove' })
        ).not.toBeVisible()
      })
    })

    test('blogs are ordered according to likes in descending order', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel(/title/i).fill('How to Play Astrologian')
      await page.getByLabel(/author/i).fill('An Astro Main')
      await page.getByLabel(/url/i).fill('astroastra.com/learn')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel(/title/i).fill('How to Play Warrior of Light')
      await page.getByLabel(/author/i).fill('A WoL Main')
      await page.getByLabel(/url/i).fill('warrioroflight.com/learn')
      await page.getByRole('button', { name: 'create' }).click()

      const blogs = page.locator('.blog')

      await blogs.nth(0).getByRole('button', { name: 'show' }).click()
      await blogs.nth(1).getByRole('button', { name: 'show' }).click()

      await blogs.nth(0).getByRole('button', { name: 'like' }).click()
      await expect(blogs.nth(0)).toContainText('likes 1')
      await blogs.nth(0).getByRole('button', { name: 'like' }).click()
      await expect(blogs.nth(0)).toContainText('likes 2')

      await blogs.nth(1).getByRole('button', { name: 'like' }).click()
      await expect(blogs.nth(1)).toContainText('likes 1')

      await expect(blogs.first()).toContainText('How to Play Astrologian')
    })
  })
})
