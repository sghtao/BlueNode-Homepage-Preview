export type Connection = {
  name: string
  slug: string
  logoSrc: string
  w: number
  h: number
  source: string
}

export const connections: Connection[] = [
  {
    name: 'DSRV',
    slug: 'dsrv',
    logoSrc: '/images/connections/dsrv.svg',
    w: 70,
    h: 21,
    source: 'https://www.dsrv.com/',
  },
  {
    name: 'Web3 Japan / Students Web3 Unit',
    slug: 'web3-japan',
    logoSrc: '/images/connections/web3-japan.png',
    w: 1772,
    h: 1066,
    source: 'existing repo asset (white bg color-keyed to transparent)',
  },
  { name: 'Solana', slug: 'solana', logoSrc: '/images/solana.svg', w: 26, h: 22, source: 'existing repo asset' },
  { name: 'NTU', slug: 'ntu', logoSrc: '/images/connections/ntu.png', w: 121, h: 135, source: 'LinkedIn @blockchain-at-ntu (navy bg color-keyed to transparent)' },
  {
    name: 'Mantle',
    slug: 'mantle',
    logoSrc: '/images/connections/mantle.svg',
    w: 152,
    h: 40,
    source: 'https://www.mantle.xyz/',
  },
  {
    name: 'XRPL',
    slug: 'xrpl',
    logoSrc: '/images/connections/xrpl.svg',
    w: 298,
    h: 225,
    source: 'https://xrpl.org/XRPL_Brand_Kit.zip',
  },
  {
    name: 'Injective',
    slug: 'injective',
    logoSrc: '/images/connections/injective.svg',
    w: 34,
    h: 34,
    source: 'https://injective.com/',
  },
  {
    name: 'BNB Chain',
    slug: 'bnb-chain',
    logoSrc: '/images/connections/bnb-chain.svg',
    w: 96,
    h: 96,
    source: 'https://www.bnbchain.org/en/brand-guidelines',
  },
  {
    name: 'Monad',
    slug: 'monad',
    logoSrc: '/images/connections/monad.svg',
    w: 24,
    h: 24,
    source: 'https://www.monad.xyz/',
  },
  {
    name: 'Altus',
    slug: 'b-harvest',
    logoSrc: '/images/connections/b-harvest.svg',
    w: 98,
    h: 28,
    source: 'https://altuslabs.io/',
  },
  {
    name: 'Catalyze Research',
    slug: 'catalyze-research',
    logoSrc: '/images/connections/catalyze-research.png',
    w: 256,
    h: 256,
    source: 'https://catalyze-research.com/',
  },
  {
    name: 'Xangle',
    slug: 'xangle',
    logoSrc: '/images/connections/xangle.svg',
    w: 211,
    h: 40,
    source: 'https://xangle.io/en',
  },
  {
    name: 'Tiger Research',
    slug: 'tiger-research',
    logoSrc: '/images/connections/tiger-research.png',
    w: 512,
    h: 157,
    source: 'https://tiger-research.com/',
  },
  {
    name: 'Four Pillars',
    slug: 'four-pillars',
    logoSrc: '/images/connections/four-pillars.svg',
    w: 280,
    h: 27,
    source: 'https://4pillars.io/en',
  },
]
