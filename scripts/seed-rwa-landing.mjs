import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { get, getDatabase, ref, set } from 'firebase/database'

function loadEnv(path) {
  const text = readFileSync(path, 'utf8')
  const env = {}
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const i = trimmed.indexOf('=')
    if (i < 0) continue
    const key = trimmed.slice(0, i).trim()
    let value = trimmed.slice(i + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }
  return env
}

const env = loadEnv(resolve(process.cwd(), '.env.local'))
const projectId = env.VITE_FIREBASE_PROJECT_ID
const apiKey = env.VITE_FIREBASE_API_KEY
const appId = env.VITE_FIREBASE_APP_ID
if (!projectId || !apiKey || !appId) {
  console.error('Missing Firebase env in .env.local')
  process.exit(1)
}

const app = initializeApp({
  apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
  projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId,
  databaseURL:
    env.VITE_FIREBASE_DATABASE_URL || `https://${projectId}-default-rtdb.firebaseio.com`,
})

const db = getDatabase(app)
const now = new Date().toISOString()

const category = {
  id: 'rwa-lending',
  label: 'RWA Token Lending',
  shortLabel: 'RWA Lending',
  accent: 'green',
  description: 'Real-world asset tokenization, collateral management, and digital lending.',
}

const demo = {
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
}

const landing = {
  id: 'landing-rwa-token-lending',
  slug: 'rwa-token-lending',
  demoId: 'demo-rwa-token-lending',
  active: true,
  brandLabel: 'Digital One Box Pvt. Ltd.',
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
  demoSectionTitle: 'Product screenshots & videos',
  demoSectionSubtitle: '',
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
  techTitle: 'Technology stack',
  techSubtitle: 'Built with proven production technologies.',
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
  formTitle: 'Request a Demo',
  formSubtitle:
    'Discuss your requirements with Digital One Box — Blockchain Development, Tokenization & Fintech Solutions. Tokenization, collateral eligibility and lending availability depend on asset verification, applicable regulations and platform configuration.',
  ctaTitle: 'Build Your RWA Lending Ecosystem',
  ctaText:
    'Bring asset tokenization, collateral management and digital lending workflows together in one configurable platform. Request a demo or discuss your requirements. This description is for informational and product-demonstration purposes only — it does not constitute an offer of credit, investment advice, or a guarantee of lending availability or returns.',
  updatedAt: now,
}

async function main() {
  const email = process.argv[2] || env.VITE_ADMIN_EMAIL
  const password = process.argv[3] || env.VITE_ADMIN_PASSWORD
  if (!email || !password) {
    console.error('Usage: node scripts/seed-rwa-landing.mjs <admin-email> <admin-password>')
    console.error('Or set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD in .env.local')
    process.exit(1)
  }

  await signInWithEmailAndPassword(getAuth(app), email, password)
  await set(ref(db, `categories/${category.id}`), category)
  await set(ref(db, `demos/${demo.id}`), demo)
  await set(ref(db, `landings/${landing.id}`), landing)

  const snap = await get(ref(db, `landings/${landing.id}`))
  console.log(
    snap.exists()
      ? `OK: landing seeded → /products/${landing.slug}`
      : 'FAILED: landing not found after write',
  )
  process.exit(snap.exists() ? 0 : 1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
