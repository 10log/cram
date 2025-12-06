import React, { useCallback } from "react";
import { ObjectPropertyInputEvent } from "../ObjectProperties";

export interface NumberInputProps {
  name: string;
  className?: string;
  value: number | string;
  style?: React.CSSProperties;
  disabled?: boolean;
  step?: number;
  min?: number;
  max?: number;
  id?: string;
  onChange: (e: ObjectPropertyInputEvent) => void;
  verifier?: (val: string | number) => boolean;
}

export function NumberInput(props: NumberInputProps) {
  const handleWheel = useCallback((e: React.WheelEvent<HTMLInputElement>) => {
    if (props.disabled) return;
    e.preventDefault();
    const step = props.step ?? 1;
    const delta = e.deltaY < 0 ? step : -step;
    let newValue = Number(props.value) + delta;
    if (props.min !== undefined) newValue = Math.max(props.min, newValue);
    if (props.max !== undefined) newValue = Math.min(props.max, newValue);
    if (!Number.isNaN(newValue)) {
      props.onChange({
        value: newValue,
        name: props.name,
        id: props.id,
        type: "number"
      });
    }
  }, [props]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.currentTarget.value);
    if (!Number.isNaN(newValue)) {
      props.onChange({
        value: newValue,
        name: props.name,
        id: props.id,
        type: "number"
      });
    }
  }, [props]);

  const _props = {
    onChange: handleChange,
    onWheel: handleWheel,
    name: props.name,
    className: ["number-input", props.className || ""].join(" "),
    value: props.value,
    style: props.style,
    disabled: props.disabled,
    step: props.step ?? 1,
    min: props.min,
    max: props.max,
    id: props.id,
    type: "number"
  };
  return <input {..._props} />;
}

export default NumberInput;
