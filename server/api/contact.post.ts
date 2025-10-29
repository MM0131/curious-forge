// server/api/contact.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate required fields
  if (!body.name || !body.email || !body.message) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields'
    })
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format'
    })
  }

  // Log submission
  console.log('📧 Contact form:', { name: body.name, email: body.email })

  return {
    success: true,
    message: 'Thank you for contacting us!'
  }
})
