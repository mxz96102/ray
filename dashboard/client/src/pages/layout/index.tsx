import { Switch } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import React, { PropsWithChildren } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import Logo from '../../logo.svg'

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& a': {
      color: theme.palette.primary.main,
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    color: 'white',
    background: '#000',
  },
  drawerPaper: {
    width: drawerWidth,
    border: 'none',
    background: '#000',
  },
  title: {
    padding: theme.spacing(2),
    color: 'white',
    textAlign: 'center',
    lineHeight: '36px',
  },
  white: {
    color: 'white',
  },
  divider: {
    background: 'rgba(255, 255, 255, .12)',
  },
  menuItem: {
    '&:hover': {
      background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
    },
  },
  selected: {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.secondary.dark} 90%)`,
  },
  child: {
    flex: 1,
  },
}));

const BasicLayout = (props: PropsWithChildren<{ setTheme: ((theme: string) => void), theme: string } & RouteComponentProps>) => {
  const classes = useStyles();
  const { location, history, children, setTheme, theme } = props;

  return <div className={classes.root}>
    <Drawer
      variant="permanent"
      anchor="left"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Typography variant="h6" className={classes.title}>
        <img width={48} src={Logo} alt="Ray" /> <br /> Ray DashBoard
      </Typography>
      <List>
        <ListItem button className={classnames(classes.menuItem, location.pathname === '/' && classes.selected)} onClick={() => history.push('/')}>
          <ListItemText className={classes.white}>Dashboard</ListItemText>
        </ListItem>
        <ListItem button className={classnames(classes.menuItem, location.pathname.includes('node') && classes.selected)} onClick={() => history.push('/node')}>
          <ListItemText className={classes.white}>Nodes</ListItemText>
        </ListItem>
        <ListItem button className={classnames(classes.menuItem, location.pathname.includes('log') && classes.selected)} onClick={() => history.push('/log')}>
          <ListItemText className={classes.white}>Log</ListItemText>
        </ListItem>
        <ListItem button className={classes.white} onClick={() => { window.scrollTo(0, 0) }}>
          Back To Top
        </ListItem>
        <ListItem className={classes.white}>
          Theme <Switch checked={theme === 'light'} onChange={(e, checked) => setTheme(checked ? 'light' : 'dark')} />
        </ListItem>
      </List>
    </Drawer>
    <div className={classes.child}>
      {children}
    </div>
  </div>
}

export default BasicLayout;
