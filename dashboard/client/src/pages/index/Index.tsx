import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import numeral from 'numeral';
import React, { useEffect, useState } from 'react';
import { getRayConfig } from '../../service/cluster';
import { RayConfig } from '../../type/config';

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

const getVal = (key: string, value: any) => {
  if (key === 'containerMemory') {
    return numeral(value * 1024 * 1024).format('0.00b')
  }
  return JSON.stringify(value)
}

const useIndex = () => {
  const [rayConfig, setConfig] = useState<RayConfig>()
  useEffect(() => {
    getRayConfig()
      .then(res => {
        if (res?.data?.data?.config) {
          setConfig(res.data.data.config)
        }
      })
  }, []);

  return { rayConfig }
}

const Index = () => {
  const { rayConfig } = useIndex();
  const classes = useStyle();

  return <div className={classes.root}>
    <Typography variant="h5">
      Index
    </Typography>
    {
      rayConfig &&
      <Paper className={classes.paper}>
      <Typography variant="subtitle2">
        {rayConfig.clusterName} - config
      </Typography>
      <br/>
      <Grid container spacing={2}>
        {
          Object.entries(rayConfig).map(([key, value]) => 
            <Grid item><span className={classes.label}>{key}</span>: {getVal(key, value)}</Grid>,
          )
        }
      </Grid>
    </Paper>
    }
  </div>
}

export default Index;
