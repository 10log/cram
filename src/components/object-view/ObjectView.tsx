// @ts-nocheck
import React, { memo, useCallback, useEffect, useState } from "react";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItemLabel from "../tree-item-label/TreeItemLabel";
import properCase from "../../common/proper-case";
import Container from "../../objects/container";
import ContextMenu from "../ContextMenu";
import { NodesIcon, RoomIcon, SourceIcon, ReceiverIcon } from "../icons";
import { emit, on } from "../../messenger";
import { useContainer } from "../../store";
import { pickProps } from "../../common/helpers";
import { useShallow } from "zustand/react/shallow";
import type { SxProps, Theme } from "@mui/material/styles";

type ClickEvent = React.MouseEvent<HTMLElement, MouseEvent>;

export interface MapChildrenProps {
  parent: string;
  container: Container;
  expanded: string[];
  setExpanded: (value: React.SetStateAction<string[]>) => void;
}

// Extracted sx constants for TreeView styling
const TREE_VIEW_SX: SxProps<Theme> = {
  flexGrow: 1,
  '& .MuiTreeItem-content': {
    py: 0.25,
  },
  '& .MuiTreeItem-content.Mui-selected': {
    bgcolor: 'transparent',
  },
  '& .MuiTreeItem-content.Mui-selected:hover': {
    bgcolor: 'transparent',
  },
  '& .MuiTreeItem-content.Mui-selected.Mui-focused': {
    bgcolor: 'transparent',
  },
  '& .MuiTreeItem-content.Mui-focused': {
    bgcolor: 'transparent',
  },
  '& .MuiTreeItem-content:hover': {
    bgcolor: 'action.hover',
  },
  '& .MuiTreeItem-iconContainer': {
    width: 'auto',
  },
  '& .MuiTreeItem-group': {
    ml: 1.75,
  },
} as const;

const SELECTED_CONTENT_SX: SxProps<Theme> = {
  bgcolor: 'action.selected',
  borderRadius: 0.5,
} as const;

const MapChildren = memo(function MapChildren(props: MapChildrenProps) {
  const { container, expanded, setExpanded, parent } = props;
  const [selected, setSelected] = useState(container.selected);
  const [name, setName] = useState(container.name);
  const draggable = true;
  const key = container.uuid;
  const itemId = container.uuid;
  const meta = properCase(container["kind"]);
  const genericLabel = name || "untitled";

  const onClick = useCallback((e: ClickEvent) => {
    if (container["kind"] !== "room") {
      emit(e.shiftKey ? "APPEND_SELECTION" : "SET_SELECTION", [container]);
    }
  }, [container]);

  useEffect(() => {
    return on("APPEND_SELECTION", (containers) => {
      if (containers.includes(container)) {
        setSelected(true);
      }
    });
  }, [container]);

  useEffect(() => {
    return on("SET_SELECTION", (containers) => {
      setSelected(containers.includes(container));
    });
  }, [container]);

  const event = `${container.kind.toUpperCase()}_SET_PROPERTY` as "SOURCE_SET_PROPERTY";
  useEffect(() => {
    return on(event, ({ uuid, property, value }) => {
      if (uuid === container.uuid && property === "name") {
        setName(value as string);
      }
    });
  }, [container.uuid, event]);

  const label = <TreeItemLabel label={genericLabel} meta={meta} />;
  const roomLabel = <TreeItemLabel icon={<RoomIcon fontSize="inherit" />} label={genericLabel} meta={meta} />;

  const handleMenuItemClick = (e) => {
    if (e.target.textContent) {
      switch (e.target.textContent) {
        case "Delete": {
          const newExpanded = new Set(expanded);
          container.traverse((object: Container) => {
            if (newExpanded.has(object.uuid)) {
              newExpanded.delete(object.uuid);
            }
          });
          emit("DESELECT_ALL_OBJECTS");
          setExpanded([...newExpanded]);
          const toDelete = [] as string[];
          container.traverse((object: Container) => {
            if (object["kind"] && ["surface", "source", "receiver", "room"].includes(object["kind"])) {
              toDelete.push(object.uuid);
            }
          });
          emit("REMOVE_CONTAINERS", toDelete);
        } break;
        case "Log to Console": console.log(container); break;
        default: break;
      }
    }
  };
  const menuItems = ["Delete", "Log to Console"];
  const onKeyDown = (e) => {
    e.preventDefault();
  };

  if (container.parent?.uuid !== parent) {
    return <></>;
  }

  // Create labels with icons for leaf items
  const surfaceLabel = <TreeItemLabel icon={<NodesIcon fontSize="inherit" />} label={genericLabel} meta={meta} />;
  const sourceLabel = <TreeItemLabel icon={<SourceIcon fontSize="inherit" />} label={genericLabel} meta={meta} />;
  const receiverLabel = <TreeItemLabel icon={<ReceiverIcon fontSize="inherit" />} label={genericLabel} meta={meta} />;

  // slotProps for selectable leaf items - apply selected styling via sx
  const selectableContentProps = {
    onClick,
    sx: selected ? SELECTED_CONTENT_SX : undefined,
  };

  switch (container["kind"]) {
    case "surface":
      return (
        <ContextMenu key={key + "context-menu"} handleMenuItemClick={handleMenuItemClick} items={menuItems}>
          <TreeItem
            label={surfaceLabel}
            slotProps={{ content: selectableContentProps }}
            draggable={draggable}
            itemId={itemId}
          />
        </ContextMenu>
      );

    case "source":
      return (
        <ContextMenu key={key + "context-menu"} handleMenuItemClick={handleMenuItemClick} items={menuItems}>
          <TreeItem
            label={sourceLabel}
            slotProps={{ content: selectableContentProps }}
            draggable={draggable}
            itemId={itemId}
          />
        </ContextMenu>
      );
    case "receiver":
      return (
        <ContextMenu key={key + "context-menu"} handleMenuItemClick={handleMenuItemClick} items={menuItems}>
          <TreeItem
            label={receiverLabel}
            slotProps={{ content: selectableContentProps }}
            draggable={draggable}
            itemId={itemId}
          />
        </ContextMenu>
      );

    case "room":
      return (
        <ContextMenu key={key + "context-menu"} handleMenuItemClick={handleMenuItemClick} items={menuItems}>
          <TreeItem
            label={roomLabel}
            slots={{ collapseIcon: ExpandMoreIcon, expandIcon: ChevronRightIcon }}
            onKeyDown={onKeyDown}
            draggable={draggable}
            itemId={itemId}
          >
            {(container.children.filter(x => x instanceof Container && x.parent?.uuid === container.uuid) as Container[]).map((x) => (
              <MapChildren
                parent={container.uuid}
                container={x}
                expanded={expanded}
                setExpanded={setExpanded}
                key={x.uuid + "-map-children"}
              />
            ))}
          </TreeItem>
        </ContextMenu>
      );

    case "container":
      return (
        <ContextMenu key={key + "context-menu"} handleMenuItemClick={handleMenuItemClick} items={menuItems}>
          <TreeItem
            label={label}
            slots={{ collapseIcon: ExpandMoreIcon, expandIcon: ChevronRightIcon }}
            onKeyDown={onKeyDown}
            draggable={draggable}
            itemId={itemId}
          >
            {(container.children.filter(x => x instanceof Container && x.parent?.uuid === container.uuid) as Container[]).map((x) => (
              <MapChildren
                parent={container.uuid}
                container={x}
                expanded={expanded}
                setExpanded={setExpanded}
                key={x.uuid + "-map-children"}
              />
            ))}
          </TreeItem>
        </ContextMenu>
      );
    default:
      return <></>;
  }
});

export default function ObjectView() {
  const { containers, getWorkspace } = useContainer(useShallow(state => pickProps(["containers", "getWorkspace"], state)));
  const [expanded, setExpanded] = useState(["containers"]);

  const isEmpty = Object.keys(containers).length === 0;
  const label = (
    <TreeItemLabel
      label={
        <span style={{ fontWeight: 400, color: isEmpty ? 'var(--mui-palette-text-disabled)' : 'var(--mui-palette-text-primary)' }}>
          Objects
        </span>
      }
    />
  );
  const keys = Object.keys(containers);
  const workspace = getWorkspace();

  if (!workspace) {
    return <></>;
  }

  return (
    <SimpleTreeView
      expandedItems={expanded}
      onExpandedItemsChange={(event, itemIds) => setExpanded(itemIds)}
      disableSelection
      sx={TREE_VIEW_SX}
    >
      <TreeItem
        label={label}
        slots={{ collapseIcon: ExpandMoreIcon, expandIcon: ChevronRightIcon }}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        itemId="containers"
      >
        {keys.map((x: string) => (
          <MapChildren
            parent={workspace ? workspace.uuid : ""}
            container={containers[x]}
            expanded={expanded}
            setExpanded={setExpanded}
            key={containers[x].uuid + "tree-item-container"}
          />
        ))}
      </TreeItem>
    </SimpleTreeView>
  );
}
