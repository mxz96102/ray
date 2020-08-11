import { Chip, InputAdornment, makeStyles, TextField } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, getGlobalEvents } from '../service/event';
import { Event } from '../type/event';
import { useFilter } from './WorkerTable';

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
  infokv: {
    margin: theme.spacing(1),
  },
  li: {
    borderBottom: `1px solid ${theme.palette.text.hint}`,
    color: theme.palette.text.secondary,
    fontSize: 12,
  },
  code: {
    wordBreak: 'break-all',
    whiteSpace: 'pre-line',
    margin: 12,
    fontSize: 14,
    color: theme.palette.text.primary,
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

const EventTable = (props: EventTableProps) => {
  const classes = useStyles();
  const { events, changeFilter } = useEventTable(props);

  return <div>
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
    <div>
      {
        events.map(({ label, message, timestamp, sourceType, sourceHostname, sourcePid, eventId, jobId, nodeId }) =>
          <article className={classes.li} key={eventId}>
            <p>
              <Chip label={label} size="small" /> {moment(parseInt(timestamp, 10) / 1000).format('YYYY-MM-DD HH:mm:ss')}
            </p>
            <p>
              <span className={classes.infokv}>source: {sourceType}</span>
              <span className={classes.infokv}>hostname: <Link to={`node/${sourceHostname}`}>
                {sourceHostname}
              </Link></span>
              <span className={classes.infokv}>pid: {sourcePid}</span>
              {jobId && <span className={classes.infokv}>jobId: <Link to={`job/${jobId}`}>
                {jobId}
              </Link></span>}
              { eventId && <span className={classes.infokv}>eventId: {eventId}</span> }
              { nodeId && <span className={classes.infokv}>nodeId: {nodeId}</span>}
            </p>
            <pre className={classes.code}>
              {message}
            </pre>
          </article>,
        )
      }
    </div>
  </div>
}

export default EventTable;
