import axios from 'axios';
import { EventGlobalRsp, EventRsp } from "../type/event";

export const getEvents = (jobId?: string) => {
  if (jobId) {
    return axios.get<EventRsp>(`events?job_id=${jobId}`);
  }
}

export const getGlobalEvents = () => {
  return axios.get<EventGlobalRsp>('events');
}
