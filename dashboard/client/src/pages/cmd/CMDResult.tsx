import { makeStyles, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import LogVirtualView from '../../components/LogView/LogVirtualView';
import { getJmap, getJstack } from '../../service/util';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    width: '100%',
  },
  table: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
  },
  pageMeta: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  search: {
    margin: theme.spacing(1),
  },
}));

const CMDResult = (props: RouteComponentProps<{cmd: string, ip: string, pid: string}>) => {
  const classes = useStyles();
  const { match: { params } } = props;
  const { cmd, ip, pid } = params;
  const [result, setResult] = useState<string>();

  useEffect(() => {
    switch (cmd) {
      case 'jstack':
        getJstack(ip, pid).then(
          rsp => {
            if (rsp.data.result) {
              setResult(rsp.data.data.output);
            } else {
              setResult(rsp.data.msg)
            }
          },
        ).catch(
          err => setResult(err.toString()),
        )
        break;
      case 'jmap':
        getJmap(ip, pid).then(
          rsp => {
            if (rsp.data.result) {
              setResult(rsp.data.data.output);
            } else {
              setResult(rsp.data.msg)
            }
          },
        ).catch(
          err => setResult(err.toString()),
        )
        break;
      default:
        setResult(`Command ${cmd} is not supported.`)
        break;
    }
  }, [cmd, ip, pid])

  return <div className={classes.root}>
    <Typography variant="h5">
      {cmd}
    </Typography>
    <Paper className={classes.pageMeta}>
      <p>IP: {ip} / Pid: {pid}</p>
      <LogVirtualView content={result || 'loading'} language="prolog" height={800} />
    </Paper>
  </div>
}

export default CMDResult;
