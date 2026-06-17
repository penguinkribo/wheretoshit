"use client";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
};

export default function StarRating({
  value,
  onChange,
  size = "md",
}: StarRatingProps) {
  const interactive = !!onChange;

  return (
    <div className={`flex gap-0.5 ${sizeMap[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""} select-none`}
          onClick={() => onChange?.(star)}
          role={interactive ? "button" : undefined}
          aria-label={interactive ? `Rate ${star} stars` : undefined}
        >
          {star <= Math.round(value) ? "⭐" : "☆"}
        </span>
      ))}
    </div>
  );
}
