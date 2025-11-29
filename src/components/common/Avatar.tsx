import styled from 'styled-components';
import { motion } from 'framer-motion';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  online?: boolean;
  isPremium?: boolean;
  nftBadgeNumber?: number;
  onClick?: () => void;
}

const sizes = {
  xs: '24px',
  sm: '32px',
  md: '40px',
  lg: '56px',
  xl: '80px',
};

const AvatarContainer = styled.div<{ $size: string }>`
  position: relative;
  width: ${({ $size }) => sizes[$size as keyof typeof sizes]};
  height: ${({ $size }) => sizes[$size as keyof typeof sizes]};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`;

const AvatarImage = styled(motion.img)<{ $isPremium: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: ${({ $isPremium }) =>
    $isPremium ? '2px solid #9333EA' : '2px solid rgba(255, 255, 255, 0.1)'};
  box-shadow: ${({ $isPremium }) =>
    $isPremium ? '0 0 20px rgba(147, 51, 234, 0.4)' : 'none'};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ $isPremium }) => ($isPremium ? '#A855F7' : 'rgba(255, 255, 255, 0.2)')};
  }
`;

const Placeholder = styled.div<{ $isPremium: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #9333EA 0%, #7E22CE 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  border: ${({ $isPremium }) =>
    $isPremium ? '2px solid #9333EA' : '2px solid rgba(255, 255, 255, 0.1)'};
  box-shadow: ${({ $isPremium }) =>
    $isPremium ? '0 0 20px rgba(147, 51, 234, 0.4)' : 'none'};
`;

const OnlineIndicator = styled.div<{ $size: string }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${({ $size }) => {
    switch ($size) {
      case 'xs':
        return '6px';
      case 'sm':
        return '8px';
      case 'md':
        return '10px';
      case 'lg':
        return '12px';
      case 'xl':
        return '16px';
      default:
        return '10px';
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'xs':
        return '6px';
      case 'sm':
        return '8px';
      case 'md':
        return '10px';
      case 'lg':
        return '12px';
      case 'xl':
        return '16px';
      default:
        return '10px';
    }
  }};
  border-radius: 50%;
  background: #10B981;
  border: 2px solid #0A0E1A;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
`;

const NFTBadge = styled(motion.div)<{ $size: string }>`
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #FFD700 0%, #CCB700 100%);
  color: #0A0E1A;
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'xs':
        return '8px';
      case 'sm':
        return '9px';
      case 'md':
        return '10px';
      case 'lg':
        return '11px';
      case 'xl':
        return '12px';
      default:
        return '10px';
    }
  }};
  font-weight: 700;
  padding: ${({ $size }) => {
    switch ($size) {
      case 'xs':
      case 'sm':
        return '2px 4px';
      default:
        return '2px 6px';
    }
  }};
  border-radius: 0.5rem;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.3);
  backdrop-filter: blur(8px);
`;

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  online = false,
  isPremium = false,
  nftBadgeNumber,
  onClick,
}) => {
  return (
    <AvatarContainer $size={size} onClick={onClick}>
      {src ? (
        <AvatarImage
          src={src}
          alt={alt}
          $isPremium={isPremium}
          whileHover={onClick ? { scale: 1.05 } : {}}
          whileTap={onClick ? { scale: 0.95 } : {}}
        />
      ) : (
        <Placeholder $isPremium={isPremium}>
          {alt.charAt(0).toUpperCase()}
        </Placeholder>
      )}
      {online && <OnlineIndicator $size={size} />}
      {nftBadgeNumber && (
        <NFTBadge
          $size={size}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          #{nftBadgeNumber}
        </NFTBadge>
      )}
    </AvatarContainer>
  );
};
