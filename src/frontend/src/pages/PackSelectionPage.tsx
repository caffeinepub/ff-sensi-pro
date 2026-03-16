import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import { Check, Crown, LogIn, Shield, Star, Zap } from "lucide-react";
import { motion } from "motion/react";

const PACKS = [
  {
    id: 1,
    name: "Basic Pack",
    price: 50,
    headshot: "50%",
    color: "primary",
    icon: Zap,
    gradient: "from-primary/20 to-primary/5",
    borderGlow: "hover:shadow-glow",
    badge: null,
    features: [
      "All 6 Sensitivity Settings",
      "50% Headshot Rate",
      "Lag Reduce Tips",
      "Fire Button Size Optimization",
    ],
  },
  {
    id: 2,
    name: "Pro Pack",
    price: 250,
    headshot: "70%",
    color: "accent",
    icon: Star,
    gradient: "from-accent/20 to-accent/5",
    borderGlow: "hover:shadow-glow-accent",
    badge: "POPULAR",
    features: [
      "All Basic Pack Features",
      "70% Headshot Rate",
      "Lag Reduce Tips",
      "Device Optimization Guide",
      "Advanced Sensitivity Tuning",
    ],
  },
  {
    id: 3,
    name: "Elite Pack",
    price: 500,
    headshot: "100%",
    color: "gold",
    icon: Crown,
    gradient: "from-[oklch(0.82_0.17_85)]/20 to-[oklch(0.82_0.17_85)]/5",
    borderGlow: "hover:shadow-[0_0_30px_oklch(0.82_0.17_85/0.5)]",
    badge: "ELITE",
    features: [
      "All Pro Pack Features",
      "100% Headshot Rate",
      "Game Booster Tips",
      "DPI Optimization",
      "Priority Support",
      "Full PC Optimization",
    ],
  },
];

export default function PackSelectionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-4">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary tracking-wider uppercase">
            Premium Sensitivity System
          </span>
        </div>
        <h1 className="font-display font-800 text-4xl sm:text-5xl lg:text-6xl mb-4 leading-tight">
          <span className="text-foreground">Unlock Your</span>
          <br />
          <span className="text-primary text-glow">FF Sensi Pro</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Choose your sensitivity pack and dominate Free Fire on PC with
          professional-grade settings.
        </p>
        <div className="mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            data-ocid="packs.link"
          >
            <LogIn className="w-4 h-4" />
            Already have an account? Login
          </Link>
        </div>
      </motion.div>

      {/* Pack Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {PACKS.map((pack, i) => {
          const Icon = pack.icon;
          const isElite = pack.id === 3;
          return (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
              data-ocid={`packs.card.${i + 1}`}
            >
              {pack.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge
                    className={`px-3 py-1 text-xs font-bold tracking-widest ${
                      isElite
                        ? "bg-[oklch(0.82_0.17_85)] text-black"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {pack.badge}
                  </Badge>
                </div>
              )}
              <Card
                className={`relative overflow-hidden transition-all duration-300 cursor-pointer h-full ${
                  isElite
                    ? "border-[oklch(0.82_0.17_85/0.5)] bg-gradient-to-b from-[oklch(0.82_0.17_85/0.08)] to-card"
                    : pack.id === 2
                      ? "border-accent/40 bg-gradient-to-b from-accent/8 to-card"
                      : "border-primary/30 bg-gradient-to-b from-primary/8 to-card"
                } ${pack.borderGlow}`}
              >
                {isElite && (
                  <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.82_0.17_85/0.05)] to-transparent pointer-events-none" />
                )}
                <CardHeader className="pb-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                      isElite
                        ? "bg-[oklch(0.82_0.17_85/0.15)]"
                        : pack.id === 2
                          ? "bg-accent/15"
                          : "bg-primary/15"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isElite
                          ? "text-[oklch(0.82_0.17_85)]"
                          : pack.id === 2
                            ? "text-accent"
                            : "text-primary"
                      }`}
                    />
                  </div>
                  <CardTitle className="text-xl font-display">
                    {pack.name}
                  </CardTitle>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span
                      className={`text-3xl font-display font-800 ${
                        isElite
                          ? "text-[oklch(0.82_0.17_85)]"
                          : pack.id === 2
                            ? "text-accent"
                            : "text-primary"
                      }`}
                    >
                      ₹{pack.price}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      one-time
                    </span>
                  </div>
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        isElite
                          ? "border-[oklch(0.82_0.17_85/0.4)] text-[oklch(0.82_0.17_85)]"
                          : pack.id === 2
                            ? "border-accent/40 text-accent"
                            : "border-primary/40 text-primary"
                      }`}
                    >
                      🎯 {pack.headshot} Headshot Rate
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <ul className="space-y-2">
                    {pack.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            isElite
                              ? "text-[oklch(0.82_0.17_85)]"
                              : pack.id === 2
                                ? "text-accent"
                                : "text-primary"
                          }`}
                        />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() =>
                      navigate({ to: "/payment", search: { pack: pack.id } })
                    }
                    className={`w-full mt-2 font-semibold ${
                      isElite
                        ? "bg-[oklch(0.82_0.17_85)] text-black hover:bg-[oklch(0.75_0.17_85)]"
                        : pack.id === 2
                          ? "bg-accent text-accent-foreground hover:bg-accent/90"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                    data-ocid={`packs.primary_button.${i + 1}`}
                  >
                    Select {pack.name}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-xs text-muted-foreground mt-10"
      >
        After payment, admin will create your login credentials. Login to access
        your settings.
      </motion.p>
    </div>
  );
}
