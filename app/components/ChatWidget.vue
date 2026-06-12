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
      class="w-[484px] bg-[#f4ed18] rounded-[34px] shadow-[0px_0px_14px_0px_rgba(0,0,0,0.5)] flex flex-col"
    >
      <!-- Close button -->
      <div class="flex justify-end px-5 pt-[17px] pb-0">
        <button
          class="w-[33px] h-[33px] flex items-center justify-center text-black hover:opacity-60 transition-opacity"
          @click="isOpen = false"
        >
          <svg
            viewBox="0 0 24 24"
            class="w-[22px] h-[22px]"
            fill="currentColor"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>

      <!-- Messages area -->
      <div class="bg-white mx-[17px] h-[400px] rounded-[19px] overflow-y-auto p-4 flex flex-col">
        <p class="text-center text-[#0d0d0d] text-base font-medium mb-4 shrink-0">
          Today 6:50 PM
        </p>
        <div class="flex flex-col gap-1">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="msg.from === 'user' ? 'flex justify-end' : 'flex justify-start'"
          >
            <div
              class="relative px-5 py-2 text-base font-medium max-w-[85%] text-black"
              :class="msg.from === 'bot' ? 'bot-bubble' : 'user-bubble'"
            >
              {{ msg.text }}
            </div>
          </div>
        </div>
      </div>

      <!-- Input area -->
      <div class="bg-white mx-[17px] my-[17px] rounded-[11px] h-[57px] flex items-center px-5 shrink-0">
        <input
          v-model="message"
          type="text"
          placeholder="Type Your Message Here"
          class="flex-1 text-[20px] font-medium focus:outline-none placeholder:text-black bg-transparent"
          @keydown.enter="sendMessage"
        >
        <button
          class="text-black hover:opacity-60 transition-opacity ml-2 shrink-0"
          @click="sendMessage"
        >
          <svg
            class="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M22 2L11 13"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Toggle button -->
    <button
      class="w-[72px] h-[72px] relative flex items-center justify-center hover:opacity-95 transition-all duration-300 active:scale-95 cursor-pointer"
      @click="isOpen = !isOpen"
    >
      <!-- Speech bubble background SVG -->
      <svg
        class="absolute inset-0 w-full h-full drop-shadow-[0px_8px_16px_rgba(0,0,0,0.18)]"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="#EDE000"
        />
        <polygon
          points="65,82 82,65 88,88"
          fill="#EDE000"
        />
      </svg>

      <!-- Blue inner circle to fill transparent 'm' in Logo -->
      <div
        v-if="!isOpen"
        class="w-[28px] h-[28px] bg-[#1D96B8] rounded-full absolute z-0"
      />

      <!-- Logo image (transparent 'm' allows blue circle to show through) -->
      <img
        v-if="!isOpen"
        src="/Images/Logo.png"
        alt="Macawoo"
        class="w-12 h-12 object-contain select-none pointer-events-none z-10"
      >
      <svg
        v-else
        class="w-8 h-8 text-black z-10"
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
.bot-bubble {
  background: #ebebeb;
  border-radius: 20px 20px 20px 5px;
  position: relative;
}

.bot-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 12px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 4px solid transparent;
  border-top: 10px solid #ebebeb;
}

.user-bubble {
  background: #ebebeb;
  border-radius: 20px 20px 5px 20px;
}
</style>
