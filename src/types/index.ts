// User Types
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  phoneNumber: string;
  bio?: string;
  isOnline: boolean;
  lastSeen: Date;
  isPremium: boolean;
  subscriptionTier: 'BASE' | 'PREMIUM' | 'VIP';
  isVerified: boolean;
  nftBadge?: NFTBadge;
  createdAt: Date;
}

// NFT Types
export interface NFTBadge {
  tokenId: string;
  badgeNumber: number; // e.g., #111
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  imageUrl: string;
  contractAddress: string;
  holographicEnabled: boolean;
  attributes: NFTAttribute[];
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTCollection {
  id: string;
  name: string;
  items: NFT[];
}

export interface NFT {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  contractAddress: string;
  rarity: string;
  price?: number;
  owner: string;
}

// Message Types
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  status: MessageStatus;
  replyTo?: string;
  reactions: Reaction[];
  attachments?: Attachment[];
  isEdited: boolean;
  isDeleted: boolean;
  expiresAt?: Date; // для секретных чатов
}

export type MessageType =
  | 'text'
  | 'voice'
  | 'video'
  | 'image'
  | 'file'
  | 'nft_gift'
  | 'system';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface Reaction {
  emoji: string;
  userId: string;
  timestamp: Date;
}

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  name: string;
  size: number;
  duration?: number; // для аудио/видео
  thumbnail?: string;
}

// Chat Types
export interface Chat {
  id: string;
  type: 'private' | 'group' | 'channel';
  name?: string;
  avatar?: string;
  participants: string[]; // user IDs
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isSecret: boolean; // секретный чат
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupChat extends Chat {
  type: 'group';
  name: string;
  description?: string;
  admins: string[];
  memberLimit: number;
}

export interface Channel extends Chat {
  type: 'channel';
  name: string;
  description?: string;
  subscriberCount: number;
  isPublic: boolean;
}

// Premium Types
export interface Subscription {
  userId: string;
  tier: 'BASE' | 'PREMIUM' | 'VIP';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  price: number;
  features: string[];
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  tier: 'PREMIUM' | 'VIP';
  icon: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterData {
  phoneNumber: string;
  verificationCode: string;
  displayName: string;
  username: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'mention' | 'nft' | 'subscription' | 'system';
  title: string;
  body: string;
  isRead: boolean;
  timestamp: Date;
  actionUrl?: string;
}

// Settings Types
export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  appearance: AppearanceSettings;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  showPreview: boolean;
  muteUntil?: Date;
}

export interface PrivacySettings {
  lastSeen: 'everyone' | 'contacts' | 'nobody';
  profilePhoto: 'everyone' | 'contacts' | 'nobody';
  readReceipts: boolean;
  onlineStatus: boolean;
  blockedUsers: string[];
}

export interface AppearanceSettings {
  fontSize: 'small' | 'medium' | 'large';
  messagePreview: boolean;
  chatWallpaper?: string;
  accentColor: string;
}

// Web3 Types
export interface WalletConnection {
  address: string;
  provider: 'metamask' | 'phantom' | 'walletconnect';
  isConnected: boolean;
  chainId: number;
}
