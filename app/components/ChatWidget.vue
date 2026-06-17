<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const isOpen = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

interface ChatOption {
  id: number | string
  icon?: string
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
    question: 'Get a Project Quote',
    response: [
      'We\'d be happy to understand your requirements and provide a custom quotation for your project.'
    ]
  },
  {
    id: 3,
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
  // 1. Add user message bubble
  messages.value.push({
    id: `user-${Date.now()}`,
    text: option.question,
    from: 'user'
  })

  await scrollToBottom()

  if (option.action === 'whatsapp') {
    // Open WhatsApp synchronously to prevent popup blocker
    openWhatsApp()
    // Still add bot feedback bubble with natural delay
    setTimeout(async () => {
      messages.value.push({
        id: `bot-wa-${Date.now()}`,
        text: 'Connecting you with our team on WhatsApp...',
        from: 'bot'
      })
      await scrollToBottom()
    }, 400)
    return
  }

  // Delay response slightly for natural feel (400ms)
  setTimeout(async () => {
    if (option.action === 'more_questions') {
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
            question: 'More Questions',
            action: 'more_questions'
          },
          {
            id: 7,
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
          class="bg-white mx-2 my-2 h-[380px] rounded-[12px] overflow-y-auto p-2.5 flex flex-col gap-2.5 shadow-inner scrollbar-hide"
        >
          <div class="flex flex-col gap-2.5">
            <template
              v-for="(msg, i) in messages"
              :key="msg.id"
            >
              <div :class="msg.from === 'user' ? 'flex justify-end' : 'flex justify-start'">
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
                        class="w-3.5 h-3.5 fill-white shrink-0"
                        viewBox="0 0 98 98"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M77.523 69.1934C76.3421 72.5361 71.6478 75.3016 67.9042 76.1103C65.3415 76.6544 61.9997 77.0848 50.7395 72.4186C38.0926 67.1789 20.531 48.5148 20.531 36.0944C20.531 29.7715 24.1766 22.4089 30.5515 22.4089C33.6189 22.4089 34.2951 22.4687 35.3045 24.89C36.4854 27.7427 39.3666 34.771 39.7096 35.4915C41.1257 38.4471 38.269 40.1773 36.1963 42.7506C35.5348 43.525 34.7851 44.3625 35.623 45.8035C36.456 47.2152 39.3372 51.9109 43.5708 55.6801C49.0392 60.5521 53.4737 62.1076 55.0613 62.7693C56.2422 63.2594 57.6534 63.1453 58.5158 62.2238C59.6085 61.0425 60.9658 59.0827 62.3476 57.1515C63.3227 55.7693 64.5624 55.5967 65.8609 56.0868C66.738 56.3907 77.8855 61.5677 78.3559 62.396C78.7038 62.9989 78.7039 65.8505 77.523 69.1934ZM49.0098 0H48.9853C21.9716 0 0 21.9782 0 49C0 59.7146 3.45453 69.6552 9.32963 77.7181L3.22422 95.9256L22.0549 89.9083C29.8018 95.0353 39.0481 98 49.0098 98C76.0235 98 98 76.0218 98 49C98 21.9782 76.0235 0 49.0098 0Z"
                          fill="currentColor"
                        />
                      </svg>
                      Talk to Our Team
                    </button>
                  </div>
                </div>
              </div>
              <!-- FAQ buttons list on the right side -->
              <div
                v-if="msg.from === 'bot' && msg.showOptions"
                class="flex justify-end w-full"
              >
                <div class="flex flex-col gap-1.5 w-[85%] items-end">
                  <button
                    v-for="opt in (msg.options || faqOptions)"
                    :key="opt.id"
                    class="w-full text-left px-3 py-1.5 rounded-[12px_12px_3px_12px] bg-[#0596B8] text-white hover:bg-[#157d9b] active:scale-[0.98] transition-all duration-200 text-[11px] font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                    @click="handleOptionClick(opt, i)"
                  >
                    <svg
                      class="w-3 h-3 shrink-0 opacity-80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="15 10 20 15 15 20" />
                      <path d="M4 4v7a4 4 0 0 0 4 4h12" />
                    </svg>
                    <span class="leading-tight">{{ opt.question }}</span>
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toggle button -->
    <button
      class="w-[84px] h-[84px] sm:w-[72px] sm:h-[72px] mb-2 sm:mb-0 relative flex items-center justify-center hover:opacity-95 active:scale-95 cursor-pointer bg-transparent border-none outline-none"
      @click="isOpen = !isOpen"
    >
      <transition name="fade-scale" mode="out-in">
        <div v-if="isOpen" key="open" class="w-[63%] h-[63%] flex items-center justify-center">
          <div class="relative w-full h-full flex items-center justify-center -translate-x-[3.9%] -translate-y-[3.9%]">
            <svg
              class="absolute inset-0 w-full h-full drop-shadow-[0px_4px_8px_rgba(0,0,0,0.15)]"
              viewBox="0 0 100 100"
              fill="none"
            >
              <circle
                cx="50"
                cy="50"
                r="50"
                fill="#F7EC12"
              />
            </svg>

            <svg
              class="w-[42%] h-[42%] text-black z-10"
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
          </div>
        </div>
        <div v-else key="closed" class="w-full h-full flex items-center justify-center">
          <img
            src="/Icons/chat_widget.svg"
            alt="Macawoo Assistant"
            class="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
          >
        </div>
      </transition>
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

/* Transition styles for the toggle button */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
