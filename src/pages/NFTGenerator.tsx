import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, Download, Copy } from 'lucide-react';
import { Button } from '../components/common';
import { NFTCard } from '../components/nft';
import { NFTGenerator as Generator } from '../utils/nftGenerator';

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #0A0E1A;
  padding: 3rem 2rem;
  overflow-y: auto;
`;

const Header = styled.div`
  max-width: 1400px;
  margin: 0 auto 3rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #9333EA 0%, #00F5FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #A0AEC0;
  margin-bottom: 2rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  width: 200px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(0, 245, 255, 0.5);
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.2);
  }

  &::placeholder {
    color: #718096;
  }
`;

const Grid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const Stats = styled.div`
  max-width: 1400px;
  margin: 2rem auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled(motion.div)`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  text-align: center;
  backdrop-filter: blur(12px);
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CodeBlock = styled.pre`
  max-width: 1400px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  color: #00F5FF;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  overflow-x: auto;
  position: relative;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const CopyButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: rgba(147, 51, 234, 0.2);
  border: 1px solid rgba(147, 51, 234, 0.5);
  color: #9333EA;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background: rgba(147, 51, 234, 0.3);
  }
`;

export const NFTGeneratorPage = () => {
  const [tokenId, setTokenId] = useState(111);
  const [count, setCount] = useState(6);
  const [nfts, setNfts] = useState(() => Generator.generateCollection(6, 111));
  const [copied, setCopied] = useState(false);

  const generateNew = () => {
    const newNfts = Generator.generateCollection(count, tokenId);
    setNfts(newNfts);
  };

  const generateRandom = () => {
    const randomId = Math.floor(Math.random() * 9999) + 1;
    setTokenId(randomId);
    const newNfts = Generator.generateCollection(count, randomId);
    setNfts(newNfts);
  };

  const downloadAll = () => {
    nfts.forEach((nft, index) => {
      setTimeout(() => {
        const blob = new Blob([nft.svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elevate-nft-${nft.attributes.tokenId}.svg`;
        a.click();
        URL.revokeObjectURL(url);
      }, index * 200);
    });
  };

  const stats = nfts.reduce(
    (acc, nft) => {
      acc[nft.attributes.rarity]++;
      if (nft.attributes.holographic) acc.holographic++;
      if (nft.attributes.hasAnimation) acc.animated++;
      return acc;
    },
    { common: 0, rare: 0, epic: 0, legendary: 0, holographic: 0, animated: 0 }
  );

  const codeExample = `import { NFTGenerator } from './utils/nftGenerator';

// Generate single NFT
const nft = NFTGenerator.generateNFT(111);
console.log(nft.attributes); // { rarity, pattern, colors, ... }
console.log(nft.svg); // SVG string

// Generate collection
const collection = NFTGenerator.generateCollection(10, 1);
collection.forEach(nft => {
  console.log(\`Token #\${nft.attributes.tokenId}: \${nft.attributes.rarity}\`);
});`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Container>
      <Header>
        <Title>🎨 NFT Generator</Title>
        <Subtitle>Generate unique SVG NFTs with different rarities and patterns</Subtitle>
        <Controls>
          <Input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(Number(e.target.value))}
            placeholder="Token ID"
          />
          <Input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value))))}
            placeholder="Count (1-20)"
          />
          <Button variant="primary" icon={<Sparkles size={18} />} onClick={generateNew}>
            Generate
          </Button>
          <Button variant="outline" icon={<RefreshCw size={18} />} onClick={generateRandom}>
            Random
          </Button>
          <Button variant="secondary" icon={<Download size={18} />} onClick={downloadAll}>
            Download All
          </Button>
        </Controls>
      </Header>

      <Stats>
        <StatCard whileHover={{ scale: 1.05 }}>
          <StatValue style={{ color: '#F59E0B' }}>{stats.legendary}</StatValue>
          <StatLabel>Legendary</StatLabel>
        </StatCard>
        <StatCard whileHover={{ scale: 1.05 }}>
          <StatValue style={{ color: '#A855F7' }}>{stats.epic}</StatValue>
          <StatLabel>Epic</StatLabel>
        </StatCard>
        <StatCard whileHover={{ scale: 1.05 }}>
          <StatValue style={{ color: '#3B82F6' }}>{stats.rare}</StatValue>
          <StatLabel>Rare</StatLabel>
        </StatCard>
        <StatCard whileHover={{ scale: 1.05 }}>
          <StatValue style={{ color: '#9CA3AF' }}>{stats.common}</StatValue>
          <StatLabel>Common</StatLabel>
        </StatCard>
        <StatCard whileHover={{ scale: 1.05 }}>
          <StatValue style={{ color: '#FFD700' }}>{stats.holographic}</StatValue>
          <StatLabel>Holographic</StatLabel>
        </StatCard>
        <StatCard whileHover={{ scale: 1.05 }}>
          <StatValue style={{ color: '#00F5FF' }}>{stats.animated}</StatValue>
          <StatLabel>Animated</StatLabel>
        </StatCard>
      </Stats>

      <Grid>
        {nfts.map((nft) => (
          <NFTCard key={nft.attributes.tokenId} tokenId={nft.attributes.tokenId} />
        ))}
      </Grid>

      <CodeBlock>
        <CopyButton
          onClick={copyCode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Copy size={16} />
          {copied ? 'Copied!' : 'Copy'}
        </CopyButton>
        {codeExample}
      </CodeBlock>
    </Container>
  );
};
