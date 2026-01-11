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
import "./ObjectView.css";
import { emit, on } from "../../messenger";
import { useContainer } from "../../store";
import { pickProps } from "../../common/helpers";
import { useShallow } from "zustand/react/shallow";




type ClickEvent = React.MouseEvent<HTMLElement, MouseEvent>;

export interface MapChildrenProps {
  parent: string;
  container: Container;
  expanded: string[];
  setExpanded: (value: React.SetStateAction<string[]>) => void;
}

const MapChildren = memo(function MapChildren(props: MapChildrenProps) {
  const { container, expanded, setExpanded, parent } = props;
  const [selected, setSelected] = useState(container.selected);
  const [name, setName] = useState(container.name);
  const className = selected ? "container-selected" : "";
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

  const label = <TreeItemLabel {...{ label: genericLabel, meta }} />;
  const roomLabel = <TreeItemLabel icon={<RoomIcon fontSize="inherit" />} {...{ label: genericLabel, meta }} />;

  const ContextMenuSharedProps = {
    handleMenuItemClick: (e) => {
      if (e.target.textContent) {
        switch (e.target.textContent) {
          case "Delete": {
            const newExpanded = new Set(expanded);
            container.traverse((object: Container) => {
              if(newExpanded.has(object.uuid)){
                newExpanded.delete(object.uuid);
              }
            });
            emit("DESELECT_ALL_OBJECTS");
            setExpanded([...newExpanded]);
            const toDelete = [] as string[];
            container.traverse((object: Container) => {
              if(object["kind"] && ["surface", "source", "receiver", "room"].includes(object["kind"])){
                toDelete.push(object.uuid);
              }
            });
            emit("REMOVE_CONTAINERS", toDelete);
          } break;
          case "Log to Console": console.log(container); break;
          default: break;
        }
      }
    },
    key: key + "context-menu",
    items: ["Delete", "Log to Console"]
  };
  const onKeyDown = (e) => {
    e.preventDefault();
  };

  if(container.parent?.uuid !== parent){
    return <></>;
  }

  // Create labels with icons for leaf items
  const surfaceLabel = <TreeItemLabel icon={<NodesIcon fontSize="inherit" />} {...{ label: genericLabel, meta }} />;
  const sourceLabel = <TreeItemLabel icon={<SourceIcon fontSize="inherit" />} {...{ label: genericLabel, meta }} />;
  const receiverLabel = <TreeItemLabel icon={<ReceiverIcon fontSize="inherit" />} {...{ label: genericLabel, meta }} />;

  // slotProps for selectable leaf items (surface, source, receiver)
  const selectableContentProps = { className, onClick };

  switch (container["kind"]) {
    case "surface":
         return (
          <ContextMenu {...ContextMenuSharedProps}>
            <TreeItem
              label={surfaceLabel}
              slotProps={{ content: selectableContentProps }}
              {...{ draggable, key, itemId }}
            />
          </ContextMenu>
        )

    case "source":
      return (
        <ContextMenu {...ContextMenuSharedProps}>
          <TreeItem
            label={sourceLabel}
            slotProps={{ content: selectableContentProps }}
            {...{ draggable, key, itemId }}
          />
        </ContextMenu>
      );
    case "receiver":
      return (
        <ContextMenu {...ContextMenuSharedProps}>
          <TreeItem
            label={receiverLabel}
            slotProps={{ content: selectableContentProps }}
            {...{ draggable, key, itemId }}
          />
        </ContextMenu>
      );

    case "room":
        return (
          <ContextMenu {...ContextMenuSharedProps}>
            <TreeItem
              label={roomLabel}
              slots={{ collapseIcon: ExpandMoreIcon, expandIcon: ChevronRightIcon }}
              onKeyDown={onKeyDown}
              {...{ draggable, key, itemId }}
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
        return <ContextMenu {...ContextMenuSharedProps}>
        <TreeItem
          label={label}
          slots={{ collapseIcon: ExpandMoreIcon, expandIcon: ChevronRightIcon }}
          onKeyDown={onKeyDown}
          {...{ draggable, key, itemId }}
        >{
          (container.children.filter(x=>x instanceof Container && x.parent?.uuid === container.uuid) as Container[]).map((x) => (
          <MapChildren
            parent={container.uuid}
            container={x}
            expanded={expanded}
            setExpanded={setExpanded}
            key={x.uuid + "-map-children"}
          />
        ))}            </TreeItem>
        </ContextMenu>
    default: return <></>;
  }
});

export default function ObjectView() {
  const {containers, getWorkspace} = useContainer(useShallow(state=>pickProps(["containers", "getWorkspace"], state)));
  const [expanded, setExpanded] = useState(["containers"]);

  const ContainerLabelStyle = {
    fontWeight: 400,
    color: Object.keys(containers).length === 0 ? "#ced9e0" : "#182026"
  };

  const label = <TreeItemLabel label={<div style={ContainerLabelStyle}>Objects</div>} />;
  const keys = Object.keys(containers);
  const workspace = getWorkspace();

  if(!workspace){
    return <></>
  }
  return (
    <SimpleTreeView
      expandedItems={expanded}
      onExpandedItemsChange={(event, itemIds) => setExpanded(itemIds)}
      disableSelection
      className="tree-view-root"
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
