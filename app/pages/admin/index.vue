<script setup lang="ts">
import type { BlogPost } from '~/data/blog'

// Dynamic state composables
const { posts: blogs, addPost, updatePost, deletePost, resetBlogs } = useBlogs()
const { projects: portfolio, addProject, updateProject, deleteProject, resetPortfolio } = usePortfolio()
const { jobs: careers, addJob, updateJob, deleteJob, resetCareers } = useCareers()
const { caseStudies, addCaseStudy, updateCaseStudy, deleteCaseStudy, resetCaseStudies } = useCaseStudies()

useSeoMeta({
  title: 'Admin Dashboard — Macawoo',
  description: 'Control center for updating Macawoo content.'
})

// Tabs definition
const tabs = [
  { label: '🎛️ Dashboard', value: 'dashboard' },
  { label: '📝 Blogs', value: 'blogs' },
  { label: '💼 Portfolio / Featured', value: 'portfolio' },
  { label: '📊 Case Studies', value: 'case-studies' },
  { label: '👥 Careers (Open Roles)', value: 'careers' }
] as const

// Navigation tab state
const activeTab = ref<'dashboard' | 'blogs' | 'portfolio' | 'case-studies' | 'careers'>('dashboard')

// Template images for selection
const templateImages = [
  { label: 'Branding & Design Cover', value: '/Images/Branding.jpeg' },
  { label: 'Designing Hero', value: '/Images/Designing.jpeg' },
  { label: 'Digital Marketing Cover', value: '/Images/Digital Marketing.jpeg' },
  { label: 'Marketing Cover', value: '/Images/Marketing.jpeg' },
  { label: 'Video Production Cover', value: '/Images/Video Production.jpeg' },
  { label: 'Lecrown Project', value: '/Images/Lecrown.png' },
  { label: 'Pinklabel Project', value: '/Images/Pinklabel.jpg' },
  { label: 'TAB Project', value: '/Images/TAB.png' },
  { label: 'Take My Family Project', value: '/Images/Take my family.png' },
  { label: 'Hero Graphic', value: '/Images/hero.png' }
]

// Slug helper
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

// Modal Form states
const isModalOpen = ref(false)
const modalType = ref<'blog' | 'portfolio' | 'case-study' | 'career'>('blog')
const modalMode = ref<'create' | 'edit'>('create')
const editId = ref<string | number>('') // slug or ID

// Form models
const blogForm = ref({
  title: '',
  slug: '',
  excerpt: '',
  date: new Date().toISOString().split('T')[0] || '',
  readTime: '5 Min Read',
  image: '/Images/Branding.jpeg',
  body: [] as { heading?: string, content: string }[]
})

const portfolioForm = ref({
  title: '',
  slug: '',
  subtitle: '',
  category: 'Branding' as 'Branding' | 'Marketing' | 'Video Production',
  tagsString: '',
  image: '/Images/Lecrown.png',
  heroImage: '/Images/Lecrown.png',
  galleryImagesString: '',
  story: '',
  featured: true,
  displayOrder: 1
})

const caseStudyForm = ref({
  title: '',
  slug: '',
  client: '',
  tagsString: '',
  image: '/Images/Lecrown.png',
  heroImage: '/Images/Lecrown.png',
  challenge: '',
  approach: '',
  solution: [] as string[],
  results: [] as { metric: string, label: string }[]
})

const careerForm = ref({
  id: '',
  title: 'Senior UI/UX Designer',
  department: 'Design',
  location: 'Kochi',
  type: 'Full-Time',
  experience: '4+ Years Experience'
})

// Auto-slug watcher for forms
watch(() => blogForm.value.title, (newTitle) => {
  if (modalMode.value === 'create') {
    blogForm.value.slug = generateSlug(newTitle)
  }
})
watch(() => portfolioForm.value.title, (newTitle) => {
  if (modalMode.value === 'create') {
    portfolioForm.value.slug = generateSlug(newTitle)
  }
})
watch(() => caseStudyForm.value.title, (newTitle) => {
  if (modalMode.value === 'create') {
    caseStudyForm.value.slug = generateSlug(newTitle)
  }
})

// CRUD Handlers
const openCreateModal = (type: 'blog' | 'portfolio' | 'case-study' | 'career') => {
  modalType.value = type
  modalMode.value = 'create'
  editId.value = ''
  isModalOpen.value = true

  // Reset form schemas
  if (type === 'blog') {
    blogForm.value = {
      title: '',
      slug: '',
      excerpt: '',
      date: new Date().toISOString().split('T')[0] || '',
      readTime: '5 Min Read',
      image: '/Images/Branding.jpeg',
      body: [{ heading: 'Introduction', content: '' }]
    }
  } else if (type === 'portfolio') {
    portfolioForm.value = {
      title: '',
      slug: '',
      subtitle: '',
      category: 'Branding',
      tagsString: '',
      image: '/Images/Lecrown.png',
      heroImage: '/Images/Lecrown.png',
      galleryImagesString: '',
      story: '',
      featured: true,
      displayOrder: portfolio.value.length + 1
    }
  } else if (type === 'case-study') {
    caseStudyForm.value = {
      title: '',
      slug: '',
      client: '',
      tagsString: '',
      image: '/Images/Lecrown.png',
      heroImage: '/Images/Lecrown.png',
      challenge: '',
      approach: '',
      solution: [''],
      results: [{ metric: '', label: '' }]
    }
  } else if (type === 'career') {
    careerForm.value = {
      id: String(Date.now()),
      title: '',
      department: 'Design',
      location: 'Kochi',
      type: 'Full-Time',
      experience: ''
    }
  }
}

const openEditModal = (type: 'blog' | 'portfolio' | 'case-study' | 'career', id: string | number) => {
  modalType.value = type
  modalMode.value = 'edit'
  editId.value = id
  isModalOpen.value = true

  if (type === 'blog') {
    const original = blogs.value.find(b => b.slug === id)
    if (original) {
      blogForm.value = JSON.parse(JSON.stringify(original))
    }
  } else if (type === 'portfolio') {
    const original = portfolio.value.find(p => p.slug === id)
    if (original) {
      portfolioForm.value = {
        ...JSON.parse(JSON.stringify(original)),
        tagsString: original.tags.join(', '),
        galleryImagesString: original.galleryImages.join(', ')
      }
    }
  } else if (type === 'case-study') {
    const original = caseStudies.value.find(c => c.slug === id)
    if (original) {
      caseStudyForm.value = {
        ...JSON.parse(JSON.stringify(original)),
        tagsString: original.tags.join(', ')
      }
    }
  } else if (type === 'career') {
    const original = careers.value.find(c => c.id === id)
    if (original) {
      careerForm.value = JSON.parse(JSON.stringify(original))
    }
  }
}

// Submit forms
const handleFormSubmit = () => {
  if (modalType.value === 'blog') {
    if (modalMode.value === 'create') {
      addPost(blogForm.value as BlogPost)
    } else {
      updatePost(editId.value as string, blogForm.value as BlogPost)
    }
  } else if (modalType.value === 'portfolio') {
    const processedProject = {
      ...portfolioForm.value,
      tags: portfolioForm.value.tagsString.split(',').map(s => s.trim()).filter(Boolean),
      galleryImages: portfolioForm.value.galleryImagesString.split(',').map(s => s.trim()).filter(Boolean)
    }
    // Delete temporary string fields before saving
    delete (processedProject as any).tagsString
    delete (processedProject as any).galleryImagesString

    if (modalMode.value === 'create') {
      addProject(processedProject)
    } else {
      updateProject(editId.value as string, processedProject)
    }
  } else if (modalType.value === 'case-study') {
    const processedStudy = {
      ...caseStudyForm.value,
      tags: caseStudyForm.value.tagsString.split(',').map(s => s.trim()).filter(Boolean),
      solution: caseStudyForm.value.solution.filter(Boolean),
      results: caseStudyForm.value.results.filter(r => r.metric && r.label)
    }
    delete (processedStudy as any).tagsString

    if (modalMode.value === 'create') {
      addCaseStudy(processedStudy)
    } else {
      updateCaseStudy(editId.value as string, processedStudy)
    }
  } else if (modalType.value === 'career') {
    if (modalMode.value === 'create') {
      addJob({ ...careerForm.value })
    } else {
      updateJob(editId.value as string, { ...careerForm.value })
    }
  }

  isModalOpen.value = false
}

// Quick helpers for dynamic forms
const addBlogBodySection = () => {
  blogForm.value.body.push({ heading: '', content: '' })
}
const removeBlogBodySection = (idx: number) => {
  blogForm.value.body.splice(idx, 1)
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

// Re-sorting portfolio
const moveProjectOrder = (index: number, direction: 'up' | 'down') => {
  const sorted = [...portfolio.value].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= sorted.length) return

  const itemA = sorted[index]
  const itemB = sorted[targetIndex]
  if (itemA && itemB) {
    // Swap displayOrders
    const temp = itemA.displayOrder ?? index
    itemA.displayOrder = itemB.displayOrder ?? targetIndex
    itemB.displayOrder = temp

    portfolio.value = sorted
  }
}

// Reset operations
const resetAllDynamicState = () => {
  if (confirm('Are you sure you want to discard all browser modifications and restore original static mock data?')) {
    resetBlogs()
    resetPortfolio()
    resetCareers()
    resetCaseStudies()
    alert('Local data reset completed successfully.')
  }
}
</script>

<template>
  <div>
    <!-- Hero Block — styled to match the public subpages -->
    <PageHero
      variant="teal"
      title-html="ADMIN <span class=&quot;text-brand-yellow-500&quot;>PANEL</span>"
      video="/Background%20Videos/Portfolio.mp4"
      image="/Images/Designing.jpeg"
      description="The workspace command center for Macawoo. Dynamically modify portfolios, blogs, open roles, case studies, and homepage layout grids."
    />

    <!-- Main Section — Light layout mirroring public listings -->
    <section class="bg-zinc-50 py-16 md:py-20 text-brand-dark">
      <div class="max-w-[1266px] mx-auto px-6 md:px-8">
        <!-- Controls Row -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-zinc-200 pb-6">
          <h2 class="text-2xl font-bold font-sans text-brand-dark">
            Workspace Console
          </h2>
          <button
            class="px-5 py-2.5 rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition text-sm font-bold shadow-sm"
            @click="resetAllDynamicState"
          >
            Reset All Data ↺
          </button>
        </div>

        <!-- Filter tabs for Admin Navigation — identical style to Portfolio index.vue -->
        <div class="flex flex-wrap gap-2.5 mb-10 justify-center border-b border-zinc-200 pb-6">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 select-none"
            :class="activeTab === tab.value
              ? 'bg-brand-yellow-500 text-brand-dark shadow-sm'
              : 'border border-zinc-300 bg-white text-zinc-600 hover:border-brand-teal-500 hover:text-brand-teal-500'"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab Content Area -->
        <div class="mt-6">
          <!-- TAB 1: DASHBOARD -->
          <div
            v-if="activeTab === 'dashboard'"
            class="space-y-8"
          >
            <!-- Welcome Info Box (Teal Banner) -->
            <div
              class="p-8 rounded-2xl text-white border border-brand-teal-700 bg-brand-teal-500 shadow-sm"
            >
              <h3 class="text-2xl font-bold font-fredoka text-[#E8F600] mb-3">
                Welcome to your Macawoo Studio Admin Panel
              </h3>
              <p class="text-white/95 leading-relaxed text-sm max-w-4xl">
                This Console allows you to update, remove, or insert content dynamically. All mutations are stored locally inside your browser's client-side database (`localStorage`). This lets you review complete design variations, preview copy adjustments, or prototype layouts before committing them to a production backend.
              </p>
            </div>

            <!-- Stats grid -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 text-center">
                <span class="text-3xl block mb-2">📝</span>
                <span class="text-3xl font-bold text-brand-teal-500 block mb-1">{{ blogs.length }}</span>
                <span class="text-xs text-zinc-500 font-bold uppercase tracking-wider">Total Blogs</span>
              </div>
              <div class="bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 text-center">
                <span class="text-3xl block mb-2">💼</span>
                <span class="text-3xl font-bold text-brand-teal-500 block mb-1">{{ portfolio.length }}</span>
                <span class="text-xs text-zinc-500 font-bold uppercase tracking-wider">Portfolio Works</span>
              </div>
              <div class="bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 text-center">
                <span class="text-3xl block mb-2">⭐</span>
                <span class="text-3xl font-bold text-brand-teal-500 block mb-1">
                  {{ portfolio.filter(p => p.featured !== false).length }}
                </span>
                <span class="text-xs text-zinc-500 font-bold uppercase tracking-wider">Featured on Home</span>
              </div>
              <div class="bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 text-center">
                <span class="text-3xl block mb-2">👥</span>
                <span class="text-3xl font-bold text-brand-teal-500 block mb-1">{{ careers.length }}</span>
                <span class="text-xs text-zinc-500 font-bold uppercase tracking-wider">Open Career Roles</span>
              </div>
            </div>

            <!-- Guide Section -->
            <div class="bg-white border border-zinc-200 shadow-sm rounded-2xl p-8">
              <h3 class="font-bold text-brand-dark text-lg mb-4">
                Front-End Persistence Guide
              </h3>
              <ul class="space-y-3.5 text-sm text-zinc-600">
                <li class="flex items-start gap-2.5">
                  <span class="text-brand-teal-500 font-bold text-base">✓</span>
                  <span>Navigate to any page from the top/footer links, and modifications will be rendered instantly.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-brand-teal-500 font-bold text-base">✓</span>
                  <span>Hit "Reset All Data" at the top right to erase browser edits and revert to the static codebase files.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-brand-teal-500 font-bold text-base">✓</span>
                  <span>Standardized file paths like <code class="bg-zinc-100 text-brand-teal-600 px-1.5 py-0.5 rounded text-xs">/Images/Branding.jpeg</code> point to resources in the public assets folder.</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- TAB 2: BLOGS -->
          <div
            v-if="activeTab === 'blogs'"
            class="space-y-6"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold font-sans text-brand-dark">
                Manage Journal Posts
              </h2>
              <button
                class="px-6 py-2.5 bg-brand-teal-500 hover:bg-brand-teal-600 text-white text-sm font-bold rounded-full transition shadow-sm"
                @click="openCreateModal('blog')"
              >
                + New Blog Post
              </button>
            </div>

            <!-- Blog List Cards -->
            <div class="space-y-4">
              <div
                v-for="post in blogs"
                :key="post.slug"
                class="flex items-center justify-between bg-white border border-zinc-200 rounded-2xl p-5 hover:shadow-md transition gap-4"
              >
                <div class="flex items-center gap-4 min-w-0">
                  <img
                    :src="post.image"
                    class="w-16 h-12 object-cover rounded-lg bg-zinc-100 shrink-0 border border-zinc-200"
                  >
                  <div class="min-w-0">
                    <h3 class="font-bold text-brand-dark truncate text-base">
                      {{ post.title }}
                    </h3>
                    <p class="text-xs text-zinc-400 truncate mt-1">
                      /blog/{{ post.slug }} · {{ post.date }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button
                    class="px-4 py-2 rounded-xl border border-zinc-300 text-zinc-700 hover:text-brand-teal-500 hover:bg-zinc-50 text-xs font-semibold transition"
                    @click="openEditModal('blog', post.slug)"
                  >
                    Edit
                  </button>
                  <button
                    class="px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold transition"
                    @click="deletePost(post.slug)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 3: PORTFOLIO & FEATURED WORKS -->
          <div
            v-if="activeTab === 'portfolio'"
            class="space-y-6"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold font-sans text-brand-dark">
                Manage Portfolio Projects
              </h2>
              <button
                class="px-6 py-2.5 bg-brand-teal-500 hover:bg-brand-teal-600 text-white text-sm font-bold rounded-full transition shadow-sm"
                @click="openCreateModal('portfolio')"
              >
                + New Project
              </button>
            </div>

            <!-- Portfolio Items & Homepage Reordering -->
            <div class="space-y-4">
              <p class="text-sm text-zinc-500 leading-relaxed">
                To reorder featured works displayed on the Homepage, click the up (▲) or down (▼) buttons. Toggle "Featured" inside a project to control homepage selection.
              </p>

              <div class="space-y-4">
                <div
                  v-for="(project, idx) in [...portfolio].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))"
                  :key="project.slug"
                  class="bg-white border rounded-2xl p-5 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  :class="project.featured !== false ? 'border-brand-yellow-500/50 shadow-sm' : 'border-zinc-200'"
                >
                  <div class="flex items-center gap-4 min-w-0">
                    <img
                      :src="project.image"
                      class="w-16 h-12 object-cover rounded-lg bg-zinc-100 shrink-0 border border-zinc-200"
                    >
                    <div class="min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <h3 class="font-bold text-brand-dark text-base leading-snug">
                          {{ project.title }}
                        </h3>
                        <span
                          v-if="project.featured !== false"
                          class="text-[10px] bg-brand-yellow-500 text-brand-dark font-bold px-2.5 py-0.5 rounded-full select-none shrink-0 uppercase tracking-wider"
                        >Featured</span>
                      </div>
                      <p class="text-xs text-zinc-400 truncate mt-1">
                        {{ project.category }} · Slug: {{ project.slug }}
                      </p>
                    </div>
                  </div>

                  <div class="flex flex-wrap items-center gap-3 justify-end shrink-0">
                    <!-- Ordering Controls -->
                    <div class="flex items-center gap-1 bg-zinc-50 rounded-xl p-1 border border-zinc-200 shadow-inner">
                      <button
                        class="p-1 px-3 hover:bg-zinc-200 text-zinc-600 hover:text-brand-dark rounded disabled:opacity-20 text-xs font-mono transition"
                        :disabled="idx === 0"
                        title="Move Up"
                        @click="moveProjectOrder(idx, 'up')"
                      >
                        ▲
                      </button>
                      <button
                        class="p-1 px-3 hover:bg-zinc-200 text-zinc-600 hover:text-brand-dark rounded disabled:opacity-20 text-xs font-mono transition"
                        :disabled="idx === portfolio.length - 1"
                        title="Move Down"
                        @click="moveProjectOrder(idx, 'down')"
                      >
                        ▼
                      </button>
                    </div>

                    <!-- Actions -->
                    <button
                      class="px-4 py-2 rounded-xl border border-zinc-300 text-zinc-700 hover:text-brand-teal-500 hover:bg-zinc-50 text-xs font-semibold transition"
                      @click="openEditModal('portfolio', project.slug)"
                    >
                      Edit
                    </button>
                    <button
                      class="px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold transition"
                      @click="deleteProject(project.slug)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 4: CASE STUDIES -->
          <div
            v-if="activeTab === 'case-studies'"
            class="space-y-6"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold font-sans text-brand-dark">
                Manage Case Studies
              </h2>
              <button
                class="px-6 py-2.5 bg-brand-teal-500 hover:bg-brand-teal-600 text-white text-sm font-bold rounded-full transition shadow-sm"
                @click="openCreateModal('case-study')"
              >
                + New Case Study
              </button>
            </div>

            <!-- Case Studies List -->
            <div class="space-y-4">
              <div
                v-for="study in caseStudies"
                :key="study.slug"
                class="flex items-center justify-between bg-white border border-zinc-200 rounded-2xl p-5 hover:shadow-md transition gap-4"
              >
                <div class="flex items-center gap-4 min-w-0">
                  <img
                    :src="study.image"
                    class="w-16 h-12 object-cover rounded-lg bg-zinc-100 shrink-0 border border-zinc-200"
                  >
                  <div class="min-w-0">
                    <h3 class="font-bold text-brand-dark truncate text-base">
                      {{ study.title }}
                    </h3>
                    <p class="text-xs text-zinc-400 truncate mt-1">
                      Client: {{ study.client }} · /case-studies/{{ study.slug }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button
                    class="px-4 py-2 rounded-xl border border-zinc-300 text-zinc-700 hover:text-brand-teal-500 hover:bg-zinc-50 text-xs font-semibold transition"
                    @click="openEditModal('case-study', study.slug)"
                  >
                    Edit
                  </button>
                  <button
                    class="px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold transition"
                    @click="deleteCaseStudy(study.slug)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 5: CAREERS (OPEN ROLES) -->
          <div
            v-if="activeTab === 'careers'"
            class="space-y-6"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold font-sans text-brand-dark">
                Manage Open Roles
              </h2>
              <button
                class="px-6 py-2.5 bg-brand-teal-500 hover:bg-brand-teal-600 text-white text-sm font-bold rounded-full transition shadow-sm"
                @click="openCreateModal('career')"
              >
                + Add Open Role
              </button>
            </div>

            <!-- Careers List -->
            <div class="space-y-4">
              <div
                v-for="job in careers"
                :key="job.id"
                class="flex items-center justify-between bg-white border border-zinc-200 rounded-2xl p-5 hover:shadow-md transition gap-4"
              >
                <div class="min-w-0">
                  <h3 class="font-bold text-brand-teal-500 text-lg leading-snug">
                    {{ job.title }}
                  </h3>
                  <p class="text-xs text-zinc-400 truncate mt-1">
                    {{ job.department }} · {{ job.location }} · {{ job.type }} · {{ job.experience }}
                  </p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button
                    class="px-4 py-2 rounded-xl border border-zinc-300 text-zinc-700 hover:text-brand-teal-500 hover:bg-zinc-50 text-xs font-semibold transition"
                    @click="openEditModal('career', job.id)"
                  >
                    Edit
                  </button>
                  <button
                    class="px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold transition"
                    @click="deleteJob(job.id)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MODAL OVERLAY EDITOR (Floating Light Glass modal panel) -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        class="absolute inset-0 bg-brand-dark/60 backdrop-blur-md"
        @click="isModalOpen = false"
      />

      <div
        class="relative bg-white border border-zinc-200 text-brand-dark rounded-3xl w-full max-w-3xl p-8 max-h-[85vh] overflow-y-auto shadow-2xl space-y-6"
      >
        <!-- Modal Close Button -->
        <button
          class="absolute top-5 right-5 text-zinc-400 hover:text-brand-dark transition text-xl"
          @click="isModalOpen = false"
        >
          ✕
        </button>

        <div class="border-b border-zinc-200 pb-4">
          <span class="text-xs uppercase font-bold text-brand-teal-500 tracking-wider font-fredoka">{{ modalMode === 'create' ? 'Create' : 'Edit' }} Content</span>
          <h2 class="text-2xl font-bold font-sans text-brand-dark capitalize mt-0.5">
            {{ modalType }} Details
          </h2>
        </div>

        <form
          class="space-y-5"
          @submit.prevent="handleFormSubmit"
        >
          <!-- ── FORM FOR BLOGS ── -->
          <div
            v-if="modalType === 'blog'"
            class="space-y-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Blog Title</label>
                <input
                  v-model="blogForm.title"
                  type="text"
                  required
                  placeholder="e.g. Scaling Brand Identity in 2026"
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">URL Slug</label>
                <input
                  v-model="blogForm.slug"
                  type="text"
                  required
                  placeholder="e.g. scaling-brand-identity-2026"
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                  :disabled="modalMode === 'edit'"
                >
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-zinc-700 mb-1.5">Excerpt</label>
              <textarea
                v-model="blogForm.excerpt"
                required
                rows="2"
                placeholder="Brief summary of the blog post to display in the card..."
                class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Publish Date</label>
                <input
                  v-model="blogForm.date"
                  type="date"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Read Time</label>
                <input
                  v-model="blogForm.readTime"
                  type="text"
                  required
                  placeholder="e.g. 6 Min Read"
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Cover Image Path / URL</label>
                <input
                  v-model="blogForm.image"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
            </div>

            <!-- Quick template image select -->
            <div>
              <label class="block text-xs font-bold text-zinc-400 mb-1">Select from Template Images</label>
              <select
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 text-xs focus:outline-none"
                @change="blogForm.image = ($event.target as HTMLSelectElement).value"
              >
                <option
                  value=""
                  disabled
                  selected
                >
                  -- Choose local template asset --
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

            <!-- Dynamic Blog Content Sections -->
            <div class="border-t border-zinc-200 pt-4 space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-zinc-800">
                  Blog Body Sections
                </h3>
                <button
                  type="button"
                  class="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-brand-dark rounded-lg transition border border-zinc-200"
                  @click="addBlogBodySection"
                >
                  + Add Paragraph Section
                </button>
              </div>

              <div class="space-y-4">
                <div
                  v-for="(section, idx) in blogForm.body"
                  :key="idx"
                  class="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3 relative"
                >
                  <button
                    type="button"
                    class="absolute top-2 right-2 text-red-500 hover:text-red-600 text-xs font-bold"
                    @click="removeBlogBodySection(idx)"
                  >
                    Remove
                  </button>
                  <div>
                    <label class="block text-xs text-zinc-500 mb-1">Section Heading (Optional)</label>
                    <input
                      v-model="section.heading"
                      type="text"
                      placeholder="e.g. The Psychology of Color"
                      class="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-brand-dark text-xs"
                    >
                  </div>
                  <div>
                    <label class="block text-xs text-zinc-500 mb-1">Section Content</label>
                    <textarea
                      v-model="section.content"
                      required
                      rows="4"
                      placeholder="Write paragraph content here..."
                      class="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-brand-dark text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── FORM FOR PORTFOLIO ── -->
          <div
            v-if="modalType === 'portfolio'"
            class="space-y-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Project Title</label>
                <input
                  v-model="portfolioForm.title"
                  type="text"
                  required
                  placeholder="e.g. Lecrown"
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">URL Slug</label>
                <input
                  v-model="portfolioForm.slug"
                  type="text"
                  required
                  placeholder="e.g. lecrown"
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                  :disabled="modalMode === 'edit'"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Subtitle</label>
                <input
                  v-model="portfolioForm.subtitle"
                  type="text"
                  required
                  placeholder="e.g. Branding & Marketing"
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Category</label>
                <select
                  v-model="portfolioForm.category"
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
                  <option value="Branding">
                    Branding
                  </option>
                  <option value="Marketing">
                    Marketing
                  </option>
                  <option value="Video Production">
                    Video Production
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Image Cover Path</label>
                <input
                  v-model="portfolioForm.image"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Hero Image Path</label>
                <input
                  v-model="portfolioForm.heroImage"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
            </div>

            <!-- Quick Template dropdowns for Cover / Hero -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-400 mb-1">Cover Template Select</label>
                <select
                  class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 text-xs focus:outline-none"
                  @change="portfolioForm.image = ($event.target as HTMLSelectElement).value"
                >
                  <option
                    value=""
                    disabled
                    selected
                  >
                    -- Choose cover asset --
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
              <div>
                <label class="block text-xs font-bold text-zinc-400 mb-1">Hero Template Select</label>
                <select
                  class="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 text-xs focus:outline-none"
                  @change="portfolioForm.heroImage = ($event.target as HTMLSelectElement).value"
                >
                  <option
                    value=""
                    disabled
                    selected
                  >
                    -- Choose hero asset --
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

            <div>
              <label class="block text-xs font-bold text-zinc-700 mb-1.5">Tags (Comma Separated)</label>
              <input
                v-model="portfolioForm.tagsString"
                type="text"
                placeholder="Branding, Designing, Video Production"
                class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
              >
            </div>

            <div>
              <label class="block text-xs font-bold text-zinc-700 mb-1.5">Gallery Image URLs (Comma Separated)</label>
              <input
                v-model="portfolioForm.galleryImagesString"
                type="text"
                placeholder="/Images/Lecrown- 1.png, /Images/Lecrown.png"
                class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
              >
            </div>

            <div>
              <label class="block text-xs font-bold text-zinc-700 mb-1.5">Project Story</label>
              <textarea
                v-model="portfolioForm.story"
                required
                rows="4"
                placeholder="The detailed story behind the project execution..."
                class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>

            <!-- Featured check box -->
            <div class="flex items-center gap-3 bg-zinc-50 p-4 border border-zinc-200 rounded-xl">
              <input
                id="feat-checkbox"
                v-model="portfolioForm.featured"
                type="checkbox"
                class="w-4 h-4 rounded text-brand-teal-500 focus:ring-brand-teal-500 border-zinc-200 bg-white"
              >
              <label
                for="feat-checkbox"
                class="text-sm font-semibold select-none cursor-pointer text-zinc-700"
              >
                Feature this project on the Homepage
              </label>
            </div>
          </div>

          <!-- ── FORM FOR CASE STUDIES ── -->
          <div
            v-if="modalType === 'case-study'"
            class="space-y-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Case Study Title</label>
                <input
                  v-model="caseStudyForm.title"
                  type="text"
                  required
                  placeholder="e.g. Le Crown Vagamon Campaign"
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">URL Slug</label>
                <input
                  v-model="caseStudyForm.slug"
                  type="text"
                  required
                  placeholder="e.g. le-crown-vagamon"
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                  :disabled="modalMode === 'edit'"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Client Name</label>
                <input
                  v-model="caseStudyForm.client"
                  type="text"
                  required
                  placeholder="e.g. Le Crown Vagamon"
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Tags (Comma Separated)</label>
                <input
                  v-model="caseStudyForm.tagsString"
                  type="text"
                  required
                  placeholder="Resorts & Hospitality, Branding"
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Card Image URL</label>
                <input
                  v-model="caseStudyForm.image"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Hero Image URL</label>
                <input
                  v-model="caseStudyForm.heroImage"
                  type="text"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-zinc-700 mb-1.5">The Challenge</label>
              <textarea
                v-model="caseStudyForm.challenge"
                required
                rows="3"
                placeholder="The problem statements..."
                class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-zinc-700 mb-1.5">Our Approach</label>
              <textarea
                v-model="caseStudyForm.approach"
                required
                rows="3"
                placeholder="The creative strategic approach taken..."
                class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
              />
            </div>

            <!-- Dynamic solutions section -->
            <div class="border-t border-zinc-200 pt-4 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-zinc-800">
                  The Solutions Bullet Points
                </h3>
                <button
                  type="button"
                  class="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-brand-dark rounded-lg transition border border-zinc-200"
                  @click="addSolutionPoint"
                >
                  + Add Point
                </button>
              </div>

              <div class="space-y-2">
                <div
                  v-for="(point, index) in caseStudyForm.solution"
                  :key="index"
                  class="flex gap-2 items-center"
                >
                  <input
                    v-model="caseStudyForm.solution[index]"
                    type="text"
                    required
                    placeholder="e.g. Professional photography and videography capturing the property"
                    class="flex-1 px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 text-brand-dark text-xs"
                  >
                  <button
                    type="button"
                    class="p-2 text-red-500 hover:text-red-600 font-bold"
                    @click="removeSolutionPoint(index)"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <!-- Dynamic results metrics section -->
            <div class="border-t border-zinc-200 pt-4 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-zinc-800">
                  Results & Metrics
                </h3>
                <button
                  type="button"
                  class="text-xs px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-brand-dark rounded-lg transition border border-zinc-200"
                  @click="addResultMetric"
                >
                  + Add Metric
                </button>
              </div>

              <div class="space-y-2">
                <div
                  v-for="(metric, idx) in caseStudyForm.results"
                  :key="idx"
                  class="flex gap-3 items-center bg-zinc-50 p-3 rounded-lg border border-zinc-200"
                >
                  <div class="flex-1 grid grid-cols-2 gap-2">
                    <input
                      v-model="metric.metric"
                      type="text"
                      required
                      placeholder="e.g. +180% or 3.2x"
                      class="px-3 py-2 rounded-lg border border-zinc-200 bg-white text-brand-dark text-xs"
                    >
                    <input
                      v-model="metric.label"
                      type="text"
                      required
                      placeholder="e.g. Growth in Social Reach"
                      class="px-3 py-2 rounded-lg border border-zinc-200 bg-white text-brand-dark text-xs"
                    >
                  </div>
                  <button
                    type="button"
                    class="text-red-500 hover:text-red-600 font-bold"
                    @click="removeResultMetric(idx)"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ── FORM FOR CAREERS ── -->
          <div
            v-if="modalType === 'career'"
            class="space-y-4"
          >
            <div>
              <label class="block text-xs font-bold text-zinc-700 mb-1.5">Job Title</label>
              <input
                v-model="careerForm.title"
                type="text"
                required
                placeholder="e.g. Senior Copywriter"
                class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
              >
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Department</label>
                <input
                  v-model="careerForm.department"
                  type="text"
                  required
                  placeholder="e.g. Marketing"
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Location</label>
                <input
                  v-model="careerForm.location"
                  type="text"
                  required
                  placeholder="e.g. Kochi (Hybrid / Onsite)"
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Type</label>
                <input
                  v-model="careerForm.type"
                  type="text"
                  required
                  placeholder="e.g. Full-Time or Internship"
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-700 mb-1.5">Experience Requirement</label>
                <input
                  v-model="careerForm.experience"
                  type="text"
                  required
                  placeholder="e.g. 2+ Years Experience"
                  class="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                >
              </div>
            </div>
          </div>

          <!-- Form Submissions -->
          <div class="flex items-center justify-end gap-3 border-t border-zinc-200 pt-5">
            <button
              type="button"
              class="px-5 py-3 rounded-full border border-zinc-300 text-zinc-600 hover:bg-zinc-50 transition text-sm font-semibold"
              @click="isModalOpen = false"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-7 py-3 bg-brand-yellow-500 text-brand-dark text-sm font-bold rounded-full hover:bg-brand-yellow-400 transition"
            >
              {{ modalMode === 'create' ? 'Save New Item' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
