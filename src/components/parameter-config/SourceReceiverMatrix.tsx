import React, { memo, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
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
  },
};

const headerCellSx: SxProps<Theme> = {
  textAlign: "center",
  fontWeight: 500,
  color: "#1c2127",
  borderBottom: "1px solid #e1e4e8",
  whiteSpace: "nowrap",
  maxWidth: 80,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const rowHeaderCellSx: SxProps<Theme> = {
  fontWeight: 500,
  color: "#1c2127",
  borderRight: "1px solid #e1e4e8",
  whiteSpace: "nowrap",
  maxWidth: 80,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const dataCellSx: SxProps<Theme> = {
  textAlign: "center",
  borderBottom: "1px solid #f0f0f0",
};

const cornerCellSx: SxProps<Theme> = {
  textAlign: "right",
  fontWeight: 400,
  fontSize: 10,
  color: "#656d76",
  borderBottom: "1px solid #e1e4e8",
  borderRight: "1px solid #e1e4e8",
};

const emptyMessageSx: SxProps<Theme> = {
  p: "12px 8px",
  fontSize: 11,
  color: "#8c959f",
  fontStyle: "italic",
  textAlign: "center",
};

const checkboxSx: SxProps<Theme> = {
  p: 0,
  width: 14,
  height: 14,
  "& .MuiSvgIcon-root": {
    fontSize: 18,
  },
};

interface SourceReceiverMatrixProps {
  uuid: string;
  disabled?: boolean;
  eventType?: "RAYTRACER_SET_PROPERTY" | "IMAGESOURCE_SET_PROPERTY" | "BEAMTRACE_SET_PROPERTY" | "ART_SET_PROPERTY";
}

export const SourceReceiverMatrix = memo(({ uuid, disabled = false, eventType = "RAYTRACER_SET_PROPERTY" }: SourceReceiverMatrixProps) => {
  const containers = useContainer((state) => state.containers);
  const version = useContainer((state) => state.version);

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

  // Provide defaults for undefined arrays
  const sourceIDs = sourceIDsRaw || [];
  const receiverIDs = receiverIDsRaw || [];

  // Check if a source-receiver pair is selected
  const isPairSelected = useCallback((sourceId: string, receiverId: string) => {
    return sourceIDs.includes(sourceId) && receiverIDs.includes(receiverId);
  }, [sourceIDs, receiverIDs]);

  // Toggle a source-receiver pair
  // Note: With the current data model, selecting a pair means adding the source to sourceIDs
  // and the receiver to receiverIDs. All combinations of sourceIDs × receiverIDs form pairs.
  // Unchecking removes the source/receiver only if no other pairs would be affected.
  const togglePair = useCallback((sourceId: string, receiverId: string, checked: boolean) => {
    if (checked) {
      // Add both source and receiver if not already present
      const newSourceIDs = sourceIDs.includes(sourceId) ? sourceIDs : [...sourceIDs, sourceId];
      const newReceiverIDs = receiverIDs.includes(receiverId) ? receiverIDs : [...receiverIDs, receiverId];

      if (newSourceIDs !== sourceIDs) {
        setSourceIDs({ value: newSourceIDs });
      }
      if (newReceiverIDs !== receiverIDs) {
        setReceiverIDs({ value: newReceiverIDs });
      }
    } else {
      // Remove the source if it only pairs with this one receiver
      if (receiverIDs.length === 1) {
        setSourceIDs({ value: sourceIDs.filter(id => id !== sourceId) });
      }

      // Remove the receiver if it only pairs with this one source
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
      <Box component="table" sx={tableSx}>
        <thead>
          <tr>
            <Box component="th" sx={cornerCellSx}>Src \ Rec</Box>
            {receivers.map(rec => (
              <Box component="th" key={rec.uuid} sx={headerCellSx} title={rec.name}>
                {rec.name}
              </Box>
            ))}
          </tr>
        </thead>
        <tbody>
          {sources.map(src => (
            <tr key={src.uuid}>
              <Box component="td" sx={rowHeaderCellSx} title={src.name}>{src.name}</Box>
              {receivers.map(rec => (
                <Box component="td" key={`${src.uuid}-${rec.uuid}`} sx={dataCellSx}>
                  <Checkbox
                    checked={isPairSelected(src.uuid, rec.uuid)}
                    onChange={(e) => togglePair(src.uuid, rec.uuid, e.target.checked)}
                    title={`${src.name} → ${rec.name}`}
                    sx={checkboxSx}
                    size="small"
                  />
                </Box>
              ))}
            </tr>
          ))}
        </tbody>
      </Box>
    </Box>
  );
});

export default SourceReceiverMatrix;
