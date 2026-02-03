import React, { useState, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleLinear } from "@visx/scale";
import { Grid } from "@visx/grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { Result, ResultKind, useResult } from "../../store/result-store";
import { pickProps } from "../../common/helpers";
import { on } from "../../messenger";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

export type ImpulseResponseChartProps = {
  uuid: string;
  width?: number;
  height?: number;
  events?: boolean;
};

const verticalContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
};

const titleSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
};

const horizontalContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  flex: 1,
};

const graphContainerSx: SxProps<Theme> = {
  display: "flex",
  flex: 8,
  width: "100%",
};

const infoContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  p: "8px 16px",
  fontSize: 12,
};

const getTime = (d: { time: number; amplitude: number }) => d.time;
const getAmplitude = (d: { time: number; amplitude: number }) => d.amplitude;

const Chart = ({ uuid, width = 400, height = 200 }: ImpulseResponseChartProps) => {
  const { data: _data } = useResult(
    useShallow((state) =>
      pickProps(["data"], state.results[uuid] as Result<ResultKind.ImpulseResponse>)
    )
  );

  const [data, setData] = useState(_data);

  useEffect(
    () =>
      on("UPDATE_RESULT", (e) => {
        if (e.uuid === uuid) {
          setData((e.result as Result<ResultKind.ImpulseResponse>).data);
        }
      }),
    [uuid]
  );

  const scalePadding = 60;
  const scaleWidth = width - scalePadding;
  const scaleHeight = height - scalePadding;

  // Guard against empty data
  if (!data || data.length === 0) {
    return (
      <svg width={width} height={height}>
        <text x={width / 2} y={height / 2} textAnchor="middle">
          No impulse response data
        </text>
      </svg>
    );
  }

  const maxTime = Math.max(...data.map(getTime));
  const maxAmp = Math.max(...data.map((d) => Math.abs(d.amplitude)));

  // Guard against invalid values
  if (!Number.isFinite(maxTime) || maxTime <= 0 || !Number.isFinite(maxAmp) || maxAmp <= 0) {
    return (
      <svg width={width} height={height}>
        <text x={width / 2} y={height / 2} textAnchor="middle">
          Invalid impulse response data
        </text>
      </svg>
    );
  }

  const xScale = scaleLinear<number>({
    range: [0, scaleWidth],
    domain: [0, maxTime],
  });

  const yScale = scaleLinear<number>({
    range: [scaleHeight, 0],
    domain: [-maxAmp, maxAmp],
  });

  return (
    <svg width={width} height={height}>
      <Grid
        xScale={xScale}
        yScale={yScale}
        width={scaleWidth}
        height={scaleHeight}
        left={scalePadding}
      />
      <Group left={scalePadding}>
        <LinePath
          data={data}
          x={(d) => xScale(getTime(d))}
          y={(d) => yScale(getAmplitude(d))}
          stroke="#2563eb"
          strokeWidth={1}
        />
      </Group>
      <AxisBottom scale={xScale} top={scaleHeight} left={scalePadding} label="Time (s)" />
      <AxisLeft scale={yScale} left={scalePadding} label="Amplitude" />
    </svg>
  );
};

export const ImpulseResponseChart = ({
  uuid,
  width = 400,
  height = 300,
  events = false,
}: ImpulseResponseChartProps) => {
  const { name, info } = useResult(
    useShallow((state) =>
      pickProps(["name", "info"], state.results[uuid] as Result<ResultKind.ImpulseResponse>)
    )
  );

  return width < 10 ? null : (
    <Box sx={verticalContainerSx}>
      <Typography sx={titleSx}>{name}</Typography>
      <Box sx={horizontalContainerSx}>
        <Box sx={graphContainerSx}>
          <ParentSize debounceTime={10}>
            {({ width }) => <Chart {...{ width, height, uuid, events }} />}
          </ParentSize>
        </Box>
        <Box sx={infoContainerSx}>
          <div>
            <b>Source:</b> {info.sourceName}
          </div>
          <div>
            <b>Receiver:</b> {info.receiverName}
          </div>
          <div>
            <b>Sample Rate:</b> {info.sampleRate} Hz
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default ImpulseResponseChart;
