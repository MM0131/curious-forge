import { ref } from '#imports'
import type { Blueprint } from '~/types/blueprint'

type DbBlueprint = {
  id: string
  title: string
  description?: string
  category: string
  difficulty?: string
  duration?: string
  materials?: string[] | null
  steps?: Array<{ number?: number; title?: string; description?: string }> | string[] | null
  science_explanation?: string | null
  safety_notes?: string[] | null
  image_url?: string | null
  video_url?: string | null
}

export function useBlueprints() {
  const list = ref<Blueprint[]>([])
  const loading = ref(false)

  async function load() {
    loading.value = true
    try {
      // Prefer Supabase if configured, otherwise fallback to local JSON
      const config = useRuntimeConfig()
      const supabaseUrl = (config.public as any).supabaseUrl as string | undefined
      const supabaseKey = (config.public as any).supabaseKey as string | undefined

      if (supabaseUrl && supabaseKey) {
        const supabase = useSupabase()
        const { data, error } = await supabase
          .from('blueprints')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })

        if (error) throw error

        const mapped: Blueprint[] = (data as DbBlueprint[]).map((b) => ({
          id: b.id,
          title: b.title,
          category: b.category,
          difficulty: (b.difficulty || 'Easy').replace('beginner', 'Easy').replace('intermediate', 'Medium').replace('advanced', 'Hard'),
          time: b.duration || '—',
          materials: (b.materials || []) ?? [],
          steps: Array.isArray(b.steps)
            ? (b.steps as any[]).map((s) => (typeof s === 'string' ? s : s.title || s.description || ''))
            : [],
          purpose: b.description || '',
          warnings: (b.safety_notes || []).join(' • '),
          description: b.description,
          sciencePrinciple: b.science_explanation || undefined,
          funFacts: undefined,
          image: b.image_url || undefined,
          videoUrl: b.video_url || undefined,
        }))

        list.value = mapped
      } else {
        const res = await fetch('/assets/data/blueprints.json')
        list.value = await res.json()
      }
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
