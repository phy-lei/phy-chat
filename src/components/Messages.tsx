'use client';

import { pusherClient } from '@/lib/pusher';
import { cn, toPusherKey } from '@/lib/utils';
import { Message } from '@/lib/validations/message';
import ChatBubble from '@/components/ChatBubble';
import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react';

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  chatId: string;
  sessionImg: string | null | undefined;
  chatPartner: User;
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  chatId,
  chatPartner,
  sessionImg,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };

    const delMessageHandler = (delData: Record<string, number>) => {
      const { messageNum, index } = delData;

      setMessages((prev) => {
        const tempArr = [...prev];
        tempArr.splice(index, messageNum);
        return tempArr;
      });
    };

    pusherClient.bind('incoming-message', messageHandler);
    pusherClient.bind('delete-message', delMessageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind('incoming-message', messageHandler);
    };
  }, [chatId]);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />

      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;

        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <div
            className="chat-message"
            key={`${message.id}-${message.timestamp}`}
          >
            <div
              className={cn('flex items-end', {
                'justify-end': isCurrentUser,
              })}
            >
              <ChatBubble
                isCurrentUser={isCurrentUser}
                message={message}
                index={index}
                chatId={chatId}
                isRoundCorner={hasNextMessageFromSameUser}
              />
              <div
                className={cn('relative w-6 h-6', {
                  'order-2': isCurrentUser,
                  'order-1': !isCurrentUser,
                  'invisible': hasNextMessageFromSameUser,
                })}
              >
                <Image
                  fill
                  src={
                    isCurrentUser ? (sessionImg as string) : chatPartner.image
                  }
                  alt="Profile picture"
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
