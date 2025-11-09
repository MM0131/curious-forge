import { computed, watch, onMounted, ref } from 'vue'
import type { Blueprint } from '~/types/blueprint'
import blueprintsData from '@/assets/data/blueprints.en'

// A small helper to detect Supabase configuration presence
export function isSupabaseConfigured() {
  const config = useRuntimeConfig()
  const url = (config.public as any).supabaseUrl as string | undefined
  const key = (config.public as any).supabaseKey as string | undefined
  return Boolean(url && key)
}

export function useSaved() {
  const supabase = isSupabaseConfigured() ? useSupabase() : null
  const { user, isAuthenticated } = useAuth()

  // Single source of truth for saved ids
  const savedIds = useState<string[]>('saved-ids', () => [])
  const loading = useState<boolean>('saved-loading', () => false)

  // Load saved items from the appropriate source
  const loadSaved = async () => {
    if (!import.meta.client) return
    loading.value = true
    try {
      // If Supabase is available and user is logged in, load from DB
      if (supabase && isAuthenticated.value && user.value) {
        const { data, error } = await supabase
          .from('saved_blueprints')
          .select('blueprint_id')

        if (error) throw error
        savedIds.value = (data || []).map((row: any) => row.blueprint_id as string)
      } else {
        // Fallback to localStorage (guest mode)
        // Use per-user key when a mock / local user exists, otherwise fall back to global 'saved'
        const localKey = user.value && user.value.id ? `cf:saved:${user.value.id}` : 'saved'
        const raw = localStorage.getItem(localKey)
        // Backwards-compatibility: if per-user key not found, try legacy 'saved'
        const fallback = !raw ? localStorage.getItem('saved') : raw
        savedIds.value = fallback ? JSON.parse(fallback) : []
      }
    } catch (e) {
      console.error('Failed to load saved items:', e)
      savedIds.value = []
    } finally {
      loading.value = false
    }
  }

  // Persist guest saved ids into localStorage only when not authenticated
  watch(savedIds, (ids) => {
    if (!import.meta.client) return
    // If Supabase isn't configured, persist to a local per-user key (or guest key)
    if (!isSupabaseConfigured()) {
      const key = user.value && user.value.id ? `cf:saved:${user.value.id}` : 'saved'
      localStorage.setItem(key, JSON.stringify(ids))
      return
    }

    // When Supabase is configured, only persist to localStorage for unauthenticated guests
    if (!isAuthenticated.value) {
      localStorage.setItem('saved', JSON.stringify(ids))
    }
  }, { deep: true })

  // Initial load on client
  onMounted(() => {
    loadSaved()
  })

  // Derive saved blueprint objects from whichever source is available
  // Prefer loaded blueprints from useBlueprints(); fallback to local JSON
  const { list: loadedList } = (() => {
    try {
      return useBlueprints()
    } catch {
      return { list: ref([] as Blueprint[]) }
    }
  })()

  const all = computed<Blueprint[]>(() => {
    return (loadedList?.value && loadedList.value.length > 0)
      ? loadedList.value
      : (blueprintsData as Blueprint[])
  })

  const savedBlueprints = computed(() => all.value.filter(b => savedIds.value.includes(b.id)))
  const count = computed(() => savedIds.value.length)

  // Mutations
  const save = async (id: string) => {
    if (savedIds.value.includes(id)) return
    // Auth required for persistent save
    if (supabase && isAuthenticated.value && user.value) {
      // Optimistic update
      savedIds.value = [...savedIds.value, id]
      const { error } = await supabase
        .from('saved_blueprints')
        .upsert({ blueprint_id: id, user_id: user.value.id } as any)
      if (error) {
        // Revert on failure
        savedIds.value = savedIds.value.filter(x => x !== id)
        throw error
      }
    } else {
      // Guest mode: store locally (optional), or require login
      // Here we choose to allow local save so UX still works without account
      savedIds.value = [...savedIds.value, id]
    }
  }

  const remove = async (id: string) => {
    if (!savedIds.value.includes(id)) return
    if (supabase && isAuthenticated.value && user.value) {
      // Optimistic update
      const prev = [...savedIds.value]
      savedIds.value = savedIds.value.filter(x => x !== id)
      const { error } = await supabase
        .from('saved_blueprints')
        .delete()
        .eq('blueprint_id', id)
      if (error) {
        savedIds.value = prev
        throw error
      }
    } else {
      savedIds.value = savedIds.value.filter(x => x !== id)
    }
  }

  const toggle = async (id: string) => {
    if (savedIds.value.includes(id)) return remove(id)
    return save(id)
  }

  const isSaved = (id: string) => savedIds.value.includes(id)

  return { savedIds, savedBlueprints, count, save, remove, toggle, isSaved, loadSaved, loading }
}
