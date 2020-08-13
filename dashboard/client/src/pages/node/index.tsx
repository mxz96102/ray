import { Chip, InputAdornment, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { SearchOutlined } from '@material-ui/icons';
import numeral from 'numeral';
import React from 'react';
import { Link } from 'react-router-dom';
import PercentageBar from '../../components/PercentageBar';
import { NodeDetail } from '../../type/node';
import { useNodeList } from './hook/useNodeList';

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

export const brpcLinkChanger = (href: string) => {
  const { location } = window;
  const { pathname } = location;
  const pathArr = pathname.split('/')
  if (pathArr.some(e => e.split('.').length > 1)) {
    const index = pathArr.findIndex(e => e.includes('.'));
    const resultArr = pathArr.slice(0, index);
    resultArr.push(href);
    return `${location.protocol}//${location.host}${resultArr.join('/')}`
  }

  return `http://${href}`
}

const columns = ['Status', 'Host', 'IP', 'CPU Usage', 'Memory', 'Disk(root)', 'Sent', 'Received', 'BRPC Port'];

const Nodes = () => {
  const classes = useStyles();
  const { msg, isRefreshing, onSwitchChange, nodeList, changeFilter } = useNodeList();

  return <div className={classes.root}>
    <Typography variant="h5">
      Nodes
    </Typography>
    <Paper className={classes.pageMeta}>
      Request Status: {msg} <br/>
      Auto Refresh: 
      <Switch
        checked={isRefreshing}
        onChange={onSwitchChange}
        name="refresh"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
    </Paper>
    <TableContainer className={classes.table} component={Paper}>
      <TextField className={classes.search} id="standard-basic" label="Host" InputProps={{
          onChange: ({ target: { value } }) => {
            changeFilter('hostname', value.trim())
          },
          endAdornment: (
            <InputAdornment position="end">
              <SearchOutlined />
            </InputAdornment>
          ),
        }} />
      <TextField className={classes.search} id="standard-basic" label="IP" InputProps={{
          onChange: ({ target: { value } }) => {
            changeFilter('ip', value.trim())
          },
          endAdornment: (
            <InputAdornment position="end">
              <SearchOutlined />
            </InputAdornment>
          ),
        }} />
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
          nodeList.map(({ hostname = '', ip = '', cpu = 0, mem = [], disk, net = [0, 0], raylet }: NodeDetail) => 
            <TableRow key={hostname}>
              <TableCell>
                <Chip style={{ color: green[500], borderColor: green[500] }} label="RUNNING" variant="outlined" size="small"/>
              </TableCell>
              <TableCell align="center">
                <Link to={`/node/${hostname}`}>{hostname}</Link>
              </TableCell>
              <TableCell align="center">
                {ip}
              </TableCell>
              <TableCell>
                <PercentageBar num={Number(cpu)} total={100}>
                  {cpu}%
                </PercentageBar>
              </TableCell>
              <TableCell>
                <PercentageBar num={Number(mem[0] - mem[1])} total={mem[0]}>
                  {numeral(mem[0] - mem[1]).format('0.00b')}/{numeral(mem[0]).format('0.00b')}({mem[2]}%)
                </PercentageBar>
              </TableCell>
              <TableCell>
                {
                  disk['/'] &&
                  <PercentageBar num={Number(disk['/'].used)} total={disk['/'].total}>
                    {numeral(disk['/'].used).format('0.00b')}/{numeral(disk['/'].total).format('0.00b')}({disk['/'].percent}%)
                  </PercentageBar>
                }
              </TableCell>
              <TableCell align="center">
                {numeral(net[0]).format('0.00b')}/s
              </TableCell>
              <TableCell align="center">
                {numeral(net[1]).format('0.00b')}/s
              </TableCell>
              <TableCell align="center">
              {raylet.brpcPort && <a target="_blank" rel="noopener noreferrer" href={brpcLinkChanger(`${ip}:${raylet.brpcPort}`)}>{raylet.brpcPort}</a>}
              </TableCell>
            </TableRow>,
          )
        }
      </TableBody>
    </Table>
    </TableContainer>
  </div>
}

export default Nodes;
