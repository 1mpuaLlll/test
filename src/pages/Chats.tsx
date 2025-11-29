import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Search,
  Settings,
  Plus,
  MoreVertical,
  Check,
  CheckCheck,
  Pin,
  Bell,
  BellOff,
} from 'lucide-react';
import { Avatar, Badge, Input, Card } from '../components/common';
import { Chat } from '../types';
import { formatDistanceToNow } from 'date-fns';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background: #0A0E1A;
  display: flex;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 380px;
  background: rgba(10, 14, 26, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(20px);
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #9333EA 0%, #00F5FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
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

const SearchWrapper = styled.div`
  margin-top: 1rem;
`;

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
`;

const ChatItem = styled(motion.div)<{ $isActive: boolean }>`
  padding: 1rem 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: ${({ $isActive }) =>
    $isActive ? 'rgba(147, 51, 234, 0.1)' : 'transparent'};
  border-left: 3px solid
    ${({ $isActive }) => ($isActive ? '#9333EA' : 'transparent')};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ChatInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`;

const ChatName = styled.div`
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChatTime = styled.span`
  font-size: 0.75rem;
  color: #718096;
`;

const ChatPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #718096;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UnreadBadge = styled.div`
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, #9333EA 0%, #7E22CE 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.375rem;
  box-shadow: 0 0 15px rgba(147, 51, 234, 0.4);
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0A0E1A;
`;

const EmptyState = styled.div`
  text-align: center;
  max-width: 400px;
  padding: 2rem;
`;

const EmptyIcon = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  border-radius: 2rem;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(0, 245, 255, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const EmptySubtitle = styled.p`
  color: #A0AEC0;
  margin-bottom: 2rem;
`;

// Mock data
const mockChats: Chat[] = [
  {
    id: '1',
    type: 'private',
    name: 'Alex Johnson',
    participants: ['1', '2'],
    lastMessage: {
      id: 'm1',
      chatId: '1',
      senderId: '2',
      content: 'Hey! Check out my new NFT collection',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'read',
      reactions: [],
      isEdited: false,
      isDeleted: false,
    },
    unreadCount: 2,
    isPinned: true,
    isMuted: false,
    isSecret: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    type: 'private',
    name: 'Sarah Williams',
    participants: ['1', '3'],
    lastMessage: {
      id: 'm2',
      chatId: '2',
      senderId: '1',
      content: 'Sounds good!',
      type: 'text',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: 'delivered',
      reactions: [],
      isEdited: false,
      isDeleted: false,
    },
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    isSecret: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const Chats = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats] = useState<Chat[]>(mockChats);

  const filteredChats = chats.filter((chat) =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check size={14} />;
      case 'delivered':
      case 'read':
        return <CheckCheck size={14} />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <HeaderTop>
            <Logo>Elevate</Logo>
            <HeaderActions>
              <IconButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Plus size={20} />
              </IconButton>
              <IconButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Settings size={20} />
              </IconButton>
            </HeaderActions>
          </HeaderTop>
          <SearchWrapper>
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={18} />}
              fullWidth
            />
          </SearchWrapper>
        </SidebarHeader>

        <ChatList>
          {filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              $isActive={activeChat === chat.id}
              onClick={() => setActiveChat(chat.id)}
              whileHover={{ x: 4 }}
            >
              <Avatar
                src={undefined}
                alt={chat.name || 'Chat'}
                size="lg"
                online={true}
                isPremium={true}
                nftBadgeNumber={111}
              />
              <ChatInfo>
                <ChatHeader>
                  <ChatName>
                    {chat.name}
                    {chat.isPinned && <Pin size={14} color="#9333EA" />}
                    {chat.isMuted && <BellOff size={14} color="#718096" />}
                  </ChatName>
                  <ChatTime>
                    {chat.lastMessage &&
                      formatDistanceToNow(chat.lastMessage.timestamp, {
                        addSuffix: false,
                      })}
                  </ChatTime>
                </ChatHeader>
                <ChatPreview>
                  {chat.lastMessage?.senderId === '1' &&
                    getMessageStatusIcon(chat.lastMessage.status)}
                  {chat.lastMessage?.content}
                </ChatPreview>
              </ChatInfo>
              {chat.unreadCount > 0 && (
                <UnreadBadge>{chat.unreadCount}</UnreadBadge>
              )}
            </ChatItem>
          ))}
        </ChatList>
      </Sidebar>

      <MainContent>
        {!activeChat ? (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyTitle>Select a Chat</EmptyTitle>
            <EmptySubtitle>
              Choose a conversation from the sidebar to start messaging
            </EmptySubtitle>
          </EmptyState>
        ) : (
          <div>Chat view will go here</div>
        )}
      </MainContent>
    </Container>
  );
};
