import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const isDark = ref(localStorage.getItem('theme') === 'dark')

    const toggleTheme = () => {
        isDark.value = !isDark.value
    }

    // Sync with DOM and localStorage
    watch(isDark, (val) => {
        if (val) {
            if (!window.location.pathname.startsWith('/seller')) {
                document.documentElement.classList.add('dark')
            }
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, { immediate: true })

    return {
        isDark,
        toggleTheme
    }
})
