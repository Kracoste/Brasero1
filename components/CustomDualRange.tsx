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
      const styles = getComputedStyle(wrapperRef.current);
      const thumbSize = parseFloat(styles.getPropertyValue("--dual-thumb-size")) || 24;
      // offset = distance from edge to center of thumb
      const offset = thumbSize / 2;
      // width = total available width minus the thumb radiuses on both sides
      const width = Math.max(wrapperRef.current.clientWidth - thumbSize, 0);
      setTrackMetrics({ offset, width });
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);
    return () => window.removeEventListener("resize", updateMetrics);
  }, []);

  const percentMin = getPercent(minVal);
  const percentMax = getPercent(maxVal);
  const activeLeftPx = trackMetrics.offset + trackMetrics.width * percentMin;
  const activeWidthPx = Math.max(trackMetrics.width * (percentMax - percentMin), 0);

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
