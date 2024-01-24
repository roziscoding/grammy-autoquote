import { Bot } from "./src/deps.deno.ts";
import { autoQuote } from "./src/mod.ts";

const bot = new Bot("298746736:AAFA6AuLgCvYujnZWsvqp559poFrSsPDRBE");
bot.use(autoQuote({ allowSendingWithoutReply: true }));

bot.on("message", (ctx) => {
  ctx.reply("Hello, world!");
});

bot.start();
