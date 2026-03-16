import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type SensitivityResult, loadResult } from "@/utils/sensitivityCalc";
import { Link, useNavigate } from "@tanstack/react-router";
import { Cpu, Monitor, Unlock } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

function SensCard({
  label,
  value,
  emoji,
  delay,
}: {
  label: string;
  value: number;
  emoji: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="card-glass border-primary/20 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <CardContent className="pt-5 pb-4 relative">
          <div className="mb-1 text-2xl">{emoji}</div>
          <div className="font-display font-800 text-4xl text-primary text-glow stat-number mb-1">
            {value}
          </div>
          <div className="font-medium text-xs text-foreground/70 uppercase tracking-widest">
            {label}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SensitivityResult | null>(null);

  useEffect(() => {
    const result = loadResult();
    if (!result) {
      navigate({ to: "/" });
    } else {
      setSettings(result);
    }
  }, [navigate]);

  if (!settings) return null;

  const sensitivities = [
    { label: "General", value: settings.generalSensitivity, emoji: "🎯" },
    { label: "No Scope", value: settings.noScopeSensitivity, emoji: "🔫" },
    { label: "Red Dot", value: settings.redDotSensitivity, emoji: "🔴" },
    { label: "2x Scope", value: settings.scope2xSensitivity, emoji: "🔭" },
    { label: "4x Scope", value: settings.scope4xSensitivity, emoji: "🏹" },
    { label: "AWM Scope", value: settings.awmScopeSensitivity, emoji: "🎖️" },
  ];

  return (
    <div
      className="container mx-auto px-4 py-12 max-w-4xl"
      data-ocid="results.panel"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="font-display font-800 text-4xl sm:text-5xl mb-3">
          <span className="text-foreground">Your PC </span>
          <span className="text-primary text-glow">Sensitivity</span>
          <span className="text-foreground"> Settings</span>
        </h1>
        <Badge
          variant="outline"
          className="border-accent/60 text-accent gap-1.5"
        >
          <Unlock className="w-3.5 h-3.5" />
          Free Access
        </Badge>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 p-4 rounded-lg card-glass border border-border/50 flex flex-wrap gap-4 text-sm"
      >
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Cpu className="w-4 h-4 text-primary/70" />
          <span className="font-medium text-foreground">
            {settings.deviceDetails.deviceModel}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span>RAM: </span>
          <span className="font-medium text-foreground">
            {settings.deviceDetails.ramGb} GB
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Monitor className="w-4 h-4 text-primary/70" />
          <span className="font-medium text-foreground">
            {settings.deviceDetails.screenSizeInches}&quot; Monitor
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {sensitivities.map((s, i) => (
          <SensCard
            key={s.label}
            label={s.label}
            value={s.value}
            emoji={s.emoji}
            delay={0.1 + i * 0.05}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45 }}
        className="mb-6"
      >
        <Card className="card-glass border-accent/30 text-center overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
          <CardContent className="pt-5 pb-4 relative">
            <div className="mb-1 text-2xl">🔥</div>
            <div className="font-display font-800 text-5xl text-accent text-glow stat-number mb-1">
              {settings.fireButtonSize}
            </div>
            <div className="font-medium text-xs text-foreground/70 uppercase tracking-widest">
              Fire Button Size
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <Card className="card-glass border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="font-display font-700 text-lg flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <span className="text-accent">Game Booster Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/85 leading-relaxed">
              {settings.gameBoosterTips}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-8 text-center space-y-4">
        <div>
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
            data-ocid="results.link"
          >
            ← Recalculate with different PC
          </Link>
        </div>
        <p className="text-xs text-muted-foreground/50 tracking-widest uppercase">
          Created by{" "}
          <span className="text-muted-foreground/80 font-semibold">
            ZEESHAN ASSAD
          </span>
        </p>
      </div>
    </div>
  );
}
