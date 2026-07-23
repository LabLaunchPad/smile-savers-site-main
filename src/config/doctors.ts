/**
 * Doctors Configuration
 * Team member data for the practice
 */

import drImage from '@/assets/team/dr.jpg';

export interface Doctor {
  id: string;
  name: string;
  credentials: string;
  title: string;
  specialty: string;
  bio: string;
  image?: string;
}

/**
 * Practice doctors/dentists
 */
export const doctors: Doctor[] = [
  {
    id: 'dr-deepak-bhagat',
    name: 'Dr. Deepak Bhagat',
    credentials: 'DDS, ICOI Diplomate, Certified Implant Specialist',
    title: 'Lead Dentist ',
    specialty: 'Certified Implant Specialist & Implantology',
    bio: 'Graduated from New York University in 1987. Over two decades of experience in Woodside, NY. Diplomate of the International Congress of Oral Implantology.',
    image: '/images/doctors/dr-bhagat.jpg',
  },
  {
    id: 'dr-julie-islam',
    name: 'Dr. Julie Islam',
    credentials: 'DMD, Certified Implant Specialist',
    title: 'Associate Dentist',
    specialty: 'Certified Implant Specialist & General Dentistry',
    bio: 'Dedicated to providing compassionate, patient-centered dental care with a focus on preventive treatments and patient education.',
    image: drImage.src,
  },
  {
    id: 'dr-dorothy-li',
    name: 'Dr. Dorothy Li',
    credentials: 'DDS, Certified Implant Specialist',
    title: 'Associate Dentist',
    specialty: 'Certified Implant Specialist & Digital Dentistry',
    bio: 'NYU graduate with advanced training in implant surgery, digital dentistry, and Invisalign. Completed residency at Brooklyn Methodist Hospital.',
    image: drImage.src,
  },
  {
    id: 'dr-sarha-avendano',
    name: 'Dr. Sarha Avendaño',
    credentials: 'DDS, Certified Implant Specialist',
    title: 'Associate Dentist',
    specialty: 'Certified Implant Specialist & Preventive Care',
    bio: 'NYU College of Dentistry graduate with residency at NY Presbyterian - Queens. Passionate about tailored, patient-centered care and personalized treatment plans.',
    image: drImage.src,
  },
];
