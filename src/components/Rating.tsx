import { Star } from "lucide-react";

export function Rating({ rating, reviewCount, size = 14 }: { rating: number; reviewCount?: number; size?: number }) {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < full ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}
          />
        ))}
      </div>
      <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && <span>({reviewCount})</span>}
    </div>
  );
}
