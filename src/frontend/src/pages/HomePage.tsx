import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateSensitivity, saveResult } from "@/utils/sensitivityCalc";
import { useNavigate } from "@tanstack/react-router";
import { Cpu, Crosshair, MemoryStick, Monitor, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function HomePage() {
  const navigate = useNavigate();
  const [ram, setRam] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [screenSize, setScreenSize] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ramNum = Number.parseInt(ram);
    const screenNum = Number.parseInt(screenSize);

    if (ramNum < 1 || ramNum > 64) {
      toast.error("RAM must be between 1 and 64 GB");
      return;
    }
    if (screenNum < 19 || screenNum > 34) {
      toast.error("Monitor size must be between 19 and 34 inches");
      return;
    }
    if (!deviceModel.trim()) {
      toast.error("Please enter your PC model");
      return;
    }

    const result = calculateSensitivity({
      ramGb: ramNum,
      screenSizeInches: screenNum,
      deviceModel: deviceModel.trim(),
    });
    saveResult(result);
    toast.success("PC details submitted!");
    navigate({ to: "/results" });
  }

  return (
    <div className="relative overflow-hidden">
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img
          src="/assets/generated/ff-hero-banner.dim_1600x600.jpg"
          alt="FF Sensi Pro"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        <div className="absolute inset-0 scanline" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display font-800 text-4xl sm:text-6xl tracking-tight mb-2">
              <span className="text-primary text-glow">DOMINATE</span>
              <br />
              <span className="text-foreground">THE BATTLEFIELD</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md">
              Get your perfect Free Fire PC sensitivity settings based on your
              computer specs
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="card-glass border-primary/20 shadow-glow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/15 border border-primary/30">
                  <Crosshair className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="font-display font-700 text-2xl">
                  PC Details
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                Enter your PC specs to calculate your optimal sensitivity
                settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="ram"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <MemoryStick className="w-4 h-4 text-primary" />
                    RAM (GB)
                  </Label>
                  <Input
                    id="ram"
                    type="number"
                    min={1}
                    max={64}
                    placeholder="e.g. 4, 8, 16, 32..."
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    className="bg-input/60 border-border focus:border-primary focus:ring-primary/30"
                    required
                    data-ocid="device_form.input"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported range: 1-64 GB
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="deviceModel"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <Cpu className="w-4 h-4 text-primary" />
                    PC Model
                  </Label>
                  <Input
                    id="deviceModel"
                    type="text"
                    placeholder="e.g. Dell Inspiron, HP Pavilion, ASUS ROG, Lenovo IdeaPad..."
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    className="bg-input/60 border-border focus:border-primary focus:ring-primary/30"
                    required
                    data-ocid="device_form.input"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="screenSize"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <Monitor className="w-4 h-4 text-primary" />
                    Monitor Size (inches)
                  </Label>
                  <Input
                    id="screenSize"
                    type="number"
                    min={19}
                    max={34}
                    placeholder="e.g. 21, 24, 27, 32..."
                    value={screenSize}
                    onChange={(e) => setScreenSize(e.target.value)}
                    className="bg-input/60 border-border focus:border-primary focus:ring-primary/30"
                    required
                    data-ocid="device_form.input"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported range: 19-34 inches
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-700 text-base tracking-wide glow-primary transition-all duration-300"
                  data-ocid="device_form.submit_button"
                >
                  <Zap className="mr-2 w-4 h-4" />
                  Calculate My Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 grid grid-cols-2 gap-4"
        >
          {[
            { icon: "🎯", label: "Sensitivity", desc: "Below 70 for PC" },
            { icon: "🔥", label: "Fire Button", desc: "Up to size 50" },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center p-4 rounded-lg card-glass border border-primary/10"
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="font-display font-700 text-sm text-primary">
                {item.label}
              </div>
              <div className="text-xs text-muted-foreground">{item.desc}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
