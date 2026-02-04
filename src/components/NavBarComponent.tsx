import React, { MouseEvent } from "react";
import { emit, postMessage } from "../messenger";
import MenuItemText from "./MenuItemText";
import { Characters } from "../constants";
import { create } from 'zustand';
import "./NavBarComponent.css";
import { useAppStore } from "../store";

// MUI imports
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import type { SxProps, Theme } from "@mui/material/styles";

// Zustand store for menu state - using anchorEl pattern for MUI
type NavBarStore = {
  openMenu: string | null;
  anchorEl: HTMLElement | null;
  openMenuWithAnchor: (menu: string, anchor: HTMLElement) => void;
  closeMenu: () => void;
}

export const useNavBarStore = create<NavBarStore>((set) => ({
  openMenu: null,
  anchorEl: null,
  openMenuWithAnchor: (menu, anchor) => set({ openMenu: menu, anchorEl: anchor }),
  closeMenu: () => set({ openMenu: null, anchorEl: null }),
}));

// Shared styles
const menuButtonSx: SxProps<Theme> = {
  textTransform: 'none',
  minWidth: 'auto',
  px: 1.5,
  py: 0.25,
  fontSize: '9pt',
  color: 'text.primary',
  '&:hover': {
    backgroundColor: 'action.hover',
  },
};

const menuPaperProps = {
  elevation: 4,
  sx: {
    minWidth: 180,
    '& .MuiMenuItem-root': {
      fontSize: '9pt',
      py: 0.5,
      px: 1.5,
    },
  },
};

interface MenuItemWithMessengerProps {
  label: string;
  hotkey?: string[];
  disabled?: boolean;
  message: string;
}

function MenuItemWithMessenger(props: MenuItemWithMessengerProps) {
  const { closeMenu } = useNavBarStore();
  return (
    <MenuItem
      onClick={() => {
        postMessage(props.message);
        closeMenu();
      }}
      disabled={props.disabled}
    >
      <MenuItemText text={props.label} hotkey={props.hotkey || [""]} />
    </MenuItem>
  );
}

type MenuItemWithEmitterProps = {
  label: string;
  hotkey?: string[];
  disabled?: boolean;
  event: keyof EventTypes;
  args?: EventTypes[MenuItemWithEmitterProps["event"]];
}

const MenuItemWithEmitter = ({ label, hotkey, disabled, event, args }: MenuItemWithEmitterProps) => {
  const { closeMenu } = useNavBarStore();
  return (
    <MenuItem
      onClick={() => {
        emit(event, args);
        closeMenu();
      }}
      disabled={disabled}
    >
      <MenuItemText text={label} hotkey={hotkey || [""]} />
    </MenuItem>
  );
}

export function FileMenu() {
  const { openMenu, anchorEl, openMenuWithAnchor, closeMenu } = useNavBarStore();
  const isOpen = openMenu === 'file';

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    openMenuWithAnchor('file', e.currentTarget);
  };

  return (
    <>
      <Button
        size="small"
        sx={menuButtonSx}
        onClick={handleClick}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        File
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: menuPaperProps }}
      >
        <MenuItemWithEmitter label="New" event="NEW" hotkey={[Characters.SHIFT, "N"]} />
        <MenuItemWithEmitter label="Open" event="OPEN" hotkey={[Characters.COMMAND, "O"]} />
        <MenuItemWithEmitter label="Save" event="SAVE" hotkey={[Characters.COMMAND, "S"]} />
        <Divider />
        <MenuItemWithEmitter label="Import" event="SHOW_IMPORT_DIALOG" args={true} hotkey={[Characters.COMMAND, "I"]} />
      </Menu>
    </>
  );
}

export function EditMenu() {
  const { openMenu, anchorEl, openMenuWithAnchor, closeMenu } = useNavBarStore();
  const isOpen = openMenu === 'edit';

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    openMenuWithAnchor('edit', e.currentTarget);
  };

  return (
    <>
      <Button
        size="small"
        sx={menuButtonSx}
        onClick={handleClick}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        Edit
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: menuPaperProps }}
      >
        <MenuItemWithMessenger label="Undo" message="UNDO" hotkey={[Characters.COMMAND, "Z"]} disabled />
        <MenuItemWithMessenger
          label="Redo"
          message="REDO"
          hotkey={[Characters.SHIFT, Characters.COMMAND, "Z"]}
          disabled
        />
        <Divider />
        <MenuItemWithMessenger
          label="Duplicate"
          message="SHOULD_DUPLICATE_SELECTED_OBJECTS"
          hotkey={[Characters.SHIFT, "D"]}
          disabled
        />
        <Divider />
        <MenuItemWithMessenger label="Cut" message="CUT" hotkey={[Characters.COMMAND, "X"]} disabled />
        <MenuItemWithMessenger label="Copy" message="COPY" hotkey={[Characters.COMMAND, "C"]} disabled />
        <MenuItemWithMessenger label="Paste" message="PASTE" hotkey={[Characters.COMMAND, "V"]} disabled />
      </Menu>
    </>
  );
}

export function AddMenu() {
  const { openMenu, anchorEl, openMenuWithAnchor, closeMenu } = useNavBarStore();
  const isOpen = openMenu === 'add';

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    openMenuWithAnchor('add', e.currentTarget);
  };

  return (
    <>
      <Button
        size="small"
        sx={menuButtonSx}
        onClick={handleClick}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        Add
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: menuPaperProps }}
      >
        <MenuItemWithMessenger label="Source" message="SHOULD_ADD_SOURCE" />
        <MenuItemWithMessenger label="Receiver" message="SHOULD_ADD_RECEIVER" />
        <Divider />
        <MenuItemWithMessenger label="Sketch" message="SHOULD_ADD_SKETCH" disabled />
        <Divider />
        <MenuItemWithMessenger label="Ray Tracer" message="SHOULD_ADD_RAYTRACER" />
        <MenuItemWithMessenger label="Image Source" message="SHOULD_ADD_IMAGE_SOURCE"/>
        <MenuItemWithEmitter label="Beam Trace" event="SHOULD_ADD_BEAMTRACE" />
        <MenuItemWithEmitter label="2D-FDTD" event="ADD_FDTD_2D" />
        <MenuItemWithMessenger label="Statistical RT" message="SHOULD_ADD_RT60" />
        <MenuItemWithMessenger label="Energy Decay" message="SHOULD_ADD_ENERGYDECAY"/>
        <MenuItemWithEmitter label="Acoustic Radiance Transfer" event="ADD_ART"/>
      </Menu>
    </>
  );
}

export function ViewMenu() {
  const { openMenu, anchorEl, openMenuWithAnchor, closeMenu } = useNavBarStore();
  const isOpen = openMenu === 'view';

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    openMenuWithAnchor('view', e.currentTarget);
  };

  return (
    <>
      <Button
        size="small"
        sx={menuButtonSx}
        onClick={handleClick}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        View
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: menuPaperProps }}
      >
        <MenuItemWithMessenger label="Clear Local Storage" message="CLEAR_LOCAL_STORAGE" />
        <MenuItemWithMessenger label="Toggle Renderer Stats" message="TOGGLE_RENDERER_STATS_VISIBLE" />
        <MenuItemWithEmitter label="Toggle Results Panel" event="TOGGLE_RESULTS_PANEL" hotkey={[Characters.SHIFT, "R"]} />
      </Menu>
    </>
  );
}

export function ToolMenu() {
  const { openMenu, anchorEl, openMenuWithAnchor, closeMenu } = useNavBarStore();
  const isOpen = openMenu === 'tools';

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    openMenuWithAnchor('tools', e.currentTarget);
  };

  return (
    <>
      <Button
        size="small"
        sx={menuButtonSx}
        onClick={handleClick}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        Tools
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: menuPaperProps }}
      >
        <MenuItemWithMessenger label="CLF Viewer" message="OPEN_CLF_VIEWER" />
        <MenuItemWithMessenger label="Image Source Test" message="SHOULD_ADD_IMAGE_SOURCE" />
      </Menu>
    </>
  );
}

export function ExamplesMenu() {
  const { openMenu, anchorEl, openMenuWithAnchor, closeMenu } = useNavBarStore();
  const isOpen = openMenu === 'examples';

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    openMenuWithAnchor('examples', e.currentTarget);
  };

  return (
    <>
      <Button
        size="small"
        sx={menuButtonSx}
        onClick={handleClick}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        Examples
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: menuPaperProps }}
      >
        <MenuItemWithEmitter label="Shoebox" event="OPEN_EXAMPLE" args="shoebox" />
        <MenuItemWithEmitter label="Concord" event="OPEN_EXAMPLE" args="concord" />
        <MenuItemWithEmitter label="Auditorium" event="OPEN_EXAMPLE" args="auditorium" />
      </Menu>
    </>
  );
}

const ProjectName = () => {
  const projectName = useAppStore(state => state.projectName);
  return (
    <Box
      className="main-nav_bar-projectname_text"
      sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '10pt',
        fontWeight: 200,
      }}
    >
      {projectName}
    </Box>
  );
}

// Styles for the AppBar
const appBarSx: SxProps<Theme> = {
  height: 'var(--main-nav_bar__height)',
  minHeight: 'var(--main-nav_bar__height)',
  backgroundColor: 'background.paper',
  color: 'text.primary',
  boxShadow: 'none',
  borderBottom: '1px solid',
  borderColor: 'divider',
};

const toolbarSx: SxProps<Theme> = {
  minHeight: 'var(--main-nav_bar__height) !important',
  height: 'var(--main-nav_bar__height)',
  px: 1,
  display: 'flex',
  justifyContent: 'space-between',
};

const navGroupSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  height: 'var(--main-nav_bar__height)',
  flex: 1,
};

const logoSx: SxProps<Theme> = {
  fontSize: '12pt',
  fontWeight: 500,
  mr: 1,
};

export function NavBarComponent() {
  return (
    <AppBar position="static" sx={appBarSx}>
      <Toolbar disableGutters sx={toolbarSx}>
        {/* Left group */}
        <Box sx={navGroupSx}>
          <Box sx={logoSx}>cram</Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <ButtonGroup variant="text" size="small">
            <FileMenu />
            <EditMenu />
            <AddMenu />
            <ViewMenu />
            <ToolMenu />
            <ExamplesMenu />
          </ButtonGroup>
        </Box>

        {/* Center - Project name */}
        <ProjectName />

        {/* Right group */}
        <Box sx={{ ...navGroupSx, justifyContent: 'flex-end' }}>
          <IconButton
            size="small"
            onClick={() => postMessage("SHOW_SETTINGS_DRAWER")}
            sx={{ p: 0.5 }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBarComponent;
