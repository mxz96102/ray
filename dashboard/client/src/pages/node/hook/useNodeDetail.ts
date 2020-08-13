
import { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getNodeDetail } from '../../../service/node';
import { NodeDetailExtend } from '../../../type/node';

export const useNodeDetail = (props: RouteComponentProps<{ id: string }>) => {
  const { match: { params } } = props;
  const [selectedTab, setTab] = useState('info')
  const [nodeDetail, setNode] = useState<NodeDetailExtend | undefined>();
  const [msg, setMsg] = useState('Loading the node infos...');
  const [isRefreshing, setRefresh] = useState(true)
  const onRefreshChange = (event: React.ChangeEvent<HTMLInputElement>) => { setRefresh(event.target.checked) };
  const getDetail = useCallback(async () => {
    if (!isRefreshing) {
      return;
    }
    const { data } = await getNodeDetail(params.id);
    const { data: rspData, msg, result } = data;
    if (rspData?.detail) {
      setNode(rspData.detail);
    }

    if (msg) {
      setMsg(msg)
    }

    if (result === false) {
      setMsg('Node Query Error Please Check Node Name');
      setRefresh(false);
    }
  }, [isRefreshing, params.id])
  const raylet = nodeDetail?.raylet;
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setTab(newValue);
  };

  useEffect(() => {
    getDetail()
    const invId = setInterval(getDetail, 3000);
    return () => {
      clearInterval(invId);
    }
  }, [getDetail]);

  return {
    params,
    selectedTab,
    nodeDetail,
    msg,
    isRefreshing,
    onRefreshChange,
    raylet,
    handleChange,
  }
}