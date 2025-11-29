import styled from 'styled-components';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Check, CheckCheck, Edit2, Trash2, Reply, MoreVertical } from 'lucide-react';
import { Message } from '../../types';
import { useState } from 'react';

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
  showAvatar?: boolean;
}

const BubbleContainer = styled(motion.div)<{ $isSent: boolean }>`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  justify-content: ${({ $isSent }) => ($isSent ? 'flex-end' : 'flex-start')};
  flex-direction: ${({ $isSent }) => ($isSent ? 'row-reverse' : 'row')};
`;

const BubbleContent = styled.div<{ $isSent: boolean }>`
  max-width: 60%;
  display: flex;
  flex-direction: column;
  align-items: ${({ $isSent }) => ($isSent ? 'flex-end' : 'flex-start')};
`;

const Bubble = styled(motion.div)<{ $isSent: boolean; $isDeleted: boolean }>`
  padding: 0.875rem 1.125rem;
  border-radius: 1.25rem;
  background: ${({ $isSent, $isDeleted }) =>
    $isDeleted
      ? 'rgba(239, 68, 68, 0.1)'
      : $isSent
      ? 'linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)'
      : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid
    ${({ $isSent, $isDeleted }) =>
      $isDeleted
        ? 'rgba(239, 68, 68, 0.3)'
        : $isSent
        ? 'rgba(147, 51, 234, 0.3)'
        : 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(12px);
  position: relative;
  box-shadow: ${({ $isSent }) =>
    $isSent ? '0 0 20px rgba(147, 51, 234, 0.2)' : 'none'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ $isSent, $isDeleted }) =>
      $isDeleted
        ? 'rgba(239, 68, 68, 0.5)'
        : $isSent
        ? 'rgba(147, 51, 234, 0.5)'
        : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const MessageText = styled.p<{ $isDeleted: boolean }>`
  color: ${({ $isDeleted }) => ($isDeleted ? '#EF4444' : 'white')};
  margin: 0;
  line-height: 1.5;
  word-wrap: break-word;
  font-style: ${({ $isDeleted }) => ($isDeleted ? 'italic' : 'normal')};
`;

const MessageFooter = styled.div<{ $isSent: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  justify-content: ${({ $isSent }) => ($isSent ? 'flex-end' : 'flex-start')};
`;

const Timestamp = styled.span`
  font-size: 0.75rem;
  color: #718096;
`;

const StatusIcon = styled.span<{ $status: string }>`
  display: flex;
  align-items: center;
  color: ${({ $status }) => ($status === 'read' ? '#00F5FF' : '#718096')};
`;

const EditedLabel = styled.span`
  font-size: 0.75rem;
  color: #718096;
  font-style: italic;
`;

const ReactionBar = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
`;

const Reaction = styled(motion.div)`
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ReactionCount = styled.span`
  font-size: 0.75rem;
  color: #A0AEC0;
  font-weight: 600;
`;

const ActionMenu = styled(motion.div)<{ $isSent: boolean }>`
  position: absolute;
  top: 0;
  ${({ $isSent }) => ($isSent ? 'left: -120px' : 'right: -120px')};
  background: rgba(15, 20, 35, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

const ActionButton = styled(motion.button)`
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A0AEC0;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &.danger:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #EF4444;
    border-color: rgba(239, 68, 68, 0.3);
  }
`;

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isSent,
  showAvatar = true,
}) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <Check size={14} />;
      case 'delivered':
        return <CheckCheck size={14} />;
      case 'read':
        return <CheckCheck size={14} />;
      default:
        return null;
    }
  };

  const groupedReactions = message.reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <BubbleContainer
      $isSent={isSent}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <BubbleContent $isSent={isSent}>
        <Bubble
          $isSent={isSent}
          $isDeleted={message.isDeleted}
          whileHover={{ scale: 1.02 }}
        >
          <MessageText $isDeleted={message.isDeleted}>
            {message.isDeleted ? 'This message was deleted' : message.content}
          </MessageText>

          {showActions && !message.isDeleted && (
            <ActionMenu
              $isSent={isSent}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <ActionButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Reply size={16} />
              </ActionButton>
              {isSent && (
                <ActionButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Edit2 size={16} />
                </ActionButton>
              )}
              <ActionButton
                className="danger"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 size={16} />
              </ActionButton>
            </ActionMenu>
          )}
        </Bubble>

        {message.reactions.length > 0 && (
          <ReactionBar>
            {Object.entries(groupedReactions).map(([emoji, count]) => (
              <Reaction
                key={emoji}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {emoji}
                <ReactionCount>{count}</ReactionCount>
              </Reaction>
            ))}
          </ReactionBar>
        )}

        <MessageFooter $isSent={isSent}>
          {message.isEdited && <EditedLabel>edited</EditedLabel>}
          <Timestamp>{format(message.timestamp, 'HH:mm')}</Timestamp>
          {isSent && (
            <StatusIcon $status={message.status}>{getStatusIcon()}</StatusIcon>
          )}
        </MessageFooter>
      </BubbleContent>
    </BubbleContainer>
  );
};
