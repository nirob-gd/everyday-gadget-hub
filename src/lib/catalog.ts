export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  discountPercent?: number;
  gradient: string;
  description: string;
  featured?: boolean;
  topRated?: boolean;
};

export type Category = {
  name: string;
  slug: string;
  icon: string;
  count: number;
};

export const categories: Category[] = [
  { name: "Curtains", slug: "curtains", icon: "Blinds", count: 42 },
  { name: "Curtain Rods", slug: "curtain-rods", icon: "Ruler", count: 18 },
  { name: "Cushions & Pillows", slug: "cushions", icon: "Sofa", count: 26 },
  { name: "Bed Sheets", slug: "bed-sheets", icon: "BedDouble", count: 22 },
  { name: "Rugs & Carpets", slug: "rugs", icon: "Layers", count: 15 },
  { name: "Wallpapers", slug: "wallpapers", icon: "Palette", count: 20 },
  { name: "Blinds & Shades", slug: "blinds", icon: "LampCeiling", count: 12 },
  { name: "Home Decor", slug: "home-decor", icon: "Home", count: 30 },
];

export const brands = [
  "KZ",
  "TRN",
  "Moondrop",
  "Truthear",
  "FiiO",
  "Shanling",
  "Hidizs",
  "Tanchjim",
  "7Hz",
  "CCA",
  "TinHiFi",
  "Simgot",
  "Dunu",
  "Kiwi Ears",
];

const g = ["product-gradient-1", "product-gradient-2", "product-gradient-3", "product-gradient-4", "product-gradient-5", "product-gradient-6"];

export const products: Product[] = [
  {
    id: "1",
    name: "KZ ZSN Pro X Hybrid IEM",
    slug: "kz-zsn-pro-x",
    category: "Earphones",
    categorySlug: "earphones",
    brand: "KZ",
    price: 2700,
    originalPrice: 3500,
    rating: 4.6,
    reviewCount: 218,
    discountPercent: 23,
    gradient: g[0],
    description: "Hybrid dual driver in-ear monitors with detachable cable and balanced tuning for everyday listening.",
    featured: true,
    topRated: true,
  },
  {
    id: "2",
    name: "Moondrop Chu II Dynamic IEM",
    slug: "moondrop-chu-ii",
    category: "Earphones",
    categorySlug: "earphones",
    brand: "Moondrop",
    price: 2400,
    originalPrice: 2800,
    rating: 4.7,
    reviewCount: 402,
    discountPercent: 14,
    gradient: g[2],
    description: "Refined single-DD earphones with textured cable and Harman-tuned signature.",
    topRated: true,
  },
  {
    id: "3",
    name: "Truthear Hola",
    slug: "truthear-hola",
    category: "Earphones",
    categorySlug: "earphones",
    brand: "Truthear",
    price: 2200,
    rating: 4.5,
    reviewCount: 156,
    gradient: g[3],
    description: "Budget-friendly IEM tuned for a smooth, natural sound.",
  },
  {
    id: "4",
    name: "FiiO FW3 Wireless Earbuds",
    slug: "fiio-fw3",
    category: "Wireless Earbuds",
    categorySlug: "wireless-earbuds",
    brand: "FiiO",
    price: 12500,
    originalPrice: 14500,
    rating: 4.4,
    reviewCount: 62,
    discountPercent: 14,
    gradient: g[4],
    description: "TWS earbuds with LDAC support and dedicated DAC for high-res wireless audio.",
    featured: true,
  },
  {
    id: "5",
    name: "Shanling MTW300 TWS",
    slug: "shanling-mtw300",
    category: "Wireless Earbuds",
    categorySlug: "wireless-earbuds",
    brand: "Shanling",
    price: 7900,
    rating: 4.3,
    reviewCount: 41,
    gradient: g[5],
    description: "Compact TWS with active noise cancellation and app control.",
  },
  {
    id: "6",
    name: "Hidizs S9 Pro Portable DAC",
    slug: "hidizs-s9-pro",
    category: "DAC & Converters",
    categorySlug: "dac-converters",
    brand: "Hidizs",
    price: 9800,
    originalPrice: 11000,
    rating: 4.8,
    reviewCount: 187,
    discountPercent: 11,
    gradient: g[0],
    description: "Balanced + single-ended portable DAC/amp with MQA support and glass finish.",
    featured: true,
    topRated: true,
  },
  {
    id: "7",
    name: "FiiO KA11 USB-C DAC Dongle",
    slug: "fiio-ka11",
    category: "DAC & Converters",
    categorySlug: "dac-converters",
    brand: "FiiO",
    price: 3200,
    rating: 4.6,
    reviewCount: 98,
    gradient: g[1],
    description: "Ultra-compact dongle DAC with clean output and drop-in USB-C compatibility.",
  },
  {
    id: "8",
    name: "Phone Cooler Pro X Peltier",
    slug: "phone-cooler-pro-x",
    category: "Gaming Coolers",
    categorySlug: "gaming-coolers",
    brand: "KZ",
    price: 1900,
    originalPrice: 2500,
    rating: 4.2,
    reviewCount: 74,
    discountPercent: 24,
    gradient: g[2],
    description: "Semiconductor smartphone cooler with RGB and magnetic mount for extended gaming sessions.",
  },
  {
    id: "9",
    name: "Braided USB-C Fast Charge Cable 2m",
    slug: "usb-c-cable-2m",
    category: "Cables",
    categorySlug: "cables",
    brand: "TRN",
    price: 550,
    originalPrice: 750,
    rating: 4.5,
    reviewCount: 312,
    discountPercent: 27,
    gradient: g[3],
    description: "Durable braided cable supporting 100W PD fast charging and 480Mbps data.",
    topRated: true,
  },
  {
    id: "10",
    name: "0.78mm 2-Pin Silver-Plated Upgrade Cable",
    slug: "silver-2pin-cable",
    category: "Cables",
    categorySlug: "cables",
    brand: "TRN",
    price: 1400,
    rating: 4.4,
    reviewCount: 55,
    gradient: g[4],
    description: "Silver-plated OFC upgrade cable for IEMs with 2-pin connectors.",
  },
  {
    id: "11",
    name: "Carbon Fiber Gaming Finger Sleeves (2 pcs)",
    slug: "carbon-finger-sleeves",
    category: "Finger Sleeves",
    categorySlug: "finger-sleeves",
    brand: "CCA",
    price: 250,
    originalPrice: 400,
    rating: 4.3,
    reviewCount: 189,
    discountPercent: 38,
    gradient: g[5],
    description: "Breathable, ultra-thin gaming finger sleeves for precise touchscreen control.",
  },
  {
    id: "12",
    name: "1:24 RC Drift Car with LED",
    slug: "rc-drift-car-124",
    category: "RC & Drift Cars",
    categorySlug: "rc-drift-cars",
    brand: "Simgot",
    price: 3200,
    originalPrice: 4000,
    rating: 4.1,
    reviewCount: 33,
    discountPercent: 20,
    gradient: g[0],
    description: "2.4GHz RC drift car with dedicated drift tires and RGB underglow.",
  },
  {
    id: "13",
    name: "Shanling M0 Pro DAP",
    slug: "shanling-m0-pro",
    category: "Digital Audio Players",
    categorySlug: "digital-audio-players",
    brand: "Shanling",
    price: 15500,
    rating: 4.7,
    reviewCount: 88,
    gradient: g[1],
    description: "Pocket-sized dual-DAC digital audio player with balanced output.",
    featured: true,
    topRated: true,
  },
  {
    id: "14",
    name: "7Hz Salnotes Zero:2",
    slug: "7hz-zero-2",
    category: "Earphones",
    categorySlug: "earphones",
    brand: "7Hz",
    price: 2100,
    originalPrice: 2500,
    rating: 4.6,
    reviewCount: 271,
    discountPercent: 16,
    gradient: g[2],
    description: "Successor to the Salnotes Zero with improved bass and a refined enclosure.",
  },
  {
    id: "15",
    name: "Tanchjim One DSP",
    slug: "tanchjim-one-dsp",
    category: "Earphones",
    categorySlug: "earphones",
    brand: "Tanchjim",
    price: 1900,
    rating: 4.4,
    reviewCount: 121,
    gradient: g[3],
    description: "Entry-level DSP IEM with switchable EQ profiles via USB-C.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getByCategory = (slug: string) => products.filter((p) => p.categorySlug === slug);

export const formatBDT = (n: number) => `BDT ${n.toLocaleString("en-BD")}`;

export const mockOrders = [
  { id: "ORD-10231", date: "2026-07-08", status: "Delivered", total: 4900, items: 2 },
  { id: "ORD-10188", date: "2026-06-27", status: "Shipped", total: 12500, items: 1 },
  { id: "ORD-10142", date: "2026-06-11", status: "Processing", total: 2700, items: 1 },
];
