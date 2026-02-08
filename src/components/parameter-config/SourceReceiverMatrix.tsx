import React, { memo, useMemo, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";
import { useContainer } from "../../store";
import { useSolverProperty } from "./SolverComponents";
import RayTracer from "../../compute/raytracer";

const matrixContainerSx = (disabled: boolean): SxProps<Theme> => ({
  p: "4px 8px",
  overflowX: "auto",
  opacity: disabled ? 0.5 : 1,
  pointerEvents: disabled ? "none" : "auto",
});

const tableSx: SxProps<Theme> = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 11,
  "& th, & td": {
    p: "4px 6px",
    transition: "background-color 0.1s",
  },
};

const headerCellSx: SxProps<Theme> = {
  textAlign: "center",
  fontWeight: 500,
  color: "text.primary",
  borderBottom: "1px solid",
  borderColor: "divider",
  whiteSpace: "nowrap",
  maxWidth: 80,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const rowHeaderCellSx: SxProps<Theme> = {
  fontWeight: 500,
  color: "text.primary",
  borderRight: "1px solid",
  borderColor: "divider",
  whiteSpace: "nowrap",
  maxWidth: 80,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const dataCellSx: SxProps<Theme> = {
  textAlign: "center",
  cursor: "pointer",
  userSelect: "none",
  borderBottom: "1px solid",
  borderColor: "action.hover",
};

const highlightBgSx: SxProps<Theme> = {
  bgcolor: "action.hover",
};

const cornerCellSx: SxProps<Theme> = {
  textAlign: "right",
  fontWeight: 400,
  fontSize: 10,
  color: "text.disabled",
  borderBottom: "1px solid",
  borderRight: "1px solid",
  borderColor: "divider",
};

const emptyMessageSx: SxProps<Theme> = {
  p: "12px 8px",
  fontSize: 11,
  color: "text.disabled",
  fontStyle: "italic",
  textAlign: "center",
};

const checkMarkSx: SxProps<Theme> = {
  fontSize: 14,
  fontWeight: 700,
  color: "primary.main",
  lineHeight: 1,
};

const emptyMarkSx: SxProps<Theme> = {
  fontSize: 14,
  fontWeight: 400,
  color: "text.disabled",
  lineHeight: 1,
};

interface SourceReceiverMatrixProps {
  uuid: string;
  disabled?: boolean;
  eventType?: "RAYTRACER_SET_PROPERTY" | "IMAGESOURCE_SET_PROPERTY" | "BEAMTRACE_SET_PROPERTY" | "ART_SET_PROPERTY";
}

export const SourceReceiverMatrix = memo(({ uuid, disabled = false, eventType = "RAYTRACER_SET_PROPERTY" }: SourceReceiverMatrixProps) => {
  const containers = useContainer((state) => state.containers);
  const version = useContainer((state) => state.version);
  const [hoverCell, setHoverCell] = useState<{ row: number; col: number } | null>(null);

  const sources = useMemo(() => {
    return Object.values(containers)
      .filter(c => c.kind === "source")
      .map(c => ({ uuid: c.uuid, name: c.name }));
  }, [containers, version]);

  const receivers = useMemo(() => {
    return Object.values(containers)
      .filter(c => c.kind === "receiver")
      .map(c => ({ uuid: c.uuid, name: c.name }));
  }, [containers, version]);

  const [sourceIDsRaw, setSourceIDs] = useSolverProperty<RayTracer, "sourceIDs">(
    uuid,
    "sourceIDs",
    eventType
  );

  const [receiverIDsRaw, setReceiverIDs] = useSolverProperty<RayTracer, "receiverIDs">(
    uuid,
    "receiverIDs",
    eventType
  );

  const sourceIDs = sourceIDsRaw || [];
  const receiverIDs = receiverIDsRaw || [];

  const isPairSelected = useCallback((sourceId: string, receiverId: string) => {
    return sourceIDs.includes(sourceId) && receiverIDs.includes(receiverId);
  }, [sourceIDs, receiverIDs]);

  const togglePair = useCallback((sourceId: string, receiverId: string) => {
    const selected = sourceIDs.includes(sourceId) && receiverIDs.includes(receiverId);

    if (!selected) {
      const newSourceIDs = sourceIDs.includes(sourceId) ? sourceIDs : [...sourceIDs, sourceId];
      const newReceiverIDs = receiverIDs.includes(receiverId) ? receiverIDs : [...receiverIDs, receiverId];

      if (newSourceIDs !== sourceIDs) {
        setSourceIDs({ value: newSourceIDs });
      }
      if (newReceiverIDs !== receiverIDs) {
        setReceiverIDs({ value: newReceiverIDs });
      }
    } else {
      if (receiverIDs.length === 1) {
        setSourceIDs({ value: sourceIDs.filter(id => id !== sourceId) });
      }
      if (sourceIDs.length === 1) {
        setReceiverIDs({ value: receiverIDs.filter(id => id !== receiverId) });
      }
    }
  }, [sourceIDs, receiverIDs, setSourceIDs, setReceiverIDs]);

  if (sources.length === 0 && receivers.length === 0) {
    return <Typography sx={emptyMessageSx}>Add sources and receivers to configure pairs</Typography>;
  }

  if (sources.length === 0) {
    return <Typography sx={emptyMessageSx}>Add sources to configure pairs</Typography>;
  }

  if (receivers.length === 0) {
    return <Typography sx={emptyMessageSx}>Add receivers to configure pairs</Typography>;
  }

  return (
    <Box sx={matrixContainerSx(disabled)}>
      <Box
        component="table"
        sx={tableSx}
        onMouseLeave={() => setHoverCell(null)}
      >
        <thead>
          <tr>
            <Box component="th" sx={cornerCellSx}>Src \ Rec</Box>
            {receivers.map((rec, colIdx) => (
              <Box
                component="th"
                key={rec.uuid}
                sx={hoverCell && hoverCell.col === colIdx
                  ? { ...headerCellSx, ...highlightBgSx }
                  : headerCellSx}
                title={rec.name}
              >
                {rec.name}
              </Box>
            ))}
          </tr>
        </thead>
        <tbody>
          {sources.map((src, rowIdx) => (
            <tr key={src.uuid}>
              <Box
                component="td"
                sx={hoverCell && hoverCell.row === rowIdx
                  ? { ...rowHeaderCellSx, ...highlightBgSx }
                  : rowHeaderCellSx}
                title={src.name}
              >
                {src.name}
              </Box>
              {receivers.map((rec, colIdx) => {
                const selected = isPairSelected(src.uuid, rec.uuid);
                const highlighted = hoverCell && (hoverCell.row === rowIdx || hoverCell.col === colIdx);
                return (
                  <Box
                    component="td"
                    key={`${src.uuid}-${rec.uuid}`}
                    sx={highlighted
                      ? { ...dataCellSx, ...highlightBgSx }
                      : dataCellSx}
                    onClick={() => togglePair(src.uuid, rec.uuid)}
                    onMouseEnter={() => setHoverCell({ row: rowIdx, col: colIdx })}
                    title={`${src.name} \u2192 ${rec.name}`}
                  >
                    <Typography component="span" sx={selected ? checkMarkSx : emptyMarkSx}>
                      {selected ? "\u2713" : "\u00B7"}
                    </Typography>
                  </Box>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Box>
    </Box>
  );
});

export default SourceReceiverMatrix;
