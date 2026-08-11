import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminProductsQuery, categoriesQuery } from "@/lib/queries";
import { formatBDT, type Product } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: AdminProducts,
});

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function AdminProducts() {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery(adminProductsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const rows = useMemo(
    () =>
      products.filter(
        (p) =>
          (cat === "all" || p.categoryId === cat) &&
          (search === "" || p.name.toLowerCase().includes(search.toLowerCase())),
      ),
    [products, search, cat],
  );

  const refresh = () => qc.invalidateQueries({ queryKey: ["products"] });

  async function toggleActive(p: Product) {
    const { error } = await supabase.from("products").update({ is_active: !p.isActive }).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(p.isActive ? "Product hidden" : "Product published");
    refresh();
  }

  async function remove(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    refresh();
  }

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const file = fd.get("image") as File | null;
    setSaving(true);

    let imagePath: string | undefined;
    if (file && file.size > 0) {
      const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "-")}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(path, file);
      if (upErr) {
        setSaving(false);
        return toast.error(upErr.message);
      }
      imagePath = path;
    }

    const payload = {
      name,
      slug: slugify(name),
      category_id: String(fd.get("category_id") ?? "") || null,
      description: String(fd.get("description") ?? ""),
      price: Number(fd.get("price") ?? 0),
      sale_price: fd.get("sale_price") ? Number(fd.get("sale_price")) : null,
      stock: Number(fd.get("stock") ?? 0),
      is_active: fd.get("is_active") === "on",
      is_featured: fd.get("is_featured") === "on",
      ...(imagePath ? { image_url: imagePath } : {}),
    };

    const res = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);


    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Product updated" : "Product created");
    setEditing(null);
    setCreating(false);
    refresh();
  }

  const showForm = creating || editing !== null;
  const inputCls = "w-full rounded-lg border bg-background px-3 py-2 text-sm";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => { setEditing(null); setCreating(true); }}>New product</Button>
      </div>

      {showForm && (
        <form onSubmit={save} className="mt-6 grid gap-4 rounded-2xl border bg-card p-6 sm:grid-cols-2">
          <div className="sm:col-span-2 text-lg font-bold">{editing ? "Edit product" : "New product"}</div>
          <label className="text-sm">Name
            <Input name="name" required defaultValue={editing?.name ?? ""} />
          </label>
          <label className="text-sm">Category
            <select name="category_id" defaultValue={editing?.categoryId ?? ""} className={inputCls}>
              <option value="">Uncategorized</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="text-sm">Price (BDT)
            <Input name="price" type="number" min={0} step="1" required defaultValue={editing?.originalPrice ?? editing?.price ?? ""} />
          </label>
          <label className="text-sm">Sale price (optional)
            <Input name="sale_price" type="number" min={0} step="1" defaultValue={editing?.originalPrice ? editing.price : ""} />
          </label>
          <label className="text-sm">Stock
            <Input name="stock" type="number" min={0} defaultValue={editing?.stock ?? 0} />
          </label>
          <label className="text-sm">Image
            <input name="image" type="file" accept="image/*" className={inputCls} />
          </label>
          <label className="text-sm sm:col-span-2">Description
            <textarea name="description" rows={3} className={inputCls} defaultValue={editing?.description ?? ""} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" defaultChecked={editing ? editing.isActive : true} /> Visible in store
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_featured" defaultChecked={editing?.isFeatured ?? false} /> Featured
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" disabled={saving}>{editing ? "Save changes" : "Create product"}</Button>
            <Button type="button" variant="outline" onClick={() => { setCreating(false); setEditing(null); }}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" className="max-w-xs" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={inputCls + " max-w-xs"}>
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3 font-semibold">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3">{formatBDT(p.price)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">{p.isActive ? "Active" : "Hidden"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setCreating(false); setEditing(p); }}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => toggleActive(p)}>{p.isActive ? "Hide" : "Publish"}</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(p)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No products yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
