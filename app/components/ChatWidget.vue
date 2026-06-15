<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const isOpen = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

interface ChatOption {
  id: number | string
  icon: string
  question: string
  action?: string
  response?: string[]
}

interface ChatMessage {
  id: string
  text?: string
  list?: string[]
  from: 'bot' | 'user'
  time?: string
  hasCTA?: boolean
  showOptions?: boolean
  options?: ChatOption[]
}

// FAQ Options definitions from macawoo_chat_bot.pdf
const faqOptions: ChatOption[] = [
  {
    id: 1,
    icon: '🎨',
    question: 'What services do you offer?',
    response: [
      'Macawoo offers:',
      '• Branding & Identity Design',
      '• Digital Marketing',
      '• Video Production',
      '• Website Development'
    ]
  },
  {
    id: 2,
    icon: '💰',
    question: 'Get a Project Quote',
    response: [
      'We\'d be happy to understand your requirements and provide a custom quotation for your project.'
    ]
  },
  {
    id: 3,
    icon: '🎥',
    question: 'Do you provide Video Production Services?',
    response: [
      'Yes. We provide:',
      '• Corporate Videos',
      '• Advertisement Films',
      '• Product Shoots',
      '• Drone Videography',
      '• Social Media Reels & Content'
    ]
  },
  {
    id: 4,
    icon: '📊',
    question: 'Do you manage Social Media Marketing?',
    response: [
      'Yes. We offer:',
      '• Social Media Management',
      '• Content Creation',
      '• Meta Ads',
      '• Google Ads',
      '• Lead Generation Campaigns'
    ]
  },
  {
    id: 5,
    icon: '🎨',
    question: 'Do you provide Branding Services?',
    response: [
      'Yes. We provide:',
      '• Logo Design',
      '• Brand Identity Design',
      '• Brand Strategy',
      '• Packaging Design',
      '• Brand Guidelines'
    ]
  },
  {
    id: 6,
    icon: '🌐',
    question: 'Do you create Websites?',
    response: [
      'Yes. We design and develop:',
      '• Business Websites',
      '• Corporate Websites',
      '• Landing Pages',
      '• E-commerce Websites',
      '• Custom Web Solutions'
    ]
  },
  {
    id: 7,
    icon: '📞',
    question: 'Talk to Our Team',
    action: 'whatsapp'
  }
]

// Initial welcome message and options
const messages = ref<ChatMessage[]>([
  {
    id: 'welcome',
    text: 'Hello! Welcome to Macawoo. How can we help you today? Please select one of the frequently asked questions:',
    from: 'bot',
    showOptions: true,
    options: faqOptions
  }
])

const WHATSAPP_NUMBER = '919747477502'
const DEFAULT_MESSAGE = 'Hello Macawoo Team, I would like to know more about your services.'

function getWhatsAppUrl(customMessage?: string) {
  const text = encodeURIComponent(customMessage || DEFAULT_MESSAGE)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

function openWhatsApp(customMessage?: string) {
  window.open(getWhatsAppUrl(customMessage), '_blank')
}

function getWhatsAppMessageForCTA(msg: ChatMessage) {
  if (msg.list && msg.list[0]?.includes('offers')) {
    return 'Hello Macawoo Team, I would like to learn more about your services.'
  }
  if (msg.list && msg.list[0]?.includes('Video')) {
    return 'Hello Macawoo Team, I would like to talk about video production services.'
  }
  if (msg.list && msg.list[0]?.includes('Social Media')) {
    return 'Hello Macawoo Team, I would like to talk about social media marketing services.'
  }
  if (msg.list && msg.list[0]?.includes('Branding')) {
    return 'Hello Macawoo Team, I would like to talk about branding and identity design services.'
  }
  if (msg.list && msg.list[0]?.includes('Websites')) {
    return 'Hello Macawoo Team, I would like to talk about website development services.'
  }
  return 'Hello Macawoo Team, I would like to talk to a representative.'
}

async function handleOptionClick(option: ChatOption, messageIndex: number) {
  // Hide the options list for this specific historical message
  if (messages.value[messageIndex]) {
    messages.value[messageIndex].showOptions = false
  }

  // 1. Add user message bubble
  messages.value.push({
    id: `user-${Date.now()}`,
    text: `${option.icon} ${option.question}`,
    from: 'user'
  })

  await scrollToBottom()

  // Delay response slightly for natural feel (400ms)
  setTimeout(async () => {
    if (option.action === 'whatsapp') {
      // Direct WhatsApp action
      messages.value.push({
        id: `bot-wa-${Date.now()}`,
        text: 'Connecting you with our team on WhatsApp...',
        from: 'bot'
      })
      openWhatsApp()
    } else if (option.action === 'more_questions') {
      // Display other questions
      messages.value.push({
        id: `bot-more-${Date.now()}`,
        text: 'Here are the other questions you can ask:',
        from: 'bot',
        showOptions: true,
        options: faqOptions.filter(o => o.action !== 'whatsapp')
      })
    } else {
      // Standard FAQ response
      messages.value.push({
        id: `bot-${Date.now()}`,
        list: option.response,
        from: 'bot',
        hasCTA: true
      })

      // Append new options prompt
      messages.value.push({
        id: `options-${Date.now()}`,
        text: 'Would you like to ask anything else? Select an option below:',
        from: 'bot',
        showOptions: true,
        options: [
          {
            id: 'more_questions',
            icon: '❓',
            question: 'More Questions',
            action: 'more_questions'
          },
          {
            id: 7,
            icon: '📞',
            question: 'Talk to Our Team',
            action: 'whatsapp'
          }
        ]
      })
    }

    await scrollToBottom()
  }, 400)
}

async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

// Watch isOpen to scroll to bottom when chat opens
watch(isOpen, async (val) => {
  if (val) {
    await scrollToBottom()
  }
})
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
    <!-- Chat panel -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div
        v-if="isOpen"
        class="w-[calc(100vw-32px)] sm:w-[310px] bg-[#F7EC12] rounded-[20px] border border-[#DED410] shadow-[0_15px_40px_rgba(0,0,0,0.22)] flex flex-col overflow-hidden mb-1"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-3.5 py-2 border-b border-black/10 shrink-0 bg-[#F7EC12]">
          <div class="flex items-center gap-2">
            <div class="relative w-7 h-7 bg-[#0596B8] rounded-full flex items-center justify-center border border-black/5 shadow-sm">
              <img
                src="/Images/Logo.png"
                alt="Macawoo Logo"
                class="w-4 h-4 object-contain"
              >
              <span class="absolute bottom-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full border border-white" />
            </div>
            <div>
              <h3 class="text-xs font-semibold text-black leading-tight">
                Macawoo Assistant
              </h3>
            </div>
          </div>

          <button
            class="w-6.5 h-6.5 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black transition-colors cursor-pointer"
            @click="isOpen = false"
          >
            <svg
              viewBox="0 0 24 24"
              class="w-[12px] h-[12px]"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Messages area -->
        <div
          ref="messagesContainer"
          class="bg-white mx-2 my-2 h-[290px] rounded-[12px] overflow-y-auto p-2.5 flex flex-col gap-2.5 shadow-inner scrollbar-hide"
        >
          <div class="flex flex-col gap-2.5">
            <div
              v-for="(msg, i) in messages"
              :key="msg.id"
              :class="msg.from === 'user' ? 'flex justify-end' : 'flex justify-start'"
            >
              <div class="flex flex-col max-w-[85%]">
                <div
                  class="px-3 py-1.5 text-[11px] font-semibold"
                  :class="msg.from === 'bot' ? 'bot-bubble text-zinc-900 shadow-sm' : 'user-bubble shadow-sm'"
                >
                  <div
                    v-if="msg.text"
                    class="whitespace-pre-line leading-relaxed"
                  >
                    {{ msg.text }}
                  </div>
                  <div
                    v-else-if="msg.list"
                    class="flex flex-col gap-0.5 leading-relaxed"
                  >
                    <div
                      v-for="(line, idx) in msg.list"
                      :key="idx"
                    >
                      {{ line }}
                    </div>
                  </div>

                  <!-- Optional CTA inside bot bubble -->
                  <button
                    v-if="msg.from === 'bot' && msg.hasCTA"
                    class="mt-2 w-full bg-[#0596B8] hover:bg-[#157d9b] text-white py-1.5 px-2.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm"
                    @click="openWhatsApp(getWhatsAppMessageForCTA(msg))"
                  >
                    <svg
                      class="w-3.5 h-3.5 fill-white"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.031 0C5.39 0 0 5.402 0 12.044c0 2.125.556 4.197 1.61 6.011L.03 24l6.14-1.613c1.77.965 3.754 1.474 5.86 1.478 6.643 0 12.043-5.402 12.043-12.044 0-3.22-1.252-6.243-3.52-8.514C18.283 1.252 15.26 0 12.03 0zm5.735 17.034c-.237.669-1.38 1.28-1.9 1.343-.49.057-1.127.085-3.328-.826-2.812-1.164-4.626-4.01-4.767-4.2-1.428-1.87-2.39-3.83-2.39-5.9 0-2.072 1.085-3.086 1.488-3.5.31-.32.793-.43.12-.43h.76c.203 0 .467.078.694.618.25.597.85 2.076.924 2.227.07.15.12.327.02.528-.1.2-.15.32-.3.497-.15.18-.32.404-.455.54-.15.15-.31.31-.132.61.18.3.792 1.306 1.7 2.115.938.835 1.734 1.095 2.062 1.25.328.15.518.13.71-.098.192-.228.825-.96.963-1.29.138-.33.275-.27.462-.2.188.07 1.192.562 1.396.666.204.103.34.152.39.237.05.085.05.498-.187 1.167z" />
                    </svg>
                    Talk to Our Team
                  </button>
                </div>

                <!-- FAQ buttons list appended inside option messages -->
                <div
                  v-if="msg.from === 'bot' && msg.showOptions"
                  class="mt-2 flex flex-col gap-1.5 w-full"
                >
                  <button
                    v-for="opt in (msg.options || faqOptions)"
                    :key="opt.id"
                    class="w-full text-left px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-[#F7EC12]/10 hover:border-[#F7EC12] active:scale-[0.98] transition-all duration-200 text-[10px] font-semibold text-zinc-800 flex items-center gap-1.5 shadow-sm cursor-pointer"
                    @click="handleOptionClick(opt, i)"
                  >
                    <span class="text-xs shrink-0">{{ opt.icon }}</span>
                    <span class="leading-tight">{{ opt.question }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toggle button -->
    <button
      class="w-[64px] h-[64px] sm:w-[52px] sm:h-[52px] relative flex items-center justify-center hover:opacity-95 transition-all duration-300 active:scale-95 cursor-pointer"
      @click="isOpen = !isOpen"
    >
      <svg
        class="absolute inset-0 w-full h-full drop-shadow-[0px_4px_8px_rgba(0,0,0,0.15)]"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="#F7EC12"
        />
        <polygon
          points="65,82 82,65 88,88"
          fill="#F7EC12"
        />
      </svg>

      <div
        v-if="!isOpen"
        class="w-[16px] h-[16px] bg-[#0596B8] rounded-full absolute z-0"
      />

      <img
        v-if="!isOpen"
        src="/Images/Logo.png"
        alt="Macawoo"
        class="w-10 h-10 sm:w-8 sm:h-8 object-contain select-none pointer-events-none z-10"
      >
      <svg
        v-else
        class="w-5.5 h-5.5 text-black z-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
/* Hide scrollbar across all browsers */
.scrollbar-hide {
  scrollbar-width: none;        /* Firefox */
  -ms-overflow-style: none;     /* IE / Edge */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;                /* Chrome / Safari / Opera */
}

.bot-bubble {
  background: #f3f4f6;
  border-radius: 12px 12px 12px 3px;
}

.user-bubble {
  background: #0596B8;
  color: white;
  border-radius: 12px 12px 3px 12px;
}
</style>
