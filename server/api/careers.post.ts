import { defineEventHandler, readBody, createError } from 'h3'
import { escapeHtml, EMAIL_RE, verifyTurnstile } from '../utils/form-security'

// Mirrors the client-side limits in ModalCareers.vue (5MB, PDF/DOC/DOCX). The
// client check is a UX affordance; these are the ones that actually hold.
const MAX_RESUME_BASE64_CHARS = 7_200_000 // ~5MB once decoded
const ALLOWED_RESUME_EXTENSIONS = ['pdf', 'doc', 'docx']

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  const { name, email, phone, resume, resumeName, token } = body

  // Validate required fields
  if (!name || !email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please fill in all required fields (Name and Email).'
    })
  }

  // Verify Cloudflare Turnstile token
  await verifyTurnstile(token, config.turnstileSecretKey || process.env.TURNSTILE_SECRET_KEY, 'careers')

  // Validate email format and bound input sizes (cheap abuse guard).
  if (typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 320) {
    throw createError({ statusCode: 400, statusMessage: 'Please provide a valid email address.' })
  }
  if (String(name).length > 200 || String(phone ?? '').length > 50) {
    throw createError({ statusCode: 400, statusMessage: 'Input exceeds the allowed length.' })
  }

  // Validate the attachment before it reaches the mail provider.
  let attachmentName: string | null = null
  if (resume || resumeName) {
    if (typeof resume !== 'string' || typeof resumeName !== 'string' || !resume || !resumeName) {
      throw createError({ statusCode: 400, statusMessage: 'The attached resume could not be read.' })
    }
    if (resume.length > MAX_RESUME_BASE64_CHARS) {
      throw createError({ statusCode: 400, statusMessage: 'Resume file size must be less than 5MB.' })
    }
    const ext = resumeName.split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_RESUME_EXTENSIONS.includes(ext)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Unsupported resume format. Allowed: ${ALLOWED_RESUME_EXTENSIONS.join(', ')}.`
      })
    }
    // Strip path separators and anything exotic so the filename that reaches
    // the mail provider (and our inbox) is a plain flat name.
    attachmentName = resumeName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120)
  }

  // Get Resend API Key from runtime config / env
  const resendApiKey = config.resendApiKey || process.env.RESEND_API_KEY
  const recipientEmail = config.contactRecipientEmail || process.env.CONTACT_RECIPIENT_EMAIL || 'info@macawoo.co'

  if (!resendApiKey) {
    console.error('RESEND_API_KEY environment variable is not configured.')
    throw createError({
      statusCode: 500,
      statusMessage: 'Email service configuration error. Please check environment variables.'
    })
  }

  // Format HTML Email Template for Career application. Every interpolated
  // value is submitter-controlled, so it all goes through escapeHtml.
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background-color: #F7EC12; padding: 20px; text-align: center;">
        <h2 style="color: #000; margin: 0; font-size: 24px;">New Job Application Received</h2>
      </div>
      <div style="padding: 24px; background-color: #fff;">
        <p style="font-size: 16px; margin-top: 0;">You have received a new application via the <strong>Careers Page Modal</strong>:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Applicant Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email Address:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${encodeURIComponent(email)}" style="color: #0596B8; text-decoration: none;">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone Number:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(phone || 'Not provided')}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Resume File:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(attachmentName || 'No file uploaded')}</td>
          </tr>
        </table>
      </div>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee;">
        This email was sent automatically from the Macawoo website.
      </div>
    </div>
  `

  try {
    const emailPayload: Record<string, unknown> = {
      from: 'Macawoo Careers <career@macawoo.co>',
      to: recipientEmail,
      subject: `Macawoo Job Application: ${name}`,
      html: htmlContent,
      reply_to: email
    }

    // Add resume attachment if provided
    if (resume && attachmentName) {
      emailPayload.attachments = [
        {
          filename: attachmentName,
          content: resume
        }
      ]
    }

    // Send email using Resend REST API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Resend API response error:', errorData)
      throw new Error(`Resend responded with status ${response.status}`)
    }

    const data = await response.json()
    return { success: true, id: data.id }
  } catch (error: unknown) {
    // Log the upstream detail, return a generic message — Resend's errors can
    // name internal configuration and don't belong in a client response.
    console.error('Careers application mail sending failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to dispatch application message.'
    })
  }
})
