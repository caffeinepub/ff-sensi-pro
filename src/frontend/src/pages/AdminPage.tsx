import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, KeyRound, Shield, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const ADMIN_USERNAME = "zeeshan18";
const ADMIN_PASSWORD = "788";

export default function AdminPage() {
  const [credsPassed, setCredsPassed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [credsError, setCredsError] = useState("");

  function handleCredsSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setCredsError("");
      setCredsPassed(true);
    } else {
      setCredsError("Incorrect username or password.");
    }
  }

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
            Admin <span className="text-primary">Login</span>
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

  return (
    <div
      className="container mx-auto px-4 py-12 max-w-3xl"
      data-ocid="admin.panel"
    >
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
            <span className="text-primary">Admin</span>{" "}
            <span className="text-foreground">Panel</span>
          </h1>
        </div>
        <p className="text-muted-foreground ml-14">Welcome, Zeeshan Assad</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display font-700 text-xl flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              App Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              FF Sensi Pro is live and free for all users. Sensitivity settings
              are generated instantly based on PC details -- no payment or
              approval required.
            </p>
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium">
              All systems operational
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
