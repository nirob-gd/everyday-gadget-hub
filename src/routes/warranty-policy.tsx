import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/warranty-policy")({
  head: () => ({
    meta: [
      { title: "Warranty Policy — GadgetHub" },
      { name: "description", content: "Read the GadgetHub warranty policy including coverage, claims process and exclusions." },
    ],
  }),
  component: Warranty,
});

function Warranty() {
  return (
    <div className="container-page py-12">
      <article className="prose mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Warranty policy</h1>
        <p className="mt-2 text-muted-foreground">Last updated: July 2026</p>

        <section className="mt-8 space-y-6 text-[15px] leading-7 text-foreground/90">
          <div>
            <h2 className="mb-2 text-xl font-bold">Coverage</h2>
            <p>Most products sold by GadgetHub include a 6 to 12 month manufacturer warranty against defects in materials and workmanship under normal use. Warranty length is listed on each product page.</p>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-bold">What is covered</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Manufacturing defects present on arrival</li>
              <li>Component failure under normal, intended use</li>
              <li>Dead-on-arrival (DOA) units reported within 7 days</li>
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-bold">What is not covered</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>Physical damage, drops, or liquid damage</li>
              <li>Wear-and-tear items (ear tips, cables past 90 days)</li>
              <li>Unauthorized repairs or modifications</li>
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-xl font-bold">How to claim</h2>
            <p>Email <a className="text-brand underline" href="mailto:support@gadgethub.bd">support@gadgethub.bd</a> with your order ID, a short description, and a photo or video of the issue. We'll respond with next steps within 24 hours.</p>
          </div>
        </section>
      </article>
    </div>
  );
}
