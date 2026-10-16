import { afterEach, describe, expect, test, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('retired Loops redirect policy', () => {
  test.each(['dev', 'staging', 'prod'])('has no Loops redirect in %s', async environment => {
    vi.stubEnv('NEXT_PUBLIC_APP_ENV', environment)
    vi.resetModules()
    const { default: config } = await import('./next.config')
    const redirects = await config.redirects!()

    expect(redirects.some(rule => rule.source === '/loops')).toBe(false)
  })

  test.each(['dev', 'staging', 'prod'])('preserves Discord in %s', async environment => {
    vi.stubEnv('NEXT_PUBLIC_APP_ENV', environment)
    vi.resetModules()
    const { default: config } = await import('./next.config')
    const redirects = await config.redirects!()

    expect(redirects).toContainEqual({
      source: '/discord',
      destination: 'https://discord.gg/kbPnYJjvwZ',
      permanent: false,
    })
  })
})
