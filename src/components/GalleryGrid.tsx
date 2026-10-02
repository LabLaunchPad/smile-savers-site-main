import { useEffect, useState } from 'react';

interface GalleryItem {
  id: number;
  category: string;
  image: string;
  alt: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    category: 'facilities',
    image: '/images/gallery/l1.webp',
    alt: 'Bright dental treatment room with an exam chair',
  },
  {
    id: 2,
    category: 'facilities',
    image: '/images/gallery/l2.webp',
    alt: 'Monitor showing dental X-rays beside an exam light',
  },
  {
    id: 3,
    category: 'facilities',
    image: '/images/gallery/l3.webp',
    alt: 'Patients waiting in the reception area',
  },
  {
    id: 4,
    category: 'facilities',
    image: '/images/gallery/l4.webp',
    alt: 'Dentist in scrubs beside a dental X-ray monitor',
  },
  {
    id: 5,
    category: 'facilities',
    image: '/images/gallery/l5.webp',
    alt: 'Clinician treating a patient in the dental chair',
  },
  {
    id: 6,
    category: 'dentists',
    image: '/images/gallery/l6.webp',
    alt: 'Smiling clinician in safety glasses holding a dental tool',
  },
  {
    id: 7,
    category: 'dentists',
    image: '/images/gallery/l7.webp',
    alt: 'Two dental staff standing in a treatment room',
  },
  {
    id: 8,
    category: 'dentists',
    image: '/images/gallery/l8.webp',
    alt: 'Clinician and patient smiling for a phone selfie',
  },
  {
    id: 9,
    category: 'services',
    image: '/images/gallery/l9.webp',
    alt: 'Dentist showing a clear dental tray to a patient',
  },
  {
    id: 10,
    category: 'services',
    image: '/images/gallery/l10.webp',
    alt: 'Clinician talking with a patient in the dental chair',
  },
  {
    id: 11,
    category: 'services',
    image: '/images/gallery/l11.webp',
    alt: 'Two clinicians treating a young patient',
  },
  {
    id: 12,
    category: 'services',
    image: '/images/gallery/l12.webp',
    alt: 'Clinician examining a reclined patient with a mirror',
  },
];

const filters = [
  { value: '*', label: 'View All' },
  { value: 'dentists', label: 'Dentists' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'services', label: 'Services' },
];

export default function GalleryGrid() {
  const [filter, setFilter] = useState('*');

  // Template scripts direct-bind these links (return false kills React's
  // listener); filtering is React-owned, so release those bindings.
  useEffect(() => {
    window.jQuery?.('#filters a').off('click');
  }, []);

  // Magnific binds at init to the nodes React later remounts on filter change;
  // re-run binding after every render so the lightbox survives filtering.
  useEffect(() => {
    window.rebindGalleryPopup?.();
  });

  const filteredItems =
    filter === '*' ? galleryItems : galleryItems.filter((item) => item.category === filter);

  return (
    <>
      <div className="row">
        <div className="col-md-12 text-center">
          <ul id="filters" className="wow fadeInUp" data-wow-delay="0s">
            {filters.map((f) => (
              <li key={f.value}>
                <a
                  href="#"
                  role="button"
                  aria-pressed={filter === f.value}
                  onClick={(e) => {
                    e.preventDefault();
                    setFilter(f.value);
                  }}
                  className={filter === f.value ? 'selected' : ''}
                >
                  {f.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div id="gallery" className="row g-3 wow fadeIn" data-wow-delay=".3s">
        {filteredItems.map((item) => (
          <div key={item.id} className={`col-md-3 col-sm-6 item col-12 ${item.category}`}>
            <a
              href={item.image}
              className="image-popup d-block hover"
              aria-label={`View larger: ${item.alt}`}
            >
              <div className="rounded-1 relative overflow-hidden">
                <div className="hover-op-1 abs-middle absolute start-0 z-2 z-3 w-100 p-5 text-center text-white">
                  View
                </div>
                <div className="overlay-black-5 hover-op-1 absolute start-0 z-2 h-100 w-100"></div>
                <img
                  src={item.image}
                  className="hover-scale-1-2 w-100"
                  width={1380}
                  height={877}
                  loading="lazy"
                  decoding="async"
                  alt={item.alt}
                />
              </div>
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
