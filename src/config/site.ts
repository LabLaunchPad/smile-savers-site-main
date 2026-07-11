/**
 * Site Configuration
 * Central source of truth for all site-wide settings
 */

export const siteConfig = {
  // Basic Info
  name: 'Smile Savers Dental',
  tagline: 'Your trusted neighborhood dental practice',
  description:
    'Smile Savers Dental provides comprehensive dental care in Queens, NY. From routine cleanings to dental implants, we offer gentle, personalized care for the whole family.',
  url: 'https://smilesavers.dental',

  // Contact
  phone: '(718) 956-8400',
  email: 'dentalsmilesavers@gmail.com',

  // Location
  address: {
    street: '3202 53rd Place',
    city: 'Woodside',
    state: 'NY',
    zip: '11377',
    latitude: 40.7549,
    longitude: -73.9059,
  },

  // Business Hours
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], open: '10:00', close: '18:00', display: '10:00 AM – 6:00 PM' },
    { days: ['Friday'], open: '09:00', close: '17:00', display: '9:00 AM – 5:00 PM' },
    { days: ['Saturday'], open: '09:00', close: '13:00', display: '9:00 AM – 1:00 PM' },
    { days: ['Sunday'], open: 'Closed', close: 'Closed', display: 'Closed' },
  ],

  // Flat daily hours for components like OfficeHours table
  businessHours: [
    { day: 'Monday', open: '10:00 AM', close: '6:00 PM' },
    { day: 'Tuesday', open: '10:00 AM', close: '6:00 PM' },
    { day: 'Wednesday', open: '10:00 AM', close: '6:00 PM' },
    { day: 'Thursday', open: '10:00 AM', close: '6:00 PM' },
    { day: 'Friday', open: '9:00 AM', close: '5:00 PM' },
    { day: 'Saturday', open: '9:00 AM', close: '1:00 PM' },
    { day: 'Sunday', open: null, close: null },
  ],

  // Social Media
  social: {
    facebook: 'https://facebook.com/smilesavers32',
    instagram: '#', // Placeholder - update when available
    twitter: '',
    linkedin: '',
    yelp: 'https://yelp.com/biz/smile-savers-woodside-2',
  },

  // SEO Defaults
  defaultOgImage: '/images/og-image.jpg',
  twitterHandle: '@smilesavers',

  // Service Areas (for local SEO)
  serviceAreas: [
    'Woodside',
    'Sunnyside',
    'Jackson Heights',
    'Elmhurst',
    'Astoria',
    'Long Island City',
    'Flushing',
    'Corona',
  ],

  // Insurance (example list)
  acceptedInsurance: [
    'Delta Dental',
    'Cigna',
    'Aetna',
    'MetLife',
    'Guardian',
    'United Healthcare',
  ],
} as const;

export type SiteConfig = typeof siteConfig;
