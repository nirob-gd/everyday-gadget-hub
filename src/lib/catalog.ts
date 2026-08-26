export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sortOrder: number;
  count?: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  categoryId: string | null;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating?: number;
  reviewCount: number;
  description: string;
  imageUrl?: string;
  stock: number;
  gradient: string;
  isActive: boolean;
  isFeatured: boolean;
  /** Gallery images from product_images (cover image first when set). */
  images: ProductImage[];
};

export type ProductImage = { id: string; path: string; url: string };

export const formatBDT = (n: number) => `BDT ${Math.round(n).toLocaleString("en-BD")}`;

const gradients = [
  "product-gradient-1",
  "product-gradient-2",
  "product-gradient-3",
  "product-gradient-4",
  "product-gradient-5",
  "product-gradient-6",
];

export function gradientFor(key: string) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 997;
  return gradients[h % gradients.length];
}

/** Public URL for an image stored in the private product-images bucket. */
export const productImageSrc = (path?: string | null) =>
  path ? (path.startsWith("http") ? path : `/api/public/product-image/${path}`) : undefined;

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
};

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  description: string;
  price: number | string;
  sale_price: number | string | null;
  stock: number;
  image_url: string | null;
  rating: number | string | null;
  review_count: number;
  is_active: boolean;
  is_featured: boolean;
  categories?: { name: string; slug: string } | null;
  product_images?: { id: string; image_path: string; sort_order: number }[] | null;
};

export function mapCategory(row: CategoryRow): Category {
  return { id: row.id, name: row.name, slug: row.slug, icon: row.icon, sortOrder: row.sort_order };
}

export function mapProduct(row: ProductRow): Product {
  const base = Number(row.price);
  const sale = row.sale_price === null || row.sale_price === undefined ? null : Number(row.sale_price);
  const hasSale = sale !== null && sale > 0 && sale < base;
  const price = hasSale ? sale! : base;

  const gallery = [...(row.product_images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id))
    .map((i) => ({ id: i.id, path: i.image_path, url: productImageSrc(i.image_path)! }));

  const images: ProductImage[] =
    row.image_url && !gallery.some((g) => g.path === row.image_url)
      ? [{ id: "cover", path: row.image_url, url: productImageSrc(row.image_url)! }, ...gallery]
      : gallery;

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.categories?.name ?? "Uncategorized",
    categorySlug: row.categories?.slug ?? "",
    categoryId: row.category_id,
    price,
    originalPrice: hasSale ? base : undefined,
    discountPercent: hasSale ? Math.round(((base - sale!) / base) * 100) : undefined,
    rating: row.rating === null || row.rating === undefined ? undefined : Number(row.rating),
    reviewCount: row.review_count ?? 0,
    description: row.description ?? "",
    imageUrl: productImageSrc(row.image_url) ?? images[0]?.url,
    stock: row.stock ?? 0,
    gradient: gradientFor(row.id),
    isActive: row.is_active,
    isFeatured: row.is_featured,
    images,
  };
}

export const PRODUCT_SELECT =
  "id,name,slug,category_id,description,price,sale_price,stock,image_url,rating,review_count,is_active,is_featured,created_at,categories(name,slug),product_images(id,image_path,sort_order)";
