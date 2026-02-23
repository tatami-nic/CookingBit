import { cn } from "@/lib/utils"

interface RatingDisplayProps {
  value: number
  max?: number
  label: string
  size?: "sm" | "md"
}

export function RatingDisplay({ value, max = 10, label, size = "md" }: RatingDisplayProps) {
  const percentage = (value / max) * 100
  const barColor =
    percentage >= 70 ? "bg-chart-3" : percentage >= 40 ? "bg-accent" : "bg-chart-5"

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className={cn("text-muted-foreground", size === "sm" ? "text-xs" : "text-sm")}>
          {label}
        </span>
        <span className={cn("font-medium text-foreground", size === "sm" ? "text-xs" : "text-sm")}>
          {value}/{max}
        </span>
      </div>
      <div className={cn("overflow-hidden rounded-full bg-muted", size === "sm" ? "h-1.5" : "h-2")}>
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
