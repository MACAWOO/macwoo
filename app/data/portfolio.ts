export interface PortfolioProject {
  slug: string
  title: string
  subtitle: string
  tags: string[]
  category: string
  image: string
  heroImage: string
  galleryImages: string[]
  story: string
  tagline?: string
  services?: string
  industry?: string
  date?: string
  storyParagraphs?: string[]
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
    galleryImages: ['/Images/Lecrown-_1.png', '/Images/Lecrown.png'],
    story: 'Le Crown Vagamon is a five-star hotel nestled in the scenic hills of Vagamon, offering a perfect blend of luxury, comfort, and nature. Our collaboration with Le Crown focused on building a strong and consistent brand presence across both digital and offline platforms. We crafted a comprehensive visual identity that reflects the hotel\'s elegance and hospitality. Through strategic storytelling, engaging content, and professional photography, we helped position Le Crown as a distinguished destination for travellers seeking an exceptional stay experience.',
    tagline: 'A comprehensive brand transformation for a 4-star mountain resort, blending luxury hospitality with cinematic storytelling.',
    services: 'Branding, Designing, Video Production, Marketing',
    industry: 'Resorts & Hospitality',
    date: 'June, 2026',
    storyParagraphs: [
      'Le Crown Vagamon is a premium 4-star hotel nestled in the scenic hills of Vagamon, offering guests a perfect blend of luxury, comfort, and nature. Our collaboration with Le Crown focused on building a strong and consistent brand presence across both digital and offline platforms. From branding and creative design to marketing campaigns, advertising materials, and professional video production, we developed a comprehensive visual identity that reflects the hotel\'s elegance and hospitality. Through strategic storytelling, engaging content, and high-quality creative assets, we helped position Le Crown as a distinguished destination for travelers seeking an exceptional stay experience in Vagamon.'
    ]
  },
  {
    slug: 'takemyfamily',
    title: 'TakeMyFamily',
    subtitle: 'Digital Marketing & Designing',
    tags: ['Digital Marketing', 'Designing'],
    category: 'Marketing',
    image: '/Images/Take_my_family.png',
    heroImage: '/Images/Take_my_family.png',
    galleryImages: ['/Images/Take_My_Familt_-_1.png', '/Images/Take_my_family.png'],
    story: 'TakeMyFamily is a family travel platform connecting travellers with curated family-friendly experiences. We partnered with them to build a vibrant digital presence that speaks directly to families planning their next adventure. Our work spanned social media strategy, content creation, and UI/UX design — crafting a warm, trustworthy brand voice that resonated with their audience and drove meaningful engagement across all platforms.',
    tagline: 'Elevating a family-centric travel brand through strategic design, digital marketing, and compelling storytelling.',
    services: 'Designing, Video Production, Marketing',
    industry: 'Tourism & Hospitality',
    date: 'June, 2026',
    storyParagraphs: [
      'Take My Family Holidays is a travel and tourism brand dedicated to creating memorable holiday experiences for families and senior citizens. With a strong focus on comfort, care, and personalized travel planning, the brand offers thoughtfully curated tour packages designed to bring loved ones closer through meaningful travel experiences.',
      'Our partnership with Take My Family Holidays focused on strengthening the brand\'s presence across digital and marketing channels. From creative designing and visual communication to promotional campaigns and professional video production, we developed engaging brand assets that effectively showcase the company\'s travel experiences and customer-centric approach. Through strategic marketing initiatives and compelling storytelling, we helped elevate the brand\'s visibility, inspire traveler confidence, and create a stronger connection with its target audience.'
    ]
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
    story: 'Pinklabel is a fashion-forward brand that needed a strong digital identity and compelling video content to stand out in a crowded market. We produced a series of high-quality brand films and reels that captured the essence of their aesthetic. Combined with a targeted digital marketing strategy, we helped Pinklabel grow their online audience and strengthen their brand recall among fashion-conscious consumers.',
    tagline: 'Enhancing the visual presence of a premier bridal and festive fashion brand to showcase timeless craftsmanship and modern style.',
    services: 'Designing, Video Production, Marketing',
    industry: 'Fashion Brand',
    date: 'June, 2026',
    storyParagraphs: [
      'Pink Label is a contemporary fashion brand that celebrates the elegance and timeless beauty of Indian ethnic wear. Specializing in bridal sarees, festive collections, and occasion wear, the brand combines traditional craftsmanship with modern style to create pieces that make every moment memorable.',
      'Our collaboration with Pink Label focused on enhancing the brand\'s visual presence and strengthening its connection with fashion-conscious audiences. Through creative design solutions, high-quality video production, and strategic marketing initiatives, we developed engaging brand experiences that showcased the craftsmanship, elegance, and uniqueness of the collection. From promotional campaigns and social media creatives to compelling visual storytelling, every touchpoint was designed to elevate brand perception and drive audience engagement.'
    ]
  },
  {
    slug: 'tab',
    title: 'TAB',
    subtitle: 'Website Designing & Branding',
    tags: ['Website Designing', 'Branding'],
    category: 'Branding',
    image: '/Images/TAB.png',
    heroImage: '/Images/TAB.png',
    galleryImages: ['/Images/Tab_-_1.png', '/Images/TAB.png'],
    story: 'TAB required a premium digital presence that communicated their brand values at a glance. We designed a sleek, modern website paired with a refined brand identity system — from logo and colour palette to typography and visual guidelines. The result was a cohesive brand experience that elevated TAB\'s positioning and gave their audience a clear, memorable impression of who they are and what they stand for.',
    tagline: 'Building a strong, recognizable brand presence for a leading overseas education and immigration consultancy through strategic design and marketing.',
    services: 'Branding, Designing, Video Production, Marketing',
    industry: 'Study Abroad, Immigration, Recruitment',
    date: 'June, 2026',
    storyParagraphs: [
      'TAB is a leading overseas education, immigration, and recruitment consultancy committed to helping students and professionals achieve their global aspirations. With expert guidance, personalized support, and a wide network of international opportunities, TAB assists clients in navigating their journey toward education, career growth, and migration abroad.',
      'Our collaboration with TAB focused on building a strong and recognizable brand presence across multiple touchpoints. From brand development and creative design to video production and strategic marketing, we created a cohesive visual and communication system that reflects the company\'s professionalism, trust, and global outlook. Through engaging content, impactful campaigns, and high-quality creative assets, we helped strengthen TAB\'s market presence and connect effectively with students, job seekers, and aspiring migrants.'
    ]
  }
]
