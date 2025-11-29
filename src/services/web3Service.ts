import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
import { WalletConnection } from '../types';

// Адрес кошелька продавца (можно изменить на свой)
const SELLER_WALLET = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

interface PurchaseResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

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
    return formatEther(balance);
  }

  async getBalanceInEth(): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const address = await this.signer.getAddress();
    const balance = await this.provider!.getBalance(address);
    return formatEther(balance);
  }

  async purchaseNFT(
    tokenId: number,
    priceInEth: number,
    sellerAddress?: string
  ): Promise<PurchaseResult> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const recipient = sellerAddress || SELLER_WALLET;
      const value = parseEther(priceInEth.toString());

      // Отправка ETH продавцу
      const tx = await this.signer.sendTransaction({
        to: recipient,
        value: value,
      });

      // Ждем подтверждения транзакции
      const receipt = await tx.wait();

      console.log('Purchase successful!', {
        tokenId,
        transactionHash: receipt.hash,
        from: await this.signer.getAddress(),
        to: recipient,
        value: formatEther(value),
      });

      return {
        success: true,
        transactionHash: receipt.hash,
      };
    } catch (error: any) {
      console.error('Error purchasing NFT:', error);

      let errorMessage = 'Unknown error occurred';
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction rejected by user';
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async batchPurchaseNFTs(
    purchases: Array<{ tokenId: number; priceInEth: number }>,
    sellerAddress?: string
  ): Promise<PurchaseResult[]> {
    const results: PurchaseResult[] = [];

    for (const purchase of purchases) {
      const result = await this.purchaseNFT(
        purchase.tokenId,
        purchase.priceInEth,
        sellerAddress
      );
      results.push(result);

      // Задержка между транзакциями
      if (results.length < purchases.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  async estimateGasCost(priceInEth: number): Promise<string> {
    if (!this.signer || !this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const gasPrice = (await this.provider.getFeeData()).gasPrice;
      const gasLimit = 21000n; // Standard ETH transfer

      if (!gasPrice) {
        return '0.001'; // Fallback estimate
      }

      const gasCost = gasPrice * gasLimit;
      return formatEther(gasCost);
    } catch (error) {
      console.error('Error estimating gas:', error);
      return '0.001';
    }
  }

  getCurrentWalletAddress(): string | null {
    return this.signer ? this.signer.address : null;
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
