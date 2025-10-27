import { computed, watch, onMounted } from 'vue'
import type { Blueprint } from '~/types/blueprint'
import blueprintsData from '@/assets/data/blueprints.json'

export function useSaved() {
  // Keep a single reactive source of truth
  const savedIds = useState<string[]>('saved-ids', () => [])

  // Load once on client
  onMounted(() => {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem('saved')
      if (raw) savedIds.value = JSON.parse(raw)
    } catch {
      savedIds.value = []
    }
  })

  // Persist on change
  watch(savedIds, (ids) => {
    if (!import.meta.client) return
    localStorage.setItem('saved', JSON.stringify(ids))
  }, { deep: true })

  const all = blueprintsData as Blueprint[]
  const savedBlueprints = computed(() => all.filter(b => savedIds.value.includes(b.id)))
  const count = computed(() => savedIds.value.length)

  function save(id: string) {
    if (!savedIds.value.includes(id)) savedIds.value.push(id)
  }
  function remove(id: string) {
    savedIds.value = savedIds.value.filter(x => x !== id)
  }
  function toggle(id: string) {
    if (savedIds.value.includes(id)) remove(id)
    else save(id)
  }
  function isSaved(id: string) {
    return savedIds.value.includes(id)
  }

  return { savedIds, savedBlueprints, count, save, remove, toggle, isSaved }
}
