"use client";

import {
  BG_COLOR_PRESETS,
  TEXT_COLOR_PRESETS,
  ReaderTheme,
} from "@/lib/useReaderPrefs";

interface ReaderSettingsProps {
  fontSize: number;
  canIncrease: boolean;
  canDecrease: boolean;
  theme: ReaderTheme;
  bgColor: string | null;
  textColor: string | null;
  onIncrease: () => void;
  onDecrease: () => void;
  onToggleTheme: () => void;
  onSetBgColor: (color: string | null) => void;
  onSetTextColor: (color: string | null) => void;
  onResetColors: () => void;
  onClose: () => void;
}

export function ReaderSettings({
  fontSize,
  canIncrease,
  canDecrease,
  theme,
  bgColor,
  textColor,
  onIncrease,
  onDecrease,
  onToggleTheme,
  onSetBgColor,
  onSetTextColor,
  onResetColors,
  onClose,
}: ReaderSettingsProps) {
  return (
    <div className="reader-sheet-backdrop" onClick={onClose}>
      <div className="reader-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="reader-sheet-handle" />
        <h3 className="reader-sheet-title">Cài Đặt Đọc</h3>

        <div className="reader-sheet-row">
          <span>Cỡ chữ</span>
          <div className="reader-font-controls">
            <button
              className="btn-icon"
              onClick={onDecrease}
              disabled={!canDecrease}
              aria-label="Giảm cỡ chữ"
            >
              A-
            </button>
            <span className="reader-font-size-value">{fontSize}px</span>
            <button
              className="btn-icon"
              onClick={onIncrease}
              disabled={!canIncrease}
              aria-label="Tăng cỡ chữ"
            >
              A+
            </button>
          </div>
        </div>

        <div className="reader-sheet-row">
          <span>Giao diện</span>
          <button className="btn-secondary" onClick={onToggleTheme}>
            {theme === "dark" ? "Chế Độ Sáng" : "Chế Độ Tối"}
          </button>
        </div>

        <div className="reader-sheet-row reader-sheet-row-column">
          <span>Màu nền</span>
          <div className="reader-color-swatches">
            {BG_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={`reader-color-swatch${
                  bgColor === preset.value ? " active" : ""
                }`}
                style={{ background: preset.value }}
                onClick={() => onSetBgColor(preset.value)}
                aria-label={preset.label}
                title={preset.label}
              />
            ))}
            <label
              className="reader-color-swatch reader-color-swatch-custom"
              title="Tùy chỉnh"
              aria-label="Tùy chỉnh màu nền"
            >
              <input
                type="color"
                value={bgColor ?? "#000000"}
                onChange={(e) => onSetBgColor(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="reader-sheet-row reader-sheet-row-column">
          <span>Màu chữ</span>
          <div className="reader-color-swatches">
            {TEXT_COLOR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={`reader-color-swatch${
                  textColor === preset.value ? " active" : ""
                }`}
                style={{ background: preset.value }}
                onClick={() => onSetTextColor(preset.value)}
                aria-label={preset.label}
                title={preset.label}
              />
            ))}
            <label
              className="reader-color-swatch reader-color-swatch-custom"
              title="Tùy chỉnh"
              aria-label="Tùy chỉnh màu chữ"
            >
              <input
                type="color"
                value={textColor ?? "#000000"}
                onChange={(e) => onSetTextColor(e.target.value)}
              />
            </label>
          </div>
        </div>

        {(bgColor || textColor) && (
          <div className="reader-sheet-row">
            <span>Màu mặc định</span>
            <button className="btn-secondary" onClick={onResetColors}>
              Đặt Lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
