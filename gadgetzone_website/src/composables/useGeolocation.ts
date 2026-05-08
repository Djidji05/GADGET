import { ref } from 'vue'

export interface UserCoords {
  latitude: number
  longitude: number
}

export function useGeolocation() {
  const coords = ref<UserCoords | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const getPosition = () => {
    // Check if we have it in localStorage already
    const saved = localStorage.getItem('user_coords')
    if (saved) {
      coords.value = JSON.parse(saved)
      return Promise.resolve(coords.value)
    }

    if (!navigator.geolocation) {
      error.value = 'Géolocalisation non supportée par votre navigateur'
      return Promise.reject(error.value)
    }

    loading.value = true
    return new Promise<UserCoords>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          coords.value = newCoords
          localStorage.setItem('user_coords', JSON.stringify(newCoords))
          loading.value = false
          resolve(newCoords)
        },
        (err) => {
          error.value = err.message
          loading.value = false
          reject(err)
        },
        { timeout: 10000 }
      )
    })
  }

  const saveCoords = (lat: number, lng: number) => {
    const newCoords = { latitude: lat, longitude: lng }
    coords.value = newCoords
    localStorage.setItem('user_coords', JSON.stringify(newCoords))
  }

  return {
    coords,
    error,
    loading,
    getPosition,
    saveCoords
  }
}
