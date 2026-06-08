<script setup lang="ts">
const isOpen = ref(false)
const message = ref('')

const messages = ref([
  { text: 'Hello, Macawoo here', from: 'bot', time: 'Today 6:50 PM' },
  { text: 'May I know how we can help you?', from: 'bot', time: '' }
])

function sendMessage() {
  if (!message.value.trim()) return
  messages.value.push({ text: message.value, from: 'user', time: '' })
  message.value = ''
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
    <!-- Chat panel -->
    <div
      v-if="isOpen"
      class="w-80 bg-brand-yellow-500 rounded-2xl border border-brand-dark/10 overflow-hidden"
    >
      <!-- Header bar -->
      <div class="flex items-center justify-between px-4 py-3">
        <span class="font-bold text-brand-dark text-sm">Macawoo Chat</span>
        <button
          class="text-brand-dark hover:opacity-70 transition-opacity"
          @click="isOpen = false"
        >
          ✕
        </button>
      </div>

      <!-- Messages -->
      <div class="bg-white mx-3 rounded-xl p-4 min-h-48 max-h-64 overflow-y-auto space-y-3">
        <p
          v-if="messages[0]"
          class="text-xs text-zinc-400 text-center"
        >
          {{ messages[0].time }}
        </p>
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="msg.from === 'user' ? 'flex justify-end' : ''"
        >
          <div
            class="inline-block px-4 py-2.5 rounded-2xl text-sm max-w-[85%]"
            :class="msg.from === 'bot' ? 'bg-zinc-100 text-zinc-800' : 'bg-brand-teal-500 text-white'"
          >
            {{ msg.text }}
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="flex items-center gap-2 px-3 py-3 bg-white mx-3 mb-3 rounded-xl mt-2">
        <input
          v-model="message"
          type="text"
          placeholder="Type Your Message Here"
          class="flex-1 text-sm focus:outline-none placeholder:text-zinc-400"
          @keydown.enter="sendMessage"
        >
        <button
          class="text-zinc-400 hover:text-brand-teal-500 transition-colors"
          @click="sendMessage"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Toggle button -->
    <button
      class="w-14 h-14 bg-brand-yellow-500 rounded-full flex items-center justify-center hover:bg-brand-yellow-400 transition-colors"
      :class="!isOpen ? 'rounded-br-none' : ''"
      @click="isOpen = !isOpen"
    >
      <span
        v-if="!isOpen"
        class="text-brand-dark font-bold text-2xl select-none leading-none"
      >m</span>
      <svg
        v-else
        class="w-6 h-6 text-brand-dark"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>
