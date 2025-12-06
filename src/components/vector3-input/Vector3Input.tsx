import React from "react";
import "./Vector3Input.css";

export interface Vector3InputChangeEvent {
  id?: string;
  value: number[];
}

export interface Vector3InputProps {
  id?: string;
  value: number[];
  onChange: (event: Vector3InputChangeEvent) => void;
  min: number;
  max: number;
  step: number;
}

export interface Vector3InputState {
  stagedValue: number[];
}

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

export default class Vector3Input extends React.Component<Vector3InputProps, Vector3InputState> {
  inputX: React.RefObject<HTMLInputElement>;
  inputY: React.RefObject<HTMLInputElement>;
  inputZ: React.RefObject<HTMLInputElement>;

  constructor(props: Vector3InputProps) {
    super(props);
    this.state = {
      stagedValue: this.props.value
    };
    this.inputX = React.createRef<HTMLInputElement>();
    this.inputY = React.createRef<HTMLInputElement>();
    this.inputZ = React.createRef<HTMLInputElement>();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.inputX.current!.value = (this.state.stagedValue && String(this.state.stagedValue[0])) || "0";
    this.inputY.current!.value = (this.state.stagedValue && String(this.state.stagedValue[1])) || "0";
    this.inputZ.current!.value = (this.state.stagedValue && String(this.state.stagedValue[2])) || "0";
  }

  emitChange() {
    const valueX = clamp(Number(this.inputX.current!.value), this.props.min, this.props.max);
    const valueY = clamp(Number(this.inputY.current!.value), this.props.min, this.props.max);
    const valueZ = clamp(Number(this.inputZ.current!.value), this.props.min, this.props.max);
    this.props.onChange({ value: [valueX, valueY, valueZ] });
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    this.emitChange();
    event.preventDefault();
  }

  handleWheel(event: React.WheelEvent<HTMLInputElement>) {
    event.preventDefault();
    const input = event.currentTarget;
    const step = this.props.step || 1;
    const delta = event.deltaY < 0 ? step : -step;
    const currentValue = Number(input.value);
    const newValue = clamp(currentValue + delta, this.props.min, this.props.max);
    input.value = String(newValue);
    this.emitChange();
  }

  handleChange() {
    this.emitChange();
  }

  render() {
    return (
      <div className="vector3-input-container">
        <form onSubmit={this.handleSubmit} noValidate>
          <input
            type="number"
            className={"vector3-input-number"}
            min={this.props.min}
            max={this.props.max}
            step={this.props.step || 1}
            id={this.props.id + "-x"}
            ref={this.inputX}
            onWheel={this.handleWheel}
            onChange={this.handleChange}
          />
        </form>
        <form onSubmit={this.handleSubmit} noValidate>
          <input
            type="number"
            className={"vector3-input-number"}
            min={this.props.min}
            max={this.props.max}
            step={this.props.step || 1}
            id={this.props.id + "-y"}
            ref={this.inputY}
            onWheel={this.handleWheel}
            onChange={this.handleChange}
          />
        </form>
        <form onSubmit={this.handleSubmit} noValidate>
          <input
            type="number"
            className={"vector3-input-number"}
            min={this.props.min}
            max={this.props.max}
            step={this.props.step || 1}
            id={this.props.id + "-z"}
            ref={this.inputZ}
            onWheel={this.handleWheel}
            onChange={this.handleChange}
          />
        </form>
      </div>
    );
  }
}
