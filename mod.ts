import type {
  Context,
  Middleware,
  Transformer,
} from "https://deno.land/x/grammy@v1.21.2/mod.ts";

/**
 * Adds `reply_to_message_id` and `chat_id` to outgoing messages if not present, forcing the bot to quote the user's message whenever possible.
 *
 * ```ts
 * import { autoQuote } from "jsr:@roz/grammy-autoquote";
 * ```
 *
 * @module
 */

/**
 * Options for the {@link autoQuote} middleware
 */
export type AutoQuoteOptions = {
  /**
   * Mirror for the property described in the [documentation for ReplyParameters](https://core.telegram.org/bots/api#replyparameters)
   */
  allow_sending_without_reply: boolean;
};

/**
 * Adds `reply_to_message_id` and `chat_id` to outgoing message payloads if not present.
 *
 * Use this when you want to enable auto-quoting for a single scope.
 *
 * @example
 * ```ts
 * import { Bot } from "grammy";
 * import { addReplyParam } from "jsr:@roz/grammy-autoquote";
 *
 * const bot = new Bot("");
 *
 * bot.command("demo", async (ctx) => {
 *   ctx.api.config.use(addReplyParam(ctx));
 *   // OR:
 *   // ctx.api.config.use(addReplyParam(ctx, { allow_send_without_reply: true }));
 *
 *   ctx.reply("Demo command!"); // This will quote the user's message
 * });
 *
 * bot.start();
 * ```
 *
 * @param ctx - The context object.
 * @param options - Optional configuration options.
 * @returns A transformer function.
 */
export function addReplyParam<C extends Context>(
  ctx: C,
  options?: Partial<AutoQuoteOptions>,
): Transformer {
  const transformer: Transformer = (prev, method, payload, signal) => {
    if (
      // If we're not calling a "send" method
      !method.startsWith("send") ||
      // If we're calling "sendChatAction", which doesn't tak "reply_to_message_id"
      method === "sendChatAction"
    ) {
      // Do nothing
      return prev(method, payload, signal);
    }

    return prev(
      method,
      {
        ...payload,
        reply_parameters: {
          ...(payload as any).reply_parameters,
          message_id: (payload as any).reply_parameters?.message_id ??
            ctx.msg?.message_id,
          chat_id: (payload as any).reply_parameters?.chat_id ?? ctx.chat?.id,
          allow_sending_without_reply: options?.allow_sending_without_reply,
        },
      },
      signal,
    );
  };

  return transformer;
}

/**
 * Applies the {@link addReplyParam} middleware to the bot's API configuration.
 *
 * Use this when you want to enable auto-quoting for all scopes.
 *
 * @example
 * ```ts
 *  import { Bot } from "grammy";
 *  import { autoQuote } from "jsr:@roz/grammy-autoquote";
 *
 *  const bot = new Bot("");
 *
 *  bot.use(autoQuote());
 *  // OR:
 *  // bot.use(autoQuote({ allow_send_without_reply: true })
 *
 *  bot.command("demo", async (ctx) => {
 *    ctx.reply("Demo command!"); // This will quote the user's message
 *  });
 *
 *  bot.command("hello", async (ctx) => {
 *    ctx.reply("Hi there :)"); // Also quotes the user's message
 *  });
 *
 *  bot.start();
 * ```
 *
 * @param options - Optional configuration options for autoQuote.
 * @returns A middleware function.
 */
export function autoQuote(options?: Partial<AutoQuoteOptions>): Middleware {
  return async (ctx, next) => {
    ctx.api.config.use(addReplyParam(ctx, options));
    await next();
  };
}
