import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const InputWrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #A0AEC0;
  margin-left: 0.25rem;
`;

const InputContainer = styled.div<{ $isFocused: boolean; $hasError: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid
    ${({ $hasError, $isFocused }) =>
      $hasError
        ? '#EF4444'
        : $isFocused
        ? 'rgba(0, 245, 255, 0.5)'
        : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  box-shadow: ${({ $isFocused }) =>
    $isFocused ? '0 0 20px rgba(0, 245, 255, 0.2)' : 'none'};

  &:hover {
    border-color: ${({ $hasError }) =>
      $hasError ? '#EF4444' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const StyledInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 1rem;

  &::placeholder {
    color: #718096;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  color: #A0AEC0;
`;

const ErrorText = styled(motion.span)`
  font-size: 0.75rem;
  color: #EF4444;
  margin-left: 0.25rem;
`;

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  label,
  icon,
  fullWidth = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputWrapper $fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <InputContainer $isFocused={isFocused} $hasError={!!error}>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        <StyledInput
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </InputContainer>
      {error && (
        <ErrorText
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {error}
        </ErrorText>
      )}
    </InputWrapper>
  );
};
