import { Context, Middleware, Transformer } from "./deps.deno.ts";

export const addReplyParam = <C extends Context>(ctx: C) => {
  const transformer: Transformer = (prev, method, payload, signal) => {
    if (
      // If we're not calling a "send" method
      !method.startsWith("send") ||
      // If we're calling "sendChatAction", which doesn't tak "reply_to_message_id"
      method === "sendChatAction" ||
      // If a reply to message id is already set
      "reply_to_message_id" in payload
    ) {
      // Do nothing
      return prev(method, payload, signal);
    }

    if (
      // If the payload contains a chat_id
      (payload as any).chat_id &&
      // And it's different from the chat_id that initiated the interaction
      (payload as any).chat_id !== ctx.msg?.chat.id
    ) {
      // Do nothing
      return prev(method, payload, signal);
    }

    return prev(
      method,
      { ...payload, reply_to_message_id: ctx.msg?.message_id },
      signal,
    );
  };

  return transformer;
};

export const autoQuote: Middleware = (ctx, next) => {
  ctx.api.config.use(addReplyParam(ctx));
  next();
};
