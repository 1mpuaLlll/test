import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Shield, Sparkles } from 'lucide-react';
import { Button, Input } from '../components/common';

type Step = 'welcome' | 'phone' | 'verification' | 'profile';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background: #0A0E1A;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AnimatedBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%);
    top: -200px;
    right: -200px;
    animation: float 8s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(0, 245, 255, 0.1) 0%, transparent 70%);
    bottom: -150px;
    left: -150px;
    animation: float 6s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(30px, -30px) rotate(5deg);
    }
  }
`;

const FloatingShape = styled(motion.div)<{ $top?: string; $left?: string; $color?: string }>`
  position: absolute;
  width: 80px;
  height: 80px;
  background: ${({ $color }) => $color || 'rgba(147, 51, 234, 0.1)'};
  backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  top: ${({ $top }) => $top || '50%'};
  left: ${({ $left }) => $left || '50%'};
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 480px;
  padding: 2rem;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 3rem 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Logo = styled(motion.div)`
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, #9333EA 0%, #00F5FF 100%);
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 0 40px rgba(147, 51, 234, 0.4);
`;

const Title = styled(motion.h1)`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #FFFFFF 0%, #A0AEC0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled(motion.p)`
  font-size: 1rem;
  color: #A0AEC0;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Features = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
`;

const Feature = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(0, 245, 255, 0.3);
  }
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(0, 245, 255, 0.2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00F5FF;
`;

const FeatureText = styled.span`
  font-size: 0.75rem;
  color: #A0AEC0;
  text-align: center;
`;

const VerificationInput = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
`;

const CodeDigit = styled.input`
  width: 50px;
  height: 60px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00F5FF;
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
  }
`;

export const Welcome = () => {
  const [step, setStep] = useState<Step>('welcome');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('verification');
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('profile');
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to main app
    console.log('Profile created!');
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  return (
    <Container>
      <AnimatedBackground />

      {/* Floating Shapes */}
      <FloatingShape
        $top="15%"
        $left="10%"
        $color="rgba(147, 51, 234, 0.1)"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <FloatingShape
        $top="70%"
        $left="85%"
        $color="rgba(0, 245, 255, 0.1)"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <FloatingShape
        $top="30%"
        $left="90%"
        $color="rgba(255, 215, 0, 0.1)"
        animate={{
          y: [0, 15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <Logo
            animate={{
              boxShadow: [
                '0 0 40px rgba(147, 51, 234, 0.4)',
                '0 0 60px rgba(0, 245, 255, 0.4)',
                '0 0 40px rgba(147, 51, 234, 0.4)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            E
          </Logo>

          <AnimatePresence mode="wait">
            {step === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Title>Welcome to Elevate</Title>
                <Subtitle>Premium messaging with NFT integration</Subtitle>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setStep('phone')}
                  icon={<Sparkles size={20} />}
                >
                  Get Started
                </Button>

                <Features
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Feature whileHover={{ scale: 1.05 }}>
                    <FeatureIcon>
                      <Shield size={20} />
                    </FeatureIcon>
                    <FeatureText>End-to-End Encrypted</FeatureText>
                  </Feature>
                  <Feature whileHover={{ scale: 1.05 }}>
                    <FeatureIcon>
                      <Sparkles size={20} />
                    </FeatureIcon>
                    <FeatureText>NFT Integration</FeatureText>
                  </Feature>
                  <Feature whileHover={{ scale: 1.05 }}>
                    <FeatureIcon>
                      <Phone size={20} />
                    </FeatureIcon>
                    <FeatureText>Voice & Video</FeatureText>
                  </Feature>
                </Features>
              </motion.div>
            )}

            {step === 'phone' && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Title>Enter Your Number</Title>
                <Subtitle>We'll send you a verification code</Subtitle>

                <Form onSubmit={handlePhoneSubmit}>
                  <Input
                    type="tel"
                    placeholder="+1 XXX-XXX-XXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    icon={<Phone size={20} />}
                    fullWidth
                  />
                  <Button type="submit" variant="primary" size="lg" fullWidth>
                    Send Code
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep('welcome')}
                  >
                    Back
                  </Button>
                </Form>
              </motion.div>
            )}

            {step === 'verification' && (
              <motion.div
                key="verification"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Title>Enter Code</Title>
                <Subtitle>Sent to {phoneNumber}</Subtitle>

                <Form onSubmit={handleVerificationSubmit}>
                  <VerificationInput>
                    {verificationCode.map((digit, index) => (
                      <CodeDigit
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                      />
                    ))}
                  </VerificationInput>
                  <Button type="submit" variant="primary" size="lg" fullWidth>
                    Verify
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep('phone')}
                  >
                    Back
                  </Button>
                </Form>
              </motion.div>
            )}

            {step === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Title>Create Profile</Title>
                <Subtitle>Tell us about yourself</Subtitle>

                <Form onSubmit={handleProfileSubmit}>
                  <Input
                    type="text"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    fullWidth
                  />
                  <Input
                    type="text"
                    placeholder="@username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                  />
                  <Button type="submit" variant="primary" size="lg" fullWidth>
                    Complete Setup
                  </Button>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </ContentWrapper>
    </Container>
  );
};
