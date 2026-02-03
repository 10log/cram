import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { useShallow } from "zustand/react/shallow";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { ResultKind, useResult } from "../../store/result-store";
import { emit } from "../../messenger";
import { pickProps } from "../../common/helpers";

// Mini bar chart using SVG for LTP preview
import { scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import chroma from "chroma-js";

const previewContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  p: "8px",
  my: "4px",
  bgcolor: "#fff",
  border: "1px solid #e1e4e8",
  borderRadius: "4px",
  cursor: "pointer",
  "&:hover": {
    bgcolor: "#f6f8fa",
    borderColor: "#d0d7de",
  },
};

const previewHeaderSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  mb: "6px",
};

const previewTitleSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: 12,
  fontWeight: 500,
  color: "#1c2127",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const expandButtonSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: "2px",
  borderRadius: "3px",
  color: "#656d76",
  "&:hover": {
    bgcolor: "#dde3e8",
    color: "#1c2127",
  },
};

const miniChartContainerSx: SxProps<Theme> = {
  height: 40,
  width: "100%",
  bgcolor: "#f6f8fa",
  borderRadius: "3px",
  overflow: "hidden",
};

const noDataTextSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  fontSize: 11,
  color: "#8c959f",
  fontStyle: "italic",
};

/**
 * Maps result kind to its icon component
 */
const ResultIconMap: Record<string, React.ElementType> = {
  [ResultKind.LevelTimeProgression]: TimelineIcon,
  [ResultKind.StatisticalRT60]: BarChartIcon,
  [ResultKind.ImpulseResponse]: GraphicEqIcon,
  [ResultKind.Default]: BarChartIcon,
};

const colorScale = chroma.scale(["#ff8a0b", "#000080"]).mode("lch");
const getOrderColors = (n: number) => colorScale.colors(Math.max(n, 1));

/**
 * Mini LTP chart for preview
 */
const MiniLTPChart = ({ data, maxOrder }: { data: any[]; maxOrder: number }) => {
  const width = 200;
  const height = 40;

  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [0, width],
        domain: [0, data.length > 0 ? Math.max(...data.map((d) => d.time)) : 1],
      }),
    [data]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [height - 2, 2],
        domain: data.length > 0
          ? [
              Math.min(...data.map((d) => d.pressure[0])) * 0.75,
              Math.max(...data.map((d) => d.pressure[0])),
            ]
          : [0, 1],
      }),
    [data]
  );

  const colors = useMemo(() => getOrderColors(maxOrder + 1), [maxOrder]);

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <Group>
        {data.slice(0, 100).map((d, i) => {
          const barHeight = height - 2 - yScale(d.pressure[0]);
          const barX = xScale(d.time);
          const barY = height - 2 - barHeight;
          return (
            <Bar
              key={`mini-bar-${i}`}
              x={barX}
              y={barY}
              width={2}
              height={Math.max(barHeight, 1)}
              fill={colors[Math.min(d.order, colors.length - 1)]}
            />
          );
        })}
      </Group>
    </svg>
  );
};

/**
 * Mini RT60 chart for preview
 */
const MiniRT60Chart = ({ data }: { data: any[] }) => {
  const width = 200;
  const height = 40;
  const barWidth = width / (data.length * 3 + 1);

  const maxValue = Math.max(...data.map((d) => Math.max(d.sabine || 0, d.eyring || 0, d.ap || 0)));

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [height - 2, 2],
        domain: [0, maxValue * 1.2],
      }),
    [maxValue]
  );

  const colors = ["#48beff", "#43c593", "#14453d"];

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <Group>
        {data.map((d, i) => {
          const groupX = (i * 3 + 0.5) * barWidth;
          const values = [d.sabine, d.eyring, d.ap];
          return values.map((val, j) => {
            const barHeight = height - 2 - yScale(val || 0);
            return (
              <Bar
                key={`mini-rt-${i}-${j}`}
                x={groupX + j * barWidth}
                y={height - 2 - barHeight}
                width={barWidth * 0.9}
                height={Math.max(barHeight, 1)}
                fill={colors[j]}
                rx={1}
              />
            );
          });
        })}
      </Group>
    </svg>
  );
};

/**
 * Mini IR chart for preview (simple waveform)
 */
const MiniIRChart = ({ data }: { data: any[] }) => {
  const width = 200;
  const height = 40;
  const centerY = height / 2;

  // Downsample data for preview
  const step = Math.max(1, Math.floor(data.length / 100));
  const sampledData = data.filter((_, i) => i % step === 0);

  const maxAmp = Math.max(...sampledData.map((d) => Math.abs(d.amplitude)));

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <Group>
        {sampledData.map((d, i) => {
          const x = (i / sampledData.length) * width;
          const ampHeight = (Math.abs(d.amplitude) / maxAmp) * (height / 2 - 2);
          return (
            <Bar
              key={`mini-ir-${i}`}
              x={x}
              y={centerY - ampHeight}
              width={Math.max(width / sampledData.length, 1)}
              height={ampHeight * 2}
              fill="#2d72d2"
            />
          );
        })}
      </Group>
    </svg>
  );
};

export interface ResultPreviewProps {
  uuid: string;
}

export default function ResultPreview({ uuid }: ResultPreviewProps) {
  const result = useResult(
    useShallow((state) => {
      const r = state.results[uuid];
      if (!r) return null;
      return pickProps(["name", "kind", "data", "info"], r);
    })
  );

  if (!result) {
    return null;
  }

  const { name, kind, data, info } = result;
  const Icon = ResultIconMap[kind] || BarChartIcon;

  const handleClick = () => {
    // Open the results panel and switch to this result's tab
    emit("TOGGLE_RESULTS_PANEL", true);
    // Small delay to ensure panel is open before switching tabs
    setTimeout(() => {
      emit("SELECT_RESULT_TAB", uuid);
    }, 50);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClick();
  };

  const hasData = data && data.length > 0;

  const renderMiniChart = () => {
    if (!hasData) {
      return <Box sx={noDataTextSx}>No data yet</Box>;
    }

    switch (kind) {
      case ResultKind.LevelTimeProgression:
        return <MiniLTPChart data={data} maxOrder={(info as any)?.maxOrder || 3} />;
      case ResultKind.StatisticalRT60:
        return <MiniRT60Chart data={data} />;
      case ResultKind.ImpulseResponse:
        return <MiniIRChart data={data} />;
      default:
        return <Box sx={noDataTextSx}>Preview not available</Box>;
    }
  };

  return (
    <Box sx={previewContainerSx} onClick={handleClick}>
      <Box sx={previewHeaderSx}>
        <Box sx={previewTitleSx}>
          <Icon style={{ fontSize: 14 }} />
          {name}
        </Box>
        <Box sx={expandButtonSx} onClick={handleExpandClick} title="Open in Results panel">
          <OpenInNewIcon style={{ fontSize: 14 }} />
        </Box>
      </Box>
      <Box sx={miniChartContainerSx}>{renderMiniChart()}</Box>
    </Box>
  );
}
