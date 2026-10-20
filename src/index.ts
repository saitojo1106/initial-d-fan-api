import app from './app'

const port = Number(Bun.env.PORT ?? 3000)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer between 1 and 65535')

Bun.serve({ port, fetch: app.fetch })
console.log(`Initial D Fan API running at http://localhost:${port}/docs`)
