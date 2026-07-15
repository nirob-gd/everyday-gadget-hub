import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — GadgetHub" },
      { name: "description", content: "Get in touch with GadgetHub for product questions, delivery help, or warranty support." },
      { property: "og:title", content: "Contact GadgetHub" },
      { property: "og:description", content: "Reach the GadgetHub team for support." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact us</h1>
        <p className="mt-2 text-muted-foreground">We usually reply within a few hours.</p>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_320px]">
          <form
            className="grid gap-4"
            onSubmit={(e) => { e.preventDefault(); toast.success("Message sent — we'll reply soon."); (e.target as HTMLFormElement).reset(); }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label htmlFor="name">Name</Label><Input id="name" required className="mt-1.5" /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required className="mt-1.5" /></div>
            </div>
            <div><Label htmlFor="subject">Subject</Label><Input id="subject" required className="mt-1.5" /></div>
            <div><Label htmlFor="msg">Message</Label><Textarea id="msg" rows={6} required className="mt-1.5" /></div>
            <div><Button type="submit" size="lg">Send message</Button></div>
          </form>

          <aside className="space-y-4">
            {[
              { icon: Mail, title: "Email", value: "hello@gadgethub.bd" },
              { icon: Phone, title: "Phone", value: "+880 1700 000000" },
              { icon: MessageSquare, title: "Facebook", value: "fb.com/gadgethub" },
            ].map(({ icon: Icon, title, value }) => (
              <div key={title} className="rounded-2xl border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-brand"><Icon size={18} /></div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
                    <div className="font-semibold">{value}</div>
                  </div>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}
