import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { categoriesQuery } from "@/lib/queries";
import type { Category } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: AdminCategories,
});

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function AdminCategories() {
  const qc = useQueryClient();
  const { data: categories = [] } = useQuery(categoriesQuery);
  const [editing, setEditing] = useState<Category | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["categories"] });

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const payload = {
      name,
      slug: slugify(name),
      icon: String(fd.get("icon") ?? "Home"),
      sort_order: Number(fd.get("sort_order") ?? 0),
    };
    const res = editing
      ? await supabase.from("categories").update(payload).eq("id", editing.id)
      : await supabase.from("categories").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success(editing ? "Category updated" : "Category added");
    setEditing(null);
    e.currentTarget.reset();
    refresh();
  }

  async function remove(c: Category) {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Category deleted");
    refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Categories</h1>

      <form onSubmit={save} className="mt-6 grid gap-4 rounded-2xl border bg-card p-6 sm:grid-cols-4">
        <label className="text-sm sm:col-span-2">Name
          <Input name="name" required defaultValue={editing?.name ?? ""} key={editing?.id ?? "new"} />
        </label>
        <label className="text-sm">Icon (lucide name)
          <Input name="icon" defaultValue={editing?.icon ?? "Home"} />
        </label>
        <label className="text-sm">Sort order
          <Input name="sort_order" type="number" defaultValue={editing?.sortOrder ?? categories.length} />
        </label>
        <div className="flex gap-2 sm:col-span-4">
          <Button type="submit">{editing ? "Save changes" : "Add category"}</Button>
          {editing && <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>}
        </div>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-3 font-semibold">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                <td className="px-4 py-3">{c.sortOrder}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditing(c)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(c)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No categories yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
