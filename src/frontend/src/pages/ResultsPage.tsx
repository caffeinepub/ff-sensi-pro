import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { loadResult } from "@/utils/sensitivityCalc";
import type { SensitivityResult } from "@/utils/sensitivityCalc";
import { useNavigate } from "@tanstack/react-router";
import {
  Crown,
  LogOut,
  Settings,
  Shield,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface FFUser {
  username: string;
  pack: number;
}

const PACK_NAMES: Record<number, string> = {
  1: "Basic Pack",
  2: "Pro Pack",
  3: "Elite Pack",
};

const PACK_ICONS: Record<
  number,
  React.ComponentType<{ className?: string }>
> = {
  1: Zap,
  2: Star,
  3: Crown,
};

const SENSITIVITY_ITEMS = [
  { key: "generalSensitivity", label: "General", icon: "🎯" },
  { key: "noScopeSensitivity", label: "No Scope", icon: "🔫" },
  { key: "redDotSensitivity", label: "Red Dot", icon: "🔴" },
  { key: "scope2xSensitivity", label: "2x Scope", icon: "🔭" },
  { key: "scope4xSensitivity", label: "4x Scope", icon: "🎯" },
  { key: "awmScopeSensitivity", label: "AWM Scope", icon: "⚡" },
] as const;

function calcDPI(ram: number): number {
  if (ram >= 16) return 800;
  if (ram >= 8) return 600;
  if (ram >= 4) return 400;
  return 400;
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<FFUser | null>(null);
  const [result, setResult] = useState<SensitivityResult | null>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem("ff_user");
    const res = loadResult();
    if (!rawUser || !res) {
      navigate({ to: "/" });
      return;
    }
    setUser(JSON.parse(rawUser) as FFUser);
    setResult(res);
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("ff_user");
    localStorage.removeItem("ff_sensi_result");
    navigate({ to: "/" });
  }

  if (!user || !result) return null;

  const pack = user.pack;
  const PackIcon = PACK_ICONS[pack] || Zap;
  const dpi = calcDPI(result.deviceDetails.ramGb);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display font-800 text-2xl text-primary">
                Your Sensitivity Settings
              </h1>
              <Badge
                className={`flex items-center gap-1 ${
                  pack === 3
                    ? "bg-[oklch(0.82_0.17_85)] text-black"
                    : pack === 2
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary text-primary-foreground"
                }`}
              >
                <PackIcon className="w-3 h-3" />
                {PACK_NAMES[pack] || "Basic Pack"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              PC: {result.deviceDetails.deviceModel} ·{" "}
              {result.deviceDetails.ramGb}GB RAM ·{" "}
              {result.deviceDetails.screenSizeInches}&quot; Monitor
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="shrink-0 flex items-center gap-2"
            data-ocid="results.button"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </motion.div>

        {/* Sensitivity Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="w-5 h-5 text-primary" />
                Sensitivity Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SENSITIVITY_ITEMS.map(({ key, label, icon }) => (
                  <div
                    key={key}
                    className="bg-secondary/50 rounded-lg p-3 text-center border border-border/60"
                    data-ocid="results.card"
                  >
                    <div className="text-lg mb-1">{icon}</div>
                    <div className="font-mono font-700 text-xl text-primary stat-number">
                      {result[key]}
                    </div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between bg-secondary/40 rounded-lg p-3">
                <span className="text-sm text-muted-foreground">
                  🔘 Fire Button Size
                </span>
                <span className="font-mono font-700 text-lg text-accent stat-number">
                  {result.fireButtonSize}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pack 1+: Headshot Rate & Lag Reduce */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-5 border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="w-5 h-5 text-primary" />
                Headshot & Performance
                <Badge
                  className={`ml-auto ${
                    pack >= 3
                      ? "bg-[oklch(0.82_0.17_85)] text-black"
                      : pack >= 2
                        ? "bg-accent text-accent-foreground"
                        : "bg-primary text-primary-foreground"
                  }`}
                >
                  🎯 {pack >= 3 ? "100%" : pack >= 2 ? "70%" : "50%"} Headshot
                  Rate
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm font-medium text-primary mb-1">
                  ⚡ Lag Reduce Tip
                </p>
                <p className="text-sm text-muted-foreground">
                  Close all background apps before launching Free Fire emulator.
                  Disable Windows game mode and set emulator to high priority in
                  Task Manager.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pack 2+: Device Optimization */}
        {pack >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="mb-5 border-accent/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="w-5 h-5 text-accent" />
                  Device Optimization
                  <Badge className="ml-auto bg-accent text-accent-foreground">
                    Pro
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                  <p className="text-sm font-medium text-accent mb-1">
                    🖥️ PC Optimization Tips
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Update GPU drivers to latest version</li>
                    <li>• Set power plan to "High Performance" in Windows</li>
                    <li>• Disable unnecessary startup programs</li>
                    <li>
                      • Set emulator CPU priority to "High" in Task Manager
                    </li>
                    <li>• Use wired internet connection for lower ping</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Pack 3: Game Booster + DPI */}
        {pack >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="mb-5 border-[oklch(0.82_0.17_85/0.4)] bg-gradient-to-b from-[oklch(0.82_0.17_85/0.06)] to-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Crown className="w-5 h-5 text-[oklch(0.82_0.17_85)]" />
                  Elite Features
                  <Badge className="ml-auto bg-[oklch(0.82_0.17_85)] text-black">
                    Elite
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-[oklch(0.82_0.17_85/0.08)] border border-[oklch(0.82_0.17_85/0.2)]">
                  <p className="text-sm font-medium text-[oklch(0.82_0.17_85)] mb-2">
                    🚀 Game Booster Tips
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.gameBoosterTips}
                  </p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-[oklch(0.82_0.17_85/0.08)] border border-[oklch(0.82_0.17_85/0.2)]">
                  <div>
                    <p className="text-sm font-medium text-[oklch(0.82_0.17_85)]">
                      🖱️ Recommended DPI
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Based on your RAM ({result.deviceDetails.ramGb}GB)
                    </p>
                  </div>
                  <span className="font-mono font-700 text-2xl text-[oklch(0.82_0.17_85)] stat-number">
                    {dpi}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Credit */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          Settings generated by{" "}
          <span className="text-primary font-semibold">ZEESHAN ASSAD</span>
        </motion.p>
      </div>
    </div>
  );
}
