import { readMultipartFormData, createError, getCookie, defineEventHandler } from 'h3'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
  ogg: 'video/ogg'
}

const ascii = (buf: Uint8Array, start: number, end: number) =>
  String.fromCharCode(...buf.subarray(start, end))

function matchesMagicBytes(ext: string, buf: Uint8Array): boolean {
  if (buf.length < 12) return false
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF
    case 'png':
      return buf[0] === 0x89 && ascii(buf, 1, 4) === 'PNG'
    case 'gif':
      return ascii(buf, 0, 4) === 'GIF8'
    case 'webp':
      return ascii(buf, 0, 4) === 'RIFF' && ascii(buf, 8, 12) === 'WEBP'
    case 'mp4':
    case 'mov':
      // ISO base media: box size (4 bytes) then a box type such as ftyp,
      // moov, mdat, free or wide (older QuickTime files).
      return ['ftyp', 'moov', 'mdat', 'free', 'wide', 'skip'].includes(ascii(buf, 4, 8))
    case 'webm':
      return buf[0] === 0x1A && buf[1] === 0x45 && buf[2] === 0xDF && buf[3] === 0xA3
    case 'ogg':
      return ascii(buf, 0, 4) === 'OggS'
    default:
      return false
  }
}

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

  // The stored Content-Type is derived from the extension, never taken from the
  // client: the bucket is public and serves objects with whatever type they
  // were written with, so a client-chosen type (text/html, image/svg+xml, ...)
  // would turn a "media" upload into a page that runs script on our storage
  // origin. SVG is deliberately absent for the same reason.
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const contentType = ALLOWED_TYPES[ext]
  if (!contentType) {
    throw createError({
      statusCode: 400,
      statusMessage: `Unsupported file type. Allowed: ${Object.keys(ALLOWED_TYPES).join(', ')}`
    })
  }
  const isVideo = contentType.startsWith('video/')

  // Check the leading bytes actually match the claimed format.
  if (!matchesMagicBytes(ext, fileData.data)) {
    throw createError({ statusCode: 400, statusMessage: 'File contents do not match its extension.' })
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
