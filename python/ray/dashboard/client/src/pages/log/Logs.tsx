import { Button, InputAdornment, List, ListItem, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import LogVirtualView from '../../components/LogView/LogVirtualView';
import { getLogDetail } from '../../service/log';

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

type LogsProps = RouteComponentProps<{ host?: string, path?: string  }> & { theme?: "dark" | "light" };


const useLogs = (props: LogsProps) => {
  const { match: { params }, theme } = props;
  const { host, path } = params;
  const el = useRef<HTMLDivElement>(null)
  const [origin, setOrigin] = useState<string>();
  const [search, setSearch] = useState<{ keywords?: string, lineNumber?: string, fontSize?: number }>();
  const [log, setLogs] = useState<undefined | string | { [key:string]: string, }[]>();

  useEffect(
    () => {
      let url = 'logs';
      setLogs('Loading...')
      if (host) {
        url = decodeURIComponent(host);
        setOrigin((new URL(url)).origin)
        if (path) {
          url += decodeURIComponent(path);
        }
      } else {
        setOrigin(undefined)
      }
      getLogDetail(url)
        .then(
          res => {
            if (res) {
              setLogs(res);
            } else {
              setLogs('(null)')
            }
            
          }
        ).catch(() => {
          setLogs('Failed to load')
        })
    }
    , [host, path]
  )

  return {
    log, origin, host, path, el, search, setSearch, theme
  }
}

export const Logs = (props: LogsProps) => {
  const classes = useStyles();
  const { log, origin, path, el, search, setSearch, theme } = useLogs(props);
  let href = '#/log/';

  if (origin) {
    if (path) {
      const after = decodeURIComponent(path).split('/');
      after.pop();
      if (after.length > 1) {
        href += encodeURIComponent(origin)
        href += '/'
        href += encodeURIComponent(after.join('/'));
      }
    }
  }

  return <div className={classes.root} ref={el}>
    <Typography variant="h5">
      Logs
    </Typography>
    <Paper className={classes.table}>
      {
        !origin && <p>Please choose an url to get log path</p>
      }
      {
        origin && <p>Now Path: {origin}{decodeURIComponent(path || '')}</p>
      }
      {
        origin && <Button variant="contained" href={href} className={classes.search}>Back To ../</Button>
      }
    </Paper>
    <Paper className={classes.table}>
      {
        typeof log === 'object' &&
        <List>
          {log.map(
            (e: { [key:string]: string }) => <ListItem key={e.name}>
              <a href={`#/log/${origin ? `${encodeURIComponent(origin)}/` : ''}${encodeURIComponent(e.href)}`}>{e.name}</a>
            </ListItem>
          )}
        </List>
      }
      {
        typeof log === 'string' &&
        <div>
          <div>
          <TextField className={classes.search} label="Keyword" InputProps={{
          onChange: ({ target: { value } }) => {
            setSearch({ ...search, keywords: value })
          },
          type: '',
          endAdornment: (
            <InputAdornment position="end">
              <SearchOutlined />
            </InputAdornment>
          ),
        }} />
        <TextField className={classes.search} label="Line Number" InputProps={{
          onChange: ({ target: { value } }) => {
            setSearch({ ...search, lineNumber: value })
          },
          type: '',
          endAdornment: (
            <InputAdornment position="end">
              <SearchOutlined />
            </InputAdornment>
          ),
        }} />
            <TextField className={classes.search} label="Font Size" InputProps={{
          onChange: ({ target: { value } }) => {
            setSearch({ ...search, fontSize: Number(value) })
          },
          type: '',
        }} />
          </div>
          <LogVirtualView theme={theme} revert keywords={search?.keywords} focusLine={Number(search?.lineNumber) || undefined} fontSize={search?.fontSize || 12} content={log} language="prolog" />
        </div>
      }
    </Paper>
  </div>
}