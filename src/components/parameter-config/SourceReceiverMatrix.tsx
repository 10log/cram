import React, { memo, useMemo, useCallback } from "react";
import styled from "styled-components";
import { useContainer } from "../../store";
import { useSolverProperty } from "./SolverComponents";
import RayTracer from "../../compute/raytracer";

const MatrixContainer = styled.div<{ $disabled?: boolean }>`
  padding: 4px 8px;
  overflow-x: auto;
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.$disabled ? "none" : "auto")};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
`;

const HeaderCell = styled.th`
  padding: 4px 6px;
  text-align: center;
  font-weight: 500;
  color: #1c2127;
  border-bottom: 1px solid #e1e4e8;
  white-space: nowrap;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RowHeaderCell = styled.td`
  padding: 4px 6px;
  font-weight: 500;
  color: #1c2127;
  border-right: 1px solid #e1e4e8;
  white-space: nowrap;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DataCell = styled.td`
  padding: 4px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 14px;
  height: 14px;
  cursor: pointer;
  accent-color: #2d72d2;
`;

const EmptyMessage = styled.div`
  padding: 12px 8px;
  font-size: 11px;
  color: #8c959f;
  font-style: italic;
  text-align: center;
`;

const CornerCell = styled.th`
  padding: 4px 6px;
  text-align: right;
  font-weight: 400;
  font-size: 10px;
  color: #656d76;
  border-bottom: 1px solid #e1e4e8;
  border-right: 1px solid #e1e4e8;
`;

interface SourceReceiverMatrixProps {
  uuid: string;
  disabled?: boolean;
  eventType?: "RAYTRACER_SET_PROPERTY" | "IMAGESOURCE_SET_PROPERTY" | "BEAMTRACE_SET_PROPERTY";
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
    return <EmptyMessage>Add sources and receivers to configure pairs</EmptyMessage>;
  }

  if (sources.length === 0) {
    return <EmptyMessage>Add sources to configure pairs</EmptyMessage>;
  }

  if (receivers.length === 0) {
    return <EmptyMessage>Add receivers to configure pairs</EmptyMessage>;
  }

  return (
    <MatrixContainer $disabled={disabled}>
      <Table>
        <thead>
          <tr>
            <CornerCell>Src \ Rec</CornerCell>
            {receivers.map(rec => (
              <HeaderCell key={rec.uuid} title={rec.name}>
                {rec.name}
              </HeaderCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {sources.map(src => (
            <tr key={src.uuid}>
              <RowHeaderCell title={src.name}>{src.name}</RowHeaderCell>
              {receivers.map(rec => (
                <DataCell key={`${src.uuid}-${rec.uuid}`}>
                  <Checkbox
                    checked={isPairSelected(src.uuid, rec.uuid)}
                    onChange={(e) => togglePair(src.uuid, rec.uuid, e.target.checked)}
                    title={`${src.name} → ${rec.name}`}
                  />
                </DataCell>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </MatrixContainer>
  );
});

export default SourceReceiverMatrix;
