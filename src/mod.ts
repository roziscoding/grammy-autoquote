import { Context, Middleware, Transformer } from './deps.deno.ts'

export const addReplyParam = <C extends Context>(ctx: C) => {
  const transformer: Transformer = (prev, method, payload, signal) => {
    if (
      !method.startsWith('send') ||
      method === 'sendChatAction' ||
      'reply_to_message_id' in payload
    ) {
      return prev(method, payload, signal)
    }

    return prev(
      method,
      { ...payload, reply_to_message_id: ctx.msg?.message_id },
      signal
    )
  }

  return transformer
}

export const autoQuote: Middleware = (ctx, next) => {
  ctx.api.config.use(addReplyParam(ctx))
  next()
}
