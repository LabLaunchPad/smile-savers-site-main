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
    alt: 'Bright reception area at Smile Savers Dental',
  },
  {
    id: 2,
    category: 'facilities',
    image: '/images/gallery/l2.webp',
    alt: 'Modern treatment room at Smile Savers Dental',
  },
  {
    id: 3,
    category: 'facilities',
    image: '/images/gallery/l3.webp',
    alt: 'Dental chair and equipment close-up',
  },
  {
    id: 4,
    category: 'facilities',
    image: '/images/gallery/l4.webp',
    alt: 'Clean dental operatory at Smile Savers Dental',
  },
  {
    id: 5,
    category: 'facilities',
    image: '/images/gallery/l5.webp',
    alt: 'Dental office interior in Woodside Queens',
  },
  {
    id: 6,
    category: 'dentists',
    image: '/images/gallery/l6.webp',
    alt: 'Smile Savers dentist consulting with a patient',
  },
  {
    id: 7,
    category: 'dentists',
    image: '/images/gallery/l7.webp',
    alt: 'Dentist performing a gentle checkup',
  },
  {
    id: 8,
    category: 'dentists',
    image: '/images/gallery/l8.webp',
    alt: 'Smile Savers dental team at work',
  },
  {
    id: 9,
    category: 'services',
    image: '/images/gallery/l9.webp',
    alt: 'Dental treatment in progress',
  },
  {
    id: 10,
    category: 'services',
    image: '/images/gallery/l10.webp',
    alt: 'Teeth cleaning procedure at Smile Savers',
  },
  {
    id: 11,
    category: 'services',
    image: '/images/gallery/l11.webp',
    alt: 'Cosmetic dentistry treatment close-up',
  },
  {
    id: 12,
    category: 'services',
    image: '/images/gallery/l12.webp',
    alt: 'Restorative dental procedure in progress',
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
                <img src={item.image} className="hover-scale-1-2 w-100" alt={item.alt} />
              </div>
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
