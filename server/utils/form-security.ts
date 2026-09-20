import { createError } from 'h3'

// Shared hardening for the two public form endpoints (contact + careers).
// Both accept anonymous input and forward it into an email we read, so they
// need the same escaping, validation and bot check — keeping the logic here
// stops one handler from drifting behind the other.

/**
 * Escape user input before interpolating into the HTML email body. Prevents the
 * submitter from injecting markup/links (phishing) into the mail we receive.
 */
export const escapeHtml = (s: unknown): string =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Verify a Cloudflare Turnstile token.
 *
 * Fails closed: with no configured secret this throws rather than falling back
 * to Cloudflare's `1x0000...AA` test secret, which accepts every token. A
 * missing environment variable in production used to disable bot protection on
 * both public forms with no visible symptom.
 */
export async function verifyTurnstile(token: unknown, secret: string | undefined, formName: string) {
  if (!secret) {
    console.error(`TURNSTILE_SECRET_KEY is not configured; refusing the ${formName} submission.`)
    throw createError({
      statusCode: 500,
      statusMessage: 'Security verification is unavailable. Please try again later.'
    })
  }

  if (!token || typeof token !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Security verification is required (missing Turnstile token).'
    })
  }

  let verifyResult: { success?: boolean }
  try {
    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        secret,
        response: token
      })
    })
    verifyResult = await verifyResponse.json()
  } catch (err) {
    console.error('Turnstile verification request failed:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error performing security verification.'
    })
  }

  if (!verifyResult?.success) {
    console.error(`Turnstile verification failed for ${formName} form:`, verifyResult)
    throw createError({
      statusCode: 400,
      statusMessage: 'Security verification failed. Please try again.'
    })
  }
}
