import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Send,
  Smile,
  Paperclip,
  Mic,
  Image as ImageIcon,
  File,
  Video,
  Gift,
} from 'lucide-react';

const Container = styled.div`
  padding: 1.5rem;
  background: rgba(10, 14, 26, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: rgba(0, 245, 255, 0.5);
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.1);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 0.75rem;
  background: ${({ $active }) =>
    $active ? 'rgba(147, 51, 234, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid
    ${({ $active }) =>
      $active ? 'rgba(147, 51, 234, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $active }) => ($active ? '#9333EA' : '#A0AEC0')};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(147, 51, 234, 0.2);
    color: #9333EA;
    border-color: rgba(147, 51, 234, 0.5);
  }
`;

const Input = styled.textarea`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 1rem;
  resize: none;
  max-height: 120px;
  min-height: 24px;
  line-height: 1.5;
  font-family: inherit;

  &::placeholder {
    color: #718096;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
`;

const SendButton = styled(motion.button)<{ $hasContent: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $hasContent }) =>
    $hasContent
      ? 'linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)'
      : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid
    ${({ $hasContent }) =>
      $hasContent ? 'rgba(147, 51, 234, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: ${({ $hasContent }) => ($hasContent ? 'pointer' : 'not-allowed')};
  box-shadow: ${({ $hasContent }) =>
    $hasContent ? '0 0 20px rgba(147, 51, 234, 0.3)' : 'none'};
  transition: all 0.3s ease;

  &:hover {
    ${({ $hasContent }) =>
      $hasContent &&
      `
      box-shadow: 0 0 30px rgba(147, 51, 234, 0.5);
      transform: scale(1.05);
    `}
  }
`;

const AttachmentMenu = styled(motion.div)`
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 0.5rem;
  background: rgba(15, 20, 35, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  min-width: 240px;
`;

const AttachmentOption = styled(motion.button)`
  padding: 1rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #A0AEC0;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(147, 51, 234, 0.1);
    border-color: rgba(147, 51, 234, 0.3);
    color: #9333EA;
  }
`;

const OptionIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const OptionLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
`;

const VoiceRecording = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 0.5rem;
`;

const WaveformBars = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  height: 32px;
`;

const WaveBar = styled(motion.div)`
  width: 3px;
  background: linear-gradient(180deg, #9333EA 0%, #00F5FF 100%);
  border-radius: 2px;
`;

const RecordingTime = styled.span`
  font-size: 0.875rem;
  color: #A0AEC0;
  font-variant-numeric: tabular-nums;
`;

export const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setRecordingTime(0);
      // Start recording timer
      const interval = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Container>
      <InputWrapper>
        <ActionButtons style={{ position: 'relative' }}>
          <ActionButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAttachments(!showAttachments)}
            $active={showAttachments}
          >
            <Paperclip size={18} />
          </ActionButton>

          {showAttachments && (
            <AttachmentMenu
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
            >
              <AttachmentOption whileHover={{ scale: 1.05 }}>
                <OptionIcon $color="linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)">
                  <ImageIcon size={20} />
                </OptionIcon>
                <OptionLabel>Photo</OptionLabel>
              </AttachmentOption>
              <AttachmentOption whileHover={{ scale: 1.05 }}>
                <OptionIcon $color="linear-gradient(135deg, #EC4899 0%, #DB2777 100%)">
                  <Video size={20} />
                </OptionIcon>
                <OptionLabel>Video</OptionLabel>
              </AttachmentOption>
              <AttachmentOption whileHover={{ scale: 1.05 }}>
                <OptionIcon $color="linear-gradient(135deg, #10B981 0%, #059669 100%)">
                  <File size={20} />
                </OptionIcon>
                <OptionLabel>Document</OptionLabel>
              </AttachmentOption>
              <AttachmentOption whileHover={{ scale: 1.05 }}>
                <OptionIcon $color="linear-gradient(135deg, #FFD700 0%, #CCB700 100%)">
                  <Gift size={20} />
                </OptionIcon>
                <OptionLabel>NFT Gift</OptionLabel>
              </AttachmentOption>
            </AttachmentMenu>
          )}

          <ActionButton whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Smile size={18} />
          </ActionButton>
        </ActionButtons>

        {isRecording ? (
          <VoiceRecording>
            <WaveformBars>
              {[...Array(12)].map((_, i) => (
                <WaveBar
                  key={i}
                  animate={{
                    height: [8, 24, 8],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </WaveformBars>
            <RecordingTime>{formatTime(recordingTime)}</RecordingTime>
          </VoiceRecording>
        ) : (
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
          />
        )}

        {message.trim() ? (
          <SendButton
            $hasContent={true}
            onClick={handleSend}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Send size={18} />
          </SendButton>
        ) : (
          <ActionButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleRecording}
            $active={isRecording}
          >
            <Mic size={18} />
          </ActionButton>
        )}
      </InputWrapper>
    </Container>
  );
};
