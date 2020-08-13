import { makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import EventTable from '../../components/EventTable';

const useStyle = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  label: {
    fontWeight: 'bold',
  },
  pageMeta: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  tab: {
    marginBottom: theme.spacing(2),
  },
  dependenciesChip: {
    margin: theme.spacing(0.5),
  },
}))

const Events = () => {
  const classes = useStyle();

  return <div className={classes.root}>
  <Typography variant="h5">
    Events
  </Typography>
  <Paper className={classes.paper}>
    <EventTable />
  </Paper>
  </div>
}

export default Events;
