<script setup lang="ts">
// Why Macawoo Section
</script>

<template>
  <section class="relative py-20 overflow-hidden bg-[#F4ED18]">
    <!-- Background Texture -->
    <div class="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none">
      <NuxtImg
        src="/Images/upscale_image_quality_2K_202606031120.jpeg"
        alt=""
        loading="lazy"
        format="webp"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="relative z-10 max-w-[1201px] mx-auto px-6 md:px-8">
      <!-- Section Title -->
      <h2
        class="text-center text-[#0596B8] text-[36px] md:text-[48px] leading-[1.2] font-medium mb-12 md:mb-16"
        style="font-family: 'Fredoka', sans-serif;"
      >
        Why Macawoo
      </h2>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Card 1 -->
        <div class="bg-[#0596B8] rounded-[16px] p-8 flex flex-col h-full">
          <!-- Icon -->
          <div class="w-[52px] h-[52px] rounded-full bg-[#F4ED18] flex items-center justify-center mb-8 shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0596B8"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                ry="2"
              />
              <polyline points="3 12 8 12 11 6 14 18 17 12 21 12" />
            </svg>
          </div>
          <!-- Title -->
          <h3
            class="text-[#F4ED18] text-[22px] md:text-[24px] font-medium leading-[1.2] mb-6"
            style="font-family: 'Bricolage Grotesque', sans-serif;"
          >
            Creative +<br>performance<br>driven
          </h3>
          <!-- Divider -->
          <hr class="border-white/30 mb-6">
          <!-- Body -->
          <p
            class="text-white text-[15px] font-normal leading-relaxed"
            style="font-family: 'Bricolage Grotesque', sans-serif;"
          >
            Creativity that stands out and delivers measurable results.
          </p>
        </div>

        <!-- Card 2 -->
        <div class="bg-[#0596B8] rounded-[16px] p-8 flex flex-col h-full">
          <!-- Icon -->
          <div class="w-[52px] h-[52px] rounded-full bg-[#F4ED18] flex items-center justify-center mb-8 shrink-0">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="#0596B8"
            >
              <circle
                cx="12"
                cy="5"
                r="3.5"
              />
              <circle
                cx="12"
                cy="19"
                r="3.5"
              />
              <circle
                cx="5"
                cy="12"
                r="3.5"
              />
              <circle
                cx="19"
                cy="12"
                r="3.5"
              />
            </svg>
          </div>
          <!-- Title -->
          <h3
            class="text-[#F4ED18] text-[22px] md:text-[24px] font-medium leading-[1.2] mb-6"
            style="font-family: 'Bricolage Grotesque', sans-serif;"
          >
            End-to-end<br>solutions<br>&nbsp;
          </h3>
          <!-- Divider -->
          <hr class="border-white/30 mb-6">
          <!-- Body -->
          <p
            class="text-white text-[15px] font-normal leading-relaxed"
            style="font-family: 'Bricolage Grotesque', sans-serif;"
          >
            Complete support from strategy through final execution.
          </p>
        </div>

        <!-- Card 3 -->
        <div class="bg-[#0596B8] rounded-[16px] p-8 flex flex-col h-full">
          <!-- Icon -->
          <div class="w-[52px] h-[52px] rounded-full bg-[#F4ED18] flex items-center justify-center mb-8 shrink-0">
            <svg
              width="26"
              height="26"
              viewBox="0 0 39 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.6639 14.4461C18.932 13.683 20.0679 13.683 20.336 14.4461L21.9082 18.9255C22.2543 19.9101 22.8373 20.8048 23.6112 21.5385C24.385 22.2723 25.3283 22.8249 26.3664 23.1527L31.0854 24.6443C31.8898 24.8986 31.8898 25.9763 31.0854 26.2306L26.364 27.7222C25.3261 28.0505 24.3831 28.6037 23.6096 29.3378C22.8362 30.072 22.2537 30.9669 21.9082 31.9518L20.336 36.4288C20.2782 36.5959 20.1663 36.7414 20.0161 36.8445C19.866 36.9477 19.6853 37.0033 19.5 37.0033C19.3146 37.0033 19.1339 36.9477 18.9838 36.8445C18.8337 36.7414 18.7217 36.5959 18.6639 36.4288L17.0917 31.9495C16.7459 30.965 16.1632 30.0705 15.3898 29.3368C14.6164 28.6031 13.6736 28.0503 12.636 27.7222L7.91453 26.2306C7.73839 26.1758 7.58501 26.0696 7.47627 25.9271C7.36753 25.7847 7.30898 25.6133 7.30898 25.4375C7.30898 25.2616 7.36753 25.0902 7.47627 24.9478C7.58501 24.8053 7.73839 24.6991 7.91453 24.6443L12.636 23.1527C13.6736 22.8246 14.6164 22.2718 15.3898 21.5381C16.1632 20.8044 16.7459 19.9099 17.0917 18.9255L18.6639 14.4461ZM9.24784 2.65471C9.28279 2.55456 9.35012 2.46741 9.44026 2.40565C9.53041 2.34388 9.63877 2.31063 9.74997 2.31063C9.86116 2.31063 9.96952 2.34388 10.0597 2.40565C10.1498 2.46741 10.2171 2.55456 10.2521 2.65471L11.1954 5.34183C11.6171 6.5397 12.6067 7.47858 13.8693 7.87864L16.7017 8.77358C16.8073 8.80674 16.8991 8.87062 16.9642 8.95614C17.0293 9.04165 17.0644 9.14446 17.0644 9.24995C17.0644 9.35545 17.0293 9.45825 16.9642 9.54377C16.8991 9.62929 16.8073 9.69317 16.7017 9.72633L13.8693 10.6213C13.2463 10.8175 12.6801 11.149 12.2158 11.5894C11.7516 12.0298 11.4022 12.5669 11.1954 13.1581L10.2521 15.8452C10.2171 15.9453 10.1498 16.0325 10.0597 16.0943C9.96952 16.156 9.86116 16.1893 9.74997 16.1893C9.63877 16.1893 9.53041 16.156 9.44026 16.0943C9.35012 16.0325 9.28279 15.9453 9.24784 15.8452L8.30453 13.1581C8.09773 12.5669 7.74832 12.0298 7.28409 11.5894C6.81987 11.149 6.25368 10.8175 5.63059 10.6213L2.79822 9.72633C2.69266 9.69317 2.6008 9.62929 2.53569 9.54377C2.47059 9.45825 2.43555 9.35545 2.43555 9.24995C2.43555 9.14446 2.47059 9.04165 2.53569 8.95614C2.6008 8.87062 2.69266 8.80674 2.79822 8.77358L5.63059 7.87864C6.25368 7.68245 6.81987 7.35095 7.28409 6.91054C7.74832 6.47013 8.09773 5.93296 8.30453 5.34183L9.24784 2.65471ZM26.4785 0.228893C26.5026 0.163047 26.5477 0.105951 26.6075 0.0655415C26.6674 0.0251321 26.739 0.00341797 26.8125 0.00341797C26.8859 0.00341797 26.9576 0.0251321 27.0174 0.0655415C27.0772 0.105951 27.1223 0.163047 27.1464 0.228893L27.7753 2.01877C28.0556 2.81889 28.7162 3.44558 29.5595 3.71152L31.4462 4.30814C31.5156 4.33097 31.5757 4.37375 31.6183 4.43053C31.6609 4.48731 31.6838 4.55526 31.6838 4.62495C31.6838 4.69465 31.6609 4.7626 31.6183 4.81938C31.5757 4.87616 31.5156 4.91894 31.4462 4.94177L29.5595 5.53839C29.1443 5.6702 28.767 5.89172 28.4573 6.18547C28.1477 6.47922 27.9142 6.83718 27.7753 7.23114L27.1464 9.02102C27.1223 9.08686 27.0772 9.14396 27.0174 9.18437C26.9576 9.22478 26.8859 9.24649 26.8125 9.24649C26.739 9.24649 26.6674 9.22478 26.6075 9.18437C26.5477 9.14396 26.5026 9.08686 26.4785 9.02102L25.8497 7.23114C25.7107 6.83718 25.4772 6.47922 25.1676 6.18547C24.858 5.89172 24.4807 5.6702 24.0654 5.53839L22.1812 4.94177C22.1118 4.91894 22.0516 4.87616 22.009 4.81938C21.9664 4.7626 21.9436 4.69465 21.9436 4.62495C21.9436 4.55526 21.9664 4.48731 22.009 4.43053C22.0516 4.37375 22.1118 4.33097 22.1812 4.30814L24.0678 3.71152C24.9112 3.44558 25.5718 2.81889 25.8521 2.01877L26.4785 0.228893Z" fill="#0596B8" />
            </svg>
          </div>
          <!-- Title -->
          <h3
            class="text-[#F4ED18] text-[22px] md:text-[24px] font-medium leading-[1.2] mb-6"
            style="font-family: 'Bricolage Grotesque', sans-serif;"
          >
            Built for modern<br>brands<br>&nbsp;
          </h3>
          <!-- Divider -->
          <hr class="border-white/30 mb-6">
          <!-- Body -->
          <p
            class="text-white text-[15px] font-normal leading-relaxed"
            style="font-family: 'Bricolage Grotesque', sans-serif;"
          >
            Future-focused solutions designed for today's market.
          </p>
        </div>

        <!-- Card 4 -->
        <div class="bg-[#0596B8] rounded-[16px] p-8 flex flex-col h-full">
          <!-- Icon -->
          <div class="w-[52px] h-[52px] rounded-full bg-[#F4ED18] flex items-center justify-center mb-8 shrink-0 relative">
            <svg
              width="26"
              height="26"
              viewBox="0 0 59 59"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- Small Hexagon -->
              <path d="M 10 3 L 19 8 L 19 20 L 10 25 L 1 20 L 1 8 Z" fill="#0596B8"/>
              <!-- Large Hexagon -->
              <path d="M 27 22 L 27 38 L 42 38 L 42 22 L 51 27 L 51 48 L 35 57 L 18 48 L 18 27 Z" fill="#0596B8"/>
              <!-- Flagpole and Flag -->
              <path d="M 32 0 H 34.5 V 34 H 32 Z M 34.5 0 H 57 C 51 4, 51 12, 57 16 H 34.5 Z" fill="#0596B8"/>
            </svg>
          </div>
          <!-- Title -->
          <h3
            class="text-[#F4ED18] text-[22px] md:text-[24px] font-medium leading-[1.2] mb-6"
            style="font-family: 'Bricolage Grotesque', sans-serif;"
          >
            Strategy-first<br>approach<br>&nbsp;
          </h3>
          <!-- Divider -->
          <hr class="border-white/30 mb-6">
          <!-- Body -->
          <p
            class="text-white text-[15px] font-normal leading-relaxed"
            style="font-family: 'Bricolage Grotesque', sans-serif;"
          >
            Planning that creates clarity and turns vision into action.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
