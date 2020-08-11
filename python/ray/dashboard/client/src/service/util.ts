import axios from 'axios';

type CMDRsp = {
  "result": boolean,
  "msg": string,
  "data": {
    "output": string
  }
}

export function getJstack(ip: string, pid: string) {
  return axios.get<CMDRsp>('utils/jstack', {
    params: {
      ip,
      pid,
    },
  })
}

export function getJmap(ip: string, pid: string) {
  return axios.get<CMDRsp>('utils/jmap', {
    params: {
      ip,
      pid,
    },
  })
}
