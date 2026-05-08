<template>
<div class="arrow-shape">
    <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 50L60 45C120 40 240 30 360 35C480 40 600 60 720 65C840 70 960 60 1080 55C1200 50 1320 50 1380 50L1440 50V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z"
        fill="#F9FAFB"
      />
      <path
        d="M0 20L60 25C120 30 240 40 360 35C480 30 600 10 720 5C840 0 960 10 1080 15C1200 20 1320 20 1380 20L1440 20V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V20Z"
        fill="#F9FAFB"
        opacity="0.3"
      />
    </svg>
  </div>

  <!-- Zigzag Shape -->
  <div class="zigzag-shape">
    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 30L40 10L80 30L120 10L160 30L200 10L240 30L280 10L320 30L360 10L400 30L440 10L480 30L520 10L560 30L600 10L640 30L680 10L720 30L760 10L800 30L840 10L880 30L920 10L960 30L1000 10L1040 30L1080 10L1120 30L1160 10L1200 30L1240 10L1280 30L1320 10L1360 30L1400 10L1440 30V60H1400C1360 60 1320 60 1280 60C1240 60 1200 60 1160 60C1120 60 1080 60 1040 60C1000 60 960 60 920 60C880 60 840 60 800 60C760 60 720 60 680 60C640 60 600 60 560 60C520 60 480 60 440 60C400 60 360 60 320 60C280 60 240 60 200 60C160 60 120 60 80 60C40 60 0 60 0 60V30Z"
        fill="#F9FAFB"
      />
    </svg>
  </div>

  <!-- Curved Shape -->
  <div class="curved-shape">
    <svg viewBox="0 0 1440 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 75C60 75 120 50 180 50C240 50 300 75 360 75C420 75 480 50 540 50C600 50 660 75 720 75C780 75 840 50 900 50C960 50 1020 75 1080 75C1140 75 1200 50 1260 50C1320 50 1380 75 1440 75V150H1380C1320 150 1200 150 1080 150C960 150 840 150 720 150C600 150 480 150 360 150C240 150 120 150 60 150H0V75Z"
        fill="#F9FAFB"
      />
      <path
        d="M0 100C60 100 120 75 180 75C240 75 300 100 360 100C420 100 480 75 540 75C600 75 660 100 720 100C780 100 840 75 900 75C960 75 1020 100 1080 100C1140 100 1200 75 1260 75C1320 75 1380 100 1440 100V150H1380C1320 150 1200 150 1080 150C960 150 840 150 720 150C600 150 480 150 360 150C240 150 120 150 60 150H0V100Z"
        fill="#F9FAFB"
        opacity="0.4"
      />
    </svg>
  </div>
</template>

<style scoped>
.arrow-shape,
.zigzag-shape,
.curved-shape {
  width: 100%;
  height: auto;
  display: block;
}

svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Animations */
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.arrow-shape svg {
  animation: slideUp 1s ease-out;
}

.zigzag-shape svg {
  animation: slideUp 1s ease-out 0.2s both;
}

.curved-shape svg {
  animation: slideUp 1s ease-out 0.4s both;
}
</style>
