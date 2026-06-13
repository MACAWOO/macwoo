<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

const props = withDefaults(defineProps<{
  inline?: boolean
}>(), {
  inline: false
})

// defineModel allows standard v-model binding in parent components
const isOpen = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  (e: 'select', url: string): void
}>()

const supabase = useSupabase()
const bucketName = 'Website_images'

onMounted(() => {
  if (props.inline) {
    fetchFiles()
  }
})

const copyUrlToClipboard = () => {
  if (selectedFile.value?.publicUrl) {
    navigator.clipboard.writeText(selectedFile.value.publicUrl)
    alert('Public URL copied to clipboard!')
  }
}

// Component State
const files = ref<any[]>([])
const isLoading = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const errorMessage = ref<string | null>(null)
const searchQuery = ref('')
const selectedFile = ref<any | null>(null)

// Drag and drop dragover state
const isDragging = ref(false)

// Load files from Supabase Storage
const fetchFiles = async () => {
  isLoading.value = true
  errorMessage.value = null
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (error) throw error

    if (data) {
      files.value = data.map((file: any) => {
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(file.name)

        // Determine file type
        const ext = file.name.split('.').pop()?.toLowerCase() || ''
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)
        const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(ext)

        return {
          ...file,
          publicUrl: urlData?.publicUrl || '',
          isImage,
          isVideo,
          extension: ext
        }
      })
    }
  } catch (err: any) {
    console.error('Error fetching media from Supabase:', err)
    errorMessage.value = err.message || 'Failed to retrieve files.'
  } finally {
    isLoading.value = false
  }
}

// Watch for modal opening to load files automatically
watch(isOpen, (newVal) => {
  if (newVal) {
    fetchFiles()
    selectedFile.value = null
    searchQuery.value = ''
  }
})

// Format byte sizes to readable strings
const formatBytes = (bytes: number, decimals = 2) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Upload file implementation
const uploadFile = async (file: File) => {
  if (!file) return
  isUploading.value = true
  errorMessage.value = null
  uploadProgress.value = 10 // Mock progress initial

  try {
    // Generate a unique filename to prevent conflicts
    const cleanedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
    const fileName = `${Date.now()}_${cleanedName}`

    uploadProgress.value = 30

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    uploadProgress.value = 80

    // Refresh list in background
    fetchFiles().catch((err: any) => console.error('Error refreshing list:', err))

    uploadProgress.value = 100

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    if (urlData?.publicUrl) {
      emit('select', urlData.publicUrl)
      isOpen.value = false
    }

  } catch (err: any) {
    console.error('Error uploading file:', err)
    errorMessage.value = err.message || 'File upload failed.'
  } finally {
    setTimeout(() => {
      isUploading.value = false
      uploadProgress.value = 0
    }, 500)
  }
}

// Handling input files selection
const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file) uploadFile(file)
  }
}

// Handle Drag and Drop Uploads
const onDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    if (file) uploadFile(file)
  }
}

// Delete file from Supabase Storage
const deleteFile = async (file: any) => {
  if (!confirm(`Are you sure you want to permanently delete "${file.name}"?`)) return
  isLoading.value = true
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([file.name])

    if (error) throw error

    selectedFile.value = null
    await fetchFiles()
  } catch (err: any) {
    console.error('Error deleting file:', err)
    alert(err.message || 'Failed to delete file.')
  } finally {
    isLoading.value = false
  }
}

// Select asset and close
const confirmSelection = () => {
  if (selectedFile.value) {
    emit('select', selectedFile.value.publicUrl)
    isOpen.value = false
  }
}

// Filter files list based on search term
const filteredFiles = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return files.value
  return files.value.filter(file => file.name.toLowerCase().includes(query))
})
</script>

<template>
  <div
    v-if="isOpen || inline"
    :class="inline ? 'w-full h-[78vh] flex flex-col bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm font-sans antialiased' : 'fixed inset-0 z-[110] flex items-center justify-center p-4 font-sans antialiased'"
  >
    <!-- Backdrop Blur overlay -->
    <div
      v-if="!inline"
      class="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
      @click="isOpen = false"
    />

    <!-- Main Content Box -->
    <div :class="inline ? 'relative w-full h-full flex flex-col overflow-hidden' : 'relative bg-white border border-zinc-200 rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl overflow-hidden transition-all'">
      <!-- Modal/Library Header -->
      <div class="px-6 py-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-[#1D96B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 class="text-sm font-bold text-zinc-800 uppercase tracking-wider">
            {{ inline ? 'Media Library' : 'Supabase Media Picker' }}: <span class="text-[#1D96B8]">{{ bucketName }}</span>
          </h2>
        </div>
        <button
          v-if="!inline"
          class="text-zinc-400 hover:text-zinc-700 transition-colors p-1 rounded-full hover:bg-zinc-200"
          @click="isOpen = false"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="flex-1 flex overflow-hidden min-h-0">
        <!-- Left Side: File Grid & Upload Area (2/3 width) -->
        <div class="flex-1 flex flex-col p-6 overflow-hidden min-w-0 border-r border-zinc-200">
          
          <!-- Controls Panel -->
          <div class="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4 shrink-0">
            <!-- Search bar -->
            <div class="relative w-full sm:max-w-xs">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search files..."
                class="w-full pl-9 pr-4 py-1.5 border border-zinc-300 rounded-lg text-xs bg-zinc-50 focus:outline-none focus:border-[#1D96B8] focus:bg-white"
              />
            </div>

            <!-- Refresh & Upload triggers -->
            <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                class="p-2 border border-zinc-300 hover:bg-zinc-50 rounded-lg text-zinc-600 transition-colors cursor-pointer"
                title="Refresh Files List"
                @click="fetchFiles"
              >
                <svg class="w-4 h-4" :class="{'animate-spin': isLoading}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.27 15" />
                </svg>
              </button>

              <label class="px-4 py-1.5 bg-[#1D96B8] hover:bg-[#15809c] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload File
                <input
                  type="file"
                  class="hidden"
                  accept="image/*,video/*"
                  @change="onFileSelected"
                />
              </label>
            </div>
          </div>

          <!-- Error Alert Alert -->
          <div
            v-if="errorMessage"
            class="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded text-xs text-red-700 flex justify-between items-center shrink-0"
          >
            <span>{{ errorMessage }}</span>
            <button class="text-red-500 font-bold hover:text-red-800" @click="errorMessage = null">✕</button>
          </div>

          <!-- Uploading overlay progress -->
          <div
            v-if="isUploading"
            class="bg-zinc-50 border border-zinc-200 p-4 rounded-xl mb-4 text-xs space-y-2 shrink-0 animate-pulse"
          >
            <div class="flex justify-between items-center text-zinc-700">
              <span class="font-semibold">Uploading asset to Supabase Storage...</span>
              <span>{{ uploadProgress }}%</span>
            </div>
            <div class="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
              <div class="bg-[#1D96B8] h-full transition-all duration-300" :style="`width: ${uploadProgress}%`" />
            </div>
          </div>

          <!-- Files Grid / Dropzone container -->
          <div
            class="flex-1 overflow-y-auto border border-dashed rounded-xl p-4 min-h-0"
            :class="isDragging ? 'border-[#1D96B8] bg-blue-50/20' : 'border-zinc-200 bg-white'"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
          >
            <!-- Loading Indicator Skeletons -->
            <div v-if="isLoading && files.length === 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div v-for="n in 8" :key="n" class="aspect-square bg-zinc-100 rounded-lg animate-pulse" />
            </div>

            <!-- Empty Directory View -->
            <div
              v-else-if="filteredFiles.length === 0"
              class="h-full flex flex-col items-center justify-center text-zinc-400 py-12"
            >
              <svg class="w-12 h-12 mb-3 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="text-xs font-semibold">Drag and drop file here, or select "Upload File"</p>
              <p class="text-[10px] text-zinc-400 mt-1">Files will upload to Supabase public bucket Website_images</p>
            </div>

            <!-- Asset Grid List -->
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div
                v-for="file in filteredFiles"
                :key="file.name"
                class="group relative aspect-square border bg-zinc-50 rounded-xl overflow-hidden cursor-pointer select-none transition-all flex flex-col"
                :class="selectedFile?.name === file.name ? 'border-[#1D96B8] ring-2 ring-[#1D96B8]/30 shadow-md' : 'border-zinc-200 hover:border-zinc-300'"
                @click="selectedFile = file"
                @dblclick="selectedFile = file; confirmSelection()"
              >
                <!-- Thumbnail Preview -->
                <div class="flex-1 bg-zinc-100 overflow-hidden flex items-center justify-center relative">
                  <!-- Image thumbnail -->
                  <img
                    v-if="file.isImage"
                    :src="file.publicUrl"
                    class="w-full h-full object-cover transition-transform group-hover:scale-105"
                    alt="Preview"
                    loading="lazy"
                  />
                  <!-- Video icon thumbnail -->
                  <div v-else-if="file.isVideo" class="flex flex-col items-center">
                    <svg class="w-10 h-10 text-zinc-400 group-hover:text-[#1D96B8] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <!-- Generic Document/Other File Placeholder -->
                  <div v-else class="flex flex-col items-center">
                    <svg class="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-[9px] uppercase font-bold text-zinc-500 mt-1">{{ file.extension }}</span>
                  </div>

                  <!-- Quick Select checkbox Indicator top right -->
                  <div
                    class="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center transition-opacity"
                    :class="selectedFile?.name === file.name ? 'bg-[#1D96B8] text-white opacity-100' : 'bg-black/30 text-white/70 opacity-0 group-hover:opacity-100'"
                  >
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>

                <!-- Footer label -->
                <div class="px-2 py-1.5 bg-white border-t border-zinc-100 shrink-0">
                  <p class="text-[10px] font-semibold text-zinc-700 truncate" :title="file.name">
                    {{ file.name }}
                  </p>
                  <p class="text-[9px] text-zinc-400">
                    {{ formatBytes(file.metadata?.size) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Selected File Detail Panel (1/3 width) -->
        <div class="w-80 bg-zinc-50 flex flex-col overflow-y-auto p-6 shrink-0">
          <h3 class="text-xs font-bold text-zinc-500 uppercase tracking-wide border-b border-zinc-200 pb-2 mb-4">
            Asset Details
          </h3>

          <div v-if="selectedFile" class="flex-1 flex flex-col justify-between">
            <!-- Details fields -->
            <div class="space-y-5">
              <!-- Large Preview Box -->
              <div class="w-full aspect-video border border-zinc-200 rounded-xl overflow-hidden bg-zinc-200 flex items-center justify-center relative shadow-inner">
                <img
                  v-if="selectedFile.isImage"
                  :src="selectedFile.publicUrl"
                  class="w-full h-full object-contain"
                  alt="Detail Preview"
                />
                <video
                  v-else-if="selectedFile.isVideo"
                  :src="selectedFile.publicUrl"
                  controls
                  class="w-full h-full object-contain"
                />
                <div v-else class="text-center">
                  <svg class="w-12 h-12 text-zinc-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-xs uppercase font-bold text-zinc-500 mt-2 block">{{ selectedFile.extension }} File</span>
                </div>
              </div>

              <!-- Metadata fields -->
              <div class="space-y-2 text-xs">
                <div>
                  <label class="block text-zinc-400 font-bold text-[10px] uppercase">Filename</label>
                  <p class="text-zinc-800 font-semibold break-all">{{ selectedFile.name }}</p>
                </div>
                <div>
                  <label class="block text-zinc-400 font-bold text-[10px] uppercase">Format / Type</label>
                  <p class="text-zinc-800 capitalize">{{ selectedFile.metadata?.mimetype || selectedFile.extension || 'Unknown' }}</p>
                </div>
                <div>
                  <label class="block text-zinc-400 font-bold text-[10px] uppercase">File Size</label>
                  <p class="text-zinc-800">{{ formatBytes(selectedFile.metadata?.size) }}</p>
                </div>
                <div>
                  <label class="block text-zinc-400 font-bold text-[10px] uppercase">Created At</label>
                  <p class="text-zinc-800">{{ selectedFile.created_at ? new Date(selectedFile.created_at).toLocaleString() : 'N/A' }}</p>
                </div>
                <div>
                  <label class="block text-zinc-400 font-bold text-[10px] uppercase">Public URL</label>
                  <input
                    type="text"
                    readonly
                    :value="selectedFile.publicUrl"
                    class="w-full bg-zinc-200 border border-zinc-300 rounded px-2 py-1 text-[10px] font-mono select-all focus:outline-none"
                    @click="($event.target as HTMLInputElement).select()"
                  />
                </div>
              </div>
            </div>

            <!-- Action buttons inside sidebar footer -->
            <div class="pt-6 border-t border-zinc-200 space-y-2 mt-6">
              <button
                v-if="!inline"
                class="w-full py-2 bg-[#1D96B8] hover:bg-[#15809c] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                @click="confirmSelection"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Select Media
              </button>
              <button
                v-else
                class="w-full py-2 bg-[#1D96B8] hover:bg-[#15809c] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                @click="copyUrlToClipboard"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5Z" />
                </svg>
                Copy Public URL
              </button>

              <button
                class="w-full py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                @click="deleteFile(selectedFile)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete File
              </button>
            </div>
          </div>

          <!-- Empty details state selection hint -->
          <div v-else class="flex-1 flex flex-col items-center justify-center text-zinc-400 py-12">
            <svg class="w-8 h-8 mb-2 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-xs italic text-center">Select an asset from the library to see detailed properties.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
