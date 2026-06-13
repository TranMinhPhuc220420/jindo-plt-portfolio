export const DEFAULT_FOOTER_SETTINGS = {
  id: 'default',
  address: '',
  phone: '',
  email: '',
  businessHours: '',
  socialInstagramUrl: '',
  socialYoutubeUrl: '',
  socialFacebookUrl: '',
  socialInstagramEnabled: false,
  socialYoutubeEnabled: false,
  socialFacebookEnabled: false,
  socialEmailEnabled: false,
}

export function mapFooterFromDb(row) {
  if (!row) return null

  return {
    id: row.id,
    address: row.address,
    phone: row.phone,
    email: row.email,
    businessHours: row.business_hours,
    socialInstagramUrl: row.social_instagram_url ?? '',
    socialYoutubeUrl: row.social_youtube_url ?? '',
    socialFacebookUrl: row.social_facebook_url ?? '',
    socialInstagramEnabled: row.social_instagram_enabled ?? false,
    socialYoutubeEnabled: row.social_youtube_enabled ?? false,
    socialFacebookEnabled: row.social_facebook_enabled ?? false,
    socialEmailEnabled: row.social_email_enabled ?? false,
  }
}

export function mapFooterToDb(settings) {
  return {
    id: 'default',
    address: settings.address?.trim() ?? '',
    phone: settings.phone?.trim() ?? '',
    email: settings.email?.trim() ?? '',
    business_hours: settings.businessHours?.trim() ?? '',
    social_instagram_url: settings.socialInstagramUrl?.trim() || null,
    social_youtube_url: settings.socialYoutubeUrl?.trim() || null,
    social_facebook_url: settings.socialFacebookUrl?.trim() || null,
    social_instagram_enabled: Boolean(settings.socialInstagramEnabled),
    social_youtube_enabled: Boolean(settings.socialYoutubeEnabled),
    social_facebook_enabled: Boolean(settings.socialFacebookEnabled),
    social_email_enabled: Boolean(settings.socialEmailEnabled),
  }
}
