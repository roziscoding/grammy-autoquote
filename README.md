# Auto quote plugin for grammY

This plugin provides a transformer for setting the `reply_to_message_id` param in every message your bot sends, and a middleware to install the transformer to every route, if you with to do so.

## How does it work

This plugin works by setting `reply_to_message_id` param to the value of `ctx.msg.message_id` for every API method that starts with `send` (except for `sendChatAction`).

## Installation

### Deno

Just import the plugin from `jsr`:

```ts
import { autoQuote } from 'jsr:@roz/grammy-autoquote';
```

Or add an import map and import it directly

```sh
deno add @roz/grammy-autoquote
```

```ts
import { autoQuote } from '@roz/grammy-autoquote';
```

### Node.js

Add the plugin to your project

- jsr (preferred)

  ```sh
  npx jsr add @roz/grammy-autoquote
  ```

- npm

  ```sh
  npm install @roziscoding/grammy-autoquote
  ```

Then import it in your code

```ts
import { autoQuote } from "@roz/grammy-autoquote"; // for jsr
import { autoQuote } from "@roziscoding/grammy-autoquote"; // for npm
```

## Usage

### Reply Parameters

The plugin supports specifying the `allow_send_without_reply` parameter, which will allow the bot to send messages without quoting the user's message. To do so, just pass an object to the plugin initializer like so:

```ts
autoQuote({ allow_send_without_reply: true });
```

### For a single context

```ts
import { Bot } from "grammy";
import { addReplyParam } from "@roz/grammy-autoquote";

const bot = new Bot("");

bot.command("demo", async (ctx) => {
  ctx.api.config.use(addReplyParam(ctx));
  // ctx.api.config.use(addReplyParam(ctx, { allow_send_without_reply: true }));

  ctx.reply("Demo command!"); // This will quote the user's message
});

bot.start();
```

### For every context

```ts
import { Bot } from "grammy";
import { autoQuote } from "@roz/grammy-autoquote";

const bot = new Bot("");

bot.use(autoQuote());
// bot.use(autoQuote({ allow_send_without_reply: true })

bot.command("demo", async (ctx) => {
  ctx.reply("Demo command!"); // This will quote the user's message
});

bot.command("hello", async (ctx) => {
  ctx.reply("Hi there :)"); // Also quotes the user's message
});

bot.start();
```
