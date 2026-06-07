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
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'le-crown-vagamon',
    title: 'Le Crown Vagamon',
    client: 'Le Crown Vagamon',
    tags: ['Le Crown Vagamon', 'Resorts & Hospitality'],
    image: '/Images/Lecrown.png',
    heroImage: '/Images/Lecrown.png',
    challenge: 'While Le Crown Vagamon offered an exceptional luxury experience, their digital presence did not reflect the calibre of their property. Inconsistent branding across platforms, low social engagement, and a lack of compelling visual content meant that potential guests were not getting the full picture of what Le Crown had to offer.',
    approach: 'Our solution was to build a comprehensive communication strategy rooted in authentic storytelling. We immersed ourselves in the Le Crown experience — understanding what made it unique — and used that insight to craft a brand narrative that would resonate deeply with their target audience of discerning travellers.',
    solution: [
      'Complete brand identity overhaul including logo refinement and visual guidelines',
      'Professional photography and videography capturing the property\'s ambience',
      'Multi-platform social media campaigns targeting high-intent travellers',
      'Content calendar with consistent publishing cadence',
      'Influencer collaboration strategy for organic reach amplification',
      'Performance marketing campaigns optimised for bookings and enquiries'
    ],
    results: [
      { metric: '+180%', label: 'Increase in Brand Awareness' },
      { metric: '3.2x', label: 'Growth in Social Reach' },
      { metric: '+250K', label: 'New Audience Reached' },
      { metric: '87%', label: 'Improved Brand Recall' }
    ]
  },
  {
    slug: 'takemyfamily-growth',
    title: 'TakeMyFamily',
    client: 'TakeMyFamily',
    tags: ['TakeMyFamily', 'Travel & Lifestyle'],
    image: '/Images/Take my family.png',
    heroImage: '/Images/Take my family.png',
    challenge: 'TakeMyFamily needed to differentiate itself in a crowded family travel market and convert casual social media followers into active platform users. Their existing content lacked a clear brand voice and struggled to drive meaningful engagement.',
    approach: 'We developed a content-first strategy centred on relatable family travel stories. By identifying the emotional triggers that motivate families to plan trips, we built a content ecosystem that educated, inspired, and converted at each stage of the journey.',
    solution: [
      'Brand voice and content strategy development',
      'Series of family travel inspiration campaigns',
      'Platform UI/UX redesign for improved user experience',
      'SEO-optimised blog content targeting family travel keywords',
      'Community-building initiatives and user-generated content campaigns',
      'Email nurture sequences for lead conversion'
    ],
    results: [
      { metric: '+220%', label: 'Increase in User Signups' },
      { metric: '4.1x', label: 'Engagement Rate Growth' },
      { metric: '+180K', label: 'Organic Reach per Month' },
      { metric: '65%', label: 'Reduction in Bounce Rate' }
    ]
  },
  {
    slug: 'pinklabel-launch',
    title: 'Pinklabel Launch Campaign',
    client: 'Pinklabel',
    tags: ['Pinklabel', 'Fashion & Lifestyle'],
    image: '/Images/Pinklabel.jpg',
    heroImage: '/Images/Pinklabel.jpg',
    challenge: 'Pinklabel was entering a highly competitive fashion market and needed a launch strategy that would immediately establish brand recognition and drive sales from day one. With no existing audience, the challenge was to build credibility and desirability simultaneously.',
    approach: 'We designed a phased launch strategy combining high-impact video content with precision-targeted digital advertising. The goal was to create buzz before launch and sustain momentum through conversion-optimised campaigns post-launch.',
    solution: [
      'Pre-launch teaser video campaign across Instagram and YouTube',
      'Influencer seeding programme with fashion micro-influencers',
      'Brand film production showcasing product aesthetic and lifestyle',
      'Meta and Google Ads campaigns optimised for ROAS',
      'Retargeting sequences to convert window shoppers',
      'Monthly performance reporting and optimisation cycles'
    ],
    results: [
      { metric: '₹12L+', label: 'Revenue in Launch Month' },
      { metric: '5.8x', label: 'Return on Ad Spend' },
      { metric: '+95K', label: 'Instagram Followers in 90 Days' },
      { metric: '42%', label: 'Repeat Purchase Rate' }
    ]
  },
  {
    slug: 'tab-brand-identity',
    title: 'TAB Brand Identity',
    client: 'TAB',
    tags: ['TAB', 'Corporate & B2B'],
    image: '/Images/TAB.png',
    heroImage: '/Images/TAB.png',
    challenge: 'TAB required a brand identity that communicated authority and innovation in equal measure. Their existing visual identity was outdated and did not reflect the company\'s growth trajectory or premium positioning.',
    approach: 'We undertook a comprehensive brand audit before designing a new identity system. Every element — from typography to colour palette to spatial layout — was chosen to signal TAB\'s position as an industry leader.',
    solution: [
      'Brand audit and competitive positioning analysis',
      'Logo redesign with full brand mark system',
      'Custom typography and colour palette development',
      'Brand guidelines document covering all use cases',
      'Website redesign aligned to the new identity',
      'Marketing collateral templates for the sales team'
    ],
    results: [
      { metric: '+140%', label: 'Increase in Inbound Enquiries' },
      { metric: '3x', label: 'Improvement in Pitch Success Rate' },
      { metric: '+60%', label: 'Website Traffic Growth' },
      { metric: '92%', label: 'Client Satisfaction Score' }
    ]
  }
]
