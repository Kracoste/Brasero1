import React, { useEffect, useRef, useState } from "react";
import "../styles/CustomDualRange.css";

type DualRangeProps = {
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  onChange?: (range: [number, number]) => void;
};

export function CustomDualRange({
  min = 0,
  max = 100,
  step = 1,
  value = [20, 80],
  onChange,
}: DualRangeProps) {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const range = max - min || 1;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [trackMetrics, setTrackMetrics] = useState({ offset: 0, width: 0 });

  const getPercent = (val: number) => Math.min(Math.max((val - min) / range, 0), 1);

  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
  }, [value]);

  useEffect(() => {
    const updateMetrics = () => {
      if (!wrapperRef.current) return;
      const totalWidth = wrapperRef.current.clientWidth;
      setTrackMetrics({ offset: 0, width: totalWidth });
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, []);

  const percentMin = getPercent(minVal);
  const percentMax = getPercent(maxVal);

  const thumbSize = 24;
  const thumbRadius = thumbSize / 2; // 12px

  // Les thumbs natifs se déplacent de thumbRadius à (width - thumbRadius)
  // Position du centre de chaque thumb
  const sliderWidth = trackMetrics.width - thumbSize; // espace de déplacement réel
  const minThumbCenter = thumbRadius + sliderWidth * percentMin;
  const maxThumbCenter = thumbRadius + sliderWidth * percentMax;

  // La barre va du bord droit du thumb gauche au bord gauche du thumb droit
  const activeLeftPx = minThumbCenter + thumbRadius;
  const activeWidthPx = Math.max((maxThumbCenter - thumbRadius) - activeLeftPx, 0);

  const activeTrackStyle: React.CSSProperties & {
    "--active-left"?: string;
    "--active-width"?: string;
  } = {
    "--active-left": `${activeLeftPx}px`,
    "--active-width": `${activeWidthPx}px`,
  };

  return (
    <div className="dual-range-wrapper" ref={wrapperRef}>
      <div className="dual-range-track-active" style={activeTrackStyle} />
      <div className="dual-range-track-bg" />
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        step={step}
        onChange={event => {
          const newValue = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(newValue);
          onChange?.([newValue, maxVal]);
        }}
        className="dual-range-input"
        style={{ zIndex: minVal > max - 100 ? 5 : 3 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        step={step}
        onChange={event => {
          const newValue = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(newValue);
          onChange?.([minVal, newValue]);
        }}
        className="dual-range-input"
        style={{ zIndex: 4 }}
      />
    </div>
  );
}
