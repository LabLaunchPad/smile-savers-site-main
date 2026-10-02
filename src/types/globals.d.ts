// Global declarations for legacy template libraries loaded via <script> tags.
interface MagnificPopupOptions {
  delegate?: string;
  type?: string;
  closeOnContentClick?: boolean;
  closeBtnInside?: boolean;
  mainClass?: string;
  disableOn?: number;
  removalDelay?: number;
  preloader?: boolean;
  fixedContentPos?: boolean;
  image?: Record<string, unknown>;
  gallery?: Record<string, unknown>;
  zoom?: Record<string, unknown>;
}

interface OwlCarouselOptions {
  loop?: boolean;
  items?: number;
  nav?: boolean;
  dots?: boolean;
  center?: boolean;
  margin?: number;
  autoplay?: boolean;
  autoplayTimeout?: number;
  autoplayHoverPause?: boolean;
  autoplaySpeed?: number;
  smartSpeed?: number;
  slideTransition?: string;
  responsive?: Record<number, { items?: number }>;
}

interface JQuery {
  magnificPopup(options?: MagnificPopupOptions): JQuery;
  owlCarousel(options?: OwlCarouselOptions): JQuery;
}

interface Window {
  jQuery?: JQueryStatic;
  de_init?: () => void;
  rebindGalleryPopup?: () => void;
  WOW?: new () => { init(): void };
  Swiper?: new (
    el: Element,
    options?: Record<string, unknown>
  ) => {
    destroy(deleteInstance?: boolean, cleanStyles?: boolean): void;
  };
}
