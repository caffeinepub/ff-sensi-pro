import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateSensitivity, saveResult } from "@/utils/sensitivityCalc";
import { useNavigate } from "@tanstack/react-router";
import { Cpu, MemoryStick, Monitor } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function DevicePage() {
  const navigate = useNavigate();
  const [ram, setRam] = useState(8);
  const [model, setModel] = useState("");
  const [screenSize, setScreenSize] = useState(24);

  useEffect(() => {
    const raw = localStorage.getItem("ff_user");
    if (!raw) navigate({ to: "/login" });
  }, [navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = calculateSensitivity({
      ramGb: ram,
      deviceModel: model.trim() || "Unknown PC",
      screenSizeInches: screenSize,
    });
    saveResult(result);
    navigate({ to: "/results" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="font-display font-800 text-3xl">
            <span className="text-primary">PC</span> Specifications
          </h1>
          <p className="text-muted-foreground mt-2">
            Enter your PC details for personalized settings
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              Your PC Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="ram" className="flex items-center gap-2">
                  <MemoryStick className="w-4 h-4 text-primary" />
                  RAM (GB)
                </Label>
                <Input
                  id="ram"
                  type="number"
                  min={1}
                  max={64}
                  value={ram}
                  onChange={(e) => setRam(Number(e.target.value))}
                  required
                  data-ocid="device.input"
                />
                <p className="text-xs text-muted-foreground">Range: 1–64 GB</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model" className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  PC Model
                </Label>
                <Input
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Dell Inspiron, HP Pavilion, ASUS ROG"
                  data-ocid="device.input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="screen" className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-primary" />
                  Monitor Size (inches)
                </Label>
                <Input
                  id="screen"
                  type="number"
                  min={19}
                  max={34}
                  value={screenSize}
                  onChange={(e) => setScreenSize(Number(e.target.value))}
                  required
                  data-ocid="device.input"
                />
                <p className="text-xs text-muted-foreground">
                  Range: 19–34 inches
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground"
                data-ocid="device.submit_button"
              >
                Generate My Settings
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
