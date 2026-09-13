<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        @click.self="closeModal"
      >
        <div class="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto border border-gray-100 dark:border-gray-800">
          
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg">
                <i class="fas fa-crop-alt"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 dark:text-white text-base">Recadrer la photo</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Sélectionnez le produit à rechercher</p>
              </div>
            </div>
            <button 
              @click="closeModal"
              class="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Cropper Canvas Container -->
          <div class="relative w-full bg-gray-950 min-h-[320px] max-h-[420px] flex items-center justify-center overflow-hidden select-none p-4" ref="cropperBox">
            <!-- Background Preview Canvas -->
            <canvas ref="canvasRef" class="max-w-full max-h-[380px] object-contain shadow-xl rounded-lg"></canvas>

            <!-- Crop Selection Overlay Box -->
            <div
              v-if="imageLoaded && !isSearching"
              class="absolute border-2 border-blue-500 bg-blue-500/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] cursor-move rounded-lg transition-shadow"
              :style="{
                left: `${cropBox.x}px`,
                top: `${cropBox.y}px`,
                width: `${cropBox.w}px`,
                height: `${cropBox.h}px`
              }"
              @mousedown="startDrag"
              @touchstart="startDrag"
            >
              <!-- Grid lines -->
              <div class="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                <div class="border-r border-b border-white/60"></div>
                <div class="border-r border-b border-white/60"></div>
                <div class="border-b border-white/60"></div>
                <div class="border-r border-b border-white/60"></div>
                <div class="border-r border-b border-white/60"></div>
                <div class="border-b border-white/60"></div>
                <div class="border-r border-white/60"></div>
                <div class="border-r border-white/60"></div>
                <div></div>
              </div>

              <!-- Handles -->
              <div class="crop-handle top-left" @mousedown.stop="startResize($event, 'tl')" @touchstart.stop="startResize($event, 'tl')"></div>
              <div class="crop-handle top-right" @mousedown.stop="startResize($event, 'tr')" @touchstart.stop="startResize($event, 'tr')"></div>
              <div class="crop-handle bottom-left" @mousedown.stop="startResize($event, 'bl')" @touchstart.stop="startResize($event, 'bl')"></div>
              <div class="crop-handle bottom-right" @mousedown.stop="startResize($event, 'br')" @touchstart.stop="startResize($event, 'br')"></div>
            </div>

            <!-- Loading Overlay during AI Visual Search -->
            <div v-if="isSearching" class="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20">
              <div class="relative w-20 h-20 mb-4 flex items-center justify-center">
                <div class="absolute inset-0 border-4 border-blue-500/20 rounded-full animate-ping"></div>
                <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <i class="fas fa-magic text-2xl text-blue-400 absolute"></i>
              </div>
              <h4 class="font-bold text-lg mb-1">Recherche visuelle en cours...</h4>
              <p class="text-xs text-blue-200">Analyse de la zone sélectionnée par l'IA</p>
            </div>
          </div>

          <!-- Controls Toolbar -->
          <div class="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <!-- Zoom & Rotate Controls -->
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-2 flex-1">
                <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Zoom</span>
                <button @click="zoomOut" class="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center text-xs transition-colors">
                  <i class="fas fa-minus"></i>
                </button>
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  step="0.1" 
                  v-model.number="scale" 
                  @input="draw" 
                  class="flex-1 accent-blue-600 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <button @click="zoomIn" class="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center text-xs transition-colors">
                  <i class="fas fa-plus"></i>
                </button>
              </div>

              <!-- Action buttons for Transformation -->
              <div class="flex items-center gap-2">
                <button 
                  @click="rotateClockwise" 
                  title="Pivoter de 90°"
                  class="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <i class="fas fa-redo text-blue-500"></i>
                  <span>90°</span>
                </button>
                <button 
                  @click="resetTransforms" 
                  title="Réinitialiser"
                  class="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white text-xs font-medium transition-colors"
                >
                  <i class="fas fa-undo"></i>
                </button>
              </div>
            </div>

            <!-- Aspect Ratio Presets -->
            <div class="flex items-center justify-center gap-2 pt-1">
              <button 
                v-for="preset in presets" 
                :key="preset.id"
                @click="setPresetRatio(preset.ratio)"
                class="px-3 py-1 text-xs font-semibold rounded-full transition-colors"
                :class="currentRatio === preset.ratio 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 gap-3">
            <button 
              @click="$emit('retake')"
              class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <i class="fas fa-camera"></i>
              <span>Autre photo</span>
            </button>

            <button 
              @click="confirmCrop"
              :disabled="isSearching || !imageLoaded"
              class="flex-1 py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <i class="fas fa-search text-base"></i>
              <span>Rechercher cette zone</span>
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps<{
  isOpen: boolean
  imageSrc: string
  isSearching?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'retake'): void
  (e: 'confirm', croppedBase64: string): void
}>()

const cropperBox = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const imageLoaded = ref(false)
const loadedImg = ref<HTMLImageElement | null>(null)

// Transformations
const scale = ref(1)
const rotation = ref(0)
const currentRatio = ref<number | null>(null)

// Crop Box in canvas coordinate space
const cropBox = ref({ x: 40, y: 40, w: 200, h: 200 })

// Dragging states
let isDragging = false
let isResizing = false
let resizeHandle = ''
let startMousePos = { x: 0, y: 0 }
let startBoxPos = { x: 0, y: 0, w: 0, h: 0 }

const presets = [
  { id: 'free', label: 'Libre', ratio: null },
  { id: 'square', label: '1:1', ratio: 1 },
  { id: 'portrait', label: '4:3', ratio: 4 / 3 },
  { id: 'landscape', label: '16:9', ratio: 16 / 9 },
]

const closeModal = () => {
  emit('close')
}

const zoomIn = () => {
  if (scale.value < 3) {
    scale.value = Math.min(3, scale.value + 0.2)
    draw()
  }
}

const zoomOut = () => {
  if (scale.value > 1) {
    scale.value = Math.max(1, scale.value - 0.2)
    draw()
  }
}

const rotateClockwise = () => {
  rotation.value = (rotation.value + 90) % 360
  draw()
}

const resetTransforms = () => {
  scale.value = 1
  rotation.value = 0
  currentRatio.value = null
  initCropBox()
  draw()
}

const setPresetRatio = (ratio: number | null) => {
  currentRatio.value = ratio
  if (cropperBox.value) {
    const boxW = cropperBox.value.clientWidth || 300
    const boxH = cropperBox.value.clientHeight || 300
    const size = Math.min(boxW, boxH) * 0.7
    
    if (ratio) {
      const w = size
      const h = size / ratio
      cropBox.value = {
        x: Math.max(10, (boxW - w) / 2),
        y: Math.max(10, (boxH - h) / 2),
        w,
        h
      }
    } else {
      initCropBox()
    }
  }
}

const initCropBox = () => {
  if (!cropperBox.value) return
  const w = cropperBox.value.clientWidth || 320
  const h = cropperBox.value.clientHeight || 320
  const boxW = Math.min(w * 0.7, 240)
  const boxH = Math.min(h * 0.7, 240)
  cropBox.value = {
    x: (w - boxW) / 2,
    y: (h - boxH) / 2,
    w: boxW,
    h: boxH
  }
}

const loadImage = () => {
  if (!props.imageSrc) return
  imageLoaded.value = false
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = async () => {
    loadedImg.value = img
    imageLoaded.value = true
    await nextTick()
    initCropBox()
    draw()
  }
  img.src = props.imageSrc
}

const draw = () => {
  const canvas = canvasRef.value
  const img = loadedImg.value
  if (!canvas || !img || !cropperBox.value) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const containerW = cropperBox.value.clientWidth || 400
  const containerH = cropperBox.value.clientHeight || 350

  canvas.width = containerW
  canvas.height = containerH

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()

  // Center image
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rotation.value * Math.PI) / 180)
  ctx.scale(scale.value, scale.value)

  // Calculate contain dimensions
  const imgAspect = img.width / img.height
  const canvasAspect = containerW / containerH
  let drawW = containerW
  let drawH = containerH

  if (imgAspect > canvasAspect) {
    drawH = containerW / imgAspect
  } else {
    drawW = containerH * imgAspect
  }

  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
  ctx.restore()
}

// Drag & Resize Handlers
const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging = true
  const pos = getClientPos(e)
  startMousePos = pos
  startBoxPos = { ...cropBox.value }
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('touchmove', onMouseMove)
  window.addEventListener('touchend', onMouseUp)
}

const startResize = (e: MouseEvent | TouchEvent, handle: string) => {
  isResizing = true
  resizeHandle = handle
  const pos = getClientPos(e)
  startMousePos = pos
  startBoxPos = { ...cropBox.value }
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('touchmove', onMouseMove)
  window.addEventListener('touchend', onMouseUp)
}

const getClientPos = (e: MouseEvent | TouchEvent) => {
  if ('touches' in e && e.touches[0]) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const me = e as MouseEvent
  return { x: me.clientX, y: me.clientY }
}

const onMouseMove = (e: MouseEvent | TouchEvent) => {
  if (!cropperBox.value) return
  const pos = getClientPos(e)
  const dx = pos.x - startMousePos.x
  const dy = pos.y - startMousePos.y
  const containerW = cropperBox.value.clientWidth
  const containerH = cropperBox.value.clientHeight

  if (isDragging) {
    let newX = startBoxPos.x + dx
    let newY = startBoxPos.y + dy
    newX = Math.max(5, Math.min(containerW - startBoxPos.w - 5, newX))
    newY = Math.max(5, Math.min(containerH - startBoxPos.h - 5, newY))
    cropBox.value.x = newX
    cropBox.value.y = newY
  } else if (isResizing) {
    let { x, y, w, h } = startBoxPos
    if (resizeHandle.includes('r')) w += dx
    if (resizeHandle.includes('l')) { x += dx; w -= dx; }
    if (resizeHandle.includes('b')) h += dy
    if (resizeHandle.includes('t')) { y += dy; h -= dy; }

    w = Math.max(60, Math.min(containerW - x - 5, w))
    h = Math.max(60, Math.min(containerH - y - 5, h))

    if (currentRatio.value) {
      h = w / currentRatio.value
    }

    cropBox.value = { x: Math.max(5, x), y: Math.max(5, y), w, h }
  }
}

const onMouseUp = () => {
  isDragging = false
  isResizing = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('touchmove', onMouseMove)
  window.removeEventListener('touchend', onMouseUp)
}

// Crop & Export Base64 Image
const confirmCrop = () => {
  const canvas = canvasRef.value
  if (!canvas || !cropperBox.value) return

  // Create an offscreen canvas to capture the cropped box
  const outCanvas = document.createElement('canvas')
  const outCtx = outCanvas.getContext('2d')
  if (!outCtx) return

  const box = cropBox.value
  outCanvas.width = box.w
  outCanvas.height = box.h

  // Copy portion from main canvas
  outCtx.drawImage(
    canvas,
    box.x, box.y, box.w, box.h,
    0, 0, box.w, box.h
  )

  const croppedBase64 = outCanvas.toDataURL('image/jpeg', 0.85)
  emit('confirm', croppedBase64)
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => loadImage())
  }
})

watch(() => props.imageSrc, () => {
  if (props.isOpen) {
    loadImage()
  }
})

onMounted(() => {
  if (props.isOpen) loadImage()
})

onUnmounted(() => {
  onMouseUp()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.crop-handle {
  position: absolute;
  width: 14px;
  height: 14px;
  background-color: #3b82f6;
  border: 2px solid white;
  border-radius: 9999px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.crop-handle.top-left { top: -7px; left: -7px; cursor: nwse-resize; }
.crop-handle.top-right { top: -7px; right: -7px; cursor: nesw-resize; }
.crop-handle.bottom-left { bottom: -7px; left: -7px; cursor: nesw-resize; }
.crop-handle.bottom-right { bottom: -7px; right: -7px; cursor: nwse-resize; }
</style>
