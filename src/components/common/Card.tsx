import styled from 'styled-components';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient';
  padding?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

const StyledCard = styled(motion.div)<{
  $variant: string;
  $padding: string;
  $hoverable: boolean;
}>`
  border-radius: 1rem;
  padding: ${({ $padding }) => $padding};
  cursor: ${({ $hoverable }) => ($hoverable ? 'pointer' : 'default')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${({ $variant }) => {
    switch ($variant) {
      case 'glass':
        return `
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        `;
      case 'gradient':
        return `
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(0, 245, 255, 0.1) 100%);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        `;
      default:
        return `
          background: rgba(10, 14, 26, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.05);
        `;
    }
  }}

  ${({ $hoverable }) =>
    $hoverable &&
    `
    &:hover {
      border-color: rgba(0, 245, 255, 0.3);
      box-shadow: 0 0 20px rgba(0, 245, 255, 0.1);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  `}
`;

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = '1.5rem',
  hoverable = false,
  onClick,
}) => {
  return (
    <StyledCard
      $variant={variant}
      $padding={padding}
      $hoverable={hoverable}
      onClick={onClick}
      whileTap={hoverable ? { scale: 0.98 } : {}}
    >
      {children}
    </StyledCard>
  );
};
