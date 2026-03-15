import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetSensitivitySettings,
  useSubmitPaymentRequest,
} from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Cpu,
  Loader2,
  Lock,
  Monitor,
  Target,
  Unlock,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

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

function LockedStatCard({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="card-glass border-border/40 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-transparent" />
        <CardContent className="pt-6 pb-4 relative">
          <div className="mb-2 text-muted-foreground/50 flex justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div className="font-display font-800 text-5xl text-muted-foreground/30 stat-number mb-1 blur-lock select-none">
            ???
          </div>
          <div className="text-xs text-muted-foreground/50 uppercase tracking-widest mb-1">
            locked
          </div>
          <div className="font-medium text-sm text-muted-foreground/50">
            {label}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ResultsPage() {
  const { data: settings, isLoading } = useGetSensitivitySettings();
  const submitPayment = useSubmitPaymentRequest();
  const [paymentRef, setPaymentRef] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  const isUnlocked = settings != null;

  async function handlePaymentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!paymentRef.trim()) {
      toast.error("Please enter your payment reference");
      return;
    }
    try {
      await submitPayment.mutateAsync(paymentRef.trim());
      setPaymentSubmitted(true);
      toast.success("Payment request submitted! Awaiting admin approval.");
    } catch {
      toast.error("Failed to submit payment request. Please try again.");
    }
  }

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

  return (
    <div
      className="container mx-auto px-4 py-12 max-w-4xl"
      data-ocid="results.panel"
    >
      {/* Page header */}
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
        {isUnlocked ? (
          <Badge
            variant="outline"
            className="border-accent/60 text-accent gap-1.5"
          >
            <Unlock className="w-3.5 h-3.5" />
            Premium Unlocked
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-destructive/60 text-destructive gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            Locked — Payment Required
          </Badge>
        )}
      </motion.div>

      {/* Device info bar */}
      {settings?.deviceDetails && (
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

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {isUnlocked && settings ? (
          <>
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
          </>
        ) : (
          <>
            <LockedStatCard label="Sensitivity" delay={0.1} />
            <LockedStatCard label="DPI" delay={0.2} />
            <LockedStatCard label="Fire Button" delay={0.3} />
          </>
        )}
      </div>

      {/* Game booster tips or locked message */}
      {isUnlocked && settings ? (
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
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Card className="card-glass border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/5" />
            <CardContent className="pt-10 pb-10 relative">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-primary animate-pulse_glow" />
                </div>
              </div>
              <h2 className="font-display font-700 text-2xl mb-2">
                Results Locked
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Your sensitivity settings are ready but locked. Complete payment
                and submit your reference to unlock premium access.
              </p>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-display font-700 tracking-wide glow-primary"
                    data-ocid="results.unlock_button"
                  >
                    <Unlock className="mr-2 w-4 h-4" />
                    Unlock My Settings
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="card-glass border-primary/30 max-w-md"
                  data-ocid="payment.dialog"
                >
                  <DialogHeader>
                    <DialogTitle className="font-display font-700 text-xl">
                      Submit Payment Reference
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      After completing payment, enter your transaction reference
                      below. Admin will verify and unlock your settings.
                    </DialogDescription>
                  </DialogHeader>

                  <AnimatePresence mode="wait">
                    {paymentSubmitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-6 text-center"
                        data-ocid="payment.success_state"
                      >
                        <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-3" />
                        <h3 className="font-display font-700 text-lg text-foreground mb-1">
                          Request Submitted!
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Your payment reference has been sent to the admin.
                          Your settings will be unlocked once approved.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onSubmit={handlePaymentSubmit}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="paymentRef">
                            Payment Reference / Transaction ID
                          </Label>
                          <Input
                            id="paymentRef"
                            placeholder="e.g. TXN-2024-XXXXXX"
                            value={paymentRef}
                            onChange={(e) => setPaymentRef(e.target.value)}
                            className="bg-input/60"
                            required
                            data-ocid="payment.input"
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            data-ocid="payment.cancel_button"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={submitPayment.isPending}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-display font-700"
                            data-ocid="payment.submit_button"
                          >
                            {submitPayment.isPending ? (
                              <>
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              "Submit Request"
                            )}
                          </Button>
                        </DialogFooter>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Back link */}
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
