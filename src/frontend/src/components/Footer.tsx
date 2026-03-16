import { Crosshair } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border bg-background/60 py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:gap-3">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-primary" />
          <span className="font-display font-700 text-sm">
            <span className="text-primary">FF</span> Sensi Pro
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 sm:items-end">
          <p className="text-xs text-muted-foreground/60 tracking-wide">
            Created by{" "}
            <span className="text-muted-foreground font-medium">
              ZEESHAN ASSAD
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {year}. Built with ❤️ using{" "}
            <a
              href={utmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
