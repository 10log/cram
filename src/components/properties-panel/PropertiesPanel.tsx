/**
 * PropertiesPanel - MUI-based properties panel following CAD application patterns
 *
 * Design principles:
 * - Flat section structure (no nested tree views beyond top level)
 * - Accordion sections for Objects and Solvers
 * - Compact property rows with label-input layout
 * - MUI theming throughout
 */

import React, { useMemo, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import type { SxProps, Theme } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import { useShallow } from "zustand/react/shallow";

// Icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HomeIcon from "@mui/icons-material/Home";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import SensorsIcon from "@mui/icons-material/Sensors";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import SettingsIcon from "@mui/icons-material/Settings";

// Store hooks
import { useContainer } from "../../store";
import { useSolver } from "../../store/solver-store";
import { useAppStore } from "../../store/app-store";
import { emit, postMessage } from "../../messenger";

// Existing property tabs (reuse for now)
import SourceTab from "../parameter-config/SourceTab";
import ReceiverTab from "../parameter-config/ReceiverTab";
import RoomTab from "../parameter-config/RoomTab";
import RayTracerTab from "../parameter-config/RayTracerTab";
import ImageSourceTab from "../parameter-config/image-source-tab/ImageSourceTab";
import RT60Tab from "../parameter-config/RT60Tab";
import EnergyDecayTab from "../parameter-config/EnergyDecayTab";
import BeamTraceTab from "../parameter-config/BeamTraceTab";
import FDTD_2DTab from "../parameter-config/FDTD_2DTab";
import ARTTab from "../parameter-config/ARTTab";

// ============================================================================
// ANIMATIONS
// ============================================================================

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// ============================================================================
// STYLES
// ============================================================================

const panelContainerSx: SxProps<Theme> = {
  height: "100%",
  overflow: "auto",
  bgcolor: "background.paper",
};

const accordionSx: SxProps<Theme> = {
  "&:before": { display: "none" },
  boxShadow: "none",
  "&.Mui-expanded": { margin: 0 },
};

const accordionSummarySx: SxProps<Theme> = {
  minHeight: 36,
  px: 1.5,
  bgcolor: "grey.100",
  "&.Mui-expanded": { minHeight: 36 },
  "& .MuiAccordionSummary-content": {
    my: 0,
    alignItems: "center",
    gap: 1,
  },
};

const accordionDetailsSx: SxProps<Theme> = {
  p: 0,
};

const listItemSx: SxProps<Theme> = {
  py: 0.25,
  px: 1,
  "&.Mui-selected": {
    bgcolor: "primary.light",
    "&:hover": { bgcolor: "primary.light" },
  },
};

const categoryHeaderSx: SxProps<Theme> = {
  py: 0.5,
  px: 1.5,
  bgcolor: "grey.50",
  borderBottom: 1,
  borderColor: "divider",
};

const emptyStateSx: SxProps<Theme> = {
  py: 3,
  px: 2,
  textAlign: "center",
};

const propertiesContainerSx: SxProps<Theme> = {
  p: 1,
  "& > *": {
    mb: 0.5,
  },
};

const autoCalcButtonSx = (active: boolean, calculating: boolean): SxProps<Theme> => ({
  width: 24,
  height: 24,
  ml: 0.5,
  bgcolor: active ? "primary.main" : "transparent",
  color: active ? "primary.contrastText" : "text.secondary",
  "&:hover": {
    bgcolor: active ? "primary.dark" : "action.hover",
  },
  "& svg": {
    fontSize: 16,
    animation: calculating ? `${spin} 1s linear infinite` : "none",
  },
});

// ============================================================================
// TYPE ICONS
// ============================================================================

const typeIcons: Record<string, React.ReactNode> = {
  room: <HomeIcon fontSize="small" />,
  source: <GraphicEqIcon fontSize="small" />,
  receiver: <SensorsIcon fontSize="small" />,
  solver: <ViewInArIcon fontSize="small" />,
  renderer: <SettingsIcon fontSize="small" />,
};

// ============================================================================
// OBJECT ITEM COMPONENT
// ============================================================================

interface ObjectItemProps {
  uuid: string;
  name: string;
  type: string;
  visible: boolean;
  selected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
}

function ObjectItem({ uuid, name, type, visible, selected, onSelect, onToggleVisibility, onDelete }: ObjectItemProps) {
  return (
    <ListItem
      disablePadding
      sx={listItemSx}
      selected={selected}
      secondaryAction={
        <Box sx={{ display: "flex", gap: 0.25 }}>
          <IconButton size="small" onClick={onToggleVisibility} sx={{ p: 0.25 }}>
            {visible ? <VisibilityIcon sx={{ fontSize: 16 }} /> : <VisibilityOffIcon sx={{ fontSize: 16 }} />}
          </IconButton>
          <IconButton size="small" onClick={onDelete} sx={{ p: 0.25 }}>
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      }
    >
      <ListItemButton onClick={onSelect} dense sx={{ py: 0.25 }}>
        <ListItemIcon sx={{ minWidth: 28 }}>
          {typeIcons[type] || <ViewInArIcon fontSize="small" />}
        </ListItemIcon>
        <ListItemText
          primary={name}
          primaryTypographyProps={{ fontSize: "0.75rem", noWrap: true }}
        />
      </ListItemButton>
    </ListItem>
  );
}

// ============================================================================
// SOLVER ITEM COMPONENT
// ============================================================================

interface SolverItemProps {
  uuid: string;
  name: string;
  type: string;
  selected: boolean;
  onSelect: () => void;
  onRun: () => void;
  onDelete: () => void;
}

function SolverItem({ uuid, name, type, selected, onSelect, onRun, onDelete }: SolverItemProps) {
  return (
    <ListItem
      disablePadding
      sx={listItemSx}
      selected={selected}
      secondaryAction={
        <Box sx={{ display: "flex", gap: 0.25 }}>
          <IconButton size="small" onClick={onRun} color="primary" sx={{ p: 0.25 }}>
            <PlayArrowIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton size="small" onClick={onDelete} sx={{ p: 0.25 }}>
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      }
    >
      <ListItemButton onClick={onSelect} dense sx={{ py: 0.25 }}>
        <ListItemIcon sx={{ minWidth: 28 }}>
          {typeIcons.solver}
        </ListItemIcon>
        <ListItemText
          primary={name}
          secondary={type}
          primaryTypographyProps={{ fontSize: "0.75rem", noWrap: true }}
          secondaryTypographyProps={{ fontSize: "0.625rem" }}
        />
      </ListItemButton>
    </ListItem>
  );
}

// ============================================================================
// RENDERER ITEM COMPONENT
// ============================================================================

interface RendererItemProps {
  selected: boolean;
  onSelect: () => void;
}

function RendererItem({ selected, onSelect }: RendererItemProps) {
  return (
    <ListItem disablePadding sx={listItemSx} selected={selected}>
      <ListItemButton onClick={onSelect} dense sx={{ py: 0.25 }}>
        <ListItemIcon sx={{ minWidth: 28 }}>
          {typeIcons.renderer}
        </ListItemIcon>
        <ListItemText
          primary="Renderer"
          secondary="Display settings"
          primaryTypographyProps={{ fontSize: "0.75rem" }}
          secondaryTypographyProps={{ fontSize: "0.625rem" }}
        />
      </ListItemButton>
    </ListItem>
  );
}

// ============================================================================
// SOLVER PROPERTIES MAPPING
// ============================================================================

const SolverTabMap: Record<string, React.ComponentType<{ uuid: string }>> = {
  "ray-tracer": RayTracerTab,
  "image-source": ImageSourceTab,
  "rt60": RT60Tab,
  "energy-decay": EnergyDecayTab,
  "beam-trace": BeamTraceTab,
  "fdtd-2d": FDTD_2DTab,
  "art": ARTTab,
};

// ============================================================================
// MAIN PANEL COMPONENT
// ============================================================================

export function PropertiesPanel() {
  // Selection state
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [selectedSolverId, setSelectedSolverId] = useState<string | null>(null);
  const [showRenderer, setShowRenderer] = useState(false);

  // Store data
  const containers = useContainer(useShallow((state) => state.containers));
  const solversData = useSolver((state) => state.solvers);
  const autoCalculate = useAppStore((state) => state.autoCalculate);
  const progressVisible = useAppStore((state) => state.progress.visible);

  // Group objects by type
  const objectsByKind = useMemo(() => {
    const result = {
      rooms: [] as { uuid: string; name: string; visible: boolean }[],
      sources: [] as { uuid: string; name: string; visible: boolean }[],
      receivers: [] as { uuid: string; name: string; visible: boolean }[],
    };

    Object.keys(containers).forEach((uuid) => {
      const container = containers[uuid];
      const item = { uuid, name: container.name || uuid.slice(0, 8), visible: container.visible !== false };

      switch (container.kind) {
        case "room":
          result.rooms.push(item);
          break;
        case "source":
          result.sources.push(item);
          break;
        case "receiver":
          result.receivers.push(item);
          break;
      }
    });

    return result;
  }, [containers]);

  // Solver list
  const solverList = useMemo(() => {
    return Object.keys(solversData).map((uuid) => ({
      uuid,
      name: solversData[uuid].name || uuid.slice(0, 8),
      type: solversData[uuid].kind || "Unknown",
    }));
  }, [solversData]);

  const objectCount = objectsByKind.rooms.length + objectsByKind.sources.length + objectsByKind.receivers.length;
  const solverCount = solverList.length + 1; // +1 for renderer

  // Handlers
  const handleSelectObject = useCallback((uuid: string) => {
    setSelectedObjectId(uuid);
    setSelectedSolverId(null);
    setShowRenderer(false);
    postMessage("SELECT_OBJECT", uuid);
  }, []);

  const handleToggleVisibility = useCallback((uuid: string) => {
    emit("TOGGLE_CONTAINER_VISIBLE", uuid);
  }, []);

  const handleDeleteObject = useCallback((uuid: string) => {
    emit("REMOVE_CONTAINER", uuid);
    if (selectedObjectId === uuid) setSelectedObjectId(null);
  }, [selectedObjectId]);

  const handleSelectSolver = useCallback((uuid: string) => {
    setSelectedSolverId(uuid);
    setSelectedObjectId(null);
    setShowRenderer(false);
  }, []);

  const handleRunSolver = useCallback((uuid: string) => {
    emit("RUN_SOLVER", uuid);
  }, []);

  const handleDeleteSolver = useCallback((uuid: string) => {
    emit("REMOVE_SOLVER", uuid);
    if (selectedSolverId === uuid) setSelectedSolverId(null);
  }, [selectedSolverId]);

  const handleSelectRenderer = useCallback(() => {
    setShowRenderer(true);
    setSelectedObjectId(null);
    setSelectedSolverId(null);
  }, []);

  const handleAutoCalcToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    emit("SET_AUTO_CALCULATE", !autoCalculate);
  }, [autoCalculate]);

  // Get selected item details
  const selectedObject = selectedObjectId ? containers[selectedObjectId] : null;
  const selectedSolver = selectedSolverId ? solversData[selectedSolverId] : null;

  // Render property panel for selected item
  const renderProperties = () => {
    if (selectedObject) {
      switch (selectedObject.kind) {
        case "source":
          return <SourceTab uuid={selectedObjectId!} />;
        case "receiver":
          return <ReceiverTab uuid={selectedObjectId!} />;
        case "room":
          return <RoomTab uuid={selectedObjectId!} />;
        default:
          return <Typography variant="body2" color="text.secondary">Unknown object type</Typography>;
      }
    }

    if (selectedSolver) {
      const SolverTab = SolverTabMap[selectedSolver.kind];
      if (SolverTab) {
        return <SolverTab uuid={selectedSolverId!} />;
      }
      return <Typography variant="body2" color="text.secondary">Unknown solver type: {selectedSolver.kind}</Typography>;
    }

    if (showRenderer) {
      return (
        <Box sx={{ p: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Renderer settings coming soon
          </Typography>
        </Box>
      );
    }

    return null;
  };

  const hasSelection = selectedObject || selectedSolver || showRenderer;

  return (
    <Box sx={panelContainerSx}>
      {/* OBJECTS SECTION */}
      <Accordion defaultExpanded disableGutters sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummarySx}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Objects</Typography>
          <Chip label={objectCount} size="small" sx={{ height: 18, fontSize: "0.625rem" }} />
        </AccordionSummary>
        <AccordionDetails sx={accordionDetailsSx}>
          {objectCount === 0 ? (
            <Box sx={emptyStateSx}>
              <Typography variant="body2" color="text.secondary" fontSize="0.75rem">
                No objects. Import a model or add from menu.
              </Typography>
            </Box>
          ) : (
            <List dense disablePadding>
              {/* Rooms */}
              {objectsByKind.rooms.length > 0 && (
                <>
                  <ListItem sx={categoryHeaderSx}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      ROOMS ({objectsByKind.rooms.length})
                    </Typography>
                  </ListItem>
                  {objectsByKind.rooms.map((obj) => (
                    <ObjectItem
                      key={obj.uuid}
                      uuid={obj.uuid}
                      name={obj.name}
                      type="room"
                      visible={obj.visible}
                      selected={selectedObjectId === obj.uuid}
                      onSelect={() => handleSelectObject(obj.uuid)}
                      onToggleVisibility={() => handleToggleVisibility(obj.uuid)}
                      onDelete={() => handleDeleteObject(obj.uuid)}
                    />
                  ))}
                </>
              )}

              {/* Sources */}
              {objectsByKind.sources.length > 0 && (
                <>
                  <ListItem sx={categoryHeaderSx}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      SOURCES ({objectsByKind.sources.length})
                    </Typography>
                  </ListItem>
                  {objectsByKind.sources.map((obj) => (
                    <ObjectItem
                      key={obj.uuid}
                      uuid={obj.uuid}
                      name={obj.name}
                      type="source"
                      visible={obj.visible}
                      selected={selectedObjectId === obj.uuid}
                      onSelect={() => handleSelectObject(obj.uuid)}
                      onToggleVisibility={() => handleToggleVisibility(obj.uuid)}
                      onDelete={() => handleDeleteObject(obj.uuid)}
                    />
                  ))}
                </>
              )}

              {/* Receivers */}
              {objectsByKind.receivers.length > 0 && (
                <>
                  <ListItem sx={categoryHeaderSx}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      RECEIVERS ({objectsByKind.receivers.length})
                    </Typography>
                  </ListItem>
                  {objectsByKind.receivers.map((obj) => (
                    <ObjectItem
                      key={obj.uuid}
                      uuid={obj.uuid}
                      name={obj.name}
                      type="receiver"
                      visible={obj.visible}
                      selected={selectedObjectId === obj.uuid}
                      onSelect={() => handleSelectObject(obj.uuid)}
                      onToggleVisibility={() => handleToggleVisibility(obj.uuid)}
                      onDelete={() => handleDeleteObject(obj.uuid)}
                    />
                  ))}
                </>
              )}
            </List>
          )}
        </AccordionDetails>
      </Accordion>

      <Divider />

      {/* SOLVERS SECTION */}
      <Accordion defaultExpanded disableGutters sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummarySx}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>Solvers</Typography>
          <Chip label={solverCount} size="small" sx={{ height: 18, fontSize: "0.625rem" }} />
          <Tooltip title={autoCalculate ? "Auto-calculate ON" : "Auto-calculate OFF"}>
            <IconButton
              size="small"
              onClick={handleAutoCalcToggle}
              sx={autoCalcButtonSx(autoCalculate, autoCalculate && progressVisible)}
            >
              <AutorenewIcon />
            </IconButton>
          </Tooltip>
        </AccordionSummary>
        <AccordionDetails sx={accordionDetailsSx}>
          <List dense disablePadding>
            {solverList.map((solver) => (
              <SolverItem
                key={solver.uuid}
                uuid={solver.uuid}
                name={solver.name}
                type={solver.type}
                selected={selectedSolverId === solver.uuid}
                onSelect={() => handleSelectSolver(solver.uuid)}
                onRun={() => handleRunSolver(solver.uuid)}
                onDelete={() => handleDeleteSolver(solver.uuid)}
              />
            ))}
            <RendererItem
              selected={showRenderer}
              onSelect={handleSelectRenderer}
            />
          </List>
        </AccordionDetails>
      </Accordion>

      {/* PROPERTIES SECTION - shown when something is selected */}
      {hasSelection && (
        <>
          <Divider />
          <Accordion defaultExpanded disableGutters sx={accordionSx}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummarySx}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                {selectedObject ? `${selectedObject.kind} Properties` : selectedSolver ? `${selectedSolver.kind} Settings` : "Renderer Settings"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Box sx={propertiesContainerSx}>
                {renderProperties()}
              </Box>
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Box>
  );
}

export default PropertiesPanel;
