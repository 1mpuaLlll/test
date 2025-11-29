import { create } from 'zustand';
import { WalletConnection, NFT, NFTCollection } from '../types';

interface Web3Store {
  wallet: WalletConnection | null;
  nftCollections: NFTCollection[];
  isLoading: boolean;

  connectWallet: (wallet: WalletConnection) => void;
  disconnectWallet: () => void;
  setNFTCollections: (collections: NFTCollection[]) => void;
  addNFT: (collectionId: string, nft: NFT) => void;
  setLoading: (loading: boolean) => void;
}

export const useWeb3Store = create<Web3Store>((set) => ({
  wallet: null,
  nftCollections: [],
  isLoading: false,

  connectWallet: (wallet) => set({ wallet }),

  disconnectWallet: () => set({ wallet: null }),

  setNFTCollections: (nftCollections) => set({ nftCollections }),

  addNFT: (collectionId, nft) =>
    set((state) => ({
      nftCollections: state.nftCollections.map((collection) =>
        collection.id === collectionId
          ? { ...collection, items: [...collection.items, nft] }
          : collection
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),
}));
