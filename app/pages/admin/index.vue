<script setup lang="ts">
import type { BlogPost } from '~/data/blog'

definePageMeta({
  middleware: 'admin-auth'
})

const { user, init, signOut } = useAuth()

onMounted(() => {
  init()
})

const handleSignOut = async () => {
  await signOut()
  useRouter().push('/admin/login')
}

// Dynamic state composables
const { posts: blogs, addPost, updatePost, deletePost, resetBlogs } = useBlogs()
const { projects: portfolio, addProject, updateProject, deleteProject, resetPortfolio } = usePortfolio()
const { jobs: careers, addJob, updateJob, deleteJob, resetCareers } = useCareers()
const { caseStudies, addCaseStudy, updateCaseStudy, deleteCaseStudy, resetCaseStudies } = useCaseStudies()
const { settings, updateSettings, resetSettings } = usePageSettings()
const { categories, addCategory, deleteCategory, resetCategories } = useCategories()

const newCategory = ref('')
function submitCategory() {
  const value = newCategory.value.trim()
  if (!value) return
  addCategory(value)
  logAction('add', 'Category', value)
  newCategory.value = ''
}

useSeoMeta({
  title: 'Site Administration — Macawoo',
  description: 'Control center for updating Macawoo content.',
  robots: 'noindex, nofollow'
})

// Navigation & SPA view states
type View = 'dashboard' | 'list' | 'change'
type ModelType = 'blog' | 'portfolio' | 'case-study' | 'career' | 'page-settings' | 'uploads' | 'categories'

const currentView = ref<View>('dashboard')
const currentModel = ref<ModelType>('blog')
const currentId = ref<string | number | null>(null) // null for Add, slug/id for Edit

// Bulk selection
const selectedIds = ref<Record<string, boolean>>({})
const allSelected = ref(false)

// Bulk action selection
const selectedBulkAction = ref('')

// Search and filter states
const searchQueries = reactive({
  'blog': '',
  'portfolio': '',
  'case-study': '',
  'career': '',
  'page-settings': '',
  'uploads': '',
  'categories': ''
})

const activeFilters = reactive({
  portfolioCategory: 'All', // 'All' | 'Branding' | 'Marketing' | 'Video Production'
  portfolioFeatured: 'All', // 'All' | 'Featured' | 'Not Featured'
  blogYear: 'All', // 'All' | '2026' | '2025'
  careerDepartment: 'All' // 'All' | 'Design' | 'Marketing'
})

// Table sorting states
const sortKeys = reactive({
  'blog': 'date',
  'portfolio': 'displayOrder',
  'case-study': 'title',
  'career': 'title',
  'page-settings': '',
  'uploads': '',
  'categories': ''
})

const sortOrders = reactive({
  'blog': 'desc',
  'portfolio': 'asc',
  'case-study': 'asc',
  'career': 'asc',
  'page-settings': 'asc',
  'uploads': 'asc',
  'categories': 'asc'
})

// Recent actions log
interface RecentAction {
  time: string
  action: 'add' | 'change' | 'delete'
  model: string
  name: string
}
const recentActions = ref<RecentAction[]>([])

const logAction = (action: 'add' | 'change' | 'delete', modelName: string, itemName: string) => {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  recentActions.value.unshift({ time, action, model: modelName, name: itemName })
  if (recentActions.value.length > 15) {
    recentActions.value.pop()
  }
}

// Template images for selection
const templateImages = [
  { label: 'Branding & Design Cover', value: '/Images/Branding.jpeg' },
  { label: 'Designing Hero', value: '/Images/Designing.jpeg' },
  { label: 'Digital Marketing Cover', value: '/Images/Digital_Marketing.jpeg' },
  { label: 'Marketing Cover', value: '/Images/Marketing.jpeg' },
  { label: 'Video Production Cover', value: '/Images/Video_Production.jpeg' },
  { label: 'Lecrown Project', value: '/Images/Lecrown.png' },
  { label: 'Pinklabel Project', value: '/Images/Pinklabel.jpg' },
  { label: 'TAB Project', value: '/Images/TAB.png' },
  { label: 'Take My Family Project', value: '/Images/Take_my_family.png' },
  { label: 'Hero Graphic', value: '/Images/hero.png' }
]

// Slug helper
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// Form models
const settingsForm = ref({
  indexHeroImage: '',
  indexHeroVideo: '',
  aboutHeroImage: '',
  aboutHeroVideo: '',
  blogHeroImage: '',
  blogHeroVideo: '',
  servicesBrandingImage: '',
  servicesMarketingImage: '',
  servicesVideoImage: '',
  careersHeroImage: '',
  careersHeroVideo: '',
  contactHeroImage: '',
  contactHeroVideo: ''
})

const blogForm = ref({
  title: '',
  slug: '',
  excerpt: '',
  date: '',
  readTime: '5 Min Read',
  image: '/Images/Branding.jpeg',
  body: [] as { heading?: string, content: string }[]
})

const portfolioForm = ref({
  title: '',
  slug: '',
  subtitle: '',
  category: 'Branding' as string,
  tagsString: '',
  image: '/Images/Lecrown.png',
  heroImage: '/Images/Lecrown.png',
  galleryImages: [] as string[],
  story: '',
  featured: true,
  displayOrder: 1,
  tagline: '',
  services: '',
  industry: '',
  date: '',
  storyParagraphs: [] as string[]
})

const caseStudyForm = ref({
  title: '',
  slug: '',
  client: '',
  category: '',
  tagsString: '',
  image: '/Images/Lecrown.png',
  heroImage: '/Images/Lecrown.png',
  challenge: '',
  approach: '',
  solution: [] as string[],
  results: [] as { metric: string, label: string }[],
  tagline: '',
  services: '',
  industry: '',
  date: '',
  challengeParagraphs: [] as string[],
  approachParagraphs: [] as string[],
  resultsSummary: ''
})

const careerForm = ref({
  id: '',
  title: 'Senior UI/UX Designer',
  department: 'Design',
  location: 'Kochi',
  type: 'Full-Time',
  experience: '4+ Years Experience',
  applyUrl: ''
})

// Media Picker integration states
const isMediaPickerOpen = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const activeFieldRef = ref<{ obj: any, key: string } | null>(null)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openMediaPicker = (obj: any, key: string) => {
  activeFieldRef.value = { obj, key }
  isMediaPickerOpen.value = true
}

const handleMediaSelect = (url: string) => {
  if (activeFieldRef.value) {
    const { obj, key } = activeFieldRef.value
    obj[key] = url
  }
  isMediaPickerOpen.value = false
  activeFieldRef.value = null
}

// Watchers for slug generation
watch(() => blogForm.value.title, (newTitle) => {
  if (currentId.value === null) {
    blogForm.value.slug = generateSlug(newTitle)
  }
})
watch(() => portfolioForm.value.title, (newTitle) => {
  if (currentId.value === null) {
    portfolioForm.value.slug = generateSlug(newTitle)
  }
})
watch(() => caseStudyForm.value.title, (newTitle) => {
  if (currentId.value === null) {
    caseStudyForm.value.slug = generateSlug(newTitle)
  }
})

// Navigation actions
const navigateTo = (view: View, model: ModelType | null = null, id: string | number | null = null) => {
  if (model === 'page-settings') {
    currentView.value = 'change'
    currentModel.value = 'page-settings'
    currentId.value = 'global'
    settingsForm.value = { ...settings.value }
    return
  }
  currentView.value = view
  if (model) currentModel.value = model
  currentId.value = id
  selectedIds.value = {}
  allSelected.value = false
  selectedBulkAction.value = ''
}

const openAddForm = (model: ModelType) => {
  currentModel.value = model
  currentId.value = null
  currentView.value = 'change'

  if (model === 'blog') {
    blogForm.value = {
      title: '',
      slug: '',
      excerpt: '',
      date: new Date().toISOString().split('T')[0] || '',
      readTime: '5 Min Read',
      image: '/Images/Branding.jpeg',
      body: [{ heading: 'Introduction', content: '' }]
    }
  } else if (model === 'portfolio') {
    portfolioForm.value = {
      title: '',
      slug: '',
      subtitle: '',
      category: categories.value[0] || '',
      tagsString: '',
      image: '/Images/Lecrown.png',
      heroImage: '/Images/Lecrown.png',
      galleryImages: [] as string[],
      story: '',
      featured: true,
      displayOrder: portfolio.value.length + 1,
      tagline: '',
      services: '',
      industry: '',
      date: '',
      storyParagraphs: ['']
    }
  } else if (model === 'case-study') {
    caseStudyForm.value = {
      title: '',
      slug: '',
      client: '',
      category: categories.value[0] || '',
      tagsString: '',
      image: '/Images/Lecrown.png',
      heroImage: '/Images/Lecrown.png',
      challenge: '',
      approach: '',
      solution: [''],
      results: [{ metric: '', label: '' }],
      tagline: '',
      services: '',
      industry: '',
      date: '',
      challengeParagraphs: [''],
      approachParagraphs: [''],
      resultsSummary: ''
    }
  } else if (model === 'career') {
    careerForm.value = {
      id: String(Date.now()),
      title: '',
      department: 'Design',
      location: 'Kochi',
      type: 'Full-Time',
      experience: '',
      applyUrl: ''
    }
  }
}

const openEditForm = (model: ModelType, id: string | number) => {
  currentModel.value = model
  currentId.value = id
  currentView.value = 'change'

  if (model === 'page-settings') {
    settingsForm.value = { ...settings.value }
  } else if (model === 'blog') {
    const original = blogs.value.find(b => b.slug === id)
    if (original) {
      blogForm.value = JSON.parse(JSON.stringify(original))
    }
  } else if (model === 'portfolio') {
    const original = portfolio.value.find(p => p.slug === id)
    if (original) {
      portfolioForm.value = {
        ...JSON.parse(JSON.stringify(original)),
        tagsString: original.tags.join(', '),
        galleryImages: original.galleryImages ? [...original.galleryImages] : [],
        tagline: original.tagline || '',
        services: original.services || '',
        industry: original.industry || '',
        date: original.date || '',
        storyParagraphs: original.storyParagraphs ? [...original.storyParagraphs] : [original.story || '']
      }
    }
  } else if (model === 'case-study') {
    const original = caseStudies.value.find(c => c.slug === id)
    if (original) {
      caseStudyForm.value = {
        ...JSON.parse(JSON.stringify(original)),
        category: original.category || '',
        tagsString: original.tags.join(', '),
        tagline: original.tagline || '',
        services: original.services || '',
        industry: original.industry || '',
        date: original.date || '',
        challengeParagraphs: original.challengeParagraphs ? [...original.challengeParagraphs] : [original.challenge || ''],
        approachParagraphs: original.approachParagraphs ? [...original.approachParagraphs] : [original.approach || ''],
        resultsSummary: original.resultsSummary || ''
      }
    }
  } else if (model === 'career') {
    const original = careers.value.find(c => c.id === id)
    if (original) {
      careerForm.value = JSON.parse(JSON.stringify(original))
    }
  }
}

// Bulk selection check all
const toggleAllSelections = (list: { slug?: string, id?: string | number }[]) => {
  list.forEach((item) => {
    const id = currentModel.value === 'career' ? item.id! : item.slug!
    selectedIds.value[id] = allSelected.value
  })
}

// Sorting toggle
const toggleSort = (model: ModelType, key: string) => {
  if (sortKeys[model] === key) {
    sortOrders[model] = sortOrders[model] === 'asc' ? 'desc' : 'asc'
  } else {
    sortKeys[model] = key
    sortOrders[model] = 'asc'
  }
}

// CRUD Save Handlers
const handleSave = async (actionType: 'save' | 'save_and_add' | 'save_and_continue') => {
  const isCreate = currentId.value === null
  let loggedName = ''

  if (currentModel.value === 'page-settings') {
    await updateSettings(settingsForm.value)
    logAction('change', 'Page Settings', 'Updated page backgrounds and assets')
    alert('Page settings updated successfully.')
    navigateTo('dashboard')
    return
  }

  if (currentModel.value === 'blog') {
    loggedName = blogForm.value.title
    if (isCreate) {
      await addPost(blogForm.value as BlogPost)
      logAction('add', 'Blog post', loggedName)
    } else {
      await updatePost(currentId.value as string, blogForm.value as BlogPost)
      logAction('change', 'Blog post', loggedName)
    }
  } else if (currentModel.value === 'portfolio') {
    loggedName = portfolioForm.value.title
    const { tagsString, ...projectData } = portfolioForm.value
    const processedProject = {
      ...projectData,
      tags: tagsString.split(',').map(s => s.trim()).filter(Boolean),
      galleryImages: portfolioForm.value.galleryImages.map(s => s.trim()).filter(Boolean),
      storyParagraphs: portfolioForm.value.storyParagraphs.filter(Boolean)
    }

    if (isCreate) {
      await addProject(processedProject)
      logAction('add', 'Portfolio project', loggedName)
    } else {
      await updateProject(currentId.value as string, processedProject)
      logAction('change', 'Portfolio project', loggedName)
    }
  } else if (currentModel.value === 'case-study') {
    loggedName = caseStudyForm.value.title
    const { tagsString, ...studyData } = caseStudyForm.value
    const processedStudy = {
      ...studyData,
      tags: tagsString.split(',').map(s => s.trim()).filter(Boolean),
      solution: caseStudyForm.value.solution.filter(Boolean),
      results: caseStudyForm.value.results.filter(r => r.metric && r.label),
      challengeParagraphs: caseStudyForm.value.challengeParagraphs.filter(Boolean),
      approachParagraphs: caseStudyForm.value.approachParagraphs.filter(Boolean)
    }

    if (isCreate) {
      await addCaseStudy(processedStudy)
      logAction('add', 'Case study', loggedName)
    } else {
      await updateCaseStudy(currentId.value as string, processedStudy)
      logAction('change', 'Case study', loggedName)
    }
  } else if (currentModel.value === 'career') {
    loggedName = careerForm.value.title
    if (isCreate) {
      await addJob({ ...careerForm.value })
      logAction('add', 'Open role', loggedName)
    } else {
      await updateJob(currentId.value as string, { ...careerForm.value })
      logAction('change', 'Open role', loggedName)
    }
  }

  if (actionType === 'save') {
    navigateTo('list', currentModel.value)
  } else if (actionType === 'save_and_add') {
    openAddForm(currentModel.value)
  } else if (actionType === 'save_and_continue') {
    if (isCreate) {
      if (currentModel.value === 'blog') currentId.value = blogForm.value.slug
      else if (currentModel.value === 'portfolio') currentId.value = portfolioForm.value.slug
      else if (currentModel.value === 'case-study') currentId.value = caseStudyForm.value.slug
      else if (currentModel.value === 'career') currentId.value = careerForm.value.id
    }
    alert('Changes saved successfully. You may continue editing.')
  }
}

// Delete current item from Change Form
const deleteCurrentItem = async () => {
  if (!currentId.value) return
  if (confirm('Are you sure you want to delete this item?')) {
    let loggedName = ''
    if (currentModel.value === 'blog') {
      loggedName = blogForm.value.title
      await deletePost(currentId.value as string)
    } else if (currentModel.value === 'portfolio') {
      loggedName = portfolioForm.value.title
      await deleteProject(currentId.value as string)
    } else if (currentModel.value === 'case-study') {
      loggedName = caseStudyForm.value.title
      await deleteCaseStudy(currentId.value as string)
    } else if (currentModel.value === 'career') {
      loggedName = careerForm.value.title
      await deleteJob(currentId.value as string)
    }
    logAction('delete', currentModel.value, loggedName)
    navigateTo('list', currentModel.value)
  }
}

// Bulk actions executor
const executeBulkAction = async () => {
  if (selectedBulkAction.value === 'delete') {
    const idsToDelete = Object.keys(selectedIds.value).filter(id => selectedIds.value[id])
    if (idsToDelete.length === 0) {
      alert('No items selected.')
      return
    }
    if (confirm(`Are you sure you want to delete the ${idsToDelete.length} selected item(s)?`)) {
      await Promise.all(idsToDelete.map(async (id) => {
        if (currentModel.value === 'blog') {
          const item = blogs.value.find(b => b.slug === id)
          if (item) {
            await deletePost(id)
            logAction('delete', 'Blog post', item.title)
          }
        } else if (currentModel.value === 'portfolio') {
          const item = portfolio.value.find(p => p.slug === id)
          if (item) {
            await deleteProject(id)
            logAction('delete', 'Portfolio project', item.title)
          }
        } else if (currentModel.value === 'case-study') {
          const item = caseStudies.value.find(c => c.slug === id)
          if (item) {
            await deleteCaseStudy(id)
            logAction('delete', 'Case study', item.title)
          }
        } else if (currentModel.value === 'career') {
          const item = careers.value.find(c => c.id === id)
          if (item) {
            await deleteJob(id)
            logAction('delete', 'Open role', item.title)
          }
        }
      }))
      selectedIds.value = {}
      allSelected.value = false
      selectedBulkAction.value = ''
      alert('Selected items deleted successfully.')
    }
  }
}

// Helpers for nested elements in forms
const addBlogBodySection = () => {
  blogForm.value.body.push({ heading: '', content: '' })
}
const removeBlogBodySection = (idx: number) => {
  blogForm.value.body.splice(idx, 1)
}

const addPortfolioStoryParagraph = () => {
  portfolioForm.value.storyParagraphs.push('')
}
const removePortfolioStoryParagraph = (idx: number) => {
  portfolioForm.value.storyParagraphs.splice(idx, 1)
}

const addCaseStudyChallengeParagraph = () => {
  caseStudyForm.value.challengeParagraphs.push('')
}
const removeCaseStudyChallengeParagraph = (idx: number) => {
  caseStudyForm.value.challengeParagraphs.splice(idx, 1)
}

const addCaseStudyApproachParagraph = () => {
  caseStudyForm.value.approachParagraphs.push('')
}
const removeCaseStudyApproachParagraph = (idx: number) => {
  caseStudyForm.value.approachParagraphs.splice(idx, 1)
}

const addSolutionPoint = () => {
  caseStudyForm.value.solution.push('')
}
const removeSolutionPoint = (idx: number) => {
  caseStudyForm.value.solution.splice(idx, 1)
}

const addResultMetric = () => {
  caseStudyForm.value.results.push({ metric: '', label: '' })
}
const removeResultMetric = (idx: number) => {
  caseStudyForm.value.results.splice(idx, 1)
}

// Reset localStorage mock databases
const resetAllDynamicState = () => {
  if (confirm('Are you sure you want to discard all browser modifications and restore original static mock data?')) {
    resetBlogs()
    resetPortfolio()
    resetCareers()
    resetCaseStudies()
    resetSettings()
    resetCategories()
    logAction('change', 'Database', 'Reset all local storage mock records, page settings and categories')
    alert('Local data reset completed successfully.')
    navigateTo('dashboard')
  }
}

// Compute Breadcrumbs list
const breadcrumbs = computed(() => {
  const crumbs: { label: string, view: View, model: ModelType | null, id: string | number | null }[] = [
    { label: 'Home', view: 'dashboard', model: null, id: null }
  ]
  if (currentView.value === 'dashboard') {
    return crumbs
  }

  const modelLabels: Record<ModelType, string> = {
    'blog': 'Blogs',
    'portfolio': 'Portfolio',
    'case-study': 'Case Studies',
    'career': 'Careers',
    'page-settings': 'Page Settings',
    'uploads': 'Media Library',
    'categories': 'Categories'
  }

  crumbs.push({
    label: modelLabels[currentModel.value],
    view: 'list',
    model: currentModel.value,
    id: null
  })

  if (currentView.value === 'change') {
    const isEdit = currentId.value !== null
    let itemTitle = 'Add item'
    if (isEdit) {
      if (currentModel.value === 'page-settings') {
        itemTitle = 'Global settings'
      } else if (currentModel.value === 'blog') {
        itemTitle = blogs.value.find(b => b.slug === currentId.value)?.title || String(currentId.value)
      } else if (currentModel.value === 'portfolio') {
        itemTitle = portfolio.value.find(p => p.slug === currentId.value)?.title || String(currentId.value)
      } else if (currentModel.value === 'case-study') {
        itemTitle = caseStudies.value.find(c => c.slug === currentId.value)?.title || String(currentId.value)
      } else if (currentModel.value === 'career') {
        itemTitle = careers.value.find(c => c.id === currentId.value)?.title || String(currentId.value)
      }
    }
    crumbs.push({
      label: currentModel.value === 'page-settings' ? 'Configure settings' : (isEdit ? `Change: ${itemTitle}` : 'Add item'),
      view: 'change',
      model: currentModel.value,
      id: currentId.value
    })
  }

  return crumbs
})

// Filter & search compute listings
const filteredBlogs = computed(() => {
  let list = [...blogs.value]
  const q = searchQueries.blog.toLowerCase().trim()
  if (q) {
    list = list.filter(b => b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q))
  }
  if (activeFilters.blogYear !== 'All') {
    list = list.filter(b => b.date.startsWith(activeFilters.blogYear))
  }
  const key = sortKeys.blog
  const order = sortOrders.blog
  list.sort((a, b) => {
    const valA = String((a as unknown as Record<string, unknown>)[key] ?? '')
    const valB = String((b as unknown as Record<string, unknown>)[key] ?? '')
    return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
  })
  return list
})

const filteredPortfolio = computed(() => {
  let list = [...portfolio.value]
  const q = searchQueries.portfolio.toLowerCase().trim()
  if (q) {
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q))
  }
  if (activeFilters.portfolioCategory !== 'All') {
    list = list.filter(p => p.category === activeFilters.portfolioCategory)
  }
  if (activeFilters.portfolioFeatured !== 'All') {
    const feat = activeFilters.portfolioFeatured === 'Featured'
    list = list.filter(p => p.featured === feat)
  }
  const key = sortKeys.portfolio
  const order = sortOrders.portfolio
  list.sort((a, b) => {
    if (key === 'displayOrder') {
      const valA = a.displayOrder ?? 0
      const valB = b.displayOrder ?? 0
      return order === 'asc' ? valA - valB : valB - valA
    }
    const valA = String((a as unknown as Record<string, unknown>)[key] ?? '')
    const valB = String((b as unknown as Record<string, unknown>)[key] ?? '')
    return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
  })
  return list
})

const filteredCaseStudies = computed(() => {
  let list = [...caseStudies.value]
  const q = searchQueries['case-study'].toLowerCase().trim()
  if (q) {
    list = list.filter(c => c.title.toLowerCase().includes(q) || c.client.toLowerCase().includes(q))
  }
  const key = sortKeys['case-study']
  const order = sortOrders['case-study']
  list.sort((a, b) => {
    const valA = String((a as unknown as Record<string, unknown>)[key] ?? '')
    const valB = String((b as unknown as Record<string, unknown>)[key] ?? '')
    return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
  })
  return list
})

const filteredCareers = computed(() => {
  let list = [...careers.value]
  const q = searchQueries.career.toLowerCase().trim()
  if (q) {
    list = list.filter(c => c.title.toLowerCase().includes(q) || c.department.toLowerCase().includes(q) || c.location.toLowerCase().includes(q))
  }
  const key = sortKeys.career
  const order = sortOrders.career
  list.sort((a, b) => {
    const valA = String((a as unknown as Record<string, unknown>)[key] ?? '')
    const valB = String((b as unknown as Record<string, unknown>)[key] ?? '')
    return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
  })
  return list
})
</script>

<template>
  <div class="min-h-screen bg-[#f8f9fa] text-zinc-800 font-sans flex flex-col antialiased">
    <!-- Django Style Topbar Header -->
    <header class="bg-[#141111] text-white px-5 py-3.5 flex items-center justify-between border-b-4 border-[#0596B8] shrink-0">
      <div class="flex items-center gap-4">
        <h1 class="text-lg font-fredoka font-semibold tracking-wider text-white">
          MACAWOO <span class="text-[#F4ED18]">ADMINISTRATION</span>
        </h1>
      </div>
      <div class="flex items-center gap-4 text-xs text-zinc-300">
        <span>Welcome, <strong>{{ user?.email || 'administrator' }}</strong>.</span>
        <span class="text-zinc-500">|</span>
        <NuxtLink
          to="/"
          class="hover:underline hover:text-white"
        >
          View site
        </NuxtLink>
        <span class="text-zinc-500">|</span>
        <button
          class="hover:underline hover:text-white cursor-pointer bg-transparent border-0"
          @click="resetAllDynamicState"
        >
          Reset data
        </button>
        <span class="text-zinc-500">|</span>
        <button
          class="hover:underline hover:text-white cursor-pointer bg-transparent border-0"
          @click="handleSignOut"
        >
          Log out
        </button>
      </div>
    </header>

    <!-- Breadcrumbs Navigation Bar -->
    <nav class="bg-[#eaeaea] border-b border-[#dcdcdc] px-5 py-2 flex items-center gap-1.5 text-xs text-zinc-600 shrink-0">
      <template
        v-for="(crumb, idx) in breadcrumbs"
        :key="idx"
      >
        <span
          v-if="idx > 0"
          class="text-zinc-400"
        >›</span>
        <button
          v-if="idx < breadcrumbs.length - 1"
          class="hover:underline text-zinc-600 font-semibold cursor-pointer bg-transparent border-0 p-0"
          @click="navigateTo(crumb.view, crumb.model, crumb.id)"
        >
          {{ crumb.label }}
        </button>
        <span
          v-else
          class="text-zinc-800"
        >{{ crumb.label }}</span>
      </template>
    </nav>

    <!-- Main Container -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Model Navigation Sidebar -->
      <aside class="w-60 bg-white border-r border-[#e0e0e0] flex flex-col shrink-0 overflow-y-auto">
        <div class="p-4 bg-[#eaeaea] text-xs font-bold text-zinc-600 border-b border-[#e0e0e0] uppercase tracking-wider">
          Applications
        </div>
        <div class="p-2 space-y-4">
          <!-- Blog Application -->
          <div class="space-y-1">
            <div class="px-2 py-1 text-xs font-bold text-[#0596B8] uppercase tracking-wide">
              Blog Journal
            </div>
            <div class="flex items-center justify-between px-2.5 py-1 text-xs hover:bg-zinc-50 rounded">
              <button
                class="text-zinc-700 hover:underline cursor-pointer bg-transparent border-0 p-0 text-left"
                @click="navigateTo('list', 'blog')"
              >
                Blog posts
              </button>
              <div class="flex gap-2">
                <button
                  class="text-[10px] text-zinc-400 hover:text-zinc-700 cursor-pointer bg-transparent border-0"
                  @click="openAddForm('blog')"
                >
                  Add
                </button>
                <button
                  class="text-[10px] text-zinc-400 hover:text-zinc-700 cursor-pointer bg-transparent border-0"
                  @click="navigateTo('list', 'blog')"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          <!-- Portfolio Application -->
          <div class="space-y-1">
            <div class="px-2 py-1 text-xs font-bold text-[#0596B8] uppercase tracking-wide">
              Portfolio
            </div>
            <div class="flex items-center justify-between px-2.5 py-1 text-xs hover:bg-zinc-50 rounded">
              <button
                class="text-zinc-700 hover:underline cursor-pointer bg-transparent border-0 p-0 text-left"
                @click="navigateTo('list', 'portfolio')"
              >
                Projects
              </button>
              <div class="flex gap-2">
                <button
                  class="text-[10px] text-zinc-400 hover:text-zinc-700 cursor-pointer bg-transparent border-0"
                  @click="openAddForm('portfolio')"
                >
                  Add
                </button>
                <button
                  class="text-[10px] text-zinc-400 hover:text-zinc-700 cursor-pointer bg-transparent border-0"
                  @click="navigateTo('list', 'portfolio')"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          <!-- Case Studies Application -->
          <div class="space-y-1">
            <div class="px-2 py-1 text-xs font-bold text-[#0596B8] uppercase tracking-wide">
              Case Studies
            </div>
            <div class="flex items-center justify-between px-2.5 py-1 text-xs hover:bg-zinc-50 rounded">
              <button
                class="text-zinc-700 hover:underline cursor-pointer bg-transparent border-0 p-0 text-left"
                @click="navigateTo('list', 'case-study')"
              >
                Case studies
              </button>
              <div class="flex gap-2">
                <button
                  class="text-[10px] text-zinc-400 hover:text-zinc-700 cursor-pointer bg-transparent border-0"
                  @click="openAddForm('case-study')"
                >
                  Add
                </button>
                <button
                  class="text-[10px] text-zinc-400 hover:text-zinc-700 cursor-pointer bg-transparent border-0"
                  @click="navigateTo('list', 'case-study')"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          <!-- Careers Application -->
          <div class="space-y-1">
            <div class="px-2 py-1 text-xs font-bold text-[#0596B8] uppercase tracking-wide">
              Careers
            </div>
            <div class="flex items-center justify-between px-2.5 py-1 text-xs hover:bg-zinc-50 rounded">
              <button
                class="text-zinc-700 hover:underline cursor-pointer bg-transparent border-0 p-0 text-left"
                @click="navigateTo('list', 'career')"
              >
                Open roles
              </button>
              <div class="flex gap-2">
                <button
                  class="text-[10px] text-zinc-400 hover:text-zinc-700 cursor-pointer bg-transparent border-0"
                  @click="openAddForm('career')"
                >
                  Add
                </button>
                <button
                  class="text-[10px] text-zinc-400 hover:text-zinc-700 cursor-pointer bg-transparent border-0"
                  @click="navigateTo('list', 'career')"
                >
                  Change
                </button>
              </div>
            </div>

            <!-- Site Customizer -->
            <div class="space-y-1">
              <div class="px-2 py-1 text-xs font-bold text-[#0596B8] uppercase tracking-wide">
                Site Customizer
              </div>
              <div class="flex items-center justify-between px-2.5 py-1 text-xs hover:bg-zinc-50 rounded">
                <button
                  class="text-zinc-700 hover:underline cursor-pointer bg-transparent border-0 p-0 text-left"
                  @click="navigateTo('list', 'page-settings')"
                >
                  Page Settings
                </button>
                <div class="flex gap-2">
                  <button
                    class="text-[10px] text-zinc-400 hover:text-zinc-700 cursor-pointer bg-transparent border-0"
                    @click="navigateTo('list', 'page-settings')"
                  >
                    Change
                  </button>
                </div>
              </div>
              <div class="flex items-center justify-between px-2.5 py-1 text-xs hover:bg-zinc-50 rounded">
                <button
                  class="text-zinc-700 hover:underline cursor-pointer bg-transparent border-0 p-0 text-left"
                  @click="navigateTo('list', 'uploads')"
                >
                  Media Library
                </button>
                <div class="flex gap-2">
                  <button
                    class="text-[10px] text-zinc-400 hover:text-zinc-700 cursor-pointer bg-transparent border-0"
                    @click="navigateTo('list', 'uploads')"
                  >
                    View
                  </button>
                </div>
              </div>
              <div class="flex items-center justify-between px-2.5 py-1 text-xs hover:bg-zinc-50 rounded">
                <button
                  class="text-zinc-700 hover:underline cursor-pointer bg-transparent border-0 p-0 text-left"
                  @click="navigateTo('list', 'categories')"
                >
                  Categories
                </button>
                <div class="flex gap-2">
                  <button
                    class="text-[10px] text-zinc-400 hover:text-zinc-700 cursor-pointer bg-transparent border-0"
                    @click="navigateTo('list', 'categories')"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Panel Workspace -->
      <main class="flex-1 overflow-y-auto p-6 bg-[#fcfcfc]">
        <!-- ══════════════════════ VIEW 1: DASHBOARD INDEX ══════════════════════ -->
        <div
          v-if="currentView === 'dashboard'"
          class="flex flex-col lg:flex-row gap-6 items-start"
        >
          <!-- Left Table Panel -->
          <div class="flex-1 w-full space-y-6">
            <h2 class="text-base font-bold text-zinc-700 uppercase tracking-wide border-b border-[#e0e0e0] pb-2">
              Site Administration Console
            </h2>

            <div class="border border-[#e0e0e0] rounded overflow-hidden">
              <table class="w-full text-xs text-left border-collapse bg-white">
                <thead>
                  <tr class="bg-[#141111] text-white font-bold border-b border-[#e0e0e0]">
                    <th class="p-3">
                      Model Groups
                    </th>
                    <th class="p-3 text-right w-36">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Blog -->
                  <tr class="border-b border-[#e0e0e0] hover:bg-zinc-50">
                    <td class="p-3 font-semibold text-zinc-800">
                      <button
                        class="hover:underline text-left text-zinc-800 font-semibold cursor-pointer bg-transparent border-0 p-0"
                        @click="navigateTo('list', 'blog')"
                      >
                        Blog Posts
                      </button>
                    </td>
                    <td class="p-3 text-right space-x-3">
                      <button
                        class="text-[#0596B8] hover:underline cursor-pointer bg-transparent border-0 p-0"
                        @click="openAddForm('blog')"
                      >
                        + Add
                      </button>
                      <button
                        class="text-zinc-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
                        @click="navigateTo('list', 'blog')"
                      >
                        ✎ Change
                      </button>
                    </td>
                  </tr>
                  <!-- Portfolio -->
                  <tr class="border-b border-[#e0e0e0] hover:bg-zinc-50">
                    <td class="p-3 font-semibold text-zinc-800">
                      <button
                        class="hover:underline text-left text-zinc-800 font-semibold cursor-pointer bg-transparent border-0 p-0"
                        @click="navigateTo('list', 'portfolio')"
                      >
                        Portfolio Projects
                      </button>
                    </td>
                    <td class="p-3 text-right space-x-3">
                      <button
                        class="text-[#0596B8] hover:underline cursor-pointer bg-transparent border-0 p-0"
                        @click="openAddForm('portfolio')"
                      >
                        + Add
                      </button>
                      <button
                        class="text-zinc-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
                        @click="navigateTo('list', 'portfolio')"
                      >
                        ✎ Change
                      </button>
                    </td>
                  </tr>
                  <!-- Case Study -->
                  <tr class="border-b border-[#e0e0e0] hover:bg-zinc-50">
                    <td class="p-3 font-semibold text-zinc-800">
                      <button
                        class="hover:underline text-left text-zinc-800 font-semibold cursor-pointer bg-transparent border-0 p-0"
                        @click="navigateTo('list', 'case-study')"
                      >
                        Case Studies
                      </button>
                    </td>
                    <td class="p-3 text-right space-x-3">
                      <button
                        class="text-[#0596B8] hover:underline cursor-pointer bg-transparent border-0 p-0"
                        @click="openAddForm('case-study')"
                      >
                        + Add
                      </button>
                      <button
                        class="text-zinc-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
                        @click="navigateTo('list', 'case-study')"
                      >
                        ✎ Change
                      </button>
                    </td>
                  </tr>
                  <!-- Careers -->
                  <tr class="border-b border-[#e0e0e0] hover:bg-zinc-50">
                    <td class="p-3 font-semibold text-zinc-800">
                      <button
                        class="hover:underline text-left text-zinc-800 font-semibold cursor-pointer bg-transparent border-0 p-0"
                        @click="navigateTo('list', 'career')"
                      >
                        Careers (Open Roles)
                      </button>
                    </td>
                    <td class="p-3 text-right space-x-3">
                      <button
                        class="text-[#0596B8] hover:underline cursor-pointer bg-transparent border-0 p-0"
                        @click="openAddForm('career')"
                      >
                        + Add
                      </button>
                      <button
                        class="text-zinc-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
                        @click="navigateTo('list', 'career')"
                      >
                        ✎ Change
                      </button>
                    </td>
                  </tr>
                  <!-- Page Settings -->
                  <tr class="border-b border-[#e0e0e0] hover:bg-zinc-50">
                    <td class="p-3 font-semibold text-zinc-800">
                      <button
                        class="hover:underline text-left text-zinc-800 font-semibold cursor-pointer bg-transparent border-0 p-0"
                        @click="navigateTo('list', 'page-settings')"
                      >
                        Page Settings (Site Backgrounds &amp; Assets)
                      </button>
                    </td>
                    <td class="p-3 text-right space-x-3">
                      <span class="text-zinc-300 text-[10px] select-none pr-3">-</span>
                      <button
                        class="text-zinc-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
                        @click="navigateTo('list', 'page-settings')"
                      >
                        ✎ Change
                      </button>
                    </td>
                  </tr>
                  <!-- Media Uploads -->
                  <tr class="border-b border-[#e0e0e0] hover:bg-zinc-50">
                    <td class="p-3 font-semibold text-zinc-800">
                      <button
                        class="hover:underline text-left text-zinc-800 font-semibold cursor-pointer bg-transparent border-0 p-0"
                        @click="navigateTo('list', 'uploads')"
                      >
                        Media Library (Uploads &amp; Management)
                      </button>
                    </td>
                    <td class="p-3 text-right space-x-3">
                      <span class="text-zinc-300 text-[10px] select-none pr-3">-</span>
                      <button
                        class="text-zinc-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
                        @click="navigateTo('list', 'uploads')"
                      >
                        👁 View
                      </button>
                    </td>
                  </tr>
                  <!-- Categories -->
                  <tr class="hover:bg-zinc-50">
                    <td class="p-3 font-semibold text-zinc-800">
                      <button
                        class="hover:underline text-left text-zinc-800 font-semibold cursor-pointer bg-transparent border-0 p-0"
                        @click="navigateTo('list', 'categories')"
                      >
                        Categories (Portfolio &amp; Case Studies)
                      </button>
                    </td>
                    <td class="p-3 text-right space-x-3">
                      <span class="text-zinc-300 text-[10px] select-none pr-3">-</span>
                      <button
                        class="text-zinc-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
                        @click="navigateTo('list', 'categories')"
                      >
                        ✎ Change
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Right Sidebar Log Actions -->
          <div class="w-full lg:w-72 bg-white border border-[#e0e0e0] rounded p-4 self-stretch lg:self-auto">
            <h3 class="text-xs font-bold text-zinc-500 uppercase tracking-wide border-b border-[#e0e0e0] pb-2 mb-3">
              Recent Actions Log
            </h3>
            <div
              v-if="recentActions.length === 0"
              class="text-xs text-zinc-400 italic"
            >
              No modifications in this session.
            </div>
            <ul
              v-else
              class="space-y-3 text-xs"
            >
              <li
                v-for="(log, idx) in recentActions"
                :key="idx"
                class="flex items-start gap-2 border-b border-zinc-50 pb-2 last:border-0"
              >
                <span
                  class="font-mono text-[10px] bg-zinc-100 text-zinc-500 px-1 py-0.5 rounded"
                >{{ log.time }}</span>
                <div>
                  <span
                    class="font-semibold"
                    :class="[
                      log.action === 'add' && 'text-green-600',
                      log.action === 'change' && 'text-amber-600',
                      log.action === 'delete' && 'text-red-600'
                    ]"
                  >{{ log.action.toUpperCase() }}</span>
                  <span class="text-zinc-600"> {{ log.model }}:</span>
                  <strong class="text-zinc-800 truncate block max-w-[180px]">{{ log.name }}</strong>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- ══════════════════════ VIEW 2: CHANGE LIST VIEW ══════════════════════ -->
        <div
          v-if="currentView === 'list'"
          class="space-y-4"
        >
          <template v-if="currentModel === 'uploads'">
            <MediaPicker :inline="true" />
          </template>
          <template v-else-if="currentModel === 'categories'">
            <!-- Categories Management View -->
            <div class="space-y-6 bg-white border border-[#e0e0e0] p-6 rounded shadow-sm">
              <div class="border-b border-[#e0e0e0] pb-3 flex items-center justify-between">
                <h2 class="text-base font-bold text-zinc-700">
                  Manage Categories
                </h2>
                <span class="text-xs text-zinc-400">Manage categories used in Portfolio and Case Studies.</span>
              </div>

              <!-- Add category inline form -->
              <form
                class="flex gap-2 items-center bg-zinc-50 p-4 border border-zinc-200 rounded-lg"
                @submit.prevent="submitCategory"
              >
                <label class="text-xs font-bold text-zinc-700">Add New Category:</label>
                <input
                  v-model="newCategory"
                  name="categoryInput"
                  type="text"
                  placeholder="e.g. Branding & Identity"
                  required
                  class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-white focus:outline-none focus:border-[#0596B8]"
                >
                <button
                  type="submit"
                  class="px-4 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-bold rounded shadow-sm cursor-pointer"
                >
                  + Add Category
                </button>
              </form>

              <!-- Categories List -->
              <div class="border border-[#e0e0e0] rounded overflow-hidden">
                <table class="w-full text-xs text-left border-collapse bg-white">
                  <thead>
                    <tr class="bg-[#141111] text-white font-bold border-b border-[#e0e0e0]">
                      <th class="p-3">
                        Category Name
                      </th>
                      <th class="p-3 text-right w-36">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="cat in categories"
                      :key="cat"
                      class="border-b border-[#e0e0e0] hover:bg-zinc-50"
                    >
                      <td class="p-3 font-semibold text-zinc-800">
                        {{ cat }}
                      </td>
                      <td class="p-3 text-right">
                        <button
                          type="button"
                          class="text-red-600 hover:underline cursor-pointer bg-transparent border-0 p-0 font-semibold"
                          @click="deleteCategory(cat); logAction('delete', 'Category', cat)"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    <tr v-if="categories.length === 0">
                      <td
                        colspan="2"
                        class="p-4 text-center text-zinc-400 italic"
                      >
                        No categories created yet.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
          <template v-else>
            <!-- Header and Add Button -->
            <div class="flex items-center justify-between border-b border-[#e0e0e0] pb-3">
              <h2 class="text-base font-bold text-zinc-700 capitalize">
                Select {{ currentModel === 'case-study' ? 'case study' : currentModel === 'career' ? 'role' : currentModel }} to change
              </h2>
              <button
                class="px-4 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-bold rounded shadow-sm cursor-pointer"
                @click="openAddForm(currentModel)"
              >
                + Add {{ currentModel === 'case-study' ? 'Case Study' : currentModel === 'career' ? 'Role' : currentModel.toUpperCase() }}
              </button>
            </div>

            <!-- Changelist Controls (Search & Filters) -->
            <div class="flex flex-col lg:flex-row gap-5 items-start">
              <div class="flex-1 w-full space-y-4">
                <!-- Search Bar -->
                <div class="bg-white border border-[#e0e0e0] p-3 rounded flex items-center gap-2">
                  <input
                    v-model="searchQueries[currentModel]"
                    type="text"
                    placeholder="Search title, keyword or key identifiers..."
                    class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    @keydown.enter="allSelected = false"
                  >
                  <button
                    class="px-4 py-1.5 bg-[#141111] hover:bg-black text-white text-xs font-bold rounded cursor-pointer"
                  >
                    Search
                  </button>
                </div>

                <!-- Bulk Action Bar -->
                <div class="bg-zinc-100 border border-[#e0e0e0] p-2.5 rounded flex items-center gap-2 text-xs">
                  <label class="text-zinc-600 font-semibold">Action:</label>
                  <select
                    v-model="selectedBulkAction"
                    class="px-2.5 py-1 border border-zinc-300 rounded text-xs bg-white focus:outline-none"
                  >
                    <option value="">
                      ---------
                    </option>
                    <option value="delete">
                      Delete selected {{ currentModel === 'blog' ? 'blog posts' : currentModel === 'portfolio' ? 'projects' : currentModel === 'case-study' ? 'case studies' : 'open roles' }}
                    </option>
                  </select>
                  <button
                    class="px-3.5 py-1 bg-[#141111] hover:bg-black text-white font-bold rounded cursor-pointer text-xs"
                    @click="executeBulkAction"
                  >
                    Go
                  </button>
                </div>

                <!-- Data List Grid Tables -->
                <div class="border border-[#e0e0e0] rounded bg-white overflow-hidden">
                  <!-- ── Table 1: Blog Changelist ── -->
                  <table
                    v-if="currentModel === 'blog'"
                    class="w-full text-xs text-left border-collapse"
                  >
                    <thead>
                      <tr class="bg-zinc-100 text-zinc-700 font-bold border-b border-[#e0e0e0] select-none">
                        <th class="p-3 w-10 text-center">
                          <input
                            v-model="allSelected"
                            type="checkbox"
                            @change="toggleAllSelections(filteredBlogs)"
                          >
                        </th>
                        <th
                          class="p-3 cursor-pointer hover:bg-zinc-200"
                          @click="toggleSort('blog', 'title')"
                        >
                          Title <span v-if="sortKeys.blog === 'title'">{{ sortOrders.blog === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th
                          class="p-3 cursor-pointer hover:bg-zinc-200"
                          @click="toggleSort('blog', 'slug')"
                        >
                          Slug <span v-if="sortKeys.blog === 'slug'">{{ sortOrders.blog === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th
                          class="p-3 cursor-pointer hover:bg-zinc-200"
                          @click="toggleSort('blog', 'date')"
                        >
                          Publish Date <span v-if="sortKeys.blog === 'date'">{{ sortOrders.blog === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th class="p-3">
                          Read Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="post in filteredBlogs"
                        :key="post.slug"
                        class="border-b border-[#e0e0e0] hover:bg-zinc-50"
                      >
                        <td class="p-3 text-center">
                          <input
                            v-model="selectedIds[post.slug]"
                            type="checkbox"
                          >
                        </td>
                        <td class="p-3">
                          <button
                            class="text-[#0596B8] hover:underline cursor-pointer font-bold text-left bg-transparent border-0 p-0"
                            @click="openEditForm('blog', post.slug)"
                          >
                            {{ post.title }}
                          </button>
                        </td>
                        <td class="p-3 text-zinc-500 font-mono text-[11px]">
                          {{ post.slug }}
                        </td>
                        <td class="p-3">
                          {{ post.date }}
                        </td>
                        <td class="p-3">
                          {{ post.readTime }}
                        </td>
                      </tr>
                      <tr v-if="filteredBlogs.length === 0">
                        <td
                          colspan="5"
                          class="p-5 text-center text-zinc-400 italic"
                        >
                          No matching blog posts found.
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- ── Table 2: Portfolio Changelist ── -->
                  <table
                    v-if="currentModel === 'portfolio'"
                    class="w-full text-xs text-left border-collapse"
                  >
                    <thead>
                      <tr class="bg-zinc-100 text-zinc-700 font-bold border-b border-[#e0e0e0] select-none">
                        <th class="p-3 w-10 text-center">
                          <input
                            v-model="allSelected"
                            type="checkbox"
                            @change="toggleAllSelections(filteredPortfolio)"
                          >
                        </th>
                        <th
                          class="p-3 cursor-pointer hover:bg-zinc-200"
                          @click="toggleSort('portfolio', 'title')"
                        >
                          Title <span v-if="sortKeys.portfolio === 'title'">{{ sortOrders.portfolio === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th
                          class="p-3 cursor-pointer hover:bg-zinc-200"
                          @click="toggleSort('portfolio', 'category')"
                        >
                          Category <span v-if="sortKeys.portfolio === 'category'">{{ sortOrders.portfolio === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th
                          class="p-3 cursor-pointer hover:bg-zinc-200"
                          @click="toggleSort('portfolio', 'featured')"
                        >
                          Featured <span v-if="sortKeys.portfolio === 'featured'">{{ sortOrders.portfolio === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th
                          class="p-3 cursor-pointer hover:bg-zinc-200"
                          @click="toggleSort('portfolio', 'displayOrder')"
                        >
                          Order <span v-if="sortKeys.portfolio === 'displayOrder'">{{ sortOrders.portfolio === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="proj in filteredPortfolio"
                        :key="proj.slug"
                        class="border-b border-[#e0e0e0] hover:bg-zinc-50"
                      >
                        <td class="p-3 text-center">
                          <input
                            v-model="selectedIds[proj.slug]"
                            type="checkbox"
                          >
                        </td>
                        <td class="p-3">
                          <button
                            class="text-[#0596B8] hover:underline cursor-pointer font-bold text-left bg-transparent border-0 p-0"
                            @click="openEditForm('portfolio', proj.slug)"
                          >
                            {{ proj.title }}
                          </button>
                        </td>
                        <td class="p-3">
                          {{ proj.category }}
                        </td>
                        <td class="p-3">
                          <span
                            class="px-2 py-0.5 rounded font-bold text-[10px]"
                            :class="proj.featured !== false ? 'bg-amber-100 text-amber-700' : 'bg-zinc-100 text-zinc-600'"
                          >
                            {{ proj.featured !== false ? 'Featured' : 'Standard' }}
                          </span>
                        </td>
                        <td class="p-3 font-mono">
                          {{ proj.displayOrder }}
                        </td>
                      </tr>
                      <tr v-if="filteredPortfolio.length === 0">
                        <td
                          colspan="5"
                          class="p-5 text-center text-zinc-400 italic"
                        >
                          No matching portfolio projects found.
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- ── Table 3: Case Studies Changelist ── -->
                  <table
                    v-if="currentModel === 'case-study'"
                    class="w-full text-xs text-left border-collapse"
                  >
                    <thead>
                      <tr class="bg-zinc-100 text-zinc-700 font-bold border-b border-[#e0e0e0] select-none">
                        <th class="p-3 w-10 text-center">
                          <input
                            v-model="allSelected"
                            type="checkbox"
                            @change="toggleAllSelections(filteredCaseStudies)"
                          >
                        </th>
                        <th
                          class="p-3 cursor-pointer hover:bg-zinc-200"
                          @click="toggleSort('case-study', 'title')"
                        >
                          Title <span v-if="sortKeys['case-study'] === 'title'">{{ sortOrders['case-study'] === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th
                          class="p-3 cursor-pointer hover:bg-zinc-200"
                          @click="toggleSort('case-study', 'client')"
                        >
                          Client <span v-if="sortKeys['case-study'] === 'client'">{{ sortOrders['case-study'] === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th class="p-3">
                          Slug
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="study in filteredCaseStudies"
                        :key="study.slug"
                        class="border-b border-[#e0e0e0] hover:bg-zinc-50"
                      >
                        <td class="p-3 text-center">
                          <input
                            v-model="selectedIds[study.slug]"
                            type="checkbox"
                          >
                        </td>
                        <td class="p-3">
                          <button
                            class="text-[#0596B8] hover:underline cursor-pointer font-bold text-left bg-transparent border-0 p-0"
                            @click="openEditForm('case-study', study.slug)"
                          >
                            {{ study.title }}
                          </button>
                        </td>
                        <td class="p-3">
                          {{ study.client }}
                        </td>
                        <td class="p-3 text-zinc-500 font-mono text-[11px]">
                          {{ study.slug }}
                        </td>
                      </tr>
                      <tr v-if="filteredCaseStudies.length === 0">
                        <td
                          colspan="4"
                          class="p-5 text-center text-zinc-400 italic"
                        >
                          No matching case studies found.
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- ── Table 4: Careers Changelist ── -->
                  <table
                    v-if="currentModel === 'career'"
                    class="w-full text-xs text-left border-collapse"
                  >
                    <thead>
                      <tr class="bg-zinc-100 text-zinc-700 font-bold border-b border-[#e0e0e0] select-none">
                        <th class="p-3 w-10 text-center">
                          <input
                            v-model="allSelected"
                            type="checkbox"
                            @change="toggleAllSelections(filteredCareers)"
                          >
                        </th>
                        <th
                          class="p-3 cursor-pointer hover:bg-zinc-200"
                          @click="toggleSort('career', 'title')"
                        >
                          Job Title <span v-if="sortKeys.career === 'title'">{{ sortOrders.career === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th
                          class="p-3 cursor-pointer hover:bg-zinc-200"
                          @click="toggleSort('career', 'department')"
                        >
                          Department <span v-if="sortKeys.career === 'department'">{{ sortOrders.career === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th
                          class="p-3 cursor-pointer hover:bg-zinc-200"
                          @click="toggleSort('career', 'location')"
                        >
                          Location <span v-if="sortKeys.career === 'location'">{{ sortOrders.career === 'asc' ? '▲' : '▼' }}</span>
                        </th>
                        <th class="p-3">
                          Job Type
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="job in filteredCareers"
                        :key="job.id"
                        class="border-b border-[#e0e0e0] hover:bg-zinc-50"
                      >
                        <td class="p-3 text-center">
                          <input
                            v-model="selectedIds[job.id]"
                            type="checkbox"
                          >
                        </td>
                        <td class="p-3">
                          <button
                            class="text-[#0596B8] hover:underline cursor-pointer font-bold text-left bg-transparent border-0 p-0"
                            @click="openEditForm('career', job.id)"
                          >
                            {{ job.title }}
                          </button>
                        </td>
                        <td class="p-3">
                          {{ job.department }}
                        </td>
                        <td class="p-3">
                          {{ job.location }}
                        </td>
                        <td class="p-3">
                          {{ job.type }}
                        </td>
                      </tr>
                      <tr v-if="filteredCareers.length === 0">
                        <td
                          colspan="5"
                          class="p-5 text-center text-zinc-400 italic"
                        >
                          No matching careers found.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Right side Filters Sidebar -->
              <div class="w-full lg:w-56 bg-white border border-[#e0e0e0] rounded shrink-0 p-4">
                <h3 class="text-xs font-bold text-zinc-500 uppercase tracking-wide border-b border-[#e0e0e0] pb-2 mb-3">
                  Filter
                </h3>

                <!-- Filters for Portfolio -->
                <div
                  v-if="currentModel === 'portfolio'"
                  class="space-y-4 text-xs"
                >
                  <div>
                    <h4 class="font-bold text-zinc-400 mb-1.5">
                      By Category
                    </h4>
                    <ul class="space-y-1">
                      <li
                        v-for="cat in ['All', 'Branding', 'Marketing', 'Video Production']"
                        :key="cat"
                      >
                        <button
                          class="hover:underline text-left cursor-pointer bg-transparent border-0 p-0"
                          :class="activeFilters.portfolioCategory === cat ? 'text-[#0596B8] font-bold' : 'text-zinc-600'"
                          @click="activeFilters.portfolioCategory = cat; allSelected = false"
                        >
                          {{ cat }}
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-bold text-zinc-400 mb-1.5">
                      By Home Placement
                    </h4>
                    <ul class="space-y-1">
                      <li
                        v-for="feat in ['All', 'Featured', 'Not Featured']"
                        :key="feat"
                      >
                        <button
                          class="hover:underline text-left cursor-pointer bg-transparent border-0 p-0"
                          :class="activeFilters.portfolioFeatured === feat ? 'text-[#0596B8] font-bold' : 'text-zinc-600'"
                          @click="activeFilters.portfolioFeatured = feat; allSelected = false"
                        >
                          {{ feat }}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Filters for Blog -->
                <div
                  v-if="currentModel === 'blog'"
                  class="space-y-4 text-xs"
                >
                  <div>
                    <h4 class="font-bold text-zinc-400 mb-1.5">
                      By Year
                    </h4>
                    <ul class="space-y-1">
                      <li
                        v-for="yr in ['All', '2026', '2025']"
                        :key="yr"
                      >
                        <button
                          class="hover:underline text-left cursor-pointer bg-transparent border-0 p-0"
                          :class="activeFilters.blogYear === yr ? 'text-[#0596B8] font-bold' : 'text-zinc-600'"
                          @click="activeFilters.blogYear = yr; allSelected = false"
                        >
                          {{ yr }}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Default Placeholder Filters for non-filtered models -->
                <div
                  v-if="currentModel === 'case-study' || currentModel === 'career'"
                  class="text-xs text-zinc-400 italic"
                >
                  No filter choices active for this model.
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- ══════════════════════ VIEW 3: CHANGE FORM VIEW (Add/Edit) ══════════════════════ -->
        <div
          v-if="currentView === 'change'"
          class="space-y-4"
        >
          <!-- Header title -->
          <div class="border-b border-[#e0e0e0] pb-3">
            <h2 class="text-base font-bold text-zinc-700 capitalize">
              {{ currentId === null ? 'Add' : 'Change' }} {{ currentModel === 'case-study' ? 'case study' : currentModel === 'career' ? 'role' : currentModel }}
            </h2>
          </div>

          <form
            class="space-y-6"
            @submit.prevent="handleSave('save')"
          >
            <!-- ── FORM CARD (Structured Grid Layout, matching Django table rows) ── -->
            <div class="bg-white border border-[#e0e0e0] rounded overflow-hidden divide-y divide-[#eaeaea]">
              <!-- ▓▓ PAGE SETTINGS FORM FIELDS ▓▓ -->
              <template v-if="currentModel === 'page-settings'">
                <!-- Index Page Settings Group Header -->
                <div class="bg-zinc-50 px-4 py-2.5 text-xs font-bold text-zinc-600 uppercase tracking-wide">
                  Index Page Background Customizations
                </div>
                <!-- Row: Index Hero Image -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Index Hero Image Path/URL:</label>
                  <div class="flex-1 w-full space-y-2">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="settingsForm.indexHeroImage"
                        type="text"
                        required
                        placeholder="e.g. /Images/hero.png"
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(settingsForm, 'indexHeroImage')"
                      >
                        Pick Media
                      </button>
                    </div>
                    <div class="flex items-center gap-2">
                      <label class="text-[10px] text-zinc-400">Template Images Choice:</label>
                      <select
                        class="px-2 py-0.5 border border-zinc-200 rounded text-[10px] bg-zinc-50 text-zinc-700 focus:outline-none"
                        @change="settingsForm.indexHeroImage = ($event.target as HTMLSelectElement).value"
                      >
                        <option
                          value=""
                          disabled
                          selected
                        >
                          -- select template image --
                        </option>
                        <option
                          v-for="img in templateImages"
                          :key="img.value"
                          :value="img.value"
                        >
                          {{ img.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <!-- Row: Index Hero Video -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Index Hero Video Path/URL (Optional):</label>
                  <div class="flex-1 w-full space-y-1">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="settingsForm.indexHeroVideo"
                        type="text"
                        placeholder="e.g. /Background_Videos/Hero.mp4 (leave empty to show background image)"
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(settingsForm, 'indexHeroVideo')"
                      >
                        Pick Media
                      </button>
                    </div>
                    <p class="text-[10px] text-zinc-400">
                      If set, plays as the background video. If empty, displays the hero image instead.
                    </p>
                  </div>
                </div>

                <!-- About Page Settings Group Header -->
                <div class="bg-zinc-50 px-4 py-2.5 text-xs font-bold text-zinc-600 uppercase tracking-wide">
                  About Page Background Customizations
                </div>
                <!-- Row: About Hero Image -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">About Hero Image Path/URL:</label>
                  <div class="flex-1 w-full space-y-2">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="settingsForm.aboutHeroImage"
                        type="text"
                        required
                        placeholder="e.g. /Images/Branding.jpeg"
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(settingsForm, 'aboutHeroImage')"
                      >
                        Pick Media
                      </button>
                    </div>
                    <div class="flex items-center gap-2">
                      <label class="text-[10px] text-zinc-400">Template Images Choice:</label>
                      <select
                        class="px-2 py-0.5 border border-zinc-200 rounded text-[10px] bg-zinc-50 text-zinc-700 focus:outline-none"
                        @change="settingsForm.aboutHeroImage = ($event.target as HTMLSelectElement).value"
                      >
                        <option
                          value=""
                          disabled
                          selected
                        >
                          -- select template image --
                        </option>
                        <option
                          v-for="img in templateImages"
                          :key="img.value"
                          :value="img.value"
                        >
                          {{ img.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <!-- Row: About Hero Video -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">About Hero Video Path/URL:</label>
                  <div class="flex-1 w-full space-y-1">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="settingsForm.aboutHeroVideo"
                        type="text"
                        required
                        placeholder="e.g. /Background_Videos/About.mp4"
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(settingsForm, 'aboutHeroVideo')"
                      >
                        Pick Media
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Blog Page Settings Group Header -->
                <div class="bg-zinc-50 px-4 py-2.5 text-xs font-bold text-zinc-600 uppercase tracking-wide">
                  Blog Page Background Customizations
                </div>
                <!-- Row: Blog Hero Image -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Blog Hero Image Path/URL:</label>
                  <div class="flex-1 w-full space-y-2">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="settingsForm.blogHeroImage"
                        type="text"
                        required
                        placeholder="e.g. /Images/Branding.jpeg"
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(settingsForm, 'blogHeroImage')"
                      >
                        Pick Media
                      </button>
                    </div>
                    <div class="flex items-center gap-2">
                      <label class="text-[10px] text-zinc-400">Template Images Choice:</label>
                      <select
                        class="px-2 py-0.5 border border-zinc-200 rounded text-[10px] bg-zinc-50 text-zinc-700 focus:outline-none"
                        @change="settingsForm.blogHeroImage = ($event.target as HTMLSelectElement).value"
                      >
                        <option
                          value=""
                          disabled
                          selected
                        >
                          -- select template image --
                        </option>
                        <option
                          v-for="img in templateImages"
                          :key="img.value"
                          :value="img.value"
                        >
                          {{ img.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <!-- Row: Blog Hero Video -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Blog Hero Video Path/URL:</label>
                  <div class="flex-1 w-full space-y-1">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="settingsForm.blogHeroVideo"
                        type="text"
                        required
                        placeholder="e.g. /Background_Videos/Blog.mp4"
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(settingsForm, 'blogHeroVideo')"
                      >
                        Pick Media
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Services Section Settings Group Header -->
                <div class="bg-zinc-50 px-4 py-2.5 text-xs font-bold text-zinc-600 uppercase tracking-wide">
                  Homepage Services Section Cards Customizations
                </div>
                <!-- Row: Services Branding Image -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Branding &amp; Design Card Image:</label>
                  <div class="flex-1 w-full space-y-2">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="settingsForm.servicesBrandingImage"
                        type="text"
                        required
                        placeholder="e.g. /Images/Branding.jpeg"
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(settingsForm, 'servicesBrandingImage')"
                      >
                        Pick Media
                      </button>
                    </div>
                    <div class="flex items-center gap-2">
                      <label class="text-[10px] text-zinc-400">Template Images Choice:</label>
                      <select
                        class="px-2 py-0.5 border border-zinc-200 rounded text-[10px] bg-zinc-50 text-zinc-700 focus:outline-none"
                        @change="settingsForm.servicesBrandingImage = ($event.target as HTMLSelectElement).value"
                      >
                        <option
                          value=""
                          disabled
                          selected
                        >
                          -- select template image --
                        </option>
                        <option
                          v-for="img in templateImages"
                          :key="img.value"
                          :value="img.value"
                        >
                          {{ img.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <!-- Row: Services Marketing Image -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Digital Marketing Card Image:</label>
                  <div class="flex-1 w-full space-y-2">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="settingsForm.servicesMarketingImage"
                        type="text"
                        required
                        placeholder="e.g. /Images/Digital_Marketing.jpeg"
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(settingsForm, 'servicesMarketingImage')"
                      >
                        Pick Media
                      </button>
                    </div>
                    <div class="flex items-center gap-2">
                      <label class="text-[10px] text-zinc-400">Template Images Choice:</label>
                      <select
                        class="px-2 py-0.5 border border-zinc-200 rounded text-[10px] bg-zinc-50 text-zinc-700 focus:outline-none"
                        @change="settingsForm.servicesMarketingImage = ($event.target as HTMLSelectElement).value"
                      >
                        <option
                          value=""
                          disabled
                          selected
                        >
                          -- select template image --
                        </option>
                        <option
                          v-for="img in templateImages"
                          :key="img.value"
                          :value="img.value"
                        >
                          {{ img.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <!-- Row: Services Video Image -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Video Production Card Image:</label>
                  <div class="flex-1 w-full space-y-2">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="settingsForm.servicesVideoImage"
                        type="text"
                        required
                        placeholder="e.g. /Images/Video_Production.jpeg"
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(settingsForm, 'servicesVideoImage')"
                      >
                        Pick Media
                      </button>
                    </div>
                    <div class="flex items-center gap-2">
                      <label class="text-[10px] text-zinc-400">Template Images Choice:</label>
                      <select
                        class="px-2 py-0.5 border border-zinc-200 rounded text-[10px] bg-zinc-50 text-zinc-700 focus:outline-none"
                        @change="settingsForm.servicesVideoImage = ($event.target as HTMLSelectElement).value"
                      >
                        <option
                          value=""
                          disabled
                          selected
                        >
                          -- select template image --
                        </option>
                        <option
                          v-for="img in templateImages"
                          :key="img.value"
                          :value="img.value"
                        >
                          {{ img.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Careers & Contact Page Settings Group Header -->
                <div class="bg-zinc-50 px-4 py-2.5 text-xs font-bold text-zinc-600 uppercase tracking-wide">
                  Careers &amp; Contact Page Customizations
                </div>
                <!-- Row: Careers Hero Image -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Careers Hero Image Path/URL:</label>
                  <div class="flex-1 w-full space-y-2">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="settingsForm.careersHeroImage"
                        type="text"
                        required
                        placeholder="e.g. /Images/Designing.jpeg"
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(settingsForm, 'careersHeroImage')"
                      >
                        Pick Media
                      </button>
                    </div>
                    <div class="flex items-center gap-2">
                      <label class="text-[10px] text-zinc-400">Template Images Choice:</label>
                      <select
                        class="px-2 py-0.5 border border-zinc-200 rounded text-[10px] bg-zinc-50 text-zinc-700 focus:outline-none"
                        @change="settingsForm.careersHeroImage = ($event.target as HTMLSelectElement).value"
                      >
                        <option
                          value=""
                          disabled
                          selected
                        >
                          -- select template image --
                        </option>
                        <option
                          v-for="img in templateImages"
                          :key="img.value"
                          :value="img.value"
                        >
                          {{ img.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <!-- Row: Careers Hero Video -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Careers Hero Video Path/URL:</label>
                  <div class="flex-1 w-full space-y-1">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="settingsForm.careersHeroVideo"
                        type="text"
                        required
                        placeholder="e.g. /Background_Videos/Careers.mp4"
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(settingsForm, 'careersHeroVideo')"
                      >
                        Pick Media
                      </button>
                    </div>
                  </div>
                </div>
                <!-- Row: Contact Hero Image -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Contact Hero Image Path/URL:</label>
                  <div class="flex-1 w-full space-y-2">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="settingsForm.contactHeroImage"
                        type="text"
                        required
                        placeholder="e.g. /Images/Marketing.jpeg"
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(settingsForm, 'contactHeroImage')"
                      >
                        Pick Media
                      </button>
                    </div>
                    <div class="flex items-center gap-2">
                      <label class="text-[10px] text-zinc-400">Template Images Choice:</label>
                      <select
                        class="px-2 py-0.5 border border-zinc-200 rounded text-[10px] bg-zinc-50 text-zinc-700 focus:outline-none"
                        @change="settingsForm.contactHeroImage = ($event.target as HTMLSelectElement).value"
                      >
                        <option
                          value=""
                          disabled
                          selected
                        >
                          -- select template image --
                        </option>
                        <option
                          v-for="img in templateImages"
                          :key="img.value"
                          :value="img.value"
                        >
                          {{ img.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <!-- Row: Contact Hero Video -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Contact Hero Video Path/URL:</label>
                  <div class="flex-1 w-full space-y-1">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="settingsForm.contactHeroVideo"
                        type="text"
                        required
                        placeholder="e.g. /Background_Videos/Contact.mp4"
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(settingsForm, 'contactHeroVideo')"
                      >
                        Pick Media
                      </button>
                    </div>
                  </div>
                </div>
              </template>

              <!-- ▓▓ BLOG FORM FIELDS ▓▓ -->
              <template v-if="currentModel === 'blog'">
                <!-- Row: Title -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Blog Title:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="blogForm.title"
                      type="text"
                      required
                      placeholder="e.g. Scaling Brand Identity in 2026"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                    <p class="text-[10px] text-zinc-400">
                      The core heading of the journal page.
                    </p>
                  </div>
                </div>
                <!-- Row: Slug -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">URL Slug:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="blogForm.slug"
                      type="text"
                      required
                      placeholder="e.g. scaling-brand-identity-2026"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                      :disabled="currentId !== null"
                    >
                    <p class="text-[10px] text-zinc-400">
                      Used for SEO URL matching. Must be unique and hyphens-only. Auto-generated from title for new items.
                    </p>
                  </div>
                </div>
                <!-- Row: Excerpt -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Excerpt Summary:</label>
                  <div class="flex-1 w-full space-y-1">
                    <textarea
                      v-model="blogForm.excerpt"
                      required
                      rows="2"
                      placeholder="A short card synopsis summary..."
                      class="w-full max-w-2xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    />
                  </div>
                </div>
                <!-- Row: Date -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Publish Date:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="blogForm.date"
                      type="date"
                      required
                      class="w-48 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Read Time -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Read Time Duration:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="blogForm.readTime"
                      type="text"
                      required
                      placeholder="e.g. 5 Min Read"
                      class="w-48 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Image -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Cover Image Asset:</label>
                  <div class="flex-1 w-full space-y-2">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="blogForm.image"
                        type="text"
                        required
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(blogForm, 'image')"
                      >
                        Pick Media
                      </button>
                    </div>
                    <div class="flex items-center gap-2">
                      <label class="text-[10px] text-zinc-400">Template Images Choice:</label>
                      <select
                        class="px-2 py-0.5 border border-zinc-200 rounded text-[10px] bg-zinc-50 text-zinc-700 focus:outline-none"
                        @change="blogForm.image = ($event.target as HTMLSelectElement).value"
                      >
                        <option
                          value=""
                          disabled
                          selected
                        >
                          -- select local image --
                        </option>
                        <option
                          v-for="img in templateImages"
                          :key="img.value"
                          :value="img.value"
                        >
                          {{ img.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </template>

              <!-- ▓▓ PORTFOLIO FORM FIELDS ▓▓ -->
              <template v-else-if="currentModel === 'portfolio'">
                <!-- Row: Title -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Project Title:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="portfolioForm.title"
                      type="text"
                      required
                      placeholder="e.g. Lecrown Brand Launch"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Slug -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">URL Slug:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="portfolioForm.slug"
                      type="text"
                      required
                      placeholder="e.g. lecrown"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                      :disabled="currentId !== null"
                    >
                  </div>
                </div>
                <!-- Row: Subtitle -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Subtitle Tagline:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="portfolioForm.subtitle"
                      type="text"
                      required
                      placeholder="e.g. Branding & Strategy Development"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Category -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Category:</label>
                  <div class="flex-1 w-full space-y-1">
                    <select
                      v-model="portfolioForm.category"
                      class="w-48 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                      <option
                        v-for="cat in categories"
                        :key="cat"
                        :value="cat"
                      >
                        {{ cat }}
                      </option>
                    </select>
                  </div>
                </div>
                <!-- Row: Tagline -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Tagline:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="portfolioForm.tagline"
                      type="text"
                      placeholder="e.g. A comprehensive brand transformation for a mountain resort..."
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Services -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Services Provided:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="portfolioForm.services"
                      type="text"
                      placeholder="e.g. Branding, Designing, Video Production"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Industry -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Industry Segment:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="portfolioForm.industry"
                      type="text"
                      placeholder="e.g. Resorts & Hospitality"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Project Date -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Project Date / Season:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="portfolioForm.date"
                      type="text"
                      placeholder="e.g. June, 2026"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Image -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Cover Image URL:</label>
                  <div class="flex-1 w-full space-y-2">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="portfolioForm.image"
                        type="text"
                        required
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(portfolioForm, 'image')"
                      >
                        Pick Media
                      </button>
                    </div>
                    <select
                      class="px-2 py-0.5 border border-zinc-200 rounded text-[10px] bg-zinc-50 text-zinc-700 focus:outline-none"
                      @change="portfolioForm.image = ($event.target as HTMLSelectElement).value"
                    >
                      <option
                        value=""
                        disabled
                        selected
                      >
                        -- select template cover --
                      </option>
                      <option
                        v-for="img in templateImages"
                        :key="img.value"
                        :value="img.value"
                      >
                        {{ img.label }}
                      </option>
                    </select>
                  </div>
                </div>
                <!-- Row: Hero Image -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Hero Header Image URL:</label>
                  <div class="flex-1 w-full space-y-2">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="portfolioForm.heroImage"
                        type="text"
                        required
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(portfolioForm, 'heroImage')"
                      >
                        Pick Media
                      </button>
                    </div>
                    <select
                      class="px-2 py-0.5 border border-zinc-200 rounded text-[10px] bg-zinc-50 text-zinc-700 focus:outline-none"
                      @change="portfolioForm.heroImage = ($event.target as HTMLSelectElement).value"
                    >
                      <option
                        value=""
                        disabled
                        selected
                      >
                        -- select template hero --
                      </option>
                      <option
                        v-for="img in templateImages"
                        :key="img.value"
                        :value="img.value"
                      >
                        {{ img.label }}
                      </option>
                    </select>
                  </div>
                </div>
                <!-- Row: Tags -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Tags (comma-separated):</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="portfolioForm.tagsString"
                      type="text"
                      placeholder="Branding, Marketing, Social Media"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Gallery Images -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Gallery Images:</label>
                  <div class="flex-1 w-full space-y-2">
                    <div
                      v-for="(img, idx) in portfolioForm.galleryImages"
                      :key="idx"
                      class="flex items-center gap-2 max-w-xl"
                    >
                      <input
                        v-model="portfolioForm.galleryImages[idx]"
                        type="text"
                        placeholder="/Images/Pinklabel.jpg"
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(portfolioForm.galleryImages, idx)"
                      >
                        Pick Media
                      </button>
                      <button
                        type="button"
                        class="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-600 text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        aria-label="Remove image"
                        @click="portfolioForm.galleryImages.splice(idx, 1)"
                      >
                        ✕
                      </button>
                    </div>
                    <button
                      type="button"
                      class="px-3 py-1.5 border border-[#0596B8] text-[#0596B8] hover:bg-[#0596B8] hover:text-white text-xs font-semibold rounded cursor-pointer transition-colors"
                      @click="portfolioForm.galleryImages.push('')"
                    >
                      + Add Image
                    </button>
                  </div>
                </div>
                <!-- Row: Story -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Story narrative:</label>
                  <div class="flex-1 w-full space-y-1">
                    <textarea
                      v-model="portfolioForm.story"
                      required
                      rows="5"
                      placeholder="Write the detailed story behind this project here..."
                      class="w-full max-w-2xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    />
                  </div>
                </div>
                <!-- Row: Order -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Display Order index:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="portfolioForm.displayOrder"
                      type="number"
                      required
                      class="w-32 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Featured Checkbox -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-center">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 shrink-0">Featured Placement:</label>
                  <div class="flex-1 flex items-center gap-2">
                    <input
                      id="form-feat-checkbox"
                      v-model="portfolioForm.featured"
                      type="checkbox"
                      class="w-4 h-4 rounded text-[#0596B8] focus:ring-[#0596B8] border-zinc-300"
                    >
                    <label
                      for="form-feat-checkbox"
                      class="text-xs text-zinc-600 select-none cursor-pointer"
                    >Feature on the homepage featured work grid</label>
                  </div>
                </div>
              </template>

              <!-- ▓▓ CASE STUDY FORM FIELDS ▓▓ -->
              <template v-else-if="currentModel === 'case-study'">
                <!-- Row: Title -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Case Study Title:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="caseStudyForm.title"
                      type="text"
                      required
                      placeholder="e.g. Campaign Title"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Slug -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">URL Slug:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="caseStudyForm.slug"
                      type="text"
                      required
                      placeholder="e.g. campaign-slug"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                      :disabled="currentId !== null"
                    >
                  </div>
                </div>
                <!-- Row: Client -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Client Name:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="caseStudyForm.client"
                      type="text"
                      required
                      placeholder="e.g. Client Ltd."
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Category -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Category:</label>
                  <div class="flex-1 w-full space-y-1">
                    <select
                      v-model="caseStudyForm.category"
                      class="w-48 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                      <option value="">
                        -- select category --
                      </option>
                      <option
                        v-for="cat in categories"
                        :key="cat"
                        :value="cat"
                      >
                        {{ cat }}
                      </option>
                    </select>
                  </div>
                </div>
                <!-- Row: Tagline -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Tagline:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="caseStudyForm.tagline"
                      type="text"
                      placeholder="e.g. Luxury Hospitality Branding & Marketing..."
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Services -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Services Provided:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="caseStudyForm.services"
                      type="text"
                      placeholder="e.g. Branding, Designing, Video Production"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Industry -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Industry Segment:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="caseStudyForm.industry"
                      type="text"
                      placeholder="e.g. Resorts & Hospitality"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Case Study Date -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Case Study Date / Season:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="caseStudyForm.date"
                      type="text"
                      placeholder="e.g. June, 2026"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Tags -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Tags (comma-separated):</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="caseStudyForm.tagsString"
                      type="text"
                      required
                      placeholder="Branding, Campaigns"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Image -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Card Cover Image URL:</label>
                  <div class="flex-1 w-full space-y-1">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="caseStudyForm.image"
                        type="text"
                        required
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(caseStudyForm, 'image')"
                      >
                        Pick Media
                      </button>
                    </div>
                  </div>
                </div>
                <!-- Row: Hero Image -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Hero Banner Image URL:</label>
                  <div class="flex-1 w-full space-y-1">
                    <div class="flex gap-2 max-w-xl">
                      <input
                        v-model="caseStudyForm.heroImage"
                        type="text"
                        required
                        class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8] font-mono text-[11px]"
                      >
                      <button
                        type="button"
                        class="px-3 py-1.5 bg-[#0596B8] hover:bg-[#15809c] text-white text-xs font-semibold rounded cursor-pointer shrink-0 transition-colors"
                        @click="openMediaPicker(caseStudyForm, 'heroImage')"
                      >
                        Pick Media
                      </button>
                    </div>
                  </div>
                </div>
                <!-- Row: Challenge -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">The Challenge statement:</label>
                  <div class="flex-1 w-full space-y-1">
                    <textarea
                      v-model="caseStudyForm.challenge"
                      required
                      rows="3"
                      placeholder="Describe the challenge..."
                      class="w-full max-w-2xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    />
                  </div>
                </div>
                <!-- Row: Approach -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Our Strategic Approach:</label>
                  <div class="flex-1 w-full space-y-1">
                    <textarea
                      v-model="caseStudyForm.approach"
                      required
                      rows="3"
                      placeholder="Describe our strategic design approach..."
                      class="w-full max-w-2xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    />
                  </div>
                </div>
                <!-- Row: Results Summary -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Results Summary Copy:</label>
                  <div class="flex-1 w-full space-y-1">
                    <textarea
                      v-model="caseStudyForm.resultsSummary"
                      rows="3"
                      placeholder="e.g. The project established a cohesive and recognizable visual identity..."
                      class="w-full max-w-2xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    />
                  </div>
                </div>
              </template>

              <!-- ▓▓ CAREER FORM FIELDS ▓▓ -->
              <template v-else-if="currentModel === 'career'">
                <!-- Row: Job Title -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Job Position Title:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="careerForm.title"
                      type="text"
                      required
                      placeholder="e.g. Senior Copywriter"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Department -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Department Unit:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="careerForm.department"
                      type="text"
                      required
                      placeholder="e.g. Creative Strategy"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Location -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Location / Workplace:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="careerForm.location"
                      type="text"
                      required
                      placeholder="e.g. Kochi, Kerala (Onsite / Hybrid)"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Job Type -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Job Type:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="careerForm.type"
                      type="text"
                      required
                      placeholder="e.g. Full-Time or Contract"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Experience -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Experience requirement:</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="careerForm.experience"
                      type="text"
                      required
                      placeholder="e.g. 3+ Years Experience"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                  </div>
                </div>
                <!-- Row: Apply URL -->
                <div class="flex flex-col md:flex-row p-4 gap-4 items-start">
                  <label class="w-full md:w-48 text-xs font-bold text-zinc-700 pt-2 shrink-0">Apply URL (LinkedIn etc.):</label>
                  <div class="flex-1 w-full space-y-1">
                    <input
                      v-model="careerForm.applyUrl"
                      type="url"
                      placeholder="e.g. https://linkedin.com/jobs/view/123456"
                      class="w-full max-w-xl px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                    >
                    <p class="text-[10px] text-zinc-400">
                      External job posting link — visitors clicking this role will be redirected here.
                    </p>
                  </div>
                </div>
              </template>
            </div>

            <!-- ── DJANGO INLINE SECTIONS (Body, solutions, metrics) ── -->
            <!-- Portfolio Story Paragraphs Inlines -->
            <div
              v-if="currentModel === 'portfolio'"
              class="space-y-4"
            >
              <div class="flex items-center justify-between border-b border-[#e0e0e0] pb-2">
                <h3 class="text-xs font-bold text-zinc-500 uppercase tracking-wide">
                  Project Story Paragraphs Inlines
                </h3>
                <button
                  type="button"
                  class="px-3 py-1 bg-zinc-200 hover:bg-zinc-300 border border-zinc-300 text-zinc-700 text-xs font-bold rounded cursor-pointer"
                  @click="addPortfolioStoryParagraph"
                >
                  + Add Story Paragraph
                </button>
              </div>

              <div class="bg-white border border-[#e0e0e0] rounded p-4 space-y-3">
                <div
                  v-for="(para, index) in portfolioForm.storyParagraphs"
                  :key="index"
                  class="flex gap-2 items-start"
                >
                  <span class="text-xs text-zinc-400 font-mono w-6 pt-2">{{ index + 1 }}.</span>
                  <textarea
                    v-model="portfolioForm.storyParagraphs[index]"
                    required
                    rows="3"
                    placeholder="Write a paragraph describing the project's story..."
                    class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                  />
                  <button
                    type="button"
                    class="text-red-500 hover:underline font-bold text-xs p-1 pt-2 cursor-pointer"
                    @click="removePortfolioStoryParagraph(index)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <!-- 1. Blog Body Inlines -->
            <div
              v-if="currentModel === 'blog'"
              class="space-y-4"
            >
              <div class="flex items-center justify-between border-b border-[#e0e0e0] pb-2">
                <h3 class="text-xs font-bold text-zinc-500 uppercase tracking-wide">
                  Blog Body Inline Sections
                </h3>
                <button
                  type="button"
                  class="px-3 py-1 bg-zinc-200 hover:bg-zinc-300 border border-zinc-300 text-zinc-700 text-xs font-bold rounded cursor-pointer"
                  @click="addBlogBodySection"
                >
                  + Add Another Paragraph Section
                </button>
              </div>

              <div class="space-y-4">
                <div
                  v-for="(section, idx) in blogForm.body"
                  :key="idx"
                  class="bg-white border border-[#e0e0e0] rounded overflow-hidden relative"
                >
                  <div class="bg-zinc-100 px-4 py-2 border-b border-[#e0e0e0] flex items-center justify-between">
                    <span class="text-xs font-bold text-zinc-600">Paragraph Section #{{ idx + 1 }}</span>
                    <button
                      type="button"
                      class="text-xs text-red-500 hover:underline cursor-pointer"
                      @click="removeBlogBodySection(idx)"
                    >
                      Delete
                    </button>
                  </div>
                  <div class="p-4 space-y-3">
                    <div class="flex flex-col md:flex-row gap-4 items-start">
                      <label class="w-full md:w-36 text-xs text-zinc-500 pt-2 shrink-0">Section Heading:</label>
                      <input
                        v-model="section.heading"
                        type="text"
                        placeholder="e.g. The Psychology of Color"
                        class="flex-1 w-full px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                      >
                    </div>
                    <div class="flex flex-col md:flex-row gap-4 items-start">
                      <label class="w-full md:w-36 text-xs text-zinc-500 pt-2 shrink-0">Section Content:</label>
                      <textarea
                        v-model="section.content"
                        required
                        rows="4"
                        placeholder="Write body paragraph text here..."
                        class="flex-1 w-full px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Case Study Challenge Paragraphs Inlines -->
            <div
              v-if="currentModel === 'case-study'"
              class="space-y-4"
            >
              <div class="flex items-center justify-between border-b border-[#e0e0e0] pb-2">
                <h3 class="text-xs font-bold text-zinc-500 uppercase tracking-wide">
                  Case Study Challenge Paragraphs Inlines
                </h3>
                <button
                  type="button"
                  class="px-3 py-1 bg-zinc-200 hover:bg-zinc-300 border border-zinc-300 text-zinc-700 text-xs font-bold rounded cursor-pointer"
                  @click="addCaseStudyChallengeParagraph"
                >
                  + Add Challenge Paragraph
                </button>
              </div>

              <div class="bg-white border border-[#e0e0e0] rounded p-4 space-y-3">
                <div
                  v-for="(para, index) in caseStudyForm.challengeParagraphs"
                  :key="index"
                  class="flex gap-2 items-start"
                >
                  <span class="text-xs text-zinc-400 font-mono w-6 pt-2">{{ index + 1 }}.</span>
                  <textarea
                    v-model="caseStudyForm.challengeParagraphs[index]"
                    required
                    rows="3"
                    placeholder="Write a paragraph describing the challenge..."
                    class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                  />
                  <button
                    type="button"
                    class="text-red-500 hover:underline font-bold text-xs p-1 pt-2 cursor-pointer"
                    @click="removeCaseStudyChallengeParagraph(index)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <!-- Case Study Approach Paragraphs Inlines -->
            <div
              v-if="currentModel === 'case-study'"
              class="space-y-4"
            >
              <div class="flex items-center justify-between border-b border-[#e0e0e0] pb-2">
                <h3 class="text-xs font-bold text-zinc-500 uppercase tracking-wide">
                  Case Study Approach Paragraphs Inlines
                </h3>
                <button
                  type="button"
                  class="px-3 py-1 bg-zinc-200 hover:bg-zinc-300 border border-zinc-300 text-zinc-700 text-xs font-bold rounded cursor-pointer"
                  @click="addCaseStudyApproachParagraph"
                >
                  + Add Approach Paragraph
                </button>
              </div>

              <div class="bg-white border border-[#e0e0e0] rounded p-4 space-y-3">
                <div
                  v-for="(para, index) in caseStudyForm.approachParagraphs"
                  :key="index"
                  class="flex gap-2 items-start"
                >
                  <span class="text-xs text-zinc-400 font-mono w-6 pt-2">{{ index + 1 }}.</span>
                  <textarea
                    v-model="caseStudyForm.approachParagraphs[index]"
                    required
                    rows="3"
                    placeholder="Write a paragraph describing the strategic approach..."
                    class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                  />
                  <button
                    type="button"
                    class="text-red-500 hover:underline font-bold text-xs p-1 pt-2 cursor-pointer"
                    @click="removeCaseStudyApproachParagraph(index)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <!-- 2. Case Study Solution Points Inlines -->
            <div
              v-if="currentModel === 'case-study'"
              class="space-y-4"
            >
              <div class="flex items-center justify-between border-b border-[#e0e0e0] pb-2">
                <h3 class="text-xs font-bold text-zinc-500 uppercase tracking-wide">
                  The Solutions Inline Bullet Points
                </h3>
                <button
                  type="button"
                  class="px-3 py-1 bg-zinc-200 hover:bg-zinc-300 border border-zinc-300 text-zinc-700 text-xs font-bold rounded cursor-pointer"
                  @click="addSolutionPoint"
                >
                  + Add Point
                </button>
              </div>

              <div class="bg-white border border-[#e0e0e0] rounded p-4 space-y-2">
                <div
                  v-for="(point, index) in caseStudyForm.solution"
                  :key="index"
                  class="flex gap-2 items-center"
                >
                  <span class="text-xs text-zinc-400 font-mono w-6">{{ index + 1 }}.</span>
                  <input
                    v-model="caseStudyForm.solution[index]"
                    type="text"
                    required
                    placeholder="e.g. Professional photography and videography capturing the property"
                    class="flex-1 px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                  >
                  <button
                    type="button"
                    class="text-red-500 hover:underline font-bold text-xs p-1 cursor-pointer"
                    @click="removeSolutionPoint(index)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <!-- 3. Case Study Results Metrics Inlines -->
            <div
              v-if="currentModel === 'case-study'"
              class="space-y-4"
            >
              <div class="flex items-center justify-between border-b border-[#e0e0e0] pb-2">
                <h3 class="text-xs font-bold text-zinc-500 uppercase tracking-wide">
                  Results & Metrics Inlines
                </h3>
                <button
                  type="button"
                  class="px-3 py-1 bg-zinc-200 hover:bg-zinc-300 border border-zinc-300 text-zinc-700 text-xs font-bold rounded cursor-pointer"
                  @click="addResultMetric"
                >
                  + Add Metric
                </button>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(metric, idx) in caseStudyForm.results"
                  :key="idx"
                  class="bg-white border border-[#e0e0e0] rounded overflow-hidden"
                >
                  <div class="bg-zinc-100 px-4 py-2 border-b border-[#e0e0e0] flex items-center justify-between">
                    <span class="text-xs font-bold text-zinc-600">Metric Inline Row #{{ idx + 1 }}</span>
                    <button
                      type="button"
                      class="text-xs text-red-500 hover:underline cursor-pointer"
                      @click="removeResultMetric(idx)"
                    >
                      Delete
                    </button>
                  </div>
                  <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] font-bold text-zinc-500">Metric Value:</label>
                      <input
                        v-model="metric.metric"
                        type="text"
                        required
                        placeholder="e.g. +180% or 3.2x"
                        class="px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                      >
                    </div>
                    <div class="flex flex-col gap-1">
                      <label class="text-[10px] font-bold text-zinc-500">Label description:</label>
                      <input
                        v-model="metric.label"
                        type="text"
                        required
                        placeholder="e.g. Growth in Social Reach"
                        class="px-3 py-1.5 border border-zinc-300 rounded text-xs bg-zinc-50 focus:outline-none focus:border-[#0596B8]"
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── STICKY DJANGO SAVE CONTROL BAR ── -->
            <div class="bg-zinc-100 border border-[#e0e0e0] p-4 rounded flex items-center justify-between shrink-0">
              <div>
                <button
                  v-if="currentId !== null && currentModel !== 'page-settings'"
                  type="button"
                  class="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded cursor-pointer"
                  @click="deleteCurrentItem"
                >
                  Delete
                </button>
              </div>
              <div class="flex flex-wrap gap-2.5">
                <button
                  v-if="currentModel !== 'page-settings'"
                  type="button"
                  class="px-4 py-1.5 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-bold rounded cursor-pointer"
                  @click="handleSave('save_and_add')"
                >
                  Save and add another
                </button>
                <button
                  v-if="currentModel !== 'page-settings'"
                  type="button"
                  class="px-4 py-1.5 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-bold rounded cursor-pointer"
                  @click="handleSave('save_and_continue')"
                >
                  Save and continue editing
                </button>
                <button
                  type="submit"
                  class="px-5 py-1.5 bg-[#141111] hover:bg-black text-white text-xs font-bold rounded cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>

    <!-- Media Picker Modal Component -->
    <MediaPicker
      v-model="isMediaPickerOpen"
      @select="handleMediaSelect"
    />
  </div>
</template>
