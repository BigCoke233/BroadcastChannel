import process from 'node:process'
import cloudflare from '@astrojs/cloudflare'
import sentry from '@sentry/astro'
import { defineConfig } from 'astro/config'
import { provider } from 'std-env'

const adapterProvider = process.env.SERVER_ADAPTER || provider

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    ...(process.env.SENTRY_DSN
      ? [
          sentry({
            enabled: {
              client: false,
              server: process.env.SENTRY_DSN,
            },
            dsn: process.env.SENTRY_DSN,
            sourceMapsUploadOptions: {
              enabled: process.env.SENTRY_PROJECT && process.env.SENTRY_AUTH_TOKEN,
              project: process.env.SENTRY_PROJECT,
              authToken: process.env.SENTRY_AUTH_TOKEN,
            },
          }),
        ]
      : []),
  ],
  vite: {
    ssr: {
      noExternal: process.env.DOCKER ? !!process.env.DOCKER : undefined,
      external: [
        ...(adapterProvider === 'cloudflare_pages'
          ? [
              'module',
              'url',
              'events',
              'worker_threads',
              'async_hooks',
              'util',
              'node:diagnostics_channel',
              'node:net',
              'node:tls',
              'node:worker_threads',
              'node:util',
              'node:fs',
              'node:path',
              'node:process',
              'node:buffer',
              'node:string_decoder',
              'node:readline',
              'node:events',
              'node:stream',
              'node:assert',
              'node:os',
              'node:crypto',
              'node:zlib',
              'node:http',
              'node:https',
              'node:url',
              'node:querystring',
              'node:child_process',
              'node:inspector',
            ]
          : []),
      ],
    },
  },
})
