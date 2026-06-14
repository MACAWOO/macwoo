import { readMultipartFormData, createError, getCookie, defineEventHandler } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'sb-access-token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: No active session' })
  }

  // Retrieve Supabase config
  const { supabaseUrl, supabaseKey } = getSupabaseConfig(event)

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
    console.error('Error validating session during upload:', err)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Token verification failed' })
  }

  // Parse the multipart form data
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No files were uploaded' })
  }

  const fileData = formData.find(item => item.name === 'file')
  if (!fileData || !fileData.data) {
    throw createError({ statusCode: 400, statusMessage: 'No file data found in form request' })
  }

  const filename = fileData.filename || 'upload.bin'
  const contentType = fileData.type || 'application/octet-stream'

  // File type validation (MIME type check)
  const isImage = contentType.startsWith('image/')
  const isVideo = contentType.startsWith('video/')

  if (!isImage && !isVideo) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file type. Only image and video files are permitted.' })
  }

  // File extension validation
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'webm', 'mov', 'ogg']
  if (!allowedExtensions.includes(ext)) {
    throw createError({ statusCode: 400, statusMessage: `Unsupported file extension. Allowed: ${allowedExtensions.join(', ')}` })
  }

  // File size validation (10MB for images, 20MB for videos)
  const maxBytes = isVideo ? 20 * 1024 * 1024 : 10 * 1024 * 1024
  if (fileData.data.length > maxBytes) {
    throw createError({
      statusCode: 400,
      statusMessage: `File size exceeds the limit of ${isVideo ? '20MB' : '10MB'} for this asset type.`
    })
  }

  // Initialize a scoped Supabase client with the user's token for authorized writing
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  })

  // Sanitize the filename to prevent potential directory traversal issues
  const cleanedName = filename.replace(/[^a-zA-Z0-9.]/g, '_')
  const fileName = `${Date.now()}_${cleanedName}`

  const { error } = await supabase.storage
    .from('Website_images')
    .upload(fileName, fileData.data, {
      contentType,
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Supabase upload error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to write media asset to storage' })
  }

  // Retrieve the public URL
  const { data: urlData } = supabase.storage
    .from('Website_images')
    .getPublicUrl(fileName)

  return {
    success: true,
    publicUrl: urlData?.publicUrl || ''
  }
})
