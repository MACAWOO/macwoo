import { defineEventHandler, readBody, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  const { name, email, phone, service, message } = body

  // Validate required fields
  if (!name || !email || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please fill in all required fields (Name, Email, and Message).'
    })
  }

  // Insert submission into Supabase contact_submissions table
  const supabaseUrl = process.env.SUPABASE_URL || 'https://vewmzejakdfsgsyxdlpa.supabase.co'
  const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_SjN1foafYhhbb3k-DI82Aw_xsjStWt_'
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        phone: phone || null,
        service: service || 'General Inquiry',
        message,
        status: 'new'
      })
    if (dbError) {
      console.error('Failed to insert contact submission to Supabase:', dbError)
    }
  } catch (dbErr) {
    console.error('Error inserting contact submission to Supabase:', dbErr)
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

  // Format HTML Email Template
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background-color: #1D96B8; padding: 20px; text-align: center;">
        <h2 style="color: #fff; margin: 0; font-size: 24px;">New Get Started Request</h2>
      </div>
      <div style="padding: 24px; background-color: #fff;">
        <p style="font-size: 16px; margin-top: 0;">You have received a new message from the <strong>Macawoo Contact Form</strong>:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #1D96B8; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Requested Service:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><span style="background-color: #EDE000; color: #000; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">${service || 'General Inquiry'}</span></td>
          </tr>
        </table>
        
        <div style="margin-top: 25px;">
          <h3 style="font-size: 16px; border-bottom: 2px solid #1D96B8; padding-bottom: 6px; color: #1D96B8;">Message:</h3>
          <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #1D96B8; border-radius: 4px; font-style: italic; white-space: pre-wrap; margin-top: 10px;">${message}</p>
        </div>
      </div>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee;">
        This email was sent automatically from the Macawoo website.
      </div>
    </div>
  `

  try {
    // Send email using Resend REST API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Macawoo Form <onboarding@resend.dev>',
        to: recipientEmail,
        subject: `Macawoo Lead: ${name} (${service || 'General Inquiry'})`,
        html: htmlContent,
        reply_to: email
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Resend API response error:', errorData)
      throw new Error(errorData.message || `Failed with status ${response.status}`)
    }

    const data = await response.json()
    return { success: true, id: data.id }
  } catch (error: unknown) {
    console.error('Mail sending failed:', error)
    const err = error as Error
    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Failed to dispatch contact message.'
    })
  }
})
