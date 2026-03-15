import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsApproved, useSubmitPaymentRequest } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  Copy,
  IndianRupee,
  Loader2,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const UPI_ID = "9103007881";
const AMOUNT = 50;
const UPI_URL = `upi://pay?pa=${UPI_ID}@upi&pn=FF%20Sensi%20Pro&am=${AMOUNT}&cu=INR`;
const QR_API_URL = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(UPI_URL)}&bgcolor=0a0a0f&color=ff6b00&format=png`;

const PENDING_KEY = "ff_sensi_payment_pending";

export default function PaymentPage() {
  const navigate = useNavigate();
  const {
    data: isApproved,
    isLoading: approvalLoading,
    refetch,
  } = useIsApproved();
  const submitPayment = useSubmitPaymentRequest();
  const [hasPaid, setHasPaid] = useState(
    () => !!localStorage.getItem(PENDING_KEY),
  );
  const [qrLoaded, setQrLoaded] = useState(false);

  useEffect(() => {
    if (isApproved) {
      localStorage.removeItem(PENDING_KEY);
      navigate({ to: "/" });
    }
  }, [isApproved, navigate]);

  // Poll for approval if waiting
  useEffect(() => {
    if (!hasPaid) return;
    const interval = setInterval(() => {
      refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [hasPaid, refetch]);

  async function handlePaid() {
    try {
      await submitPayment.mutateAsync("upi-self-declared");
      localStorage.setItem(PENDING_KEY, "1");
      setHasPaid(true);
      toast.success("Payment request submitted! Waiting for admin approval.");
    } catch {
      // Already submitted or other error - still mark as pending
      localStorage.setItem(PENDING_KEY, "1");
      setHasPaid(true);
    }
  }

  function copyUpiId() {
    navigator.clipboard.writeText(UPI_ID);
    toast.success("UPI ID copied!");
  }

  if (approvalLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (hasPaid) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
          data-ocid="payment.success_state"
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <h2 className="font-display font-800 text-3xl mb-3 text-foreground">
            Waiting for Approval
          </h2>
          <p className="text-muted-foreground mb-6">
            Your payment request has been submitted. The admin will review and
            unlock your access shortly.
          </p>
          <Card className="card-glass border-primary/20 mb-6">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-foreground">
                    Payment request sent
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Admin will approve your access
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground">
            This page will automatically refresh when your access is approved.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            className="mt-4 text-muted-foreground hover:text-foreground"
            data-ocid="payment.secondary_button"
          >
            Check Status
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display font-800 text-3xl mb-2">
            <span className="text-primary text-glow">Unlock</span>{" "}
            <span className="text-foreground">Premium Access</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Pay Rs {AMOUNT} once to get your personalised Free Fire sensitivity
            settings
          </p>
        </div>

        {/* Price badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary/15 border border-primary/30">
            <IndianRupee className="w-5 h-5 text-primary" />
            <span className="font-display font-800 text-2xl text-primary">
              {AMOUNT}
            </span>
            <span className="text-muted-foreground text-sm ml-1">one-time</span>
          </div>
        </div>

        {/* QR Card */}
        <Card
          className="card-glass border-primary/20 shadow-glow mb-6"
          data-ocid="payment.card"
        >
          <CardHeader className="pb-2 text-center">
            <CardTitle className="font-display font-700 text-lg">
              Scan to Pay
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Use any UPI app: PhonePe, GPay, Paytm, BHIM
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {/* QR Code */}
            <div className="relative w-[220px] h-[220px] rounded-xl overflow-hidden border-2 border-primary/30 bg-background/50">
              {!qrLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
              <img
                src={QR_API_URL}
                alt="UPI QR Code"
                width={220}
                height={220}
                className={`w-full h-full object-contain transition-opacity duration-300 ${qrLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setQrLoaded(true)}
                data-ocid="payment.canvas_target"
              />
            </div>

            {/* UPI ID */}
            <div className="w-full">
              <p className="text-xs text-muted-foreground text-center mb-2">
                Or pay directly to UPI ID
              </p>
              <button
                type="button"
                onClick={copyUpiId}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-muted/40 border border-border hover:border-primary/40 hover:bg-muted/60 transition-all group"
                data-ocid="payment.secondary_button"
              >
                <span className="font-mono text-sm text-foreground font-medium">
                  {UPI_ID}@upi
                </span>
                <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* I have paid button */}
        <Button
          size="lg"
          onClick={handlePaid}
          disabled={submitPayment.isPending}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-700 text-base tracking-wide glow-primary transition-all duration-300"
          data-ocid="payment.primary_button"
        >
          {submitPayment.isPending ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 w-4 h-4" />I have Paid
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          After clicking, wait for admin to verify and unlock your access.
        </p>
      </motion.div>
    </div>
  );
}
