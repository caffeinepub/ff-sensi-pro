import { Link } from "@tanstack/react-router";
import { Crosshair, Home, Shield, Target } from "lucide-react";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div className="relative">
            <Crosshair className="w-8 h-8 text-primary group-hover:rotate-45 transition-transform duration-300" />
            <div className="absolute inset-0 blur-md bg-primary/30 rounded-full" />
          </div>
          <span className="font-display font-800 text-xl tracking-tight">
            <span className="text-primary text-glow">FF</span>
            <span className="text-foreground"> Sensi</span>
            <span className="text-accent"> Pro</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            activeProps={{ className: "text-primary bg-primary/10" }}
            data-ocid="nav.link"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link
            to="/results"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            activeProps={{ className: "text-primary bg-primary/10" }}
            data-ocid="nav.link"
          >
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">My Results</span>
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            activeProps={{ className: "text-primary bg-primary/10" }}
            data-ocid="nav.link"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
