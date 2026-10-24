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
  id: 'token-development',
  label: 'Token Development',
  shortLabel: 'Token Dev',
  accent: 'cyan',
  description: 'ERC-20, BEP-20, TRC-20, meme coins, vesting, and launchpad services.',
}

const demo = {
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
}

const landing = {
  id: 'landing-token-development',
  slug: 'token-development',
  demoId: 'demo-token-development',
  active: true,
  brandLabel: 'Digital One Box Pvt. Ltd.',
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
  highlightsTitle: 'Product Highlights',
  highlights: [
    'Source-code ownership on delivery',
    'Audit-friendly contract structure',
    'Tokenomics consultation included',
    'Admin tools for mint / vesting / sales',
    'White-label branding support',
    'Post-launch upgrade path',
  ],
  suitableTitle: 'Ideal For',
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
  demoSectionTitle: 'Product screenshots & videos',
  demoSectionSubtitle: '',
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
  whyUsTitle: 'Why choose Digital One Box?',
  whyUs: [
    'Dedicated blockchain development team',
    'Clean, maintainable contract architecture',
    'Transparent timelines and milestones',
    'Affordable packaging with upgrade paths',
    'Secure development practices',
    'Long-term support & customization',
  ],
  faqsTitle: 'FAQ',
  faqsSubtitle: 'Answers buyers usually ask before booking a demo.',
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
  formTitle: 'Get a Free Demo Access',
  formSubtitle: 'Tell us about your project and our team will share credentials and next steps.',
  ctaTitle: 'Launch your token with Digital One Box',
  ctaText:
    'Share your chain, supply model, and launch timeline. We will recommend the right token package and demo path.',
  updatedAt: now,
}

async function main() {
  const email = process.argv[2] || env.VITE_ADMIN_EMAIL
  const password = process.argv[3] || env.VITE_ADMIN_PASSWORD
  if (!email || !password) {
    console.error('Usage: node scripts/seed-token-landing.mjs <admin-email> <admin-password>')
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
