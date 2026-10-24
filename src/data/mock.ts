import type { Category, Demo, DemoRequest } from '@/types'

export const SUPPORT_PHONE = '+91 72239 27732'
export const SUPPORT_PHONE_TEL = '+917223927732'
export const SUPPORT_PHONE_ALT = '+91 74895 51813'
export const SUPPORT_PHONE_ALT_TEL = '+917489551813'
export const WHATSAPP_URL = `https://wa.me/917223927732`
export const WHATSAPP_URL_ALT = `https://wa.me/917489551813`
export const CONTACT_EMAIL = 'sales@digitalonebox.com'
export const COMPANY_WEBSITE = 'https://www.digitalonebox.com'
export const COMPANY_WEBSITE_LABEL = 'www.digitalonebox.com'
export const COMPANY_ADDRESS =
  'Nagpure Bhawan, Bhatera Choky, near Forest Naka, Balaghat, Madhya Pradesh 48100, India'

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'forex-mlm',
    label: 'Forex MLM',
    shortLabel: 'Forex MLM',
    accent: 'purple',
    description: 'ROI based Forex MLM platforms and member panels.',
  },
  {
    id: 'dapp',
    label: 'DApp / Blockchain',
    shortLabel: 'DApp',
    accent: 'cyan',
    description: 'Decentralized apps with wallet and member authentication.',
  },
  {
    id: 'binary-plan',
    label: 'Binary Plan',
    shortLabel: 'Binary Plan',
    accent: 'pink',
    description: 'Binary matrix income plans and network structure demos.',
  },
  {
    id: 'product-based',
    label: 'Product Based',
    shortLabel: 'Product Based',
    accent: 'green',
    description: 'E-commerce plus MLM member panel demonstrations.',
  },
  {
    id: 'crypto-token',
    label: 'Crypto Token / MLM',
    shortLabel: 'Crypto MLM',
    accent: 'gold',
    description: 'Token launch platforms with MLM, staking, and wallet modules.',
  },
  {
    id: 'token-development',
    label: 'Token Development',
    shortLabel: 'Token Dev',
    accent: 'cyan',
    description: 'ERC-20, BEP-20, TRC-20, meme coins, vesting, and launchpad services.',
  },
  {
    id: 'rwa-lending',
    label: 'RWA Token Lending',
    shortLabel: 'RWA Lending',
    accent: 'green',
    description: 'Real-world asset tokenization, collateral management, and digital lending.',
  },
]

export const INITIAL_DEMOS: Demo[] = [
  {
    id: 'demo-crypto-token-mlm',
    title: 'Crypto Token with MLM Platform',
    categoryId: 'crypto-token',
    description:
      'CodeCanyon-style crypto token + MLM suite with staking, wallets, KYC, and dual dashboards. Share the landing page link with clients.',
    websiteUrl: 'https://binarydemofrontend.fastsolution.cloud/',
    memberPanelUrl: 'https://binarydemofrontend.fastsolution.cloud/member',
    adminPanelUrl: 'https://binarydemofrontend.fastsolution.cloud/admin',
    landingPageSlug: 'crypto-token-mlm',
    username: 'SRPM006',
    password: 'Test@123',
    featured: true,
    active: true,
    viewCount: 12,
    createdAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'demo-token-development',
    title: 'Token Development Services',
    categoryId: 'token-development',
    description:
      'Custom crypto token, coin, and smart-contract development across ERC-20, BEP-20, TRC-20, SPL, and multi-chain launches.',
    websiteUrl: 'https://www.digitalonebox.com',
    landingPageSlug: 'token-development',
    username: 'demo',
    password: 'Demo@123',
    featured: true,
    active: true,
    viewCount: 3,
    createdAt: '2026-10-24T10:00:00.000Z',
  },
  {
    id: 'demo-rwa-token-lending',
    title: 'RWA Token Lending Platform',
    categoryId: 'rwa-lending',
    description:
      'Tokenized real-world assets, collateral management, and blockchain-powered digital lending for borrowers, lenders, and administrators.',
    websiteUrl: 'https://www.digitalonebox.com',
    landingPageSlug: 'rwa-token-lending',
    username: 'demo',
    password: 'Demo@123',
    featured: true,
    active: true,
    viewCount: 2,
    createdAt: '2026-10-24T18:00:00.000Z',
  },
  {
    id: 'demo-forex-mlm',
    title: 'Forex MLM Demo',
    categoryId: 'forex-mlm',
    description:
      'ROI based Forex MLM platform with investment plans and member panel.',
    websiteUrl: 'https://starpromarkets.com/MemberPanel/login',
    username: 'SPM201724',
    password: '452571',
    featured: true,
    active: true,
    viewCount: 8,
    createdAt: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 'demo-dapp',
    title: 'DApp Crowdfunding Demo',
    categoryId: 'dapp',
    description:
      'Decentralized crowdfunding DApp with member authentication and blockchain features.',
    websiteUrl: 'https://visionxglobal.io/member/loginauth',
    username: 'VXG00001',
    password: '0x176b2aA9e7f6f3D8e7169cE4730...',
    featured: true,
    active: true,
    viewCount: 6,
    createdAt: '2026-08-10T10:00:00.000Z',
  },
  {
    id: 'demo-binary',
    title: 'Binary Plan Demo',
    categoryId: 'binary-plan',
    description:
      'Binary MLM plan demonstration with matrix income and network structure.',
    websiteUrl: 'https://omginternational.live/member/loginauth',
    username: 'OMG00001',
    password: '1234',
    featured: false,
    active: true,
    viewCount: 5,
    createdAt: '2026-07-22T10:00:00.000Z',
  },
  {
    id: 'demo-product',
    title: 'Product Based MLM Demo',
    categoryId: 'product-based',
    description:
      'Product based MLM with e-commerce website and member panel demonstration.',
    websiteUrl: 'https://www.triayurveda.com',
    memberPanelUrl: 'https://www.triayurveda.com/MemberPanel/login.aspx',
    username: 'TA0000001',
    password: '1234',
    featured: true,
    active: true,
    viewCount: 4,
    createdAt: '2026-06-01T10:00:00.000Z',
  },
]

export const INITIAL_REQUESTS: DemoRequest[] = [
  {
    id: 'req-1',
    name: 'Aarav Mehta',
    email: 'aarav@example.com',
    company: 'NovaTrade Pvt Ltd',
    categoryId: 'forex-mlm',
    message: 'Need a white-label Forex MLM demo with ROI calculator.',
    createdAt: '2026-08-12T09:30:00.000Z',
    status: 'pending',
  },
  {
    id: 'req-2',
    name: 'Priya Shah',
    email: 'priya@example.com',
    company: 'ChainLift',
    categoryId: 'dapp',
    message: 'Looking for a staking + crowdfunding DApp walkthrough.',
    createdAt: '2026-08-08T14:10:00.000Z',
    status: 'reviewed',
  },
]
