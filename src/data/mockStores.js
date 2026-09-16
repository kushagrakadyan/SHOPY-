// Mock storefronts. Maps 1:1 to a future "Store" Mongoose model
// (ownerId, name, slug, categories, branding, contact, ratings...).
export const mockStores = [
  {
    id: "st-01",
    slug: "northline-audio",
    name: "Northline Audio",
    tagline: "Studio-grade sound for everyday listening",
    ownerId: "u-2001",
    logo: "https://api.dicebear.com/9.x/initials/svg?seed=Northline%20Audio&backgroundType=gradientLinear",
    banner:
      "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=1400&q=80&auto=format&fit=crop",
    categories: ["Audio", "Electronics", "Accessories"],
    rating: 4.7,
    reviewCount: 1284,
    followers: 9800,
    description:
      "Northline Audio designs headphones and speakers for people who actually listen closely. Founded by two acoustic engineers, every product ships with a 30-day sound-test guarantee.",
    contact: { email: "hello@northlineaudio.shopy.dev", phone: "+91 98200 11223" },
    location: "Pune, India",
    status: "active",
    createdAt: "2025-08-14",
  },
  {
    id: "st-02",
    slug: "verdant-home",
    name: "Verdant Home",
    tagline: "Plants, pots and quiet corners",
    ownerId: "u-2002",
    logo: "https://api.dicebear.com/9.x/initials/svg?seed=Verdant%20Home&backgroundType=gradientLinear",
    banner:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1400&q=80&auto=format&fit=crop",
    categories: ["Home", "Garden", "Decor"],
    rating: 4.9,
    reviewCount: 872,
    followers: 5400,
    description:
      "Verdant Home curates low-maintenance plants and hand-thrown ceramics for small apartments. Every order is packed plastic-free.",
    contact: { email: "hello@verdanthome.shopy.dev", phone: "+91 98200 44556" },
    location: "Bengaluru, India",
    status: "active",
    createdAt: "2025-09-02",
  },
  {
    id: "st-03",
    slug: "atlas-outfitters",
    name: "Atlas Outfitters",
    tagline: "Gear built for slow travel",
    ownerId: "u-2003",
    logo: "https://api.dicebear.com/9.x/initials/svg?seed=Atlas%20Outfitters&backgroundType=gradientLinear",
    banner:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1400&q=80&auto=format&fit=crop",
    categories: ["Outdoors", "Bags", "Apparel"],
    rating: 4.6,
    reviewCount: 611,
    followers: 3200,
    description:
      "Atlas Outfitters makes durable travel bags and layers for people who take the long way. Family-run since 2019.",
    contact: { email: "hello@atlasoutfitters.shopy.dev", phone: "+91 98200 77889" },
    location: "Jaipur, India",
    status: "active",
    createdAt: "2025-10-21",
  },
  {
    id: "st-04",
    slug: "loomcraft-studio",
    name: "Loomcraft Studio",
    tagline: "Handwoven textiles, made to order",
    ownerId: "u-2004",
    logo: "https://api.dicebear.com/9.x/initials/svg?seed=Loomcraft%20Studio&backgroundType=gradientLinear",
    banner:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&q=80&auto=format&fit=crop",
    categories: ["Textiles", "Home", "Apparel"],
    rating: 4.8,
    reviewCount: 349,
    followers: 2100,
    description:
      "Loomcraft Studio partners with weaving collectives to make throws, rugs and scarves on traditional looms.",
    contact: { email: "hello@loomcraft.shopy.dev", phone: "+91 98200 99001" },
    location: "Ahmedabad, India",
    status: "pending",
    createdAt: "2026-06-18",
  },
];
