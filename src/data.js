export const products = [
  { id: 1, name: 'Valknut Ring', price: 68, description: 'A blackened iron-silver ring bearing the valknut, knot of the slain.', category: 'Rings', emoji: '🐺' },
  { id: 2, name: 'Raven Oath Pendant', price: 92, description: "A weighty pendant set with Baltic amber, cast in the shape of Odin's ravens.", category: 'Necklaces', emoji: '🪶' },
  { id: 3, name: 'Wolf Fang Earrings', price: 74, description: 'Long drop earrings with blackened fang silhouettes and dark stone accents.', category: 'Earrings', emoji: '⚔️' },
  { id: 4, name: 'Custom Rune Casting', price: 120, description: 'A bespoke piece bound to your own bind-rune and chosen symbolism.', category: 'Custom', emoji: '🔥' },
];

export const socials = [
  { label: 'Instagram', url: 'https://www.instagram.com/magisa.art/' },
  { label: 'Facebook', url: 'https://www.facebook.com/p/Magisaart-61573588030128/' },
  { label: 'Etsy', url: 'https://www.etsy.com/shop/MagisaArt?ref=l2-about-shopname&from_page=listing' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@magisa.art' },
];

export const jewelryPages = [
  {
    slug: 'viking-rings',
    title: 'Viking Rings for Dark Romance',
    description: 'Discover handmade Viking and Norse rings with rune-carved bands, blackened metals, and dramatic silhouettes for everyday warrior elegance.',
    hero: 'Hand-forged Norse rings designed for oath-bound romance and rune-marked self-expression.',
    keywords: ['viking rings', 'norse jewelry', 'handmade rune ring'],
    products: [
      { name: 'Valknut Ring', price: 68, description: 'A blackened iron-silver ring bearing the valknut, knot of the slain.' },
      { name: 'Longship Band', price: 72, description: 'A sculptural ring with deep hammered texture and antique iron finish.' },
    ],
  },
  {
    slug: 'norse-necklaces',
    title: 'Norse Necklaces and Amber Pendants',
    description: 'Explore one-of-a-kind Norse necklaces featuring rune motifs, Baltic amber, and handcrafted Viking detailing.',
    hero: "Norse pendants and necklaces made to feel like heirlooms pulled from a longship's hold.",
    keywords: ['norse necklaces', 'baltic amber pendants', 'viking jewelry'],
    products: [
      { name: 'Raven Oath Pendant', price: 92, description: "A weighty pendant set with Baltic amber, cast in the shape of Odin's ravens." },
      { name: 'Iron Wolf Locket', price: 104, description: 'A rugged locket with a wolf motif and blackened antique charm.' },
    ],
  },
  {
    slug: 'runic-earrings',
    title: 'Runic Earrings for Dramatic Style',
    description: 'Browse rune-etched earrings with dark stone accents, long silhouettes, and bold northern glamour for your signature look.',
    hero: 'Elegant runic earrings designed to frame your face with iron, shadow, and old-god attitude.',
    keywords: ['runic earrings', 'viking earrings', 'dark stone earrings'],
    products: [
      { name: 'Wolf Fang Earrings', price: 74, description: 'Long drop earrings with blackened fang silhouettes and dark stone accents.' },
      { name: 'Storm Drop Earrings', price: 86, description: 'A dramatic drop earring with blackened metal and a flash of steel-blue shine.' },
    ],
  },
  {
    slug: 'custom-norse-jewelry',
    title: 'Custom Norse Jewelry Commissions',
    description: 'Commission bespoke Viking and Norse jewelry with personal bind-runes, stones, and design details crafted by Magisa.',
    hero: 'Custom jewelry commissions for those who want a piece as singular as their own saga.',
    keywords: ['custom viking jewelry', 'bespoke norse jewelry', 'commission bind-rune'],
    products: [
      { name: 'Custom Rune Casting', price: 120, description: 'A bespoke piece bound to your own bind-rune and chosen symbolism.' },
      { name: 'Signature Commission', price: 140, description: 'A fully custom creation shaped around your saga and aesthetic.' },
    ],
  },
];

export const getJewelryPage = (slug) => jewelryPages.find((entry) => entry.slug === slug);
