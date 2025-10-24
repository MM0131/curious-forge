import { ref } from '#imports'
import type { Blueprint } from '~/types/blueprint'

export function useBlueprints() {
  const list = ref<Blueprint[]>([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      const res = await fetch('/assets/data/blueprints.json')
      list.value = await res.json()
    } catch (e: unknown) {
      console.error('Failed to load blueprints:', e)
      list.value = []
    } finally {
      loading.value = false
    }
  }

  function findById(id: string) {
    return list.value.find(x => x.id === id)
  }

  function search(q: string) {
    if (!q) return list.value
    return list.value.filter(b => b.title.toLowerCase().includes(q.toLowerCase()))
  }

  return { list, loading, load, findById, search }
}
