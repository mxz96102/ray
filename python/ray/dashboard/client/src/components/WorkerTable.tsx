import { IconButton, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip } from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowRight, SearchOutlined } from '@material-ui/icons';
import moment from 'moment';
import numeral from 'numeral';
import React, { PropsWithChildren, ReactNode, useState } from 'react';
import { Actor } from '../type/actor';
import { CoreWorkerStats, Worker } from '../type/worker';
import PercentageBar from './PercentageBar';
import { StatusChip } from './StatusChip';

export const longTextCut = (text: string = '', len: number = 28) => <Tooltip title={text} interactive>
  <span>{text.length > len ? text.slice(0, len) + '...' : text}</span>
</Tooltip>

const ExpandableTableRow = ({ children, expandComponent, length, ...otherProps }: PropsWithChildren<{ expandComponent: ReactNode, length: number }>) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (length < 1) {
    return <TableRow {...otherProps}>
        <TableCell padding="checkbox"/>
        {children}
      </TableRow>
  }

  return (
    <React.Fragment>
      <TableRow {...otherProps}>
        <TableCell padding="checkbox">
          <IconButton onClick={() => setIsExpanded(!isExpanded)}>
            {length}{isExpanded ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
          </IconButton>
        </TableCell>
        {children}
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={24}>{expandComponent}</TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

const WorkerDetailTable = ({ actorMap, coreWorkerStats }: { actorMap: { [actorId: string]: Actor }, coreWorkerStats: CoreWorkerStats[] }) => {
  const actors = (coreWorkerStats || []).filter(e => actorMap[e.actorId]).map(e => ({ ...e, ...actorMap[e?.actorId] }));


  if (!actors?.length) {
    return <p>The Worker Haven't Had Related Actor Yet.</p>
  }

  return <Table>
    <TableHead>
      <TableRow>
        {
          ['ActorID', 'Name', 'Task Func Desc', 'Job Id', 'Pid', 'Port', 'State'].map(col => <TableCell align="center" key={col}>{col}</TableCell>)
        }
      </TableRow>
    </TableHead>
    <TableBody>
      {
        actors.map(({ actorId, taskSpec, jobId, pid, state, address, name }) => <TableRow key={actorId}>
          <TableCell align="center">
            {actorId}
          </TableCell>
          <TableCell align="center">
            {name}
          </TableCell>
          <TableCell align="center">
            {
              taskSpec.functionDescriptor.javaFunctionDescriptor && 
              longTextCut(`${taskSpec.functionDescriptor.javaFunctionDescriptor.className}${taskSpec.functionDescriptor.javaFunctionDescriptor.functionName}${taskSpec.functionDescriptor.javaFunctionDescriptor.signature}`, 60)
            }
            {
              taskSpec.functionDescriptor.pythonFunctionDescriptor && 
              longTextCut(`${taskSpec.functionDescriptor.pythonFunctionDescriptor.className}${taskSpec.functionDescriptor.pythonFunctionDescriptor.functionName}${taskSpec.functionDescriptor.pythonFunctionDescriptor.signature}`, 60)
            }
          </TableCell>
          <TableCell align="center">
            {jobId}
          </TableCell>
          <TableCell align="center">
            {pid}
          </TableCell>
          <TableCell align="center">
            {address?.port}
          </TableCell>
          <TableCell align="center">
            <StatusChip type="actor" status={state} />
          </TableCell>
        </TableRow>)
      }
    </TableBody>
  </Table>
}

const byteFmt = (val: number) => numeral(val).format('0.00b');

export const useFilter = <KeyType extends string>() => {
  const [filters, setFilters] = useState<{ key: KeyType, val: string }[]>([]);
  const changeFilter = (key: KeyType, val: string) => {
    const f = filters.find(e => e.key === key);
    if (f) {
      f.val = val
    } else {
      filters.push({ key, val })
    }
    setFilters([...filters]);
  }
  const filterFunc = (instance: { [key: string]: any }) => {
    return filters.every((f) => instance[f.key] && instance[f.key].toString().includes(f.val))
  }

  return {
    changeFilter,
    filterFunc,
  }
}

const RayletWorkerTable = ({ workers = [], actorMap }: { workers: Worker[], actorMap: { [actorId: string]: Actor } }) => {
  const { changeFilter, filterFunc } = useFilter();

  return <React.Fragment><div><TextField id="standard-basic" label="Pid" InputProps={{
    onChange: ({ target: { value } }) => {
      changeFilter('pid', value.trim())
    },
    endAdornment: (
      <InputAdornment position="end">
        <SearchOutlined />
      </InputAdornment>
    ),
  }} /></div>, <Table>
    <TableHead>
      <TableRow>
        {
          ['', 'Pid', 'CPU', 'CPU Times (user/system/iowait)', 'Memory (rss/vms/shared/text/lib/data/dirty)', 'CMD Line', 'Create Time', 'Log'].map(col => <TableCell align="center" key={col}>{col}</TableCell>)
        }
      </TableRow>
    </TableHead>
    <TableBody>
      {
        workers
        .filter(filterFunc)
        .sort((aWorker, bWorker) => {
          const a = (aWorker.coreWorkerStats || []).filter(e => actorMap[e.actorId]).length || 0;
          const b = (bWorker.coreWorkerStats || []).filter(e => actorMap[e.actorId]).length || 0;

          return b - a
        })
        .map(({ pid, cpuPercent, cpuTimes, memoryInfo, cmdline, createTime, coreWorkerStats = [] }) =>
          <ExpandableTableRow expandComponent={
            <WorkerDetailTable actorMap={actorMap} coreWorkerStats={coreWorkerStats} />
          } length={(coreWorkerStats || []).filter(e => actorMap[e.actorId]).length} key={pid}>
            <TableCell align="center">
              {pid}
            </TableCell>
            <TableCell align="center">
              <PercentageBar num={Number(cpuPercent)} total={100}>
                {cpuPercent}%
          </PercentageBar>
            </TableCell>
            <TableCell align="center">
              {cpuTimes?.user}/{cpuTimes?.system}/{cpuTimes?.iowait}
            </TableCell>
            <TableCell align="center">
              {byteFmt(memoryInfo?.rss)}/{byteFmt(memoryInfo?.vms)}/{byteFmt(memoryInfo?.shared)}/{byteFmt(memoryInfo?.text)}/{byteFmt(memoryInfo?.lib)}/{byteFmt(memoryInfo?.data)}/{byteFmt(memoryInfo?.dirty)}
            </TableCell>
            <TableCell align="center">
              {cmdline && longTextCut(cmdline.filter(e => e).join('\n'))}
            </TableCell>
            <TableCell align="center">
              {moment(createTime * 1000).format('YYYY/MM/DD HH:mm:ss')}
            </TableCell>
          </ExpandableTableRow>,
        )
      }
    </TableBody>
  </Table></React.Fragment>
}


export default RayletWorkerTable;
