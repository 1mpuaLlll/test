import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Wallet,
  Filter,
  X,
  Check,
  AlertCircle,
  Loader,
} from 'lucide-react';
import { Button } from '../components/common';
import { NFTCard } from '../components/nft';
import { NFTGenerator } from '../utils/nftGenerator';
import { useCartStore } from '../store/cartStore';
import { useWeb3Store } from '../store/web3Store';
import { web3Service } from '../services/web3Service';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  background: #0A0E1A;
  padding: 2rem;
`;

const Header = styled.div`
  max-width: 1400px;
  margin: 0 auto 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #9333EA 0%, #00F5FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const CartButton = styled(motion.button)`
  position: relative;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(147, 51, 234, 0.2);
    border-color: rgba(147, 51, 234, 0.5);
  }
`;

const CartBadge = styled(motion.div)`
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 24px;
  height: 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #9333EA 0%, #7E22CE 100%);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
  box-shadow: 0 0 15px rgba(147, 51, 234, 0.5);
`;

const WalletInfo = styled.div`
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  background: rgba(0, 245, 255, 0.1);
  border: 1px solid rgba(0, 245, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #00F5FF;
  font-weight: 600;
`;

const Grid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const NFTCardWrapper = styled.div`
  position: relative;
`;

const PriceTag = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
`;

const Price = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PriceEth = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PriceUsd = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const AddToCartButton = styled(motion.button)<{ $inCart: boolean }>`
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  background: ${({ $inCart }) =>
    $inCart
      ? 'rgba(16, 185, 129, 0.2)'
      : 'linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)'};
  border: 1px solid
    ${({ $inCart }) => ($inCart ? 'rgba(16, 185, 129, 0.5)' : 'rgba(147, 51, 234, 0.5)')};
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const CartModal = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 500px;
  background: rgba(10, 14, 26, 0.98);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
`;

const CartHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const CloseButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #EF4444;

  &:hover {
    background: rgba(239, 68, 68, 0.3);
  }
`;

const CartItems = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CartItem = styled(motion.div)`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartFooter = styled.div`
  padding: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
`;

const EmptyCart = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #718096;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
`;

// Цены NFT в зависимости от редкости (в ETH)
const NFT_PRICES = {
  common: 0.01,
  rare: 0.05,
  epic: 0.1,
  legendary: 0.25,
};

export const NFTMarketplace = () => {
  const [showCart, setShowCart] = useState(false);
  const [balance, setBalance] = useState<string>('0');
  const navigate = useNavigate();

  const { items, addToCart, removeFromCart, getTotalPrice, getTotalItems, isInCart } =
    useCartStore();
  const { wallet } = useWeb3Store();

  // Генерируем коллекцию NFT для продажи
  const [nfts] = useState(() => {
    const collection = NFTGenerator.generateCollection(20, 1);
    return collection.map((nft) => ({
      ...nft,
      priceInEth: NFT_PRICES[nft.attributes.rarity as keyof typeof NFT_PRICES],
    }));
  });

  useEffect(() => {
    if (wallet?.isConnected) {
      loadBalance();
    }
  }, [wallet]);

  const loadBalance = async () => {
    try {
      const bal = await web3Service.getBalanceInEth();
      setBalance(parseFloat(bal).toFixed(4));
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const handleAddToCart = (nft: any) => {
    addToCart({
      tokenId: nft.attributes.tokenId,
      priceInEth: nft.priceInEth,
      rarity: nft.attributes.rarity,
      pattern: nft.attributes.pattern,
    });
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout');
  };

  const getEthToUsd = (eth: number) => {
    // Примерный курс ETH/USD
    const ETH_USD = 2000;
    return (eth * ETH_USD).toFixed(2);
  };

  return (
    <Container>
      <Header>
        <Title>NFT Marketplace 🎨</Title>
        <Actions>
          {wallet?.isConnected ? (
            <WalletInfo>
              <Wallet size={20} />
              {balance} ETH
            </WalletInfo>
          ) : (
            <Button
              variant="primary"
              icon={<Wallet size={18} />}
              onClick={async () => {
                const result = await web3Service.connectWallet('metamask');
                if (result) {
                  await loadBalance();
                }
              }}
            >
              Connect Wallet
            </Button>
          )}
          <CartButton onClick={() => setShowCart(true)} whileHover={{ scale: 1.05 }}>
            <ShoppingCart size={20} />
            Cart
            {getTotalItems() > 0 && (
              <CartBadge
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                {getTotalItems()}
              </CartBadge>
            )}
          </CartButton>
        </Actions>
      </Header>

      <Grid>
        {nfts.map((nft) => (
          <NFTCardWrapper key={nft.attributes.tokenId}>
            <NFTCard tokenId={nft.attributes.tokenId} size="md" showActions={false} />
            <PriceTag>
              <Price>
                <PriceEth>⟠ {nft.priceInEth} ETH</PriceEth>
                <PriceUsd>${getEthToUsd(nft.priceInEth)}</PriceUsd>
              </Price>
              <AddToCartButton
                $inCart={isInCart(nft.attributes.tokenId)}
                onClick={() =>
                  isInCart(nft.attributes.tokenId)
                    ? removeFromCart(nft.attributes.tokenId)
                    : handleAddToCart(nft)
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isInCart(nft.attributes.tokenId) ? (
                  <>
                    <Check size={18} />
                    In Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Add to Cart
                  </>
                )}
              </AddToCartButton>
            </PriceTag>
          </NFTCardWrapper>
        ))}
      </Grid>

      <AnimatePresence>
        {showCart && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
            />
            <CartModal
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <CartHeader>
                <CartTitle>Shopping Cart ({getTotalItems()})</CartTitle>
                <CloseButton
                  onClick={() => setShowCart(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </CloseButton>
              </CartHeader>

              {items.length === 0 ? (
                <EmptyCart>
                  <ShoppingCart size={64} />
                  <p>Your cart is empty</p>
                </EmptyCart>
              ) : (
                <>
                  <CartItems>
                    {items.map((item) => (
                      <CartItem
                        key={item.tokenId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                            NFT #{item.tokenId}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                            {item.rarity} • {item.pattern}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700 }}>⟠ {item.priceInEth} ETH</div>
                          <Button
                            variant="ghost"
                            onClick={() => removeFromCart(item.tokenId)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </CartItem>
                    ))}
                  </CartItems>

                  <CartFooter>
                    <TotalPrice>
                      <span>Total:</span>
                      <span>⟠ {getTotalPrice().toFixed(4)} ETH</span>
                    </TotalPrice>
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={handleCheckout}
                      disabled={!wallet?.isConnected}
                    >
                      {wallet?.isConnected ? 'Proceed to Checkout' : 'Connect Wallet First'}
                    </Button>
                  </CartFooter>
                </>
              )}
            </CartModal>
          </>
        )}
      </AnimatePresence>
    </Container>
  );
};
