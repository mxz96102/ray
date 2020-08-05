import { Chip, InputAdornment, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, getGlobalEvents } from '../service/event';
import { Event } from '../type/event';
import { longTextCut, useFilter } from './WorkerTable';

type EventTableProps = {
  job_id?: string,
}

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

const useEventTable = (props: EventTableProps) => {
  const { job_id } = props;
  const { changeFilter, filterFunc } = useFilter();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const getEvent = (async () => {
      if (job_id) {
        const rsp = await getEvents(job_id);
        if (rsp?.data?.data?.events) {
          setEvents(rsp.data.data.events)
        } 
      } else {
        const rsp = await getGlobalEvents();
        if (rsp?.data?.data?.events?.global) {
          setEvents(rsp.data.data.events.global)
        } 
      }

      timeout = setTimeout(getEvent, 8000);
    });
    getEvent();

    return () => {
      clearTimeout(timeout);
    }
  }, [job_id]);

  return {
    events: events.filter(filterFunc), changeFilter,
  }
}

const columns = ['Label', 'Msg', 'Time', 'Source Type', 'Hostname', 'Pid', 'Job Id', 'Event ID', 'Node Id']

const EventTable = (props: EventTableProps) => {
  const classes = useStyles();
  const {events, changeFilter} = useEventTable(props);

  return <TableContainer>
    <div>
    <TextField className={classes.search} label="Label" InputProps={{
    onChange: ({ target: { value } }) => {
      changeFilter('label', value.trim())
    },
    endAdornment: (
      <InputAdornment position="end">
        <SearchOutlined />
      </InputAdornment>
    ),
  }} />
      <TextField className={classes.search} label="Msg" InputProps={{
    onChange: ({ target: { value } }) => {
      changeFilter('message', value.trim())
    },
    endAdornment: (
      <InputAdornment position="end">
        <SearchOutlined />
      </InputAdornment>
    ),
  }} />
  <TextField className={classes.search} label="Hostname" InputProps={{
    onChange: ({ target: { value } }) => {
      changeFilter('hostname', value.trim())
    },
    endAdornment: (
      <InputAdornment position="end">
        <SearchOutlined />
      </InputAdornment>
    ),
  }} />
  <TextField className={classes.search} label="Job Id" InputProps={{
    onChange: ({ target: { value } }) => {
      changeFilter('jobId', value.trim())
    },
    endAdornment: (
      <InputAdornment position="end">
        <SearchOutlined />
      </InputAdornment>
    ),
  }} />
  </div>
    <Table>
      <TableHead>
        <TableRow>
          {
            columns.map(col => <TableCell align="center" key={col}>{col}</TableCell>)
          }
        </TableRow>
      </TableHead>
      <TableBody>
        {
          events.map(({ label, message, timestamp, sourceType, sourceHostname, sourcePid, eventId, jobId, nodeId }) => 
            <TableRow key={eventId}>
              <TableCell>
                <Chip label={label} variant="outlined" size="small"/>
              </TableCell>
              <TableCell>
                <pre>
                  {message}
                </pre>
              </TableCell>
              <TableCell align="center">
                {moment(parseInt(timestamp, 10) / 1000).format('YYYY-MM-DD HH:mm:ss')}
              </TableCell>
              <TableCell>
                {sourceType}
              </TableCell>
              <TableCell align="center">
                <Link to={`node/${sourceHostname}`}>
                  {sourceHostname}
                </Link>
              </TableCell>
              <TableCell>
                {sourcePid}
              </TableCell>
              <TableCell>
              <Link to={`job/${jobId}`}>
                {jobId}
              </Link>
              </TableCell>
              <TableCell>
                {longTextCut(eventId, 10)}
              </TableCell>
              <TableCell>
                {longTextCut(nodeId, 10)}
              </TableCell>
            </TableRow>,
          )
        }
      </TableBody>
    </Table>
  </TableContainer>
}

export default EventTable;
