const Koa = require('koa')
const Router = require('koa-router')
const statics = require('koa-static')
const fs = require('fs')
// const koaBody = require('koa-body')

const port = 33555
const app = new Koa
const router = new Router

// app.use(koaBody())
app.use(statics('docs'))

router.get('/next-post-id', async function (ctx) {
  const posts = await fs.readdirSync('./docs/posts/')
  return ctx.body = 119 + 1 + posts.length
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(port, function () {
  console.log(`http://localhost:${port}/`)
})
