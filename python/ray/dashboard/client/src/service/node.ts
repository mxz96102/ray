import axios from 'axios';
import { NodeDetailRsp, NodeListRsp } from '../type/node';

export const getNodeList = async () => {
  return await axios.get<NodeListRsp>('nodes?view=summary')
}

export const getNodeDetail = async (hostname: string) => {
  return await axios.get<NodeDetailRsp>(`nodes/${hostname}`)
}

