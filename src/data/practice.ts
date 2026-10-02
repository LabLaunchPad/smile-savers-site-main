// Single-source brand canon. GBP wins on conflicts (4.5/153, Fri 9-5).
// Prose-embedded sentences stay inline in pages; only the formatters below are shared.
export const practice = {
  name: 'Smile Savers Dental',
  tagline: 'Affordable Family Dentistry in Woodside',
  phone: { display: '(718) 956-8400', href: 'tel:+17189568400' },
  email: { address: 'dentalsmilesavers@gmail.com', href: 'mailto:dentalsmilesavers@gmail.com' },
  address: {
    street: '32-02 53rd Pl',
    city: 'Woodside',
    state: 'NY',
    zip: '11377',
    borough: 'Queens',
  },
  hours: {
    full: 'Mon–Thu 10AM–6PM · Fri 9AM–5PM · Sat 9AM–1PM · Sun Closed',
    short: 'Mon–Thu 10–6 · Fri 9–5 · Sat 9–1',
    long: 'Monday - Thursday 10AM - 6PM, Friday 9AM - 5PM, Saturday 9AM - 1PM, Sunday Closed',
    rows: [
      { days: 'Mon–Thu', open: '10:00', close: '18:00' },
      { days: 'Fri', open: '09:00', close: '17:00' },
      { days: 'Sat', open: '09:00', close: '13:00' },
    ],
  },
  stats: {
    patients: '10,000+',
    patientsTo: 10000,
    years: '35+',
    yearsTo: 35,
    dentists: '4',
    dentistsTo: 4,
    services: '6',
    servicesTo: 6,
    rating: '4.5',
    reviews: '153',
  },
  socials: [
    // TODO_OWNER: replace '#' with real profile URLs; keep labels for aria-labels.
    { label: 'Facebook', href: '#', icon: 'fa-facebook-f' },
    { label: 'X', href: '#', icon: 'fa-x-twitter' },
    { label: 'Instagram', href: '#', icon: 'fa-instagram' },
    { label: 'YouTube', href: '#', icon: 'fa-youtube' },
    { label: 'WhatsApp', href: '#', icon: 'fa-whatsapp' },
  ],
  roster: [
    { name: 'Dr. Deepak Bhagat', suffix: 'DDS', role: 'Lead Dentist' },
    { name: 'Dr. Julie Islam', suffix: 'DMD', role: 'General Dentist' },
    { name: 'Dr. Dorothy Li', suffix: 'DDS', role: 'Restorative Dentist' },
    { name: 'Dr. Sarha Avendaño', suffix: 'DDS', role: 'General Dentist' },
  ],
} as const;

export const fullAddress = (): string =>
  `${practice.address.street}, ${practice.address.city}, ${practice.address.state} ${practice.address.zip}`;

export const mailtoWith = (subject: string, body: string): string =>
  `${practice.email.href}?subject=${subject}&body=${body}`;

// Contact-page prose + emergency "Call …" prefix uses phone.display alongside this.
export const hoursSentence = (): string => practice.hours.long;
