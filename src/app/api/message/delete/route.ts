import { db } from '@/lib/db'
import { Message } from '@/lib/validations/message'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const { chatId, message }: { chatId: string; message: Message } = await req.json()
    const res = await db.zrem(`chat:${chatId}:messages`, JSON.stringify(message))

    if (res === 0) return new Response(res.toString());
    await pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'delete-message', message)

    return new Response(res.toString());
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}