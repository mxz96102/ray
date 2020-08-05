import { makeStyles } from '@material-ui/core';
import React, { PropsWithChildren } from 'react';

const useStyle = makeStyles((theme) => ({
  container: {
    background: "linear-gradient(to right, #12c2e988, #c471ed88, #f64f59aa)",
    padding: '0 12px',
    height: 24,
    lineHeight: '24px',
    position: "relative",
    border: '#999999aa solid 1px',
    boxSizing: 'content-box',
    transition: '0.5s width',
  },
  displayBar: {
    background: theme.palette.background.paper,
    position: 'absolute',
    right: 0,
    height: 24,
    transition: '0.5s width',
  },
  text: { zIndex: 2, position: 'relative', color: theme.palette.text.secondary, width: '100%', textAlign: 'center' },
}))

const PercentageBar = (props: PropsWithChildren<{num: number, total: number}>) => {
  const { num, total } = props;
  const classes = useStyle();
  const per = Math.round(num / total * 100);

  return <div
    className={classes.container}
  >
    <div
      className={classes.displayBar}
      style={{
        width: `${Math.min(Math.max(0, 100 - per), 100)}%`,
      }}
    />
    <div className={classes.text}>
      {props.children}
    </div>
  </div>
}

export default PercentageBar;