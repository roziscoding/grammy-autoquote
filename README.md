# Auto quote plugin for grammY

This plugin provides a transformer for setting the `reply_to_message_id` param in every message your bot sends, and a middleware to install the transformer to every route, if you with to do so.

## How does it work

This plugin works by setting `reply_to_message_id` param to the value of `ctx.msg.message_id` for every API method that starts with `send` (except for `sendChatAction`).

## Usage (for a single route)

```ts
import { Bot } from 'grammy'
import { addReplyParam } from '@roziscoding/grammy-autoquote'
// import { addReplyParam } from 'https://deno.land/x/grammy_autoquote/mod.ts'

const bot = new Bot('')

bot.command('demo', async (ctx) => {
  ctx.api.config.use(addReplyParam(ctx))

  ctx.reply('Demo command!') // This will quote the user's message
})

bot.start()
```

## Usage (for every route)

```ts
import { Bot } from 'grammy'
import { autoQuote } from '@roziscoding/grammy-autoquote'
// import { addReplyParam } from 'https://deno.land/x/grammy_autoquote/mod.ts'

const bot = new Bot('')

bot.use(autoQuote)

bot.command('demo', async (ctx) => {
  ctx.reply('Demo command!') // This will quote the user's message
})

bot.command('hello', async (ctx) => {
  ctx.reply('Hi there :)') // Also quotes the user's message
})

bot.start()
```
