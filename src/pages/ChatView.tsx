import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Phone,
  Video,
  MoreVertical,
  Search,
  Pin,
  Bell,
  Trash,
  UserPlus,
} from 'lucide-react';
import { Avatar, Badge } from '../components/common';
import { MessageBubble } from '../components/chat/MessageBubble';
import { MessageInput } from '../components/chat/MessageInput';
import { Message } from '../types';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0A0E1A;
`;

const ChatHeader = styled.div`
  padding: 1.5rem;
  background: rgba(10, 14, 26, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const ChatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ChatName = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChatStatus = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const IconButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A0AEC0;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #00F5FF;
    border-color: rgba(0, 245, 255, 0.3);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: relative;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
`;

const DateDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0 1rem;
`;

const DateLabel = styled.div`
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  font-size: 0.75rem;
  color: #A0AEC0;
  backdrop-filter: blur(12px);
`;

const TypingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1.5rem;
  margin-bottom: 1rem;
`;

const TypingBubble = styled.div`
  padding: 0.875rem 1.125rem;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  display: flex;
  gap: 0.25rem;
`;

const TypingDot = styled(motion.div)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #718096;
`;

const ContextMenu = styled(motion.div)`
  position: absolute;
  top: 60px;
  right: 1.5rem;
  background: rgba(15, 20, 35, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  z-index: 100;
`;

const MenuItem = styled(motion.button)`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #A0AEC0;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }

  &.danger {
    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #EF4444;
    }
  }
`;

// Mock messages
const mockMessages: Message[] = [
  {
    id: '1',
    chatId: '1',
    senderId: '2',
    content: 'Hey! How are you doing?',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    status: 'read',
    reactions: [],
    isEdited: false,
    isDeleted: false,
  },
  {
    id: '2',
    chatId: '1',
    senderId: '1',
    content: 'Great! Just checking out this new NFT collection',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    status: 'read',
    reactions: [
      { emoji: '🔥', userId: '2', timestamp: new Date() },
      { emoji: '👍', userId: '2', timestamp: new Date() },
    ],
    isEdited: false,
    isDeleted: false,
  },
  {
    id: '3',
    chatId: '1',
    senderId: '2',
    content: 'That sounds awesome! Can you share it with me?',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    status: 'read',
    reactions: [],
    isEdited: false,
    isDeleted: false,
  },
  {
    id: '4',
    chatId: '1',
    senderId: '1',
    content: 'Sure! Let me send you the link',
    type: 'text',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    status: 'delivered',
    reactions: [],
    isEdited: true,
    isDeleted: false,
  },
];

export const ChatView = () => {
  const [messages] = useState<Message[]>(mockMessages);
  const [isTyping] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const currentUserId = '1';

  return (
    <Container>
      <ChatHeader>
        <HeaderLeft>
          <Avatar
            src={undefined}
            alt="Alex Johnson"
            size="lg"
            online={true}
            isPremium={true}
            nftBadgeNumber={111}
          />
          <ChatInfo>
            <ChatName>
              Alex Johnson
              <Badge variant="verified" size="sm">
                Verified
              </Badge>
            </ChatName>
            <ChatStatus>Online</ChatStatus>
          </ChatInfo>
        </HeaderLeft>

        <HeaderActions>
          <IconButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Search size={20} />
          </IconButton>
          <IconButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Phone size={20} />
          </IconButton>
          <IconButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Video size={20} />
          </IconButton>
          <IconButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical size={20} />
          </IconButton>
        </HeaderActions>

        {showMenu && (
          <ContextMenu
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
          >
            <MenuItem whileHover={{ x: 4 }}>
              <Pin size={16} />
              Pin Chat
            </MenuItem>
            <MenuItem whileHover={{ x: 4 }}>
              <Bell size={16} />
              Mute Notifications
            </MenuItem>
            <MenuItem whileHover={{ x: 4 }}>
              <Search size={16} />
              Search in Chat
            </MenuItem>
            <MenuItem whileHover={{ x: 4 }}>
              <UserPlus size={16} />
              Add to Group
            </MenuItem>
            <MenuItem className="danger" whileHover={{ x: 4 }}>
              <Trash size={16} />
              Delete Chat
            </MenuItem>
          </ContextMenu>
        )}
      </ChatHeader>

      <MessagesContainer>
        <DateDivider>
          <DateLabel>Today</DateLabel>
        </DateDivider>

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isSent={message.senderId === currentUserId}
          />
        ))}

        {isTyping && (
          <TypingIndicator
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Avatar src={undefined} alt="Alex" size="sm" />
            <TypingBubble>
              {[0, 1, 2].map((i) => (
                <TypingDot
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </TypingBubble>
          </TypingIndicator>
        )}
      </MessagesContainer>

      <MessageInput />
    </Container>
  );
};
