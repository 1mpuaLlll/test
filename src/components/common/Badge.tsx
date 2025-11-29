import styled from 'styled-components';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'premium' | 'vip' | 'verified' | 'online' | 'nft';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const StyledBadge = styled(motion.span)<{ $variant: string; $size: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return '0.125rem 0.5rem';
      case 'lg':
        return '0.375rem 0.75rem';
      default:
        return '0.25rem 0.625rem';
    }
  }};
  border-radius: 9999px;
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return '0.75rem';
      case 'lg':
        return '0.875rem';
      default:
        return '0.8125rem';
    }
  }};
  font-weight: 600;
  transition: all 0.3s ease;

  ${({ $variant }) => {
    switch ($variant) {
      case 'premium':
        return `
          background: linear-gradient(135deg, #9333EA 0%, #7E22CE 100%);
          color: white;
          box-shadow: 0 0 15px rgba(147, 51, 234, 0.4);
        `;
      case 'vip':
        return `
          background: linear-gradient(135deg, #FFD700 0%, #CCB700 100%);
          color: #0A0E1A;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
        `;
      case 'verified':
        return `
          background: linear-gradient(135deg, #00F5FF 0%, #00C2CC 100%);
          color: white;
          box-shadow: 0 0 15px rgba(0, 245, 255, 0.4);
        `;
      case 'online':
        return `
          background: #10B981;
          color: white;
        `;
      case 'nft':
        return `
          background: linear-gradient(135deg, #A855F7 0%, #F59E0B 100%);
          color: white;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: #A0AEC0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        `;
    }
  }}
`;

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon,
}) => {
  return (
    <StyledBadge
      $variant={variant}
      $size={size}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </StyledBadge>
  );
};
