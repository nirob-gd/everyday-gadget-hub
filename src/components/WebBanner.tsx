import bannerAsset from "@/assets/web-banner.png.asset.json";

export function WebBanner() {
  return (
    <section className="w-full">
      <div className="container-page py-4 sm:py-6">
        <div className="overflow-hidden rounded-2xl border shadow-sm">
          <img
            src={bannerAsset.url}
            alt="Mitu curtains and home decor banner"
            className="block h-auto w-full object-cover"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
