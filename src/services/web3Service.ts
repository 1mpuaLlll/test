import { BrowserProvider, Contract } from 'ethers';
import { WalletConnection } from '../types';

class Web3Service {
  private provider: BrowserProvider | null = null;
  private signer: any = null;

  async connectWallet(type: 'metamask' | 'phantom' | 'walletconnect'): Promise<WalletConnection | null> {
    try {
      if (type === 'metamask') {
        return await this.connectMetaMask();
      }
      // Add other wallet types here
      return null;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
    }
  }

  private async connectMetaMask(): Promise<WalletConnection | null> {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('MetaMask not installed');
    }

    const ethereum = (window as any).ethereum;

    // Request account access
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const chainId = await ethereum.request({ method: 'eth_chainId' });

    this.provider = new BrowserProvider(ethereum);
    this.signer = await this.provider.getSigner();

    return {
      address: accounts[0],
      provider: 'metamask',
      isConnected: true,
      chainId: parseInt(chainId, 16),
    };
  }

  async disconnectWallet(): Promise<void> {
    this.provider = null;
    this.signer = null;
  }

  async getNFTs(address: string): Promise<any[]> {
    // Mock NFT data - in production, use OpenSea API or similar
    return [
      {
        id: '1',
        tokenId: '111',
        name: 'Premium Badge #111',
        description: 'Exclusive Elevate messenger badge',
        imageUrl: '',
        contractAddress: '0x...',
        rarity: 'legendary',
      },
    ];
  }

  async sendNFT(to: string, tokenId: string, contractAddress: string): Promise<boolean> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      // Mock implementation - replace with actual contract interaction
      console.log(`Sending NFT ${tokenId} to ${to}`);

      // In production:
      // const contract = new Contract(contractAddress, ABI, this.signer);
      // const tx = await contract.transferFrom(from, to, tokenId);
      // await tx.wait();

      return true;
    } catch (error) {
      console.error('Error sending NFT:', error);
      return false;
    }
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const balance = await this.provider.getBalance(address);
    return balance.toString();
  }

  onAccountChange(callback: (accounts: string[]) => void): void {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', callback);
    }
  }

  onChainChange(callback: (chainId: string) => void): void {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      (window as any).ethereum.on('chainChanged', callback);
    }
  }
}

export const web3Service = new Web3Service();
