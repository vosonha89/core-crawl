export interface LazadaItem {
  '@type': string;
  '@context': string;
  name: string;
  image: string;
  category: string;
  brand: Brand;
  sku: string;
  mpn: number;
  description: string;
  review: Review[];
  aggregateRating: Rating;
  url: string;
  offers: Offers;
}

export interface Rating {
  '@type': string;
  bestRating: number;
  worstRating: number;
  ratingValue: number;
  ratingCount?: number;
}

export interface Brand {
  '@type': string;
  name: string;
  url: string;
}

export interface Offers {
  '@type': string;
  url: string;
  seller: Seller;
  priceCurrency: string;
  price: number;
  availability: string;
  itemCondition: string;
}

export interface Seller {
  '@type': string;
  name: string;
}

export interface Review {
  '@type': string;
  datePublished: string;
  reviewBody: string;
  reviewRating: Rating;
  author: Seller;
}
