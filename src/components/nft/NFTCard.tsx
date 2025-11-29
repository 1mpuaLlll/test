import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Heart, Share2, Download, Eye } from 'lucide-react';
import { NFTGenerator, NFTAttributes } from '../../utils/nftGenerator';

interface NFTCardProps {
  tokenId: number;
  showActions?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const CardContainer = styled(motion.div)<{ $size: string }>`
  position: relative;
  width: ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return '150px';
      case 'lg':
        return '400px';
      default:
        return '250px';
    }
  }};
  cursor: pointer;
  border-radius: 1.5rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(147, 51, 234, 0.5);
    box-shadow: 0 0 40px rgba(147, 51, 234, 0.3);
    transform: translateY(-8px);
  }
`;

const SVGContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  position: relative;

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

const Info = styled.div<{ $size: string }>`
  padding: ${({ $size }) => ($size === 'sm' ? '0.75rem' : '1.25rem')};
`;

const TokenName = styled.h3<{ $size: string }>`
  font-size: ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return '0.875rem';
      case 'lg':
        return '1.5rem';
      default:
        return '1.125rem';
    }
  }};
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RarityBadge = styled.span<{ $rarity: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  ${({ $rarity }) => {
    switch ($rarity) {
      case 'legendary':
        return `
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.3) 100%);
          border: 1px solid rgba(245, 158, 11, 0.5);
          color: #F59E0B;
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
        `;
      case 'epic':
        return `
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%);
          border: 1px solid rgba(168, 85, 247, 0.5);
          color: #A855F7;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.4);
        `;
      case 'rare':
        return `
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.3) 100%);
          border: 1px solid rgba(59, 130, 246, 0.5);
          color: #3B82F6;
        `;
      default:
        return `
          background: rgba(156, 163, 175, 0.3);
          border: 1px solid rgba(156, 163, 175, 0.5);
          color: #9CA3AF;
        `;
    }
  }}
`;

const Attributes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const Attribute = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #A0AEC0;
`;

const AttributeLabel = styled.span`
  color: #718096;
`;

const AttributeValue = styled.span`
  color: white;
  font-weight: 500;
`;

const Actions = styled(motion.div)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled(motion.button)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(147, 51, 234, 0.8);
    border-color: rgba(147, 51, 234, 1);
    box-shadow: 0 0 15px rgba(147, 51, 234, 0.5);
  }
`;

const HolographicBadge = styled(motion.div)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.1) 100%);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 215, 0, 0.5);
  color: #FFD700;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  letter-spacing: 1px;
`;

export const NFTCard: React.FC<NFTCardProps> = ({
  tokenId,
  showActions = true,
  size = 'md',
  onClick,
}) => {
  const [nftData, setNftData] = useState<{ attributes: NFTAttributes; svg: string } | null>(null);

  useEffect(() => {
    const generated = NFTGenerator.generateNFT(tokenId);
    setNftData(generated);
  }, [tokenId]);

  if (!nftData) return null;

  const handleDownload = () => {
    const blob = new Blob([nftData.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elevate-nft-${tokenId}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <CardContainer
      $size={size}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: size === 'sm' ? 1.05 : 1.02 }}
    >
      {nftData.attributes.holographic && (
        <HolographicBadge
          animate={{
            boxShadow: [
              '0 0 20px rgba(255, 215, 0, 0.4)',
              '0 0 30px rgba(255, 215, 0, 0.6)',
              '0 0 20px rgba(255, 215, 0, 0.4)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨ Holographic
        </HolographicBadge>
      )}

      {showActions && size !== 'sm' && (
        <Actions>
          <ActionButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Heart size={18} />
          </ActionButton>
          <ActionButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Share2 size={18} />
          </ActionButton>
          <ActionButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
          >
            <Download size={18} />
          </ActionButton>
        </Actions>
      )}

      <SVGContainer dangerouslySetInnerHTML={{ __html: nftData.svg }} />

      {size !== 'sm' && (
        <Info $size={size}>
          <TokenName $size={size}>
            Elevate #{tokenId}
            <RarityBadge $rarity={nftData.attributes.rarity}>
              {nftData.attributes.rarity}
            </RarityBadge>
          </TokenName>

          <Attributes>
            <Attribute>
              <AttributeLabel>Pattern</AttributeLabel>
              <AttributeValue>{nftData.attributes.pattern}</AttributeValue>
            </Attribute>
            <Attribute>
              <AttributeLabel>Animation</AttributeLabel>
              <AttributeValue>{nftData.attributes.hasAnimation ? 'Yes' : 'No'}</AttributeValue>
            </Attribute>
            {nftData.attributes.holographic && (
              <Attribute>
                <AttributeLabel>Special</AttributeLabel>
                <AttributeValue style={{ color: '#FFD700' }}>Holographic</AttributeValue>
              </Attribute>
            )}
          </Attributes>
        </Info>
      )}
    </CardContainer>
  );
};
