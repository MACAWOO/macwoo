export interface PortfolioProject {
  slug: string
  title: string
  subtitle: string
  tags: string[]
  category: 'Branding' | 'Marketing' | 'Video Production'
  image: string
  heroImage: string
  galleryImages: string[]
  story: string
}

export const projects: PortfolioProject[] = [
  {
    slug: 'lecrown',
    title: 'Lecrown',
    subtitle: 'Branding & Marketing',
    tags: ['Branding', 'Designing', 'Video Production', 'Marketing'],
    category: 'Branding',
    image: '/Images/Lecrown.png',
    heroImage: '/Images/Lecrown.png',
    galleryImages: ['/Images/Lecrown- 1.png', '/Images/Lecrown.png'],
    story: 'Le Crown Vagamon is a five-star hotel nestled in the scenic hills of Vagamon, offering a perfect blend of luxury, comfort, and nature. Our collaboration with Le Crown focused on building a strong and consistent brand presence across both digital and offline platforms. We crafted a comprehensive visual identity that reflects the hotel\'s elegance and hospitality. Through strategic storytelling, engaging content, and professional photography, we helped position Le Crown as a distinguished destination for travellers seeking an exceptional stay experience.'
  },
  {
    slug: 'takemyfamily',
    title: 'TakeMyFamily',
    subtitle: 'Digital Marketing & Designing',
    tags: ['Digital Marketing', 'Designing'],
    category: 'Marketing',
    image: '/Images/Take my family.png',
    heroImage: '/Images/Take my family.png',
    galleryImages: ['/Images/Take My Familt - 1.png', '/Images/Take my family.png'],
    story: 'TakeMyFamily is a family travel platform connecting travellers with curated family-friendly experiences. We partnered with them to build a vibrant digital presence that speaks directly to families planning their next adventure. Our work spanned social media strategy, content creation, and UI/UX design — crafting a warm, trustworthy brand voice that resonated with their audience and drove meaningful engagement across all platforms.'
  },
  {
    slug: 'pinklabel',
    title: 'Pinklabel',
    subtitle: 'Video Production & Digital Marketing',
    tags: ['Video Production', 'Digital Marketing'],
    category: 'Video Production',
    image: '/Images/Pinklabel.jpg',
    heroImage: '/Images/Pinklabel.jpg',
    galleryImages: ['/Images/Pinklabel.jpg'],
    story: 'Pinklabel is a fashion-forward brand that needed a strong digital identity and compelling video content to stand out in a crowded market. We produced a series of high-quality brand films and reels that captured the essence of their aesthetic. Combined with a targeted digital marketing strategy, we helped Pinklabel grow their online audience and strengthen their brand recall among fashion-conscious consumers.'
  },
  {
    slug: 'tab',
    title: 'TAB',
    subtitle: 'Website Designing & Branding',
    tags: ['Website Designing', 'Branding'],
    category: 'Branding',
    image: '/Images/TAB.png',
    heroImage: '/Images/TAB.png',
    galleryImages: ['/Images/Tab - 1.png', '/Images/TAB.png'],
    story: 'TAB required a premium digital presence that communicated their brand values at a glance. We designed a sleek, modern website paired with a refined brand identity system — from logo and colour palette to typography and visual guidelines. The result was a cohesive brand experience that elevated TAB\'s positioning and gave their audience a clear, memorable impression of who they are and what they stand for.'
  }
]
