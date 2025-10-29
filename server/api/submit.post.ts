// server/api/submit.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate required fields
  const required = ['name', 'email', 'projectTitle', 'category', 'difficulty', 'steps', 'materials']
  const missing = required.filter(f => !body[f])
  
  if (missing.length > 0) {
    throw createError({
      statusCode: 400,
      message: `Missing: ${missing.join(', ')}`
    })
  }

  // Validate email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email'
    })
  }

  // Log submission
  console.log('💡 New idea:', body.projectTitle, 'from', body.email)

  return {
    success: true,
    message: 'Thank you for your idea! 🎉'
  }
})
