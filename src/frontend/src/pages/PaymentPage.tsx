import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitPaymentRequest } from "@/utils/localBackend";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Loader2,
  Smartphone,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const PACK_INFO: Record<
  number,
  { name: string; price: number; headshot: string; color: string }
> = {
  1: { name: "Basic Pack", price: 50, headshot: "50%", color: "text-primary" },
  2: { name: "Pro Pack", price: 250, headshot: "70%", color: "text-accent" },
  3: {
    name: "Elite Pack",
    price: 500,
    headshot: "100%",
    color: "text-[oklch(0.82_0.17_85)]",
  },
};

export default function PaymentPage() {
  const search = useSearch({ strict: false }) as { pack?: string | number };
  const navigate = useNavigate();
  const packId = Number(search.pack) as 1 | 2 | 3;
  const pack = PACK_INFO[packId] || PACK_INFO[1];

  const [name, setName] = useState("");
  const [txnId, setTxnId] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !txnId.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      submitPaymentRequest(name.trim(), packId || 1, txnId.trim());
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm"
          data-ocid="payment.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to packs
        </button>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
              data-ocid="payment.success_state"
            >
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="font-display font-700 text-2xl mb-3">
                Payment Submitted!
              </h2>
              <p className="text-muted-foreground mb-6">
                Admin will review your payment and create your login credentials
                shortly. Check back in a few minutes.
              </p>
              <Button
                onClick={() => navigate({ to: "/login" })}
                className="bg-primary text-primary-foreground"
                data-ocid="payment.primary_button"
              >
                Go to Login
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Pack Summary */}
              <Card className="mb-6 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">
                    Selected Pack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p
                        className={`font-display font-700 text-xl ${pack.color}`}
                      >
                        {pack.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        🎯 {pack.headshot} Headshot Rate
                      </p>
                    </div>
                    <div
                      className={`text-3xl font-display font-800 ${pack.color}`}
                    >
                      ₹{pack.price}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* UPI Payment Instructions */}
              <Card className="mb-6 border-primary/30 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Smartphone className="w-5 h-5 text-primary" />
                    Payment Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Pay via{" "}
                    <span className="text-foreground font-medium">
                      Google Pay
                    </span>{" "}
                    or{" "}
                    <span className="text-foreground font-medium">PhonePe</span>{" "}
                    to:
                  </p>
                  <div className="bg-background rounded-lg p-4 border border-border text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      UPI ID / Number
                    </p>
                    <p className="font-mono font-700 text-xl text-primary tracking-wider">
                      9103007881
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    After payment, enter your name and UPI transaction ID below.
                  </p>
                </CardContent>
              </Card>

              {/* Form */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Submit Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        data-ocid="payment.input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="txn">UPI Transaction ID</Label>
                      <Input
                        id="txn"
                        value={txnId}
                        onChange={(e) => setTxnId(e.target.value)}
                        placeholder="e.g. 123456789012"
                        required
                        data-ocid="payment.input"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-primary-foreground"
                      data-ocid="payment.submit_button"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                          Submitting...
                        </>
                      ) : (
                        "Submit Payment Request"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
