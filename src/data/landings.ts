import type { ProductLanding } from '@/types'
import { uid } from '@/lib/utils'

export function normalizeProductLanding(raw: Partial<ProductLanding> & { id?: string }): ProductLanding {
  const base = createEmptyLanding()
  const merged = { ...base, ...raw, id: raw.id || base.id }

  let mediaItems = Array.isArray(raw.mediaItems) ? raw.mediaItems : []
  if (!mediaItems.length && Array.isArray(raw.demoTabs) && raw.demoTabs.length) {
    mediaItems = raw.demoTabs.map((tab) => ({
      id: tab.id,
      type: 'image' as const,
      title: tab.label,
      url: merged.heroImageUrl || '/landing/crypto-mlm-hero-devices.jpg',
    }))
  }
  if (!mediaItems.length) mediaItems = base.mediaItems

  return {
    ...merged,
    mediaItems,
    mediaSectionTitle:
      raw.mediaSectionTitle || raw.demoSectionTitle || base.mediaSectionTitle,
    mediaSectionSubtitle:
      raw.mediaSectionSubtitle ??
      raw.demoSectionSubtitle ??
      base.mediaSectionSubtitle ??
      '',
    demoSectionTitle: raw.demoSectionTitle || merged.mediaSectionTitle,
    demoSectionSubtitle: raw.demoSectionSubtitle ?? merged.mediaSectionSubtitle,
  }
}

export function createEmptyLanding(partial?: Partial<ProductLanding>): ProductLanding {
  const now = new Date().toISOString()
  return {
    id: uid('landing'),
    slug: '',
    demoId: '',
    active: true,
    brandLabel: 'Digital One Box Pvt. Ltd.',
    title: 'New Product',
    titleAccent: 'Platform',
    subtitle: 'Describe the product value proposition for prospective clients.',
    heroImageUrl: '/landing/crypto-mlm-hero-devices.jpg',
    heroChecks: ['Feature one', 'Feature two', 'Feature three'],
    networks: [],
    stats: [
      { value: '500+', label: 'Happy Clients' },
      { value: '4.8/5', label: 'Client Satisfaction' },
      { value: '100+', label: 'Custom Features' },
      { value: '24/7', label: 'Ongoing Support' },
    ],
    aboutTitle: 'About this product',
    aboutParagraphs: [
      'Explain what the product does and who it helps.',
      'Add a second paragraph covering delivery, demos, and support.',
    ],
    featuresTitle: 'Key features',
    featuresSubtitle: 'Highlight the modules buyers care about most.',
    features: [
      {
        title: 'Core Module',
        text: 'Describe a primary capability of this product.',
        accent: 'blue',
      },
    ],
    highlightsTitle: 'Product Highlights',
    highlights: ['Complete source code ownership', 'Easy installation & documentation'],
    suitableTitle: 'Ideal For',
    suitableFor: ['Startups', 'Agencies', 'Enterprises'],
    demoSectionTitle: 'Product media',
    demoSectionSubtitle: '',
    mediaSectionTitle: 'Product screenshots & videos',
    mediaSectionSubtitle: '',
    mediaItems: [
      {
        id: 'user-dashboard',
        type: 'image',
        title: 'User Dashboard',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
      {
        id: 'admin-dashboard',
        type: 'image',
        title: 'Admin Dashboard',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
    ],
    workflowTitle: 'How it works',
    workflowSubtitle: 'A clear path from discovery to launch.',
    workflow: [
      { step: '01', title: 'Discover', text: 'Review requirements and choose the right module set.' },
      { step: '02', title: 'Customize', text: 'Configure branding, plans, and integrations.' },
      { step: '03', title: 'Deploy', text: 'Launch with documentation and onboarding support.' },
    ],
    techTitle: 'Technology stack',
    techSubtitle: 'Built with proven production technologies.',
    techStack: [
      { label: 'React / Next.js', role: 'Frontend' },
      { label: 'Node.js', role: 'Backend' },
    ],
    whyUsTitle: 'Why choose Digital One Box?',
    whyUs: [
      'Experienced product specialists',
      'Clean, maintainable source architecture',
      'Long-term support & customization',
    ],
    faqsTitle: 'FAQ',
    faqsSubtitle: 'Answers buyers usually ask before booking a demo.',
    faqs: [
      {
        q: 'Can this product be customized?',
        a: 'Yes. Branding, workflows, and modules can be tailored to your go-to-market plan.',
      },
    ],
    formTitle: 'Get a Free Demo Access',
    formSubtitle: 'Tell us about your project and our team will share credentials and next steps.',
    ctaTitle: 'Build your next crypto product with Digital One Box',
    ctaText:
      'Tell us your use case — token, MLM, wallet, or exchange. We will map the right demo, scope, and delivery plan.',
    updatedAt: now,
    ...partial,
  }
}

export const INITIAL_LANDINGS: ProductLanding[] = [
  createEmptyLanding({
    id: 'landing-crypto-token-mlm',
    slug: 'crypto-token-mlm',
    demoId: 'demo-crypto-token-mlm',
    title: 'Crypto Token with',
    titleAccent: 'MLM Platform',
    subtitle:
      'Launch your own token with fundraising, community growth, staking rewards, and a complete multi-level marketing engine — ready for demos and client delivery.',
    heroImageUrl: '/landing/crypto-mlm-hero-devices.jpg',
    heroChecks: [
      'Own Token (BEP-20 / ERC-20)',
      'Multi MLM Plans',
      'Staking & Rewards',
      'Wallet Integration',
      'Admin & User Dashboards',
      'KYC & Security',
    ],
    networks: [
      { id: 'bsc', label: 'BSC', short: 'B' },
      { id: 'eth', label: 'Ethereum', short: 'Ξ' },
      { id: 'trx', label: 'Tron', short: 'T' },
      { id: 'matic', label: 'Polygon', short: 'P' },
      { id: 'sol', label: 'Solana', short: 'S' },
      { id: 'custom', label: 'Custom Chain', short: '+' },
    ],
    aboutTitle: 'A complete token + MLM stack for modern crypto communities',
    aboutParagraphs: [
      'Crypto Token with MLM Platform by Digital One Box helps founders launch branded tokens while rewarding community growth through configurable network marketing plans. Pair token utility with staking, wallets, KYC, and dual dashboards for members and administrators.',
      'Whether you are preparing an IDO-style fundraising journey or building a long-term membership economy, the platform is structured for white-label delivery, clear admin control, and a polished user experience your prospects can evaluate quickly.',
      'Share this page directly with clients, walk through live demo tabs, and collect qualified requirements through the demo access form.',
    ],
    featuresTitle: 'Everything required to launch, grow, and operate',
    featuresSubtitle: '',
    features: [
      {
        title: 'Crypto Token Development',
        text: 'Launch BEP-20, ERC-20, or custom-standard tokens with mint, burn, tax, and vesting controls.',
        accent: 'blue',
      },
      {
        title: 'Multiple MLM Plans',
        text: 'Binary, Matrix, Unilevel, and hybrid commission engines configurable from the admin panel.',
        accent: 'navy',
      },
      {
        title: 'Staking & Rewards',
        text: 'Flexible and locked staking pools with APY schedules, claim cycles, and referral boosts.',
        accent: 'cyan',
      },
      {
        title: 'Wallet Integration',
        text: 'Built-in wallet views plus MetaMask / WalletConnect for deposits, withdrawals, and history.',
        accent: 'green',
      },
      {
        title: 'Admin Dashboard',
        text: 'Manage users, token supply, payouts, KYC queues, and plan settings from one control center.',
        accent: 'violet',
      },
      {
        title: 'User Dashboard',
        text: 'Members track balances, network growth, earnings, staking positions, and team performance.',
        accent: 'orange',
      },
      {
        title: 'KYC & Security',
        text: 'Document verification workflows, 2FA options, role permissions, and hardened contract patterns.',
        accent: 'red',
      },
      {
        title: 'Payment Gateway',
        text: 'Accept crypto and optional fiat rails with reconciliation-ready transaction logs.',
        accent: 'teal',
      },
    ],
    highlights: [
      'Complete source code ownership',
      'Easy installation & documentation',
      'Mobile-responsive member panels',
      'Multi-language ready architecture',
      'White-label branding support',
      'Dedicated post-launch support',
    ],
    suitableFor: [
      'Crypto startups & token launches',
      'MLM / network marketing brands',
      'Staking & DeFi communities',
      'ICO / IDO fundraising teams',
      'Agencies building client products',
      'Enterprises needing custom chains',
    ],
    mediaSectionTitle: 'Product screenshots & videos',
    mediaSectionSubtitle: '',
    mediaItems: [
      {
        id: 'user-dashboard',
        type: 'image',
        title: 'User Dashboard',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
      {
        id: 'admin-dashboard',
        type: 'image',
        title: 'Admin Dashboard',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
      {
        id: 'mlm-dashboard',
        type: 'image',
        title: 'MLM Dashboard',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
      {
        id: 'staking-module',
        type: 'image',
        title: 'Staking Module',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
      {
        id: 'mobile-view',
        type: 'image',
        title: 'Mobile View',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
    ],
    workflowTitle: 'From token concept to launch in four clear steps',
    workflow: [
      {
        step: '01',
        title: 'Choose Your Token',
        text: 'Pick BEP-20, ERC-20, or a custom standard for your project.',
      },
      {
        step: '02',
        title: 'Select MLM Plan',
        text: 'Configure binary, matrix, unilevel, or hybrid compensation.',
      },
      {
        step: '03',
        title: 'Customize Features',
        text: 'Enable staking, KYC, wallets, branding, and payout rules.',
      },
      {
        step: '04',
        title: 'Deploy & Launch',
        text: 'Go live on your chosen network with admin onboarding support.',
      },
    ],
    techStack: [
      { label: 'React / Next.js', role: 'Frontend' },
      { label: 'Node.js', role: 'Backend' },
      { label: 'Solidity', role: 'Smart Contract' },
      { label: 'MongoDB / MySQL', role: 'Database' },
      { label: 'MetaMask', role: 'Wallet' },
      { label: 'AWS / VPS', role: 'Deployment' },
    ],
    whyUs: [
      'Experienced blockchain & MLM developers',
      'Clean, maintainable source architecture',
      'Transparent timelines and milestones',
      'Affordable packaging with upgrade paths',
      'Secure development practices',
      'Long-term support & customization',
    ],
    ctaTitle: 'Build your next crypto product with Digital One Box',
    ctaText:
      'Tell us your use case — token, MLM, wallet, or exchange. We will map the right demo, scope, and delivery plan.',
    faqs: [
      {
        q: 'Can the platform be customized for our brand?',
        a: 'Yes. Branding, commission logic, token rules, staking pools, and panel modules can be tailored to your go-to-market plan.',
      },
      {
        q: 'Which blockchain networks are supported?',
        a: 'BSC, Ethereum, Tron, Polygon, Solana, and custom EVM-compatible chains are supported depending on the selected package.',
      },
      {
        q: 'Do we receive the complete source code?',
        a: 'Yes. You receive full source ownership for the licensed package so your team can host, extend, and maintain the product.',
      },
      {
        q: 'Is installation and launch support included?',
        a: 'Documentation is included with every delivery. Guided installation and launch assistance are available on request.',
      },
      {
        q: 'Can you add features after delivery?',
        a: 'Absolutely. Post-launch feature work, audits, and growth modules can be scoped as paid change requests.',
      },
    ],
  }),
  createEmptyLanding({
    id: 'landing-token-development',
    slug: 'token-development',
    demoId: 'demo-token-development',
    title: 'Crypto Token',
    titleAccent: 'Development Services',
    subtitle:
      'Launch ERC-20, BEP-20, TRC-20, SPL, meme coins, utility tokens, stablecoins, and custom smart contracts — with vesting, tokenomics, and launchpad support.',
    heroImageUrl: '/landing/crypto-mlm-hero-devices.jpg',
    heroChecks: [
      'ERC-20 / BEP-20 / TRC-20 / SPL',
      'Smart Contract Development',
      'Tokenomics & Vesting',
      'Presale / ICO / IDO Launchpad',
      'Multi-Chain Deployment',
      'Audit-Ready Architecture',
    ],
    networks: [
      { id: 'eth', label: 'Ethereum', short: 'Ξ' },
      { id: 'bsc', label: 'BSC', short: 'B' },
      { id: 'trx', label: 'Tron', short: 'T' },
      { id: 'matic', label: 'Polygon', short: 'P' },
      { id: 'sol', label: 'Solana', short: 'S' },
      { id: 'custom', label: 'Custom Chain', short: '+' },
    ],
    stats: [
      { value: '200+', label: 'Tokens Delivered' },
      { value: '15+', label: 'Supported Chains' },
      { value: '4.9/5', label: 'Client Rating' },
      { value: '24/7', label: 'Launch Support' },
    ],
    aboutTitle: 'End-to-end token and coin development for founders and agencies',
    aboutParagraphs: [
      'Digital One Box builds production-ready crypto tokens and coins for startups, agencies, and enterprise teams. From standard fungible tokens to meme coins, governance tokens, stablecoins, and native coin architectures, we deliver clean contracts with clear admin controls.',
      'Every engagement covers tokenomics planning, vesting schedules, ownership tooling, and deployment on the chain that fits your go-to-market plan. Pair the token with launchpad, staking, wallet, or MLM modules when you need a full product stack.',
      'Use this page to walk clients through capabilities, share demo credentials, and collect requirements before scoping the build.',
    ],
    featuresTitle: 'Token development capabilities',
    featuresSubtitle: '',
    features: [
      {
        title: 'ERC-20 / BEP-20 / TRC-20 / SPL Tokens',
        text: 'Standard and custom fungible tokens with mint, burn, tax, pause, blacklist, and ownership controls.',
        accent: 'blue',
      },
      {
        title: 'Meme Coin Development',
        text: 'Fast-launch meme coins with liquidity-friendly settings, renounce options, and marketing-ready branding hooks.',
        accent: 'orange',
      },
      {
        title: 'Utility & Governance Tokens',
        text: 'Access, reward, and voting tokens designed for product utility, DAOs, and community programs.',
        accent: 'navy',
      },
      {
        title: 'Stablecoin Development',
        text: 'Collateralized or algorithm-assisted stablecoin patterns with admin mint/burn and reserve reporting hooks.',
        accent: 'teal',
      },
      {
        title: 'Smart Contract Development',
        text: 'Custom Solidity / chain contracts for vesting, staking hooks, airdrops, and launch workflows.',
        accent: 'violet',
      },
      {
        title: 'Token Presale / ICO / IDO',
        text: 'Launchpad-ready sale contracts with whitelist, hard/soft caps, stages, and claim windows.',
        accent: 'cyan',
      },
      {
        title: 'Vesting & Tokenomics',
        text: 'Cliff, linear, and team/advisor vesting schedules with transparent allocation dashboards.',
        accent: 'green',
      },
      {
        title: 'Multi-Chain Deployment',
        text: 'Deploy and bridge-ready packaging across Ethereum, BSC, Tron, Polygon, Solana, and custom EVMs.',
        accent: 'red',
      },
    ],
    highlights: [
      'Source-code ownership on delivery',
      'Audit-friendly contract structure',
      'Tokenomics consultation included',
      'Admin tools for mint / vesting / sales',
      'White-label branding support',
      'Post-launch upgrade path',
    ],
    suitableFor: [
      'Crypto startups & founders',
      'Agencies selling token packages',
      'Meme / community coin launches',
      'IDO / ICO fundraising teams',
      'Web3 product companies',
      'Enterprises exploring on-chain utility',
    ],
    mediaSectionTitle: 'Product screenshots & videos',
    mediaSectionSubtitle: '',
    mediaItems: [
      {
        id: 'token-overview',
        type: 'image',
        title: 'Token Overview',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
      {
        id: 'admin-controls',
        type: 'image',
        title: 'Admin Controls',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
      {
        id: 'vesting-schedule',
        type: 'image',
        title: 'Vesting Schedule',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
      {
        id: 'presale-module',
        type: 'image',
        title: 'Presale Module',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
    ],
    workflowTitle: 'From brief to mainnet in four steps',
    workflowSubtitle: 'A clear delivery path for token launches.',
    workflow: [
      {
        step: '01',
        title: 'Define Token Specs',
        text: 'Choose chain, supply, tax rules, ownership model, and utility requirements.',
      },
      {
        step: '02',
        title: 'Design Tokenomics',
        text: 'Map allocations, vesting, liquidity, and launch stages with your sales goals.',
      },
      {
        step: '03',
        title: 'Build & Test Contracts',
        text: 'Develop, unit-test, and stage contracts with admin tooling and docs.',
      },
      {
        step: '04',
        title: 'Deploy & Launch',
        text: 'Mainnet deploy, verify contracts, and support liquidity / sale go-live.',
      },
    ],
    techTitle: 'Technology stack',
    techSubtitle: 'Built with proven production technologies.',
    techStack: [
      { label: 'Solidity', role: 'Smart Contract' },
      { label: 'React / Next.js', role: 'Frontend' },
      { label: 'Node.js', role: 'Backend' },
      { label: 'MetaMask', role: 'Wallet' },
      { label: 'MongoDB / MySQL', role: 'Database' },
      { label: 'AWS / VPS', role: 'Deployment' },
    ],
    whyUs: [
      'Dedicated blockchain development team',
      'Clean, maintainable contract architecture',
      'Transparent timelines and milestones',
      'Affordable packaging with upgrade paths',
      'Secure development practices',
      'Long-term support & customization',
    ],
    ctaTitle: 'Launch your token with Digital One Box',
    ctaText:
      'Share your chain, supply model, and launch timeline. We will recommend the right token package and demo path.',
    faqs: [
      {
        q: 'Which token standards do you support?',
        a: 'ERC-20, BEP-20, TRC-20, SPL, and custom EVM standards are supported. Native coin / chain work can be scoped separately.',
      },
      {
        q: 'Can you add tax, reflection, or anti-bot logic?',
        a: 'Yes. Transfer tax, reflections, max wallet, cooldown, and related controls can be included based on your requirements.',
      },
      {
        q: 'Do we receive the source code?',
        a: 'Yes. You receive full source ownership for the licensed package so your team can host, verify, and extend the contracts.',
      },
      {
        q: 'Can this connect with MLM, staking, or wallet products?',
        a: 'Yes. Tokens can be packaged with MLM, staking, launchpad, and wallet modules as combo deliveries.',
      },
      {
        q: 'Is contract verification and documentation included?',
        a: 'Explorer verification support and technical documentation are included. Third-party audits can be arranged on request.',
      },
    ],
  }),
  createEmptyLanding({
    id: 'landing-rwa-token-lending',
    slug: 'rwa-token-lending',
    demoId: 'demo-rwa-token-lending',
    title: 'Unlock Real-World Value.',
    titleAccent: 'Power the Future of Lending.',
    subtitle:
      'Transform tokenized real-world assets into digital lending opportunities with a secure, transparent and technology-driven RWA lending platform. Enable eligible users to explore asset-backed borrowing, collateral management and digital asset lending through blockchain-powered infrastructure.',
    heroImageUrl: '/landing/crypto-mlm-hero-devices.jpg',
    heroChecks: [
      'Digital asset representation & token management',
      'Configurable collateral & LTV rules',
      'Transparent loan & repayment records',
      'Smart-contract workflow automation',
      'Borrower, lender & admin dashboards',
      'Flexible blockchain network support',
    ],
    networks: [
      { id: 'eth', label: 'Ethereum', short: 'Ξ' },
      { id: 'bsc', label: 'BSC', short: 'B' },
      { id: 'matic', label: 'Polygon', short: 'P' },
      { id: 'trx', label: 'Tron', short: 'T' },
      { id: 'sol', label: 'Solana', short: 'S' },
      { id: 'custom', label: 'Custom Chain', short: '+' },
    ],
    stats: [
      { value: '5+', label: 'Asset Categories' },
      { value: 'LTV', label: 'Risk Controls' },
      { value: '4', label: 'Role Dashboards' },
      { value: '24/7', label: 'Ops Visibility' },
    ],
    aboutTitle: 'Bringing Real-World Assets into Digital Lending',
    aboutParagraphs: [
      'Our RWA Token Lending Platform connects eligible real-world assets with blockchain-enabled lending infrastructure. It is designed to support the digital representation of assets, collateral management, loan requests and transparent tracking of lending activities.',
      'From real estate and precious metals to eligible receivables and other verified assets, the platform can be configured to support different asset classes, lending models and operational requirements.',
      'Supported asset categories can include real estate, precious metals, invoices & receivables, bonds & financial assets, and other eligible assets — subject to valuation methodology, legal structure, risk policies, and platform configuration.',
    ],
    featuresTitle: 'Core Platform Features',
    featuresSubtitle: '',
    features: [
      {
        title: 'RWA Tokenization',
        text: 'Represent eligible real-world assets through blockchain-based tokens with configurable issuance, ownership records and asset metadata.',
        accent: 'blue',
      },
      {
        title: 'Asset-Backed Lending',
        text: 'Enable eligible borrowers to submit loan requests backed by supported tokenized assets, subject to valuation and collateral requirements.',
        accent: 'navy',
      },
      {
        title: 'Collateral Management',
        text: 'Track pledged assets, collateral values, loan exposure and collateral status through a centralized interface.',
        accent: 'cyan',
      },
      {
        title: 'Lending Marketplace',
        text: 'Provide an interface where eligible lenders can review available lending opportunities, subject to platform rules and applicable requirements.',
        accent: 'green',
      },
      {
        title: 'Smart Contract Automation',
        text: 'Automate supported processes such as collateral locking, loan disbursement conditions, repayment tracking and collateral release where appropriate.',
        accent: 'violet',
      },
      {
        title: 'Loan & Repayment Management',
        text: 'Track principal, interest terms, due dates, repayment history and outstanding balances.',
        accent: 'orange',
      },
      {
        title: 'Risk & LTV Management',
        text: 'Configure collateral eligibility, valuation rules, LTV thresholds and alerts for under-collateralized positions.',
        accent: 'teal',
      },
      {
        title: 'KYC & Compliance Workflows',
        text: 'Support identity verification, transaction monitoring integrations, eligibility checks and configurable approval processes.',
        accent: 'red',
      },
      {
        title: 'Multi-Role Dashboards',
        text: 'Provide dedicated interfaces for borrowers, lenders, asset issuers and administrators.',
        accent: 'blue',
      },
      {
        title: 'Reporting & Analytics',
        text: 'Monitor lending activity, outstanding loans, collateral exposure, repayments and platform performance.',
        accent: 'navy',
      },
    ],
    highlightsTitle: 'Platform Modules',
    highlights: [
      'Asset Issuance & Token Management',
      'Asset Verification & Valuation',
      'Borrower Dashboard',
      'Lender Dashboard',
      'Loan Application Management',
      'Collateral Locking & Release',
      'Repayment & Settlement Tracking',
      'Smart Contract Management',
      'KYC/AML Integration',
      'Risk Monitoring & Alerts',
      'Admin & Compliance Dashboard',
      'Reporting & Audit Logs',
    ],
    suitableTitle: 'Who Is This Platform For?',
    suitableFor: [
      'RWA tokenization businesses',
      'Asset originators and issuers',
      'Digital lending providers',
      'Eligible institutional lenders',
      'Fintech and Web3 startups',
      'Businesses exploring asset-backed financing',
    ],
    mediaSectionTitle: 'Product screenshots & videos',
    mediaSectionSubtitle: '',
    mediaItems: [
      {
        id: 'borrower-dashboard',
        type: 'image',
        title: 'Borrower Dashboard',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
      {
        id: 'lender-dashboard',
        type: 'image',
        title: 'Lender Dashboard',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
      {
        id: 'collateral-management',
        type: 'image',
        title: 'Collateral Management',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
      {
        id: 'lending-marketplace',
        type: 'image',
        title: 'Lending Marketplace',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
      {
        id: 'asset-tokenization',
        type: 'image',
        title: 'Asset Tokenization',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
      {
        id: 'admin-compliance',
        type: 'image',
        title: 'Admin & Compliance',
        url: '/landing/crypto-mlm-hero-devices.jpg',
      },
    ],
    workflowTitle: 'How It Works',
    workflowSubtitle: 'From asset onboarding to repayment and settlement.',
    workflow: [
      {
        step: '01',
        title: 'Asset Onboarding',
        text: 'Submit asset information and complete the required ownership, valuation and eligibility checks.',
      },
      {
        step: '02',
        title: 'Tokenization',
        text: "Represent approved assets using the platform's configured tokenization model.",
      },
      {
        step: '03',
        title: 'Collateral Assessment',
        text: 'Evaluate eligible collateral and determine permitted borrowing limits using configured LTV rules.',
      },
      {
        step: '04',
        title: 'Loan Request',
        text: 'An eligible borrower submits a loan application with the requested amount and applicable terms.',
      },
      {
        step: '05',
        title: 'Approval & Disbursement',
        text: 'The authorized lender or lending mechanism approves the request and processes disbursement according to the configured workflow.',
      },
      {
        step: '06',
        title: 'Repayment & Settlement',
        text: 'Track repayments, outstanding obligations and collateral release or enforcement under the agreed terms.',
      },
    ],
    techStack: [
      { label: 'React / Next.js', role: 'Frontend' },
      { label: 'Node.js', role: 'Backend' },
      { label: 'Solidity', role: 'Smart Contract' },
      { label: 'MongoDB / MySQL', role: 'Database' },
      { label: 'MetaMask', role: 'Wallet' },
      { label: 'AWS / VPS', role: 'Deployment' },
    ],
    whyUsTitle: 'Built for Accountable Digital Lending',
    whyUs: [
      'Role-based access control',
      'Secure authentication and session management',
      'Smart contract testing and independent audits',
      'Transaction history and audit trails',
      'Collateral valuation and risk monitoring',
      'KYC/AML provider integrations where required',
      'Secure key management and transaction authorization',
    ],
    formTitle: 'Request a Demo',
    formSubtitle:
      'Discuss your requirements with Digital One Box — Blockchain Development, Tokenization & Fintech Solutions. Tokenization, collateral eligibility and lending availability depend on asset verification, applicable regulations and platform configuration.',
    ctaTitle: 'Build Your RWA Lending Ecosystem',
    ctaText:
      'Bring asset tokenization, collateral management and digital lending workflows together in one configurable platform. Request a demo or discuss your requirements. This description is for informational and product-demonstration purposes only — it does not constitute an offer of credit, investment advice, or a guarantee of lending availability or returns.',
    faqsTitle: 'Frequently Asked Questions',
    faqsSubtitle: '',
    faqs: [
      {
        q: 'What is RWA token lending?',
        a: 'RWA token lending uses a digital representation of eligible real-world assets within a lending or collateral-management framework.',
      },
      {
        q: 'Which assets can be used as collateral?',
        a: "Eligible assets depend on the platform's supported asset classes, ownership verification, valuation methods and applicable legal requirements.",
      },
      {
        q: 'Can lending workflows be automated?',
        a: 'Selected workflows can be automated using smart contracts, while identity checks, valuations, approvals and legal enforcement may require external services or human oversight.',
      },
      {
        q: 'Does tokenization automatically transfer legal ownership?',
        a: 'No. Tokenization alone does not necessarily transfer legal title or create enforceable rights to an underlying asset. The legal structure must define the rights represented by each token.',
      },
      {
        q: 'Can the platform support multiple blockchain networks?',
        a: 'Multi-chain support can be implemented where required, subject to network compatibility, security testing and integration scope.',
      },
      {
        q: 'Is the platform customizable?',
        a: 'Yes. Asset types, collateral rules, lending workflows, user roles, reporting and supported integrations can be configured according to project requirements.',
      },
    ],
  }),
]
