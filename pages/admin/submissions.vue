<template>
  <section class="py-12">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Admin — Submissions</h1>

      <div v-if="loading" class="text-sm text-slate-400">Loading...</div>

      <div v-else>
        <div v-if="!isAdmin" class="text-rose-400">Access denied. You must be an admin to view this page.</div>

        <div v-else>
          <table class="w-full table-auto text-sm">
            <thead>
              <tr class="text-left text-slate-300">
                <th class="p-2">Title</th>
                <th class="p-2">Submitter</th>
                <th class="p-2">Status</th>
                <th class="p-2">Created</th>
                <th class="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in submissions" :key="row.id" class="border-t border-white/5">
                <td class="p-2">{{ row.title }}</td>
                <td class="p-2">{{ row.submitter_name }}<br/><small class="text-slate-400">{{ row.submitter_email }}</small></td>
                <td class="p-2">{{ row.status }}</td>
                <td class="p-2">{{ formatDate(row.created_at) }}</td>
                <td class="p-2">
                  <button class="btn-sm mr-2" @click="updateStatus(row.id, 'approved')">Approve</button>
                  <button class="btn-sm btn-ghost" @click="updateStatus(row.id, 'rejected')">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabase } from '~/composables/useSupabase'

const supabase = useSupabase()
const submissions = ref<any[]>([])
const loading = ref(true)
const isAdmin = ref(false)

function formatDate(s: string) {
  return new Date(s).toLocaleString()
}

async function load() {
  loading.value = true
  const sessionResp = await supabase.auth.getSession()
  const session = (sessionResp as any)?.data?.session
  const user = session?.user || null
  isAdmin.value = !!user?.email && user.email.endsWith('@admin.curiousforge.com')

  if (!isAdmin.value) {
    loading.value = false
    return
  }

  const { data, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error('Failed to load submissions', error)
  } else {
    submissions.value = data || []
  }
  loading.value = false
}

async function updateStatus(id: string, status: string) {
  try {
    // forward current user's access token to the server endpoint for verification
  const sessionResp = await supabase.auth.getSession()
  const session = (sessionResp as any)?.data?.session
  const accessToken = session?.access_token
    if (!accessToken) throw new Error('Not authenticated')

    await $fetch(`/api/admin/submissions/${id}/status`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { status }
    })
    // refresh list
    await load()
  } catch (err) {
    console.error(err)
    alert('Failed to update status')
  }
}

onMounted(() => { load() })
</script>

<style scoped>
.btn-sm { @apply px-3 py-1 rounded bg-violet-600 text-white text-xs }
.btn-ghost { @apply bg-transparent border border-white/10 text-slate-100 }
</style>
