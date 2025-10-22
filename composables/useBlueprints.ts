import { ref } from 'vue'

export function useBlueprints() {
  const list = ref<any[]>([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      const res = await fetch('/assets/data/blueprints.json')
      list.value = await res.json()
    } catch (e) {
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
