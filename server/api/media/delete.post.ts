import { readBody, createError, getCookie, defineEventHandler } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'sb-access-token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: No active session' })
  }

  // Retrieve Supabase config
  const supabaseUrl = process.env.SUPABASE_URL || 'https://vewmzejakdfsgsyxdlpa.supabase.co'
  const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_SjN1foafYhhbb3k-DI82Aw_xsjStWt_'

  // Validate the auth token using the Supabase API
  try {
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: 'GET',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${token}`
      }
    })

    if (!authResponse.ok) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Invalid access token' })
    }
  } catch (err) {
    console.error('Error validating session during delete:', err)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Token verification failed' })
  }

  // Parse request body
  const body = await readBody(event)
  const filename = body?.filename

  if (!filename) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request: Filename parameter is required' })
  }

  // Initialize a scoped Supabase client with the user's token for authorized deletion
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  })

  const { error } = await supabase.storage
    .from('Website_images')
    .remove([filename])

  if (error) {
    console.error('Supabase deletion error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete media asset from storage' })
  }

  return {
    success: true
  }
})
