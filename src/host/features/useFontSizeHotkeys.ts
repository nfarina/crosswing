import { useLayoutEffect } from "react";
import { useHotkey } from "../../hooks/useHotkey";
import { useLocalStorage } from "../../hooks/useLocalStorage";

interface FontSizePreset {
  name: string;
  size: number;
}

// From iOS.
const presets: FontSizePreset[] = [
  { name: "Largest", size: 23 },
  { name: "Large", size: 21 },
  { name: "Larger", size: 19 },
  { name: "Default", size: 17 },
  { name: "Smaller", size: 16 },
  { name: "Small", size: 15 },
  { name: "Smallest", size: 14 },
];

const DEFAULT_PRESET_INDEX = 3;

/**
 * Allow you to tweak the font size globally for testing responsive
 * type in mobile apps.
 */
export function useFontSizeHotkeys() {
  const [presetIndex, setPresetIndex] = useLocalStorage<number>(
    "useFontSizeHotkeys:presetIndex",
    DEFAULT_PRESET_INDEX,
  );

  useHotkey("]", () => setPresetIndex(Math.max(0, presetIndex - 1)));
  useHotkey("[", () =>
    setPresetIndex(Math.min(presets.length - 1, presetIndex + 1)),
  );
  useHotkey("=", () => setPresetIndex(DEFAULT_PRESET_INDEX));

  // Respond to changes in preferred font size.
  useLayoutEffect(() => {
    const preset = presets[presetIndex];
    // Match behavior in AppContainer.
    const multiplier = preset.size / 17;

    document.body.style.setProperty("--font-scale", String(multiplier));
  }, [presetIndex]);
}
