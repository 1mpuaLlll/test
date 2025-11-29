import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, AlertCircle, Loader, ExternalLink } from 'lucide-react';
import { Button } from '../components/common';
import { useCartStore } from '../store/cartStore';
import { useWeb3Store } from '../store/web3Store';
import { web3Service } from '../services/web3Service';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  background: #0A0E1A;
  padding: 2rem;
`;

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: white;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(12px);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ItemName = styled.div`
  font-weight: 600;
  color: white;
`;

const ItemDetails = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const ItemPrice = styled.div`
  font-weight: 700;
  color: white;
  font-size: 1.125rem;
`;

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
`;

const SummaryRow = styled.div<{ $isTotal?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ $isTotal }) => ($isTotal ? '1.5rem' : '1rem')};
  font-weight: ${({ $isTotal }) => ($isTotal ? 700 : 500)};
  color: white;
`;

const Label = styled.span<{ $isTotal?: boolean }>`
  color: ${({ $isTotal }) => ($isTotal ? 'white' : '#A0AEC0')};
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 0.75rem;
`;

const StatusCard = styled(motion.div)<{ $type: 'success' | 'error' | 'processing' }>`
  padding: 2rem;
  border-radius: 1.5rem;
  text-align: center;
  ${({ $type }) => {
    switch ($type) {
      case 'success':
        return `
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
        `;
      case 'error':
        return `
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;
      case 'processing':
        return `
          background: rgba(0, 245, 255, 0.1);
          border: 1px solid rgba(0, 245, 255, 0.3);
        `;
    }
  }}
`;

const StatusIcon = styled.div<{ $type: 'success' | 'error' | 'processing' }>`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ $type }) => {
    switch ($type) {
      case 'success':
        return `
          background: rgba(16, 185, 129, 0.2);
          color: #10B981;
        `;
      case 'error':
        return `
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
        `;
      case 'processing':
        return `
          background: rgba(0, 245, 255, 0.2);
          color: #00F5FF;
        `;
    }
  }}
`;

const StatusTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const StatusMessage = styled.p`
  color: #A0AEC0;
  margin-bottom: 1.5rem;
`;

const TxLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #00F5FF;
  text-decoration: none;
  font-weight: 600;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Warning = styled.div`
  padding: 1rem;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 0.75rem;
  color: #F59E0B;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { wallet } = useWeb3Store();

  const [balance, setBalance] = useState<string>('0');
  const [gasCost, setGasCost] = useState<string>('0');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!wallet?.isConnected) {
      navigate('/marketplace');
      return;
    }

    if (items.length === 0) {
      navigate('/marketplace');
      return;
    }

    loadWalletData();
  }, [wallet, items]);

  const loadWalletData = async () => {
    try {
      const bal = await web3Service.getBalanceInEth();
      setBalance(bal);

      const gas = await web3Service.estimateGasCost(getTotalPrice());
      setGasCost(gas);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const handlePurchase = async () => {
    setStatus('processing');
    setErrorMessage('');

    try {
      // Покупка всех NFT из корзины
      const results = await web3Service.batchPurchaseNFTs(
        items.map((item) => ({
          tokenId: item.tokenId,
          priceInEth: item.priceInEth,
        }))
      );

      // Проверяем, все ли транзакции успешны
      const allSuccessful = results.every((r) => r.success);

      if (allSuccessful) {
        setStatus('success');
        setTxHash(results[0].transactionHash || '');
        clearCart();

        // Перенаправление на профиль через 3 секунды
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      } else {
        const failedResult = results.find((r) => !r.success);
        setStatus('error');
        setErrorMessage(failedResult?.error || 'Purchase failed');
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'An error occurred during purchase');
    }
  };

  const totalWithGas = (parseFloat(getTotalPrice().toString()) + parseFloat(gasCost)).toFixed(6);
  const insufficientFunds = parseFloat(balance) < parseFloat(totalWithGas);

  if (status === 'processing') {
    return (
      <Container>
        <Wrapper>
          <StatusCard
            $type="processing"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <StatusIcon $type="processing">
              <Loader size={48} className="animate-spin" />
            </StatusIcon>
            <StatusTitle>Processing Payment...</StatusTitle>
            <StatusMessage>
              Please confirm the transaction in MetaMask and wait for confirmation on the
              blockchain.
            </StatusMessage>
          </StatusCard>
        </Wrapper>
      </Container>
    );
  }

  if (status === 'success') {
    return (
      <Container>
        <Wrapper>
          <StatusCard
            $type="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <StatusIcon $type="success">
              <CheckCircle size={48} />
            </StatusIcon>
            <StatusTitle>Purchase Successful!</StatusTitle>
            <StatusMessage>
              Your NFTs have been successfully purchased. Redirecting to your profile...
            </StatusMessage>
            {txHash && (
              <TxLink
                href={`https://etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Etherscan <ExternalLink size={16} />
              </TxLink>
            )}
            <div style={{ marginTop: '1.5rem' }}>
              <Button variant="primary" onClick={() => navigate('/profile')}>
                Go to Profile
              </Button>
            </div>
          </StatusCard>
        </Wrapper>
      </Container>
    );
  }

  if (status === 'error') {
    return (
      <Container>
        <Wrapper>
          <StatusCard
            $type="error"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <StatusIcon $type="error">
              <AlertCircle size={48} />
            </StatusIcon>
            <StatusTitle>Purchase Failed</StatusTitle>
            <StatusMessage>{errorMessage}</StatusMessage>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Button variant="secondary" onClick={() => navigate('/marketplace')}>
                Back to Marketplace
              </Button>
              <Button variant="primary" onClick={() => setStatus('idle')}>
                Try Again
              </Button>
            </div>
          </StatusCard>
        </Wrapper>
      </Container>
    );
  }

  return (
    <Container>
      <Wrapper>
        <Header>
          <BackButton
            onClick={() => navigate('/marketplace')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={24} />
          </BackButton>
          <Title>Checkout</Title>
        </Header>

        <Card>
          <SectionTitle>Order Summary</SectionTitle>
          {items.map((item) => (
            <OrderItem key={item.tokenId}>
              <ItemInfo>
                <ItemName>Elevate NFT #{item.tokenId}</ItemName>
                <ItemDetails>
                  {item.rarity} • {item.pattern}
                </ItemDetails>
              </ItemInfo>
              <ItemPrice>⟠ {item.priceInEth} ETH</ItemPrice>
            </OrderItem>
          ))}
          <Summary>
            <SummaryRow>
              <Label>Subtotal</Label>
              <span>⟠ {getTotalPrice().toFixed(6)} ETH</span>
            </SummaryRow>
            <SummaryRow>
              <Label>Estimated Gas Fee</Label>
              <span>⟠ {gasCost} ETH</span>
            </SummaryRow>
            <SummaryRow $isTotal>
              <Label $isTotal>Total</Label>
              <span>⟠ {totalWithGas} ETH</span>
            </SummaryRow>
          </Summary>
        </Card>

        <Card>
          <SectionTitle>Payment Method</SectionTitle>
          <WalletInfo>
            <InfoRow>
              <span style={{ color: '#A0AEC0' }}>Wallet</span>
              <span style={{ fontFamily: 'monospace', color: 'white' }}>
                {wallet?.address.slice(0, 6)}...{wallet?.address.slice(-4)}
              </span>
            </InfoRow>
            <InfoRow>
              <span style={{ color: '#A0AEC0' }}>Balance</span>
              <span style={{ color: 'white', fontWeight: 600 }}>⟠ {balance} ETH</span>
            </InfoRow>
          </WalletInfo>

          {insufficientFunds && (
            <Warning>
              <AlertCircle size={20} />
              <div>
                Insufficient funds. You need at least {totalWithGas} ETH (including gas fees).
              </div>
            </Warning>
          )}

          <div style={{ marginTop: '2rem' }}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handlePurchase}
              disabled={insufficientFunds}
            >
              {insufficientFunds ? 'Insufficient Funds' : `Pay ⟠ ${totalWithGas} ETH`}
            </Button>
          </div>
        </Card>
      </Wrapper>
    </Container>
  );
};
