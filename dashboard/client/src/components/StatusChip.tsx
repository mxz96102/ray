import { Chip } from '@material-ui/core';
import { blue, cyan, green, grey, lightBlue, red } from '@material-ui/core/colors';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import React from 'react';
import { ActorEnum } from '../type/actor';

const colorMap = {
  node: {
    ALIVE: green[500],
    DEAD: red[500],
  },
  actor: {
    [ActorEnum.ALIVE]: green[500],
    [ActorEnum.DEAD]: red[500],
    [ActorEnum.PENDING]: blue[500],
    [ActorEnum.RECONSTRUCTING]: lightBlue[500],
  },
  job: {
    INIT: grey[500],
    SUBMITTED: blue[500],
    DISPATCHED: lightBlue[500],
    RUNNING: green[500],
    COMPLETED: cyan[500],
    FINISHED: cyan[500],
    FAILED: red[500],
  },
} as {
  [key: string]: {
    [key: string]: string
  }
}

export const StatusChip = ({ type, status }: { type: string, status: string | ActorEnum }) => {
  const style = {} as CSSProperties;

  if (colorMap[type] && colorMap[type][status]) {
    style.color = colorMap[type][status];
    style.borderColor = colorMap[type][status];
  }

  return <Chip style={style} variant="outlined" size="small" label={status}/>
}
