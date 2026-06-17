import { defineEventHandler, readBody, createError } from 'h3'

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
  const turnstileSecret = config.turnstileSecretKey || process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA'
  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Security verification is required (missing Turnstile token).'
    })
  }

  try {
    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: token
      })
    })

    const verifyResult = await verifyResponse.json()
    if (!verifyResult.success) {
      console.error('Turnstile verification failed for careers form:', verifyResult)
      throw createError({
        statusCode: 400,
        statusMessage: 'Security verification failed. Please try again.'
      })
    }
  } catch (err: any) {
    console.error('Turnstile verification request failed:', err)
    if (err.statusCode) throw err
    throw createError({
      statusCode: 500,
      statusMessage: 'Error performing security verification.'
    })
  }

  // Get Resend API Key from runtime config / env
  const resendApiKey = config.resendApiKey || process.env.RESEND_API_KEY
  const recipientEmail = config.contactRecipientEmail || process.env.CONTACT_RECIPIENT_EMAIL || 'macawooofficial@gmail.com'

  if (!resendApiKey) {
    console.error('RESEND_API_KEY environment variable is not configured.')
    throw createError({
      statusCode: 500,
      statusMessage: 'Email service configuration error. Please check environment variables.'
    })
  }

  // Format HTML Email Template for Career application
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
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email Address:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #0596B8; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone Number:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Resume File:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${resumeName || 'No file uploaded'}</td>
          </tr>
        </table>
      </div>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee;">
        This email was sent automatically from the Macawoo website.
      </div>
    </div>
  `

  try {
    const emailPayload: any = {
      from: 'Macawoo Careers <career@macawoo.co>',
      to: recipientEmail,
      subject: `Macawoo Job Application: ${name}`,
      html: htmlContent,
      reply_to: email
    }

    // Add resume attachment if provided
    if (resume && resumeName) {
      emailPayload.attachments = [
        {
          filename: resumeName,
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
      throw new Error(errorData.message || `Failed with status ${response.status}`)
    }

    const data = await response.json()
    return { success: true, id: data.id }
  } catch (error: unknown) {
    console.error('Careers application mail sending failed:', error)
    const err = error as Error
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Failed to dispatch application message.'
    })
  }
})
