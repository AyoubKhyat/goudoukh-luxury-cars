import { cn } from "@/lib/utils";
import AnimatedLine from "./AnimatedLine";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  dark?: boolean;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  dark = false,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn("mb-12", className)}>
      <h2
        className={cn(
          "font-bebas text-section tracking-tight",
          dark ? "text-white" : "text-[#0a0a0a]"
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "mt-3 max-w-2xl font-inter text-lg",
            dark ? "text-gray-400" : "text-gray-500"
          )}
        >
          {subtitle}
        </p>
      )}

      <AnimatedLine className="mt-4" delay={200} />
    </div>
  );
}
