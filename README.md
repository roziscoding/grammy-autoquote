# Auto quote plugin for grammY

This plugin provides a convenient way to quote the user's message when replying to them.

## How does it work

This plugin works by setting `reply_to_message_id` param to the value of `ctx.msg.message_id` for every API method that starts with `send` (except for `sendChatAction`).

## Usage

### Reply Parameters

The plugin supports specifying the `allow_send_without_reply` parameter, which will allow the bot to send messages without quoting the user's message. To do so, just pass an object to the plugin initializer like so:

```ts
autoQuote({ allowSendingWithoutReply: true });
```

### For a single context

```ts
import { Bot } from "grammy";
import { addReplyParam } from "@roz/grammy-autoquote";

const bot = new Bot("");

bot.command("demo", async (ctx) => {
  ctx.api.config.use(addReplyParam(ctx));
  // ctx.api.config.use(addReplyParam(ctx, { allowSendingWithoutReply: true }));

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
// bot.use(autoQuote({ allowSendingWithoutReply: true }));

bot.command("demo", async (ctx) => {
  ctx.reply("Demo command!"); // This will quote the user's message
});

bot.command("hello", async (ctx) => {
  ctx.reply("Hi there :)"); // Also quotes the user's message
});

bot.start();
```
