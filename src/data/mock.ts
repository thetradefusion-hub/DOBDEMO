import type { Category, Demo, DemoRequest } from '@/types'

export const SUPPORT_PHONE = '+91 98765 43210'
export const SUPPORT_PHONE_TEL = '+919876543210'
export const WHATSAPP_URL = `https://wa.me/${SUPPORT_PHONE_TEL.replace('+', '')}`
export const CONTACT_EMAIL = 'hello@digitalonebox.com'

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
]

export const INITIAL_DEMOS: Demo[] = [
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
