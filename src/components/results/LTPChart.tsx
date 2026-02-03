// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow';
import { Result, useResult, ResultKind } from '../../store/result-store';

import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Grid } from '@visx/grid';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  LegendOrdinal,
  LegendItem,
  LegendLabel,
} from '@visx/legend';
import { scaleOrdinal } from 'd3-scale';
import { pickProps, unique } from '../../common/helpers';
import { emit, on } from '../../messenger';
import chroma from 'chroma-js';
import { ImageSourceSolver } from '../../compute/raytracer/image-source';
import { BeamTraceSolver } from '../../compute/beam-trace';
import { useSolver } from '../../store';

// Type for solvers that can generate LTP results
type LTPSolver = ImageSourceSolver | BeamTraceSolver;
import PropertyRowCheckbox from "../parameter-config/property-row/PropertyRowCheckbox";
import PropertyRowLabel from '../parameter-config/property-row/PropertyRowLabel';
// accessors
const getTime = (d) => d.time;
const getPressure = (d) => d.pressure[0];

export type LTPChartProps = {
  uuid: string;
  width?: number;
  height?: number;
  events?: boolean;
  plotOrders?: number[];
  solverKind?: string;
};

const range = (start: number, stop: number) => [...Array(stop-start)].map((x,i) => start + i)
const colorScale = chroma.scale(['#ff8a0b', '#000080']).mode('lch');
const getOrderColors = (n: number) => colorScale.colors(n);

const legendGlyphSize = 12;

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

const legendContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  p: "0px 16px",
};

const frequencyContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  p: "16px 16px",
};

const graphContainerSx: SxProps<Theme> = {
  display: "flex",
  flex: 8,
  width: "80%",
};

const useUpdate = () => {
  const [updateCount, setUpdateCount] = useState<number>(0);
  return [updateCount, () => setUpdateCount(updateCount + 1)] as  [number, () => void];
}

const Chart = ({ uuid, width = 400, height = 200, events = false, plotOrders, solverKind }: LTPChartProps) => {
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
      () =>
        scaleLinear<number>({
          range: [scaleHeight, 0],
          domain: data && data.length > 0
            ? [Math.min(...data.map(getPressure))*0.75, Math.max(...data.map(getPressure))]
            : [0, 1],
        }),
      [scaleHeight, data],
    );

    const ordinalColorScale = useMemo(
      () => scaleOrdinal(
      range(0, info.maxOrder+1),
      getOrderColors(info.maxOrder+1)
    ),
      [info.maxOrder]
    );

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
      {/* <rect width={width} height={height} fill={"#fff"} rx={14} /> */}
      <Grid
        xScale={xScale}
        yScale={yScale}
        width={scaleWidth}
        height={scaleHeight}
        left={scalePadding}
        // numTicksRows={numTicksForHeight(height)}
        // numTicksColumns={numTicksForWidth(width)}
      />
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
              // stroke={"#ffff00"}
              // strokeWidth={1}
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
      <AxisBottom {...{scale: xScale, top: scaleHeight, left: scalePadding, label: "Time (s)" }} />
      <AxisLeft {...{scale: yScale, left: scalePadding, label: "Sound Pressure Level (dB re: 20uPa)" }} />
    </svg>
    )

}


export const LTPChart = ({ uuid, width = 400, height = 300, events = false }: LTPChartProps) => {

  const {name, info, from} = useResult(useShallow(state=>pickProps(["name", "info", "from"], state.results[uuid] as Result<ResultKind.LevelTimeProgression>)));
  const solver = useSolver(state => state.solvers[from] as LTPSolver | undefined);
  const initialPlotOrders = solver?.plotOrders ?? [];
  const frequencies = solver?.frequencies ?? [125, 250, 500, 1000, 2000, 4000, 8000];
  const solverKind = solver?.kind;

  const [plotOrders, setPlotOrders] = useState(initialPlotOrders);
  const [order, setMaxOrder] = useState(info.maxOrder);

  useEffect(() => {
    return on("UPDATE_RESULT", (e) => {
      if (e.uuid === uuid) {
        //@ts-ignore
        const newMaxOrder = e.result.info.maxOrder;
        setMaxOrder(newMaxOrder);
        // Auto-show all orders when maxOrder changes (new orders are added)
        const allOrders = Array.from({ length: newMaxOrder + 1 }, (_, i) => i);
        setPlotOrders(allOrders);
      }
    });
  }, [uuid]);

  useEffect(() => {
    const unsubImage = on("IMAGESOURCE_SET_PROPERTY", (e) => {
      if (e.uuid === from && e.property === "plotOrders") {
        setPlotOrders(e.value as number[]);
      }
    });
    const unsubBeam = on("BEAMTRACE_SET_PROPERTY", (e) => {
      if (e.uuid === from && e.property === "plotOrders") {
        setPlotOrders(e.value as number[]);
      }
    });
    return () => { unsubImage(); unsubBeam(); };
  }, [from]);  

  const ordinalColorScale = useMemo(
    () => scaleOrdinal(
    range(0, order+1),
    getOrderColors(order+1)
  ),
    [order]
  );


  // const {from} = useResult(state=>pickProps(["from"], state.results[uuid] as Result<ResultKind.LevelTimeProgression>));
  // let imagesourcesolver = useSolver.getState().solvers[from] as ImageSourceSolver;

  // const { PropertyTextInput, PropertyNumberInput, PropertyCheckboxInput } = createPropertyInputs<ImageSourceSolver>(
    // "IMAGESOURCE_SET_PROPERTY"
  // );

  return width < 10 ? null : (
    <Box sx={verticalContainerSx}>
      <Typography sx={titleSx}>{name}</Typography>
    <Box sx={horizontalContainerSx}>
      <Box sx={graphContainerSx}>
        <ParentSize debounceTime={10}>
          {({ width })=><Chart {...{ width, height, uuid, events, plotOrders, solverKind }} />}
        </ParentSize>
      </Box>
      <Box sx={verticalContainerSx}>
        <LegendOrdinal scale={ordinalColorScale} labelFormat={label => `Order ${label}`}>
            {labels => (
              <Box sx={legendContainerSx}>
                {labels.map((label, i) => (
                  <LegendItem
                    key={`legend-quantile-${i}`}
                    margin="0 5px"
                    onClick={() => {
                      //if (events) alert(`clicked: ${JSON.stringify(label)}`);
                    }}
                  >
                    <svg width={legendGlyphSize} height={legendGlyphSize}>
                      <rect fill={label.value} width={legendGlyphSize} height={legendGlyphSize} />
                    </svg>
                    <LegendLabel align="left" margin="0 0 0 4px">
                      {label.text}
                    </LegendLabel>
                    <PropertyRowCheckbox
                      value={plotOrders.includes(label.datum)}
                      onChange={(e) =>
                        {
                          const newPlotOrders = e.value ? unique([...plotOrders, label.datum]) : plotOrders.reduce((acc, curr) => curr === label.datum ? acc : [...acc, curr], []);
                          const eventType = solverKind === "beam-trace" ? "BEAMTRACE_SET_PROPERTY" : "IMAGESOURCE_SET_PROPERTY";
                          emit(eventType, { uuid: from, property: "plotOrders", value: newPlotOrders })
                        }
                      }
                    />
                  </LegendItem>
                ))}
              </Box>
            )}
          </LegendOrdinal>
          <Box sx={frequencyContainerSx}>
            <Typography sx={titleSx}><b>Octave Band (Hz)</b></Typography>
            <Box sx={legendContainerSx}>
              {frequencies.map((f)=>(
                <LegendItem
                  key={`freq-control-${f}`}
                  margin="0 5px"
                  onClick={() => {
                    //if (events) alert(`clicked: ${JSON.stringify(label)}`);
                }}>
                  <PropertyRowLabel
                    label={f.toString()}
                  />
                  <PropertyRowCheckbox
                    value={(f)===(info.frequency[0])}
                    onChange = {(_e) => {
                      const eventType = solverKind === "beam-trace" ? "BEAMTRACE_SET_PROPERTY" : "IMAGESOURCE_SET_PROPERTY";
                      emit(eventType, { uuid: from, property: "plotFrequency", value: f })
                    }}
                  />
                </LegendItem>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LTPChart