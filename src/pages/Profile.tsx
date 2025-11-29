import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Settings,
  Crown,
  Wallet,
  Grid3x3,
  Heart,
  Share2,
  Edit,
  Sparkles,
} from 'lucide-react';
import { Avatar, Badge, Button, Card } from '../components/common';
import { NFTGallery } from '../components/nft';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background: #0A0E1A;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

const Header = styled.div`
  position: relative;
  height: 300px;
  background: linear-gradient(180deg, rgba(147, 51, 234, 0.2) 0%, transparent 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const CoverImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #9333EA 0%, #00F5FF 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%239333EA" opacity="0.1" width="100" height="100"/></svg>');
    animation: float 20s linear infinite;
  }
`;

const ProfileInfo = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
`;

const AvatarWrapper = styled.div`
  position: absolute;
  top: -80px;
  left: 2rem;
`;

const ProfileActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
`;

const IconButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A0AEC0;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #00F5FF;
    border-color: rgba(0, 245, 255, 0.3);
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const UserInfo = styled.div`
  margin-bottom: 2rem;
`;

const UserName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Username = styled.p`
  font-size: 1.125rem;
  color: #718096;
  margin-bottom: 1rem;
`;

const Bio = styled.p`
  font-size: 1rem;
  color: #A0AEC0;
  line-height: 1.6;
  max-width: 600px;
  margin-bottom: 1.5rem;
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
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

const Tabs = styled.div`
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 2rem;
`;

const Tab = styled(motion.button)<{ $active: boolean }>`
  padding: 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? 'white' : '#718096')};
  border: none;
  background: none;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: white;
  }

  ${({ $active }) =>
    $active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #9333EA 0%, #00F5FF 100%);
    }
  `}
`;

const NFTGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const NFTCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(147, 51, 234, 0.5);
    box-shadow: 0 0 30px rgba(147, 51, 234, 0.2);
    transform: translateY(-4px);
  }
`;

const NFTImage = styled.div<{ $bg: string }>`
  width: 100%;
  height: 250px;
  background: ${({ $bg }) => $bg};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const NFTRarityBadge = styled.div<{ $rarity: string }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  backdrop-filter: blur(12px);
  ${({ $rarity }) => {
    switch ($rarity) {
      case 'legendary':
        return `
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.3) 100%);
          border: 1px solid rgba(245, 158, 11, 0.5);
          color: #F59E0B;
        `;
      case 'epic':
        return `
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%);
          border: 1px solid rgba(168, 85, 247, 0.5);
          color: #A855F7;
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

const NFTInfo = styled.div`
  padding: 1.25rem;
`;

const NFTName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
`;

const NFTCollection = styled.p`
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 1rem;
`;

const NFTFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NFTPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NFTEth = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: white;
`;

const NFTUsd = styled.span`
  font-size: 0.75rem;
  color: #718096;
`;

const NFTActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NFTActionButton = styled(motion.button)`
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #A0AEC0;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(147, 51, 234, 0.2);
    border-color: rgba(147, 51, 234, 0.5);
    color: #9333EA;
  }
`;

const SubscriptionSection = styled.div`
  margin-top: 2rem;
`;

const SubscriptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const SubscriptionCard = styled(Card)<{ $tier: string }>`
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  ${({ $tier }) =>
    $tier === 'VIP' &&
    `
    border: 2px solid rgba(255, 215, 0, 0.5);
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.2);
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    ${({ $tier }) => {
      switch ($tier) {
        case 'VIP':
          return 'background: linear-gradient(90deg, #FFD700 0%, #CCB700 100%);';
        case 'PREMIUM':
          return 'background: linear-gradient(90deg, #9333EA 0%, #7E22CE 100%);';
        default:
          return 'background: linear-gradient(90deg, #718096 0%, #4A5568 100%);';
      }
    }}
  }
`;

const TierIcon = styled.div<{ $tier: string }>`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 1.5rem;
  ${({ $tier }) => {
    switch ($tier) {
      case 'VIP':
        return `
          background: linear-gradient(135deg, #FFD700 0%, #CCB700 100%);
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
        `;
      case 'PREMIUM':
        return `
          background: linear-gradient(135deg, #9333EA 0%, #7E22CE 100%);
          box-shadow: 0 0 30px rgba(147, 51, 234, 0.4);
        `;
      default:
        return `
          background: linear-gradient(135deg, #718096 0%, #4A5568 100%);
        `;
    }
  }}
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const TierName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
`;

const TierPrice = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
`;

const TierPeriod = styled.div`
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 1.5rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  text-align: left;
`;

const Feature = styled.li`
  padding: 0.75rem 0;
  color: #A0AEC0;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &::before {
    content: '✓';
    color: #10B981;
    font-weight: 700;
  }
`;

export const Profile = () => {
  const [activeTab, setActiveTab] = useState('nfts');

  return (
    <Container>
      <Header>
        <CoverImage />
        <ProfileInfo>
          <AvatarWrapper>
            <Avatar
              src={undefined}
              alt="John Doe"
              size="xl"
              online={true}
              isPremium={true}
              nftBadgeNumber={111}
            />
          </AvatarWrapper>
          <ProfileActions>
            <IconButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Share2 size={20} />
            </IconButton>
            <IconButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Settings size={20} />
            </IconButton>
            <Button variant="primary" icon={<Edit size={18} />}>
              Edit Profile
            </Button>
          </ProfileActions>
        </ProfileInfo>
      </Header>

      <Content>
        <UserInfo>
          <UserName>
            John Doe
            <Badge variant="verified">Verified</Badge>
            <Badge variant="vip" icon={<Crown size={14} />}>
              VIP
            </Badge>
          </UserName>
          <Username>@johndoe</Username>
          <Bio>
            NFT collector & Premium messenger enthusiast. Building the future of
            decentralized communication.
          </Bio>

          <Stats>
            <Stat>
              <StatValue>247</StatValue>
              <StatLabel>NFTs Owned</StatLabel>
            </Stat>
            <Stat>
              <StatValue>1.2K</StatValue>
              <StatLabel>Followers</StatLabel>
            </Stat>
            <Stat>
              <StatValue>543</StatValue>
              <StatLabel>Following</StatLabel>
            </Stat>
          </Stats>
        </UserInfo>

        <Tabs>
          <Tab $active={activeTab === 'nfts'} onClick={() => setActiveTab('nfts')}>
            <Grid3x3 size={20} />
            NFT Collection
          </Tab>
          <Tab
            $active={activeTab === 'subscription'}
            onClick={() => setActiveTab('subscription')}
          >
            <Crown size={20} />
            Subscription
          </Tab>
        </Tabs>

        {activeTab === 'nfts' && (
          <NFTGallery
            tokenIds={[111, 456, 789, 234, 567, 890, 123, 345, 678, 321, 654, 987]}
            columns={3}
          />
        )}

        {activeTab === 'subscription' && (
          <SubscriptionSection>
            <SubscriptionGrid>
              <SubscriptionCard variant="glass" $tier="BASE">
                <TierIcon $tier="BASE">
                  <Sparkles />
                </TierIcon>
                <TierName>BASE</TierName>
                <TierPrice>Free</TierPrice>
                <TierPeriod>Forever</TierPeriod>
                <FeatureList>
                  <Feature>Basic messaging</Feature>
                  <Feature>NFT badge viewing</Feature>
                  <Feature>5GB cloud storage</Feature>
                  <Feature>Standard support</Feature>
                </FeatureList>
                <Button variant="secondary" fullWidth>
                  Current Plan
                </Button>
              </SubscriptionCard>

              <SubscriptionCard variant="glass" $tier="PREMIUM">
                <TierIcon $tier="PREMIUM">
                  <Crown />
                </TierIcon>
                <TierName>PREMIUM</TierName>
                <TierPrice>$9.99</TierPrice>
                <TierPeriod>per month</TierPeriod>
                <FeatureList>
                  <Feature>Custom NFT badges</Feature>
                  <Feature>Extended NFT gallery</Feature>
                  <Feature>Personal stickers</Feature>
                  <Feature>50GB cloud storage</Feature>
                  <Feature>Priority support</Feature>
                </FeatureList>
                <Button variant="premium" fullWidth>
                  Upgrade to Premium
                </Button>
              </SubscriptionCard>

              <SubscriptionCard variant="glass" $tier="VIP">
                <TierIcon $tier="VIP">
                  <Wallet />
                </TierIcon>
                <TierName>VIP</TierName>
                <TierPrice>$29.99</TierPrice>
                <TierPeriod>per month</TierPeriod>
                <FeatureList>
                  <Feature>Holographic avatars</Feature>
                  <Feature>Exclusive NFT collections</Feature>
                  <Feature>Unlimited storage</Feature>
                  <Feature>Personal manager</Feature>
                  <Feature>Early feature access</Feature>
                  <Feature>VIP badge & perks</Feature>
                </FeatureList>
                <Button variant="vip" fullWidth>
                  Upgrade to VIP
                </Button>
              </SubscriptionCard>
            </SubscriptionGrid>
          </SubscriptionSection>
        )}
      </Content>
    </Container>
  );
};
