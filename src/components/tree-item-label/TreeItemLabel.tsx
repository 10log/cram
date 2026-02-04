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

// Extracted sx constants
const CONTAINER_SX: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
} as const;

const LABEL_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.75rem',
  fontWeight: 400,
  color: 'text.primary',
} as const;

const ICON_SX: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  mr: 0.5,
  ml: -0.25,
  '& .MuiSvgIcon-root': {
    fontSize: '14px',
  },
} as const;

const META_SX: SxProps<Theme> = {
  fontSize: '0.75rem',
  fontWeight: 300,
  fontStyle: 'italic',
  color: 'text.secondary',
  ml: 1,
  textTransform: 'capitalize',
} as const;

export default function TreeItemLabel(props: TreeItemLabelProps) {
  const extraProps = {} as Record<string, unknown>;
  if (props.onClick) {
    extraProps.onClick = props.onClick;
  }

  return (
    <Box sx={CONTAINER_SX} {...extraProps}>
      <Box sx={LABEL_SX}>
        {props.icon && <Box sx={ICON_SX}>{props.icon}</Box>}
        {typeof props.label === 'string' ? (
          <Typography variant="body2" sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>
            {props.label}
          </Typography>
        ) : (
          props.label
        )}
      </Box>
      {props.meta && (
        <Typography variant="caption" sx={META_SX}>
          {props.meta}
        </Typography>
      )}
    </Box>
  );
}
