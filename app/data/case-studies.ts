export interface CaseStudyResult {
  metric: string
  label: string
}

export interface CaseStudy {
  slug: string
  title: string
  client: string
  tags: string[]
  image: string
  heroImage: string
  challenge: string
  approach: string
  solution: string[]
  results: CaseStudyResult[]
  category?: string
  tagline?: string
  services?: string
  industry?: string
  date?: string
  challengeParagraphs?: string[]
  approachParagraphs?: string[]
  resultsSummary?: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'le-crown-vagamon',
    title: 'Le Crown Vagamon',
    client: 'Le Crown Vagamon',
    tags: ['Le Crown Vagamon', 'Resorts & Hospitality'],
    image: '/Images/Lecrown.png',
    heroImage: '/Images/Lecrown.png',
    category: 'Branding',
    tagline: 'Luxury Hospitality Branding & Marketing',
    services: 'Branding, Designing, Video Production, Marketing',
    industry: 'Resorts & Hospitality',
    date: 'June, 2026',
    challenge: 'While Le Crown Vagamon offered an exceptional 4-star physical experience nestled in the hills, their visual identity did not fully capture that high-end reality. The primary challenge was bridging the gap between their on-site luxury and their off-site digital perception.',
    challengeParagraphs: [
      'While Le Crown Vagamon offered an exceptional 4-star physical experience nestled in the hills, their visual identity did not fully capture that high-end reality. The primary challenge was bridging the gap between their on-site luxury and their off-site digital perception.',
      'In a saturated and highly competitive tourism market, simply having great amenities isn\'t enough; the brand needed to instantly project exclusivity, comfort, and premium hospitality. To achieve this, they required a complete identity overhaul that ensured a seamless, premium feel across every touchpoint—whether a guest was scrolling through a social media campaign, browsing the website, or reading a physical brochure.'
    ],
    approach: 'Our solution was to architect a brand communication strategy rooted in immersive storytelling and visual elegance. We wanted potential guests to feel the tranquility and luxury of the resort before they even booked a room.',
    approachParagraphs: [
      'Our solution was to architect a brand communication strategy rooted in immersive storytelling and visual elegance. We wanted potential guests to feel the tranquility and luxury of the resort before they even booked a room. To achieve this, we audited and redesigned the brand\'s entire visual ecosystem.',
      'By blending sophisticated, high-end design elements with stunning visual assets that capture the breathtaking natural landscape of Vagamon, we ensured that every single touchpoint—from digital ads to physical collateral—delivered a cohesive, premium guest experience.'
    ],
    solution: [
      'Brand identity development',
      'Social media creatives',
      'Advertising materials',
      'Promotional campaigns',
      'Professional photography & videography',
      'Digital marketing assets'
    ],
    results: [
      { metric: '+180%', label: 'Increase in Brand Awareness' },
      { metric: '3.2x', label: 'Growth in Social Reach' },
      { metric: '+250K', label: 'New Audience Reached' },
      { metric: '87%', label: 'Improved Brand Recall' }
    ],
    resultsSummary: 'The project established a cohesive and recognizable visual identity that strengthened Le Crown\'s premium positioning and enhanced its appeal among travelers seeking luxury experiences.'
  },
  {
    slug: 'takemyfamily-growth',
    title: 'TakeMyFamily',
    client: 'TakeMyFamily',
    tags: ['TakeMyFamily', 'Tourism & Hospitality'],
    image: '/Images/Take my family.png',
    heroImage: '/Images/Take my family.png',
    category: 'Marketing',
    tagline: 'Family Travel Brand Growth & Digital Marketing',
    services: 'Designing, Video Production, Marketing',
    industry: 'Tourism & Hospitality',
    date: 'June, 2026',
    challenge: 'TakeMyFamily needed to differentiate itself in a crowded family travel market and convert casual social media followers into active platform users. Their existing content lacked a clear brand voice and struggled to drive meaningful engagement.',
    challengeParagraphs: [
      'TakeMyFamily needed to differentiate itself in a crowded family travel market and convert casual social media followers into active platform users. Their existing content lacked a clear brand voice and struggled to drive meaningful engagement.',
      'The platform needed to resonate with families at an emotional level — inspiring them to plan trips and trust TakeMyFamily with their most precious moments together.'
    ],
    approach: 'We developed a content-first strategy centred on relatable family travel stories. By identifying the emotional triggers that motivate families to plan trips, we built a content ecosystem that educated, inspired, and converted at each stage of the journey.',
    approachParagraphs: [
      'We developed a content-first strategy centred on relatable family travel stories. By identifying the emotional triggers that motivate families to plan trips, we built a content ecosystem that educated, inspired, and converted at each stage of the journey.',
      'From creative designing and visual communication to targeted campaigns and professional video production, every asset was crafted to strengthen the brand\'s connection with its audience.'
    ],
    solution: [
      'Brand voice and content strategy development',
      'Family travel inspiration campaigns',
      'Creative designing and visual communication',
      'Professional video production',
      'SEO-optimised content targeting family travel keywords',
      'Community-building and user-generated content campaigns'
    ],
    results: [
      { metric: '+220%', label: 'Increase in User Signups' },
      { metric: '4.1x', label: 'Engagement Rate Growth' },
      { metric: '+180K', label: 'Organic Reach per Month' },
      { metric: '65%', label: 'Reduction in Bounce Rate' }
    ],
    resultsSummary: 'The campaign significantly elevated TakeMyFamily\'s brand presence and drove meaningful growth across all key digital metrics, helping the brand connect with families across India.'
  },
  {
    slug: 'pinklabel-launch',
    title: 'Pinklabel Launch Campaign',
    client: 'Pinklabel',
    tags: ['Pinklabel', 'Fashion Brand'],
    image: '/Images/Pinklabel.jpg',
    heroImage: '/Images/Pinklabel.jpg',
    category: 'Video Production',
    tagline: 'Fashion Brand Launch & Video Production Campaign',
    services: 'Designing, Video Production, Marketing',
    industry: 'Fashion Brand',
    date: 'June, 2026',
    challenge: 'Pinklabel was entering a highly competitive fashion market and needed a launch strategy that would immediately establish brand recognition and drive sales from day one.',
    challengeParagraphs: [
      'Pinklabel was entering a highly competitive fashion market and needed a launch strategy that would immediately establish brand recognition and drive sales from day one.',
      'With no existing audience, the challenge was to build credibility and desirability simultaneously while creating a distinctive visual identity that stood apart in the crowded ethnic wear market.'
    ],
    approach: 'We designed a phased launch strategy combining high-impact video content with precision-targeted digital advertising.',
    approachParagraphs: [
      'We designed a phased launch strategy combining high-impact video content with precision-targeted digital advertising. The goal was to create buzz before launch and sustain momentum through conversion-optimised campaigns post-launch.',
      'Through creative design solutions and strategic marketing initiatives, we developed engaging brand experiences that showcased the craftsmanship and elegance of the Pinklabel collection.'
    ],
    solution: [
      'Pre-launch teaser video campaign across Instagram and YouTube',
      'Influencer seeding programme with fashion micro-influencers',
      'Brand film production showcasing product aesthetic',
      'Social media creatives and promotional campaigns',
      'Meta and Google Ads campaigns optimised for ROAS',
      'Monthly performance reporting and optimisation cycles'
    ],
    results: [
      { metric: '₹12L+', label: 'Revenue in Launch Month' },
      { metric: '5.8x', label: 'Return on Ad Spend' },
      { metric: '+95K', label: 'Instagram Followers in 90 Days' },
      { metric: '42%', label: 'Repeat Purchase Rate' }
    ],
    resultsSummary: 'The launch campaign exceeded all targets, establishing Pinklabel as a recognizable name in the ethnic fashion space and driving strong first-month revenue.'
  },
  {
    slug: 'tab-brand-identity',
    title: 'TAB Brand Identity',
    client: 'TAB',
    tags: ['TAB', 'Study Abroad & Immigration'],
    image: '/Images/TAB.png',
    heroImage: '/Images/TAB.png',
    category: 'Branding',
    tagline: 'Brand Identity & Website Design for Education Consultancy',
    services: 'Branding, Designing, Video Production, Marketing',
    industry: 'Study Abroad, Immigration, Recruitment',
    date: 'June, 2026',
    challenge: 'TAB required a brand identity that communicated authority and innovation in equal measure. Their existing visual identity was outdated and did not reflect the company\'s growth trajectory or premium positioning.',
    challengeParagraphs: [
      'TAB required a brand identity that communicated authority and innovation in equal measure. Their existing visual identity was outdated and did not reflect the company\'s growth trajectory or premium positioning.',
      'As a leading consultancy helping students and professionals pursue global opportunities, TAB needed to project professionalism and trust across every touchpoint to remain competitive in an increasingly crowded market.'
    ],
    approach: 'We undertook a comprehensive brand audit before designing a new identity system. Every element — from typography to colour palette to spatial layout — was chosen to signal TAB\'s position as an industry leader.',
    approachParagraphs: [
      'We undertook a comprehensive brand audit before designing a new identity system. Every element — from typography to colour palette to spatial layout — was chosen to signal TAB\'s position as an industry leader.',
      'From brand development and creative design to video production and strategic marketing, we created a cohesive visual and communication system that reflects the company\'s professionalism, trust, and global outlook.'
    ],
    solution: [
      'Brand audit and competitive positioning analysis',
      'Logo redesign with full brand mark system',
      'Custom typography and colour palette development',
      'Brand guidelines document covering all use cases',
      'Website redesign aligned to the new identity',
      'Marketing collateral and promotional campaign templates'
    ],
    results: [
      { metric: '+140%', label: 'Increase in Inbound Enquiries' },
      { metric: '3x', label: 'Improvement in Pitch Success Rate' },
      { metric: '+60%', label: 'Website Traffic Growth' },
      { metric: '92%', label: 'Client Satisfaction Score' }
    ],
    resultsSummary: 'The rebrand transformed TAB\'s market perception and directly contributed to a significant increase in inbound enquiries and conversion rates across all channels.'
  }
]
