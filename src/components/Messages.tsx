'use client';

import { pusherClient } from '@/lib/pusher';
import { cn, toPusherKey } from '@/lib/utils';
import { Message } from '@/lib/validations/message';
import { format } from 'date-fns';
import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react';

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  chatId: string;
  sessionImg: string | null | undefined;
  chatPartner: User;
}

const judgeIsImage = (text: string) => {
  const startStr = 'https://raw.githubusercontent.com/phy-lei/blob-imgs';
  const reg = /\.(png|jpg|jpeg)$/i;

  return text.startsWith(startStr) && reg.test(text);
};

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

    pusherClient.bind('incoming-message', messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind('incoming-message', messageHandler);
    };
  }, [chatId]);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm');
  };

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />

      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;
        const isImage = judgeIsImage(message.text);

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
              <div
                className={cn(
                  'flex flex-col space-y-2 text-base max-w-xs mx-2',
                  {
                    'order-1 items-end': isCurrentUser,
                    'order-2 items-start': !isCurrentUser,
                  }
                )}
              >
                {isCurrentUser ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={'cursor-pointer mr-26'}
                    width="18"
                    height="16"
                    viewBox="0 0 40 40"
                  >
                    <path
                      fill="#888888"
                      d="M32.937 7.304H27.19v-.956c0-1.345-.423-2.32-1.278-2.915c-.604-.39-1.353-.588-2.224-.588h-6.441c-.005 0-.009.003-.014.003c-.005 0-.009-.003-.014-.003h-.909c-2.259 0-3.503 1.244-3.503 3.503v.956H7.063a.75.75 0 0 0 0 1.5h.647l1.946 25.785c0 1.631.945 2.566 2.594 2.566h15.461c1.611 0 2.557-.93 2.592-2.51L32.25 8.804h.686a.75.75 0 0 0 .001-1.5zm-2.302 2.976H9.326l-.111-1.476h21.531l-.111 1.476zM14.308 6.348c0-1.423.58-2.003 2.003-2.003h7.378c.578 0 1.053.117 1.389.333c.413.287.613.833.613 1.67v.956H14.308v-.956zm14.498 28.224c-.019.81-.295 1.083-1.095 1.083H12.25c-.818 0-1.094-.269-1.096-1.123L9.439 11.779h21.082l-1.715 22.793z"
                    />
                    <path
                      fill="#888888"
                      d="M17.401 12.969a.749.749 0 0 0-.722.776l.704 19.354a.75.75 0 0 0 .748.723l.028-.001a.749.749 0 0 0 .722-.776l-.703-19.355c-.015-.414-.353-.757-.777-.721zm-4.649.001a.75.75 0 0 0-.696.8l1.329 19.354a.749.749 0 0 0 .747.698l.053-.002a.75.75 0 0 0 .696-.8l-1.329-19.354a.756.756 0 0 0-.8-.696zm9.784-.001c-.419-.04-.762.308-.776.722l-.705 19.354a.748.748 0 0 0 .722.776l.028.001a.75.75 0 0 0 .748-.723l.705-19.354a.748.748 0 0 0-.722-.776zm4.649.001a.757.757 0 0 0-.8.696L25.056 33.02a.75.75 0 0 0 .696.8l.053.002a.75.75 0 0 0 .747-.698l1.329-19.354a.75.75 0 0 0-.696-.8z"
                    />
                  </svg>
                ) : (
                  ''
                )}
                {isImage ? (
                  <img src={message.text} />
                ) : (
                  <span
                    className={cn('px-4 py-2 rounded-lg inline-block', {
                      'bg-indigo-600 text-white': isCurrentUser,
                      'bg-gray-200 text-gray-900': !isCurrentUser,
                      'rounded-br-none':
                        !hasNextMessageFromSameUser && isCurrentUser,
                      'rounded-bl-none':
                        !hasNextMessageFromSameUser && !isCurrentUser,
                    })}
                  >
                    {message.text}{' '}
                    <span className="ml-2 text-xs text-gray-400">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </span>
                )}
              </div>

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
