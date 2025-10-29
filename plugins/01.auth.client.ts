export default defineNuxtPlugin(async () => {
  const { initAuth } = useAuth()
  
  // Initialize authentication state
  await initAuth()
})
