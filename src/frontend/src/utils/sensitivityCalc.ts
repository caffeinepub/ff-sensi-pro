export interface DeviceInput {
  ramGb: number;
  deviceModel: string;
  screenSizeInches: number;
}

export interface SensitivityResult {
  generalSensitivity: number;
  noScopeSensitivity: number;
  redDotSensitivity: number;
  scope2xSensitivity: number;
  scope4xSensitivity: number;
  awmScopeSensitivity: number;
  fireButtonSize: number;
  gameBoosterTips: string;
  deviceDetails: DeviceInput;
}

export function calculateSensitivity(device: DeviceInput): SensitivityResult {
  const base =
    device.ramGb >= 16
      ? 65
      : device.ramGb >= 8
        ? 58
        : device.ramGb >= 6
          ? 50
          : device.ramGb >= 4
            ? 42
            : 35;

  const fireButtonSize =
    device.screenSizeInches >= 30
      ? 45
      : device.screenSizeInches >= 24
        ? 35
        : 25;

  const gameBoosterTips =
    device.ramGb >= 16
      ? "Your PC is powerful. Run Free Fire emulator in high graphics mode with performance mode enabled."
      : device.ramGb >= 8
        ? "Enable performance mode in emulator settings and close heavy background apps for smooth gameplay."
        : device.ramGb >= 6
          ? "Set emulator graphics to medium and close background apps for optimal Free Fire performance."
          : device.ramGb >= 4
            ? "Use low graphics settings and reduce emulator virtual memory usage for best results."
            : "Consider upgrading RAM for a better Free Fire experience on PC.";

  return {
    generalSensitivity: base,
    noScopeSensitivity: Math.max(base - 5, 1),
    redDotSensitivity: Math.max(base - 8, 1),
    scope2xSensitivity: Math.max(base - 12, 1),
    scope4xSensitivity: Math.max(base - 18, 1),
    awmScopeSensitivity: Math.max(base - 25, 1),
    fireButtonSize,
    gameBoosterTips,
    deviceDetails: device,
  };
}

const STORAGE_KEY = "ff_sensi_result";

export function saveResult(result: SensitivityResult) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

export function loadResult(): SensitivityResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SensitivityResult;
  } catch {
    return null;
  }
}
