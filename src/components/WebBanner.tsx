import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import slide1 from "@/assets/slide1.jpg.asset.json";
import slide2 from "@/assets/slide2.jpg.asset.json";
import slide3 from "@/assets/slide3.jpg.asset.json";

type Slide = {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  align: "left" | "center" | "right";
  tone: "light" | "dark";
};

const slides: Slide[] = [
  {
    image: slide1.url,
    eyebrow: "New Season",
    title: "Elegant Curtains for Every Home",
    subtitle: "Handpicked designs, tailored to fit your windows.",
    cta: "Shop Curtains",
    href: "/category/curtains",
    align: "left",
    tone: "dark",
  },
  {
    image: slide2.url,
    eyebrow: "Limited Time",
    title: "Cushions & Bedding Sale",
    subtitle: "Up to 40% off premium bedding this week only.",
    cta: "Shop Sale",
    href: "/shop",
    align: "right",
    tone: "light",
  },
  {
    image: slide3.url,
    eyebrow: "Complete Your Room",
    title: "Blinds, Rods & Rugs",
    subtitle: "Everything you need to finish your space — in one order.",
    cta: "Browse Decor",
    href: "/category/home-decor",
    align: "center",
    tone: "dark",
  },
];

const alignClass: Record<Slide["align"], string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

export function WebBanner() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
    const id = window.setInterval(() => api.scrollNext(), 6000);
    return () => window.clearInterval(id);
  }, [api]);

  return (
    <section className="w-full">
      <div className="container-page pt-4 sm:pt-6">
        <Carousel setApi={setApi} opts={{ loop: true }} className="relative">
          <CarouselContent>
            {slides.map((s, i) => (
              <CarouselItem key={i}>
                <div className="relative overflow-hidden rounded-2xl border shadow-sm">
                  <div className="relative aspect-[21/9] w-full sm:aspect-[21/8]">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${
                        s.align === "right"
                          ? "from-transparent via-black/10 to-black/40"
                          : s.align === "left"
                            ? "from-black/40 via-black/10 to-transparent"
                            : "from-black/30 via-black/10 to-black/30"
                      }`}
                    />
                    <div
                      className={`relative z-10 flex h-full w-full flex-col justify-center gap-3 px-6 sm:gap-4 sm:px-12 lg:px-16 ${alignClass[s.align]} ${
                        s.tone === "dark" ? "text-white" : "text-foreground"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand backdrop-blur">
                        {s.eyebrow}
                      </span>
                      <h2 className="max-w-xl text-2xl font-bold leading-tight drop-shadow-md sm:text-4xl lg:text-5xl">
                        {s.title}
                      </h2>
                      <p className="max-w-md text-sm opacity-95 drop-shadow sm:text-base">
                        {s.subtitle}
                      </p>
                      <div className="mt-2">
                        <Button size="lg" asChild>
                          <Link to={s.href}>{s.cta}</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-4 hidden sm:flex" />
          <CarouselNext className="right-4 hidden sm:flex" />

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => api?.scrollTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-6 bg-brand" : "w-2 bg-background/70"
                }`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
}
