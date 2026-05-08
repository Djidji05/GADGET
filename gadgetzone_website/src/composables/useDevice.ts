import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable pour détecter le type d'appareil (mobile, tablet, desktop)
 * Utilise les breakpoints Tailwind standards
 */
export function useDevice() {
    const isMobile = ref(false)
    const isTablet = ref(false)
    const isDesktop = ref(false)
    const screenWidth = ref(0)

    const checkDevice = () => {
        const width = window.innerWidth
        screenWidth.value = width

        // Breakpoints Tailwind
        isMobile.value = width < 768
        isTablet.value = width >= 768 && width < 1024
        isDesktop.value = width >= 1024
    }

    onMounted(() => {
        checkDevice()
        window.addEventListener('resize', checkDevice)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', checkDevice)
    })

    return {
        isMobile,
        isTablet,
        isDesktop,
        screenWidth
    }
}
