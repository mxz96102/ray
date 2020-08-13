import { useCallback, useEffect, useState } from 'react';
import { getNodeList } from '../../../service/node';
import { NodeDetail } from '../../../type/node';


export const useNodeList = () => {
  const [nodeList, setList] = useState<NodeDetail[]>([]);
  const [msg, setMsg] = useState('Loading the nodes infos...');
  const [isRefreshing, setRefresh] = useState(true);
  const [filter, setFilter] = useState<{key: 'hostname'|'ip', val: string}[]>([]);
  const changeFilter = (key: 'hostname'|'ip', val: string) => {
    const f = filter.find(e => e.key === key);
    if (f) {
      f.val = val
    } else {
      filter.push({ key, val })
    }
    setFilter([...filter]);
  }
  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => { setRefresh(event.target.checked) };
  const getList = useCallback(async () => {
    if (!isRefreshing) {
      return
    }
    const { data } = await getNodeList();
    const { data: rspData, msg } = data;
    setList(rspData.summary || []);
    if (msg) {
      setMsg(msg);
    } else {
      setMsg('')
    }
  }, [isRefreshing])

  useEffect(() => {
    getList();
    const invId = setInterval(getList, 4000);
    return () => {
      clearInterval(invId)
    }
  }, [getList]);

  return {
    nodeList: nodeList.filter(node => filter.every((f) => node[f.key] && node[f.key].includes(f.val))),
    msg,
    isRefreshing,
    onSwitchChange,
    changeFilter,
  }
}