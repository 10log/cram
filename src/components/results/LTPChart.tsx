// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow';
import { Result, useResult, ResultKind } from '../../store/result-store';

import { Bar, LinePath } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Grid } from '@visx/grid';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import type { SxProps, Theme } from '@mui/material/styles';
import { scaleOrdinal } from 'd3-scale';
import { pickProps } from '../../common/helpers';
import { emit, on } from '../../messenger';
import chroma from 'chroma-js';
import { ImageSourceSolver } from '../../compute/raytracer/image-source';
import { BeamTraceSolver } from '../../compute/beam-trace';
import { useSolver } from '../../store';

// Type for solvers that can generate LTP results
type LTPSolver = ImageSourceSolver | BeamTraceSolver;
// accessors
const getTime = (d) => d.time;
const getPressure = (d) => d.pressure[0];

type ChartMode = 'ltp' | 'etc';
type YRange = 'auto' | 10 | 20 | 30;

export type LTPChartProps = {
  uuid: string;
  width?: number;
  height?: number;
  events?: boolean;
  plotOrders?: number[];
  solverKind?: string;
  chartMode?: ChartMode;
  yRange?: YRange;
};

const range = (start: number, stop: number) => [...Array(stop-start)].map((x,i) => start + i)
const colorScale = chroma.scale(['#ff8a0b', '#000080']).mode('lch');
const getOrderColors = (n: number) => colorScale.colors(n);

const verticalContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
};

const titleSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
};

const toolbarSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 3,
  px: 2,
  py: 0.5,
};

const graphContainerSx: SxProps<Theme> = {
  display: "flex",
  flex: 1,
};

const useUpdate = () => {
  const [updateCount, setUpdateCount] = useState<number>(0);
  return [updateCount, () => setUpdateCount(updateCount + 1)] as  [number, () => void];
}

const Chart = ({ uuid, width = 400, height = 200, events = false, plotOrders, solverKind, chartMode = 'ltp', yRange = 'auto' }: LTPChartProps) => {
    const {info, data: _data, from} = useResult(useShallow(state=>pickProps(["info", "data", "from"], state.results[uuid] as Result<ResultKind.LevelTimeProgression>)));

    const [_count, _update] = useUpdate();
    const [data, setData] = useState(_data);

    // Filter data by plotOrders - if plotOrders is empty, show no data
    const filteredData = useMemo(() => {
      if (!data) return data;
      if (!plotOrders) return data;
      return data.filter(d => plotOrders.includes(d.order));
    }, [data, plotOrders]);


    useEffect(() => {
      return on("UPDATE_RESULT", (e) => {
        if (e.uuid === uuid) {
          //@ts-ignore
          setData(e.result.data);
          // update();
        }
      });
    }, [uuid]);

    const scalePadding = 60;
    const scaleWidth = width-scalePadding;
    const scaleHeight = height - scalePadding;

    // scales, memoize for performance
    // Must be called before any conditional returns to satisfy Rules of Hooks
    const xScale = useMemo(
      () =>
        scaleLinear<number>({
          range: [0, scaleWidth],
          domain: [0, data && data.length > 0 ? Math.max(...data.map(getTime)) : 1],
        }),
      [scaleWidth, data],
    );

    const yScale = useMemo(
      () => {
        if (!data || data.length === 0) {
          return scaleLinear<number>({ range: [scaleHeight, 0], domain: [0, 1] });
        }
        const maxP = Math.max(...data.map(getPressure));
        const minP = yRange === 'auto'
          ? Math.min(...data.map(getPressure)) * 0.75
          : maxP - yRange;
        return scaleLinear<number>({
          range: [scaleHeight, 0],
          domain: [minP, maxP],
        });
      },
      [scaleHeight, data, yRange],
    );

    const ordinalColorScale = useMemo(
      () => scaleOrdinal(
      range(0, info.maxOrder+1),
      getOrderColors(info.maxOrder+1)
    ),
      [info.maxOrder]
    );

    // ETC: sort filtered data by time for line plot
    const etcData = useMemo(() => {
      if (!filteredData) return [];
      return [...filteredData].sort((a, b) => getTime(a) - getTime(b));
    }, [filteredData]);

    // Guard against empty data - must be after all hooks
    if (!data || data.length === 0) {
      return (
        <svg width={width} height={height}>
          <text x={width / 2} y={height / 2} textAnchor="middle">
            No data yet - click "Update" to calculate
          </text>
        </svg>
      );
    }

    return (
      <svg width={width} height={height}>
      <Grid
        xScale={xScale}
        yScale={yScale}
        width={scaleWidth}
        height={scaleHeight}
        left={scalePadding}
      />
      {chartMode === 'etc' ? (
        <Group left={scalePadding}>
          <LinePath
            data={etcData}
            x={(d) => xScale(getTime(d))}
            y={(d) => yScale(getPressure(d))}
            stroke="#2563eb"
            strokeWidth={1.5}
          />
        </Group>
      ) : (
        <Group>
          {filteredData.map(d => {
            const time = getTime(d);
            const barHeight = scaleHeight - yScale(getPressure(d));
            const barX = xScale(time) + scalePadding;
            const barY = scaleHeight - barHeight;
            return (
              <Bar
                key={`bar-${d.arrival}`}
                x={barX}
                y={barY}
                width={3}
                height={barHeight}
                fill={ordinalColorScale(d.order)}
                className="test-bar-class"
                onMouseOver={()=>{

                }}
                onClick={() => {
                  if (!events) return;
                  const solver = useSolver.getState().solvers[from] as LTPSolver;
                  if (solver && 'toggleRayPathHighlight' in solver) {
                    (solver as ImageSourceSolver | BeamTraceSolver).toggleRayPathHighlight(d.uuid);
                  }
                }}
              />
            );
          })}
        </Group>
      )}
      <AxisBottom {...{scale: xScale, top: scaleHeight, left: scalePadding, label: "Time (s)" }} />
      <AxisLeft {...{scale: yScale, left: scalePadding, label: chartMode === 'etc' ? "Energy (dB)" : "Sound Pressure Level (dB re: 20uPa)" }} />
    </svg>
    )

}


export const LTPChart = ({ uuid, width = 400, height = 300, events = false }: LTPChartProps) => {

  const {name, info, from} = useResult(useShallow(state=>pickProps(["name", "info", "from"], state.results[uuid] as Result<ResultKind.LevelTimeProgression>)));
  const solver = useSolver(state => state.solvers[from] as LTPSolver | undefined);
  const frequencies = solver?.frequencies ?? [125, 250, 500, 1000, 2000, 4000, 8000];
  const solverKind = solver?.kind;

  const [orderRange, setOrderRange] = useState<number[]>([0, info.maxOrder]);
  const [order, setMaxOrder] = useState(info.maxOrder);
  const [chartMode, setChartMode] = useState<ChartMode>('ltp');
  const [yRange, setYRange] = useState<YRange>('auto');

  const plotOrders = useMemo(
    () => Array.from({ length: orderRange[1] - orderRange[0] + 1 }, (_, i) => orderRange[0] + i),
    [orderRange]
  );

  useEffect(() => {
    return on("UPDATE_RESULT", (e) => {
      if (e.uuid === uuid) {
        //@ts-ignore
        const newMaxOrder = e.result.info.maxOrder;
        setMaxOrder(newMaxOrder);
        setOrderRange(prev => [prev[0], Math.max(prev[1], newMaxOrder)]);
      }
    });
  }, [uuid]);

  useEffect(() => {
    const unsubImage = on("IMAGESOURCE_SET_PROPERTY", (e) => {
      if (e.uuid === from && e.property === "plotOrders") {
        const orders = e.value as number[];
        if (orders.length > 0) {
          setOrderRange([Math.min(...orders), Math.max(...orders)]);
        }
      }
    });
    const unsubBeam = on("BEAMTRACE_SET_PROPERTY", (e) => {
      if (e.uuid === from && e.property === "plotOrders") {
        const orders = e.value as number[];
        if (orders.length > 0) {
          setOrderRange([Math.min(...orders), Math.max(...orders)]);
        }
      }
    });
    return () => { unsubImage(); unsubBeam(); };
  }, [from]);

  const handleOrderRangeChange = (_event: Event, newValue: number | number[]) => {
    const val = newValue as number[];
    setOrderRange(val);
    const newPlotOrders = Array.from({ length: val[1] - val[0] + 1 }, (_, i) => val[0] + i);
    const eventType = solverKind === "beam-trace" ? "BEAMTRACE_SET_PROPERTY" : "IMAGESOURCE_SET_PROPERTY";
    emit(eventType, { uuid: from, property: "plotOrders", value: newPlotOrders });
  };

  const handleFrequencyChange = (event) => {
    const eventType = solverKind === "beam-trace" ? "BEAMTRACE_SET_PROPERTY" : "IMAGESOURCE_SET_PROPERTY";
    emit(eventType, { uuid: from, property: "plotFrequency", value: event.target.value });
  };

  return width < 10 ? null : (
    <Box sx={verticalContainerSx}>
      <Typography sx={titleSx}>{name}</Typography>
      <Box sx={toolbarSx}>
        <ToggleButtonGroup
          value={chartMode}
          exclusive
          onChange={(_e, val) => { if (val) setChartMode(val); }}
          size="small"
        >
          <ToggleButton value="ltp">LTP</ToggleButton>
          <ToggleButton value="etc">ETC</ToggleButton>
        </ToggleButtonGroup>
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>Orders</Typography>
        <Slider
          value={orderRange}
          onChange={handleOrderRangeChange}
          min={0}
          max={order}
          marks
          valueLabelDisplay="auto"
          disableSwap
          sx={{ minWidth: 200, maxWidth: 300 }}
        />
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>Y Range</Typography>
        <FormControl size="small">
          <Select
            value={yRange}
            onChange={(e) => setYRange(e.target.value as YRange)}
            sx={{ bgcolor: 'background.paper', minWidth: 90 }}
          >
            <MenuItem value="auto">Auto</MenuItem>
            <MenuItem value={10}>10 dB</MenuItem>
            <MenuItem value={20}>20 dB</MenuItem>
            <MenuItem value={30}>30 dB</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>Octave Band</Typography>
        <FormControl size="small">
          <Select
            value={info.frequency[0]}
            onChange={handleFrequencyChange}
            sx={{ bgcolor: 'background.paper', minWidth: 100 }}
          >
            {frequencies.map((f) => (
              <MenuItem key={f} value={f}>{f} Hz</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={graphContainerSx}>
        <ParentSize debounceTime={10}>
          {({ width })=><Chart {...{ width, height, uuid, events, plotOrders, solverKind, chartMode, yRange }} />}
        </ParentSize>
      </Box>
    </Box>
  );
}

export default LTPChart