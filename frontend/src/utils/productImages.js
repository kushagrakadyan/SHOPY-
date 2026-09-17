// Reliable, professional fallback images for products whose API image is
// missing, broken, or returned in an unexpected shape.
// Images are loaded from Unsplash's image CDN with fixed photo IDs.

const CDN = 'https://images.unsplash.com';

// Keep this true while the storefront uses the new polished catalogue photos.
// Set to false later if you want to switch back to the images coming from the API.
export const PREFER_PROFESSIONAL_IMAGES = true;

const image = (id, params = 'auto=format&fit=crop&w=900&q=85') =>
  `${CDN}/${id}?${params}`;

const FALLBACKS = {
  accessories: image('photo-1553062407-98eeb64c6a62'),
  electronics: image('photo-1517336714731-489689fd1ca8'),
  laptop: image('photo-1593642632823-8f785ba67e45'),
  mobile: image('photo-1511707171634-5f897ff02aa9'),
  phone: image('photo-1511707171634-5f897ff02aa9'),
  smartphone: image('photo-1511707171634-5f897ff02aa9'),
  headphones: image('photo-1546435770-a3e426bf472b'),
  camera: image('photo-1526170375885-4d8ecf77b99f'),
  watch: image('photo-1523275335684-37898b6baf30'),
  shoes: image('photo-1542291026-7eec264c27ff'),
  footwear: image('photo-1542291026-7eec264c27ff'),
  clothing: image('photo-1521572163474-6864f9cf17ab'),
  fashion: image('photo-1529139574466-a303027c1d8b'),
  beauty: image('photo-1556228720-195a672e8a03'),
  skincare: image('photo-1556228578-8c89e6adf883'),
  cosmetics: image('photo-1596462502278-27bfdc403348'),
  garden: image('photo-1485955900006-10f4d324d411'),
  plants: image('photo-1501004318641-b39e6451bec6'),
  home: image('photo-1586023492125-27b2c045efd7'),
  furniture: image('photo-1503602642458-232111445657'),
  books: image('photo-1544947950-fa07a98d10e8'),
  food: image('photo-1542838132-92c53300491e'),
  grocery: image('photo-1542838132-92c53300491e'),
  sports: image('photo-1461896836934-ffe607ba8211'),
  toys: image('photo-1550745165-9bc0b252726f'),
  default: image('photo-1556742049-0cfed4f6a45d'),
};

const exactProductFallbacks = [
  ['cable roll travel case', FALLBACKS.accessories],
  ['fiddle leaf fig', FALLBACKS.garden],
];

const keywordFallbacks = [
  ['cable', FALLBACKS.accessories],
  ['charger', FALLBACKS.electronics],
  ['adapter', FALLBACKS.electronics],
  ['keyboard', FALLBACKS.electronics],
  ['mouse', FALLBACKS.electronics],
  ['monitor', FALLBACKS.electronics],
  ['laptop', FALLBACKS.laptop],
  ['macbook', FALLBACKS.laptop],
  ['phone', FALLBACKS.mobile],
  ['iphone', FALLBACKS.mobile],
  ['smartphone', FALLBACKS.mobile],
  ['headphone', FALLBACKS.headphones],
  ['earbud', FALLBACKS.headphones],
  ['camera', FALLBACKS.camera],
  ['watch', FALLBACKS.watch],
  ['shoe', FALLBACKS.shoes],
  ['sneaker', FALLBACKS.shoes],
  ['shirt', FALLBACKS.clothing],
  ['t-shirt', FALLBACKS.clothing],
  ['dress', FALLBACKS.fashion],
  ['jacket', FALLBACKS.fashion],
  ['beauty', FALLBACKS.beauty],
  ['cream', FALLBACKS.skincare],
  ['serum', FALLBACKS.skincare],
  ['makeup', FALLBACKS.cosmetics],
  ['plant', FALLBACKS.plants],
  ['fig', FALLBACKS.garden],
  ['garden', FALLBACKS.garden],
  ['chair', FALLBACKS.furniture],
  ['table', FALLBACKS.furniture],
  ['sofa', FALLBACKS.furniture],
  ['book', FALLBACKS.books],
  ['food', FALLBACKS.food],
  ['grocery', FALLBACKS.grocery],
  ['sport', FALLBACKS.sports],
  ['toy', FALLBACKS.toys],
];

export const getProductFallbackImage = (product = {}) => {
  const text = `${product.name || ''} ${product.category || ''}`.toLowerCase();

  const exact = exactProductFallbacks.find(([name]) => text.includes(name));
  if (exact) return exact[1];

  const matched = keywordFallbacks.find(([keyword]) => text.includes(keyword));
  if (matched) return matched[1];

  const category = String(product.category || '').toLowerCase().trim();
  return FALLBACKS[category] || FALLBACKS.default;
};

export const getProductImages = (product = {}) => {
  if (!Array.isArray(product.images)) return [];

  return product.images
    .map((item) => {
      if (typeof item === 'string') return item;
      return item?.url || item?.src || item?.secure_url || '';

    })
    .map(url => String(url).trim())
    .filter(url => url && !/default\.jpg(?:$|\?)/i.test(url));
};

export const getPrimaryProductImage = (product = {}) =>
  getProductImages(product)[0] || getProductFallbackImage(product);
