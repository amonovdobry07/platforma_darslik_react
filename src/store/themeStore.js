import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set, get) => ({
      // 'dark' yoki 'light'
      theme: 'dark',
      
      // Theme'ni o'rnatish
      setTheme: (theme) => {
        set({ theme })
        // HTML elementga class qo'shish
        document.documentElement.setAttribute('data-theme', theme)
      },
      
      // Theme'ni almashtirish
      toggleTheme: () => {
        const current = get().theme
        const newTheme = current === 'dark' ? 'light' : 'dark'
        set({ theme: newTheme })
        document.documentElement.setAttribute('data-theme', newTheme)
      },
      
      // Sahifa yuklanganda theme'ni o'rnatish
      initTheme: () => {
        const current = get().theme
        document.documentElement.setAttribute('data-theme', current)
      },
    }),
    {
      name: 'darslik-theme', // localStorage kalit
    }
  )
)

export default useThemeStore