import { Context, Middleware, Transformer } from "./deps.deno.ts";

export type AutoQuoteOptions = {
  /**
   * Mirror for the property described in the [documentation for ReplyParameters](https://core.telegram.org/bots/api#replyparameters)
   */
  allowSendingWithoutReply: boolean;
};

export const addReplyParam = <C extends Context>(
  ctx: C,
  options?: Partial<AutoQuoteOptions>,
) => {
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
          allow_sending_without_reply: options?.allowSendingWithoutReply,
        },
      },
      signal,
    );
  };

  return transformer;
};

export const autoQuote =
  (options?: Partial<AutoQuoteOptions>): Middleware => async (ctx, next) => {
    ctx.api.config.use(addReplyParam(ctx, options));
    await next();
  };
