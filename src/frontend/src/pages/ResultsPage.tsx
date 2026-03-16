import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSensitivitySettings } from "@/hooks/useQueries";
import { Link, useNavigate } from "@tanstack/react-router";
import { Cpu, Monitor, Target, Unlock, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

function StatCard({
  label,
  value,
  unit,
  icon,
  delay,
}: {
  label: string;
  value: bigint;
  unit: string;
  icon: React.ReactNode;
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
        <CardContent className="pt-6 pb-4 relative">
          <div className="mb-2 text-primary/70 flex justify-center">{icon}</div>
          <div className="font-display font-800 text-5xl text-primary text-glow stat-number mb-1">
            {value.toString()}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
            {unit}
          </div>
          <div className="font-medium text-sm text-foreground/80">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ResultsPage() {
  const { data: settings, isLoading } = useGetSensitivitySettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !settings) {
      navigate({ to: "/" });
    }
  }, [isLoading, settings, navigate]);

  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 py-16 max-w-4xl"
        data-ocid="results.panel"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!settings) return null;

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
          <span className="text-foreground">Your </span>
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

      {settings.deviceDetails && (
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
              {settings.deviceDetails.ramGb.toString()} GB
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Monitor className="w-4 h-4 text-primary/70" />
            <span className="font-medium text-foreground">
              {settings.deviceDetails.screenSizeInches.toString()}&quot;
            </span>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Sensitivity"
          value={settings.sensitivity}
          unit="sens"
          icon={<Target className="w-5 h-5" />}
          delay={0.1}
        />
        <StatCard
          label="DPI"
          value={settings.dpi}
          unit="dpi"
          icon={<Zap className="w-5 h-5" />}
          delay={0.2}
        />
        <StatCard
          label="Fire Button Size"
          value={settings.fireButtonSize}
          unit="size"
          icon={<span className="text-lg">🔥</span>}
          delay={0.3}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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

      <div className="mt-8 text-center">
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          data-ocid="results.link"
        >
          ← Recalculate with different device
        </Link>
      </div>
    </div>
  );
}
