import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium' | 'vip';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

const StyledButton = styled(motion.button)<{
  $variant: string;
  $size: string;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: ${({ $size }) =>
    $size === 'sm' ? '0.5rem' : $size === 'lg' ? '1rem' : '0.75rem'};
  padding: ${({ $size }) =>
    $size === 'sm' ? '0.5rem 1rem' : $size === 'lg' ? '1rem 2rem' : '0.75rem 1.5rem'};
  font-size: ${({ $size }) =>
    $size === 'sm' ? '0.875rem' : $size === 'lg' ? '1.125rem' : '1rem'};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #9333EA 0%, #7E22CE 100%);
          color: white;
          border: none;
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.3);

          &:hover {
            box-shadow: 0 0 30px rgba(147, 51, 234, 0.5);
            transform: translateY(-2px);
          }

          &:active {
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return `
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(12px);

          &:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.3);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: #00F5FF;
          border: 2px solid #00F5FF;

          &:hover {
            background: rgba(0, 245, 255, 0.1);
            box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: white;
          border: none;

          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }
        `;
      case 'premium':
        return `
          background: linear-gradient(135deg, #9333EA 0%, #7E22CE 100%);
          color: white;
          border: 1px solid rgba(147, 51, 234, 0.5);
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.4);

          &:hover {
            box-shadow: 0 0 30px rgba(147, 51, 234, 0.6);
          }
        `;
      case 'vip':
        return `
          background: linear-gradient(135deg, #FFD700 0%, #CCB700 100%);
          color: #0A0E1A;
          border: none;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
          font-weight: 700;

          &:hover {
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
          }
        `;
      default:
        return '';
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  icon,
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </StyledButton>
  );
};
