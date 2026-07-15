import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/account/profile")({
  head: () => ({ meta: [{ title: "Profile — GadgetHub" }, { name: "description", content: "Manage your GadgetHub profile." }] }),
  component: Profile,
});

function Profile() {
  const [form, setForm] = useState({ name: "Ayaan Rahman", email: "ayaan@example.com", phone: "+880 1700 000000", address: "House 21, Road 8, Dhanmondi, Dhaka" });
  return (
    <div>
      <h2 className="text-xl font-bold">Profile</h2>
      <p className="mt-1 text-sm text-muted-foreground">Update your contact and delivery details.</p>

      <form
        className="mt-6 grid max-w-xl gap-4"
        onSubmit={(e) => { e.preventDefault(); toast.success("Profile saved"); }}
      >
        {(["name", "email", "phone", "address"] as const).map((k) => (
          <div key={k}>
            <Label htmlFor={k} className="capitalize">{k}</Label>
            <Input id={k} className="mt-1.5" value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
          </div>
        ))}
        <div><Button type="submit">Save changes</Button></div>
      </form>
    </div>
  );
}
