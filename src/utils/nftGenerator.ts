// NFT SVG Generator with randomization
export interface NFTAttributes {
  background: string;
  pattern: 'geometric' | 'cosmic' | 'waves' | 'grid' | 'particles';
  primaryColor: string;
  secondaryColor: string;
  accent: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  tokenId: number;
  hasAnimation: boolean;
  holographic: boolean;
}

const rarityColors = {
  common: {
    primary: '#9CA3AF',
    secondary: '#6B7280',
    accent: '#4B5563',
  },
  rare: {
    primary: '#3B82F6',
    secondary: '#2563EB',
    accent: '#1D4ED8',
  },
  epic: {
    primary: '#A855F7',
    secondary: '#9333EA',
    accent: '#7E22CE',
  },
  legendary: {
    primary: '#F59E0B',
    secondary: '#FFD700',
    accent: '#FBBF24',
  },
};

const backgrounds = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
];

export class NFTGenerator {
  private static getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static getRarityByProbability(): 'common' | 'rare' | 'epic' | 'legendary' {
    const roll = Math.random() * 100;
    if (roll < 50) return 'common'; // 50%
    if (roll < 80) return 'rare'; // 30%
    if (roll < 95) return 'epic'; // 15%
    return 'legendary'; // 5%
  }

  static generateAttributes(tokenId: number): NFTAttributes {
    const rarity = this.getRarityByProbability();
    const colors = rarityColors[rarity];
    const pattern = this.getRandomElement<NFTAttributes['pattern']>([
      'geometric',
      'cosmic',
      'waves',
      'grid',
      'particles',
    ]);

    return {
      background: this.getRandomElement(backgrounds),
      pattern,
      primaryColor: colors.primary,
      secondaryColor: colors.secondary,
      accent: colors.accent,
      rarity,
      tokenId,
      hasAnimation: rarity === 'epic' || rarity === 'legendary',
      holographic: rarity === 'legendary',
    };
  }

  private static generateGeometricPattern(attrs: NFTAttributes): string {
    return `
      <defs>
        <pattern id="geometric-${attrs.tokenId}" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="25" cy="25" r="20" fill="${attrs.primaryColor}" opacity="0.3"/>
          <rect x="60" y="10" width="30" height="30" fill="${attrs.secondaryColor}" opacity="0.3" transform="rotate(45 75 25)"/>
          <polygon points="10,70 30,90 50,70" fill="${attrs.accent}" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#geometric-${attrs.tokenId})"/>
    `;
  }

  private static generateCosmicPattern(attrs: NFTAttributes): string {
    const stars = Array.from({ length: 50 }, (_, i) => {
      const x = Math.random() * 400;
      const y = Math.random() * 400;
      const r = Math.random() * 3 + 1;
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="${Math.random() * 0.8 + 0.2}"/>`;
    }).join('');

    return `
      <defs>
        <radialGradient id="cosmic-${attrs.tokenId}">
          <stop offset="0%" stop-color="${attrs.primaryColor}" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="${attrs.secondaryColor}" stop-opacity="0.3"/>
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="150" fill="url(#cosmic-${attrs.tokenId})"/>
      ${stars}
      <circle cx="200" cy="200" r="80" fill="${attrs.accent}" opacity="0.5"/>
    `;
  }

  private static generateWavesPattern(attrs: NFTAttributes): string {
    return `
      <defs>
        <linearGradient id="wave-gradient-${attrs.tokenId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${attrs.primaryColor}"/>
          <stop offset="100%" stop-color="${attrs.secondaryColor}"/>
        </linearGradient>
      </defs>
      <path d="M0,100 Q100,80 200,100 T400,100 L400,400 L0,400 Z" fill="url(#wave-gradient-${attrs.tokenId})" opacity="0.3"/>
      <path d="M0,150 Q100,130 200,150 T400,150 L400,400 L0,400 Z" fill="${attrs.accent}" opacity="0.2"/>
      <path d="M0,200 Q100,180 200,200 T400,200 L400,400 L0,400 Z" fill="${attrs.primaryColor}" opacity="0.1"/>
    `;
  }

  private static generateGridPattern(attrs: NFTAttributes): string {
    const lines = Array.from({ length: 20 }, (_, i) => {
      const pos = i * 20;
      return `
        <line x1="${pos}" y1="0" x2="${pos}" y2="400" stroke="${attrs.primaryColor}" stroke-width="1" opacity="0.3"/>
        <line x1="0" y1="${pos}" x2="400" y2="${pos}" stroke="${attrs.secondaryColor}" stroke-width="1" opacity="0.3"/>
      `;
    }).join('');

    return `
      ${lines}
      <circle cx="100" cy="100" r="40" fill="${attrs.accent}" opacity="0.4"/>
      <circle cx="300" cy="300" r="60" fill="${attrs.primaryColor}" opacity="0.4"/>
      <rect x="200" y="150" width="80" height="80" fill="${attrs.secondaryColor}" opacity="0.4" transform="rotate(45 240 190)"/>
    `;
  }

  private static generateParticlesPattern(attrs: NFTAttributes): string {
    const particles = Array.from({ length: 100 }, (_, i) => {
      const x = Math.random() * 400;
      const y = Math.random() * 400;
      const r = Math.random() * 5 + 1;
      const color = [attrs.primaryColor, attrs.secondaryColor, attrs.accent][Math.floor(Math.random() * 3)];
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${Math.random() * 0.6 + 0.2}"/>`;
    }).join('');

    return particles;
  }

  private static generatePattern(attrs: NFTAttributes): string {
    switch (attrs.pattern) {
      case 'geometric':
        return this.generateGeometricPattern(attrs);
      case 'cosmic':
        return this.generateCosmicPattern(attrs);
      case 'waves':
        return this.generateWavesPattern(attrs);
      case 'grid':
        return this.generateGridPattern(attrs);
      case 'particles':
        return this.generateParticlesPattern(attrs);
      default:
        return this.generateGeometricPattern(attrs);
    }
  }

  static generateSVG(attrs: NFTAttributes): string {
    const pattern = this.generatePattern(attrs);
    const animation = attrs.hasAnimation
      ? `
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 200 200"
          to="360 200 200"
          dur="20s"
          repeatCount="indefinite"
        />
      `
      : '';

    const holographicFilter = attrs.holographic
      ? `
        <defs>
          <filter id="holographic-${attrs.tokenId}">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feColorMatrix type="hueRotate" values="0">
              <animate attributeName="values" from="0" to="360" dur="3s" repeatCount="indefinite"/>
            </feColorMatrix>
          </filter>
        </defs>
      `
      : '';

    return `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        ${holographicFilter}
        <defs>
          <linearGradient id="bg-${attrs.tokenId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${attrs.primaryColor}"/>
            <stop offset="100%" stop-color="${attrs.secondaryColor}"/>
          </linearGradient>
        </defs>

        <!-- Background -->
        <rect width="400" height="400" fill="url(#bg-${attrs.tokenId})"/>

        <!-- Pattern Layer -->
        <g ${attrs.holographic ? `filter="url(#holographic-${attrs.tokenId})"` : ''}>
          ${pattern}
          ${animation}
        </g>

        <!-- Border -->
        <rect width="400" height="400" fill="none" stroke="${attrs.accent}" stroke-width="4" opacity="0.8"/>

        <!-- Token ID -->
        <text x="200" y="360" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white" opacity="0.9">
          #${attrs.tokenId}
        </text>

        <!-- Rarity Badge -->
        <g transform="translate(20, 20)">
          <rect width="100" height="30" rx="15" fill="rgba(0, 0, 0, 0.6)"/>
          <text x="50" y="20" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="${attrs.accent}" text-transform="uppercase">
            ${attrs.rarity}
          </text>
        </g>

        ${attrs.holographic ? `
          <g opacity="0.3">
            <circle cx="200" cy="200" r="150" fill="none" stroke="white" stroke-width="2">
              <animate attributeName="r" values="150;160;150" dur="2s" repeatCount="indefinite"/>
            </circle>
          </g>
        ` : ''}
      </svg>
    `;
  }

  static generateNFT(tokenId: number): { attributes: NFTAttributes; svg: string } {
    const attributes = this.generateAttributes(tokenId);
    const svg = this.generateSVG(attributes);
    return { attributes, svg };
  }

  static generateCollection(count: number, startId: number = 1): Array<{ attributes: NFTAttributes; svg: string }> {
    return Array.from({ length: count }, (_, i) => this.generateNFT(startId + i));
  }
}
