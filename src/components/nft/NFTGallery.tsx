import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3x3, List, SlidersHorizontal, X } from 'lucide-react';
import { NFTCard } from './NFTCard';
import { NFTGenerator } from '../../utils/nftGenerator';

interface NFTGalleryProps {
  userId?: string;
  tokenIds?: number[];
  columns?: number;
}

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  padding: 0.25rem;
`;

const ViewButton = styled(motion.button)<{ $active: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: ${({ $active }) => ($active ? 'rgba(147, 51, 234, 0.3)' : 'transparent')};
  border: 1px solid ${({ $active }) => ($active ? 'rgba(147, 51, 234, 0.5)' : 'transparent')};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $active }) => ($active ? '#9333EA' : '#718096')};
  transition: all 0.3s ease;

  &:hover {
    color: #9333EA;
    background: rgba(147, 51, 234, 0.1);
  }
`;

const FilterButton = styled(motion.button)`
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(147, 51, 234, 0.2);
    border-color: rgba(147, 51, 234, 0.5);
  }
`;

const Filters = styled(motion.div)`
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #A0AEC0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterOptions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const FilterChip = styled(motion.button)<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  background: ${({ $active }) =>
    $active
      ? 'linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)'
      : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid
    ${({ $active }) => ($active ? 'rgba(147, 51, 234, 0.5)' : 'rgba(255, 255, 255, 0.1)')};
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: ${({ $active }) =>
      $active
        ? 'linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)'
        : 'rgba(147, 51, 234, 0.2)'};
    border-color: rgba(147, 51, 234, 0.5);
  }
`;

const Grid = styled.div<{ $columns: number; $view: string }>`
  display: grid;
  grid-template-columns: ${({ $view, $columns }) =>
    $view === 'grid' ? `repeat(${$columns}, 1fr)` : '1fr'};
  gap: ${({ $view }) => ($view === 'grid' ? '1.5rem' : '1rem')};
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  position: relative;
  max-width: 600px;
  width: 100%;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: -1rem;
  right: -1rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  border: 2px solid rgba(239, 68, 68, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
  z-index: 10;

  &:hover {
    background: rgba(239, 68, 68, 1);
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.7);
  }
`;

export const NFTGallery: React.FC<NFTGalleryProps> = ({
  tokenIds = [111, 456, 789, 234, 567, 890, 123, 345, 678],
  columns = 3,
}) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null);

  // Generate NFTs and calculate stats
  const nfts = tokenIds.map((id) => NFTGenerator.generateNFT(id));
  const rarityCount = nfts.reduce(
    (acc, nft) => {
      acc[nft.attributes.rarity] = (acc[nft.attributes.rarity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const filteredNFTs = nfts.filter((nft) => {
    if (selectedRarity && nft.attributes.rarity !== selectedRarity) return false;
    if (selectedPattern && nft.attributes.pattern !== selectedPattern) return false;
    return true;
  });

  return (
    <Container>
      <Header>
        <Title>NFT Collection ({filteredNFTs.length})</Title>
        <Controls>
          <ViewToggle>
            <ViewButton
              $active={view === 'grid'}
              onClick={() => setView('grid')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Grid3x3 size={20} />
            </ViewButton>
            <ViewButton
              $active={view === 'list'}
              onClick={() => setView('list')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <List size={20} />
            </ViewButton>
          </ViewToggle>
          <FilterButton
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SlidersHorizontal size={18} />
            Filters
          </FilterButton>
        </Controls>
      </Header>

      <Stats>
        <Stat>
          <StatValue>{rarityCount.legendary || 0}</StatValue>
          <StatLabel>Legendary</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{rarityCount.epic || 0}</StatValue>
          <StatLabel>Epic</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{rarityCount.rare || 0}</StatValue>
          <StatLabel>Rare</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{rarityCount.common || 0}</StatValue>
          <StatLabel>Common</StatLabel>
        </Stat>
      </Stats>

      <AnimatePresence>
        {showFilters && (
          <Filters
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <FilterGroup>
              <FilterLabel>Rarity</FilterLabel>
              <FilterOptions>
                {['all', 'legendary', 'epic', 'rare', 'common'].map((rarity) => (
                  <FilterChip
                    key={rarity}
                    $active={selectedRarity === rarity || (rarity === 'all' && !selectedRarity)}
                    onClick={() => setSelectedRarity(rarity === 'all' ? null : rarity)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  </FilterChip>
                ))}
              </FilterOptions>
            </FilterGroup>

            <FilterGroup style={{ marginTop: '1rem' }}>
              <FilterLabel>Pattern</FilterLabel>
              <FilterOptions>
                {['all', 'geometric', 'cosmic', 'waves', 'grid', 'particles'].map((pattern) => (
                  <FilterChip
                    key={pattern}
                    $active={
                      selectedPattern === pattern || (pattern === 'all' && !selectedPattern)
                    }
                    onClick={() => setSelectedPattern(pattern === 'all' ? null : pattern)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                  </FilterChip>
                ))}
              </FilterOptions>
            </FilterGroup>
          </Filters>
        )}
      </AnimatePresence>

      <Grid $columns={columns} $view={view}>
        {filteredNFTs.map((nft) => (
          <NFTCard
            key={nft.attributes.tokenId}
            tokenId={nft.attributes.tokenId}
            size={view === 'list' ? 'sm' : 'md'}
            onClick={() => setSelectedNFT(nft.attributes.tokenId)}
          />
        ))}
      </Grid>

      <AnimatePresence>
        {selectedNFT && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNFT(null)}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton
                onClick={() => setSelectedNFT(null)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </CloseButton>
              <NFTCard tokenId={selectedNFT} size="lg" showActions={true} />
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};
