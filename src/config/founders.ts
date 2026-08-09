/**
 * How an applicant reaches the founders to ask about their application.
 *
 * These are read from the environment rather than hard-coded, because they are
 * real contact details and this file is committed. Anything left unset is
 * simply not rendered — the waitlist page never shows a placeholder address or
 * an invented phone number.
 *
 * Set them in `.env.local` for development and in Vercel → Settings →
 * Environment Variables for production. Both need the NEXT_PUBLIC_ prefix:
 * they are shown to visitors, so there is nothing secret about them.
 */
export const founderContact = {
  email: process.env.NEXT_PUBLIC_FOUNDER_EMAIL ?? "",
  phone: process.env.NEXT_PUBLIC_FOUNDER_PHONE ?? "",
};

export const hasFounderContact = Boolean(founderContact.email || founderContact.phone);
