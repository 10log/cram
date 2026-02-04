import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

type ClickEvent = React.MouseEvent<HTMLElement, MouseEvent>;

export interface TreeItemLabelProps {
  label: React.ReactNode;
  icon?: React.ReactNode;
  meta?: string;
  onClick?: (e: ClickEvent) => void;
}

// Match PropertiesPanel ListItemText styling
const CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight: 24,
} as const;

const ICON_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 28,
  '& .MuiSvgIcon-root': {
    fontSize: 16,
  },
} as const;

const TEXT_CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  flex: 1,
} as const;

// Match PropertiesPanel: primaryTypographyProps={{ fontSize: "0.75rem" }}
const PRIMARY_TEXT_SX: SxProps<Theme> = {
  fontSize: '0.75rem',
  fontWeight: 400,
  lineHeight: 1.4,
  color: 'text.primary',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const;

// Match PropertiesPanel: secondaryTypographyProps={{ fontSize: "0.625rem" }}
const SECONDARY_TEXT_SX: SxProps<Theme> = {
  fontSize: '0.625rem',
  fontWeight: 400,
  lineHeight: 1.4,
  color: 'text.secondary',
} as const;

export default function TreeItemLabel(props: TreeItemLabelProps) {
  const extraProps = {} as Record<string, unknown>;
  if (props.onClick) {
    extraProps.onClick = props.onClick;
  }

  return (
    <Box sx={CONTAINER_SX} {...extraProps}>
      {props.icon && <Box sx={ICON_SX}>{props.icon}</Box>}
      <Box sx={TEXT_CONTAINER_SX}>
        {typeof props.label === 'string' ? (
          <Typography component="span" sx={PRIMARY_TEXT_SX}>
            {props.label}
          </Typography>
        ) : (
          props.label
        )}
        {props.meta && (
          <Typography component="span" sx={SECONDARY_TEXT_SX}>
            {props.meta}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
