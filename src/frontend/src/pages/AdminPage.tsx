import { ApprovalStatus, PaymentRequestStatus } from "@/backend.d";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useApprovePaymentRequest,
  useGetAllPaymentRequests,
  useIsAdmin,
  useListApprovals,
  useRevokeAccess,
} from "@/hooks/useQueries";
import type { Principal } from "@icp-sdk/core/principal";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogIn,
  Shield,
  ShieldOff,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const ADMIN_USERNAME = "zeeshan18";
const ADMIN_PASSWORD = "788";

export default function AdminPage() {
  const [credsPassed, setCredsPassed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [credsError, setCredsError] = useState("");

  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { isFetching: actorFetching } = useActor();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: paymentRequests, isLoading: requestsLoading } =
    useGetAllPaymentRequests();
  const { data: approvals, isLoading: approvalsLoading } = useListApprovals();
  const approveRequest = useApprovePaymentRequest();
  const revokeAccess = useRevokeAccess();

  function handleCredsSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setCredsError("");
      setCredsPassed(true);
    } else {
      setCredsError("Incorrect username or password.");
    }
  }

  async function handleApprove(requestId: bigint, index: number) {
    try {
      await approveRequest.mutateAsync(requestId);
      toast.success(`Payment request #${index + 1} approved!`);
    } catch {
      toast.error("Failed to approve request. Please try again.");
    }
  }

  async function handleRevoke(user: Principal) {
    try {
      await revokeAccess.mutateAsync(user);
      toast.success("Access revoked successfully.");
    } catch {
      toast.error("Failed to revoke access. Please try again.");
    }
  }

  function formatDate(timestamp: bigint) {
    const ms = Number(timestamp / BigInt(1_000_000));
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function truncatePrincipal(p: Principal) {
    const str = p.toString();
    if (str.length <= 16) return str;
    return `${str.slice(0, 8)}\u2026${str.slice(-6)}`;
  }

  // Step 1: Username/password gate
  if (!credsPassed) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <KeyRound className="w-9 h-9 text-primary" />
          </div>
          <h1 className="font-display font-800 text-3xl mb-1 text-center text-foreground">
            Admin <span className="text-primary text-glow">Login</span>
          </h1>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            Enter your admin credentials to continue
          </p>
          <form onSubmit={handleCredsSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-username"
                className="text-foreground/80 text-sm"
              >
                Username
              </Label>
              <Input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                className="bg-muted/30 border-border/50"
                data-ocid="admin.username.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-password"
                className="text-foreground/80 text-sm"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="bg-muted/30 border-border/50 pr-10"
                  data-ocid="admin.password.input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  data-ocid="admin.toggle_password.button"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {credsError && (
              <p
                className="text-destructive text-sm"
                data-ocid="admin.creds.error_state"
              >
                {credsError}
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-700 text-base"
              data-ocid="admin.creds.submit_button"
            >
              Continue
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  const isChecking = isInitializing || actorFetching || adminLoading;

  if (isChecking) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-5xl space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Step 2: Internet Identity login
  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-9 h-9 text-primary" />
          </div>
          <h1 className="font-display font-800 text-3xl mb-3 text-foreground">
            Verify Identity
          </h1>
          <p className="text-muted-foreground mb-8">
            One more step -- verify with Internet Identity to access the admin
            panel.
          </p>
          <Button
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-700 text-base glow-primary"
            data-ocid="admin.login_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <LogIn className="mr-2 w-4 h-4" />
                Login with Internet Identity
              </>
            )}
          </Button>
        </motion.div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-9 h-9 text-destructive" />
        </div>
        <h1 className="font-display font-800 text-3xl mb-3 text-foreground">
          Access Denied
        </h1>
        <p className="text-muted-foreground">
          This account does not have administrator privileges.
        </p>
      </div>
    );
  }

  const pendingRequests =
    paymentRequests?.filter((r) => r.status === PaymentRequestStatus.pending) ??
    [];
  const approvedRequests =
    paymentRequests?.filter(
      (r) => r.status === PaymentRequestStatus.approved,
    ) ?? [];

  return (
    <div
      className="container mx-auto px-4 py-12 max-w-5xl"
      data-ocid="admin.panel"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/15 border border-primary/30">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-display font-800 text-4xl">
            <span className="text-primary text-glow">Admin</span>{" "}
            <span className="text-foreground">Panel</span>
          </h1>
        </div>
        <p className="text-muted-foreground ml-14">
          Manage payment requests and user access
        </p>
      </motion.div>

      {/* Stats overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
      >
        {[
          {
            label: "Total Requests",
            value: paymentRequests?.length ?? 0,
            icon: <CreditCard className="w-4 h-4" />,
            color: "text-primary",
          },
          {
            label: "Pending",
            value: pendingRequests.length,
            icon: <Clock className="w-4 h-4" />,
            color: "text-accent",
          },
          {
            label: "Approved",
            value: approvedRequests.length,
            icon: <CheckCircle2 className="w-4 h-4" />,
            color: "text-green-400",
          },
          {
            label: "Active Users",
            value:
              approvals?.filter((a) => a.status === ApprovalStatus.approved)
                .length ?? 0,
            icon: <Users className="w-4 h-4" />,
            color: "text-blue-400",
          },
        ].map((stat) => (
          <Card key={stat.label} className="card-glass border-border/50">
            <CardContent className="pt-4 pb-4">
              <div
                className={`flex items-center gap-1.5 text-xs text-muted-foreground mb-1 ${stat.color}`}
              >
                {stat.icon}
                {stat.label}
              </div>
              <div className={`font-display font-800 text-3xl ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Payment Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10"
      >
        <Card className="card-glass border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="font-display font-700 text-xl flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {requestsLoading ? (
              <div className="p-6 space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : !paymentRequests?.length ? (
              <div
                className="p-8 text-center text-muted-foreground"
                data-ocid="payment_requests.empty_state"
              >
                <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No payment requests yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table data-ocid="payment_requests.table">
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="text-muted-foreground">#</TableHead>
                      <TableHead className="text-muted-foreground">
                        User
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Reference
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Date
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-muted-foreground text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentRequests.map((req, i) => (
                      <TableRow
                        key={`${req.user.toString()}-${i}`}
                        className="border-border/30 hover:bg-muted/20"
                        data-ocid={`payment_requests.row.${i + 1}`}
                      >
                        <TableCell className="text-muted-foreground text-xs font-mono">
                          {i + 1}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-foreground/80">
                          {truncatePrincipal(req.user)}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-accent">
                          {req.paymentReference}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(req.createdAt)}
                        </TableCell>
                        <TableCell>
                          {req.status === PaymentRequestStatus.pending ? (
                            <Badge
                              variant="outline"
                              className="border-accent/50 text-accent text-xs"
                            >
                              <Clock className="w-3 h-3 mr-1" /> Pending
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-green-500/50 text-green-400 text-xs"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {req.status === PaymentRequestStatus.pending && (
                            <Button
                              size="sm"
                              onClick={() => handleApprove(BigInt(i), i)}
                              disabled={approveRequest.isPending}
                              className="bg-primary/20 hover:bg-primary/40 text-primary border border-primary/30 text-xs h-7"
                              data-ocid={`approve.button.${i + 1}`}
                            >
                              {approveRequest.isPending ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                "Approve"
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Approvals Table */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="card-glass border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="font-display font-700 text-xl flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Active Approvals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {approvalsLoading ? (
              <div className="p-6 space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : !approvals?.length ? (
              <div
                className="p-8 text-center text-muted-foreground"
                data-ocid="approvals.empty_state"
              >
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No approvals yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table data-ocid="approvals.table">
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="text-muted-foreground">#</TableHead>
                      <TableHead className="text-muted-foreground">
                        User Principal
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-muted-foreground text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvals.map((approval, i) => (
                      <TableRow
                        key={approval.principal.toString()}
                        className="border-border/30 hover:bg-muted/20"
                        data-ocid={`approvals.row.${i + 1}`}
                      >
                        <TableCell className="text-muted-foreground text-xs font-mono">
                          {i + 1}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-foreground/80">
                          {truncatePrincipal(approval.principal)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              approval.status === ApprovalStatus.approved
                                ? "border-green-500/50 text-green-400 text-xs"
                                : approval.status === ApprovalStatus.pending
                                  ? "border-accent/50 text-accent text-xs"
                                  : "border-destructive/50 text-destructive text-xs"
                            }
                          >
                            {approval.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-destructive/30 text-destructive hover:bg-destructive/10 text-xs h-7"
                                data-ocid={`revoke.button.${i + 1}`}
                              >
                                Revoke
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="card-glass border-destructive/30">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-display font-700">
                                  Revoke Access?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  This will remove premium access for{" "}
                                  <span className="font-mono text-foreground">
                                    {truncatePrincipal(approval.principal)}
                                  </span>
                                  . They will need to re-submit a payment to
                                  regain access.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel data-ocid="revoke.cancel_button">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleRevoke(approval.principal)
                                  }
                                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                  data-ocid="revoke.confirm_button"
                                >
                                  {revokeAccess.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    "Yes, Revoke"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
