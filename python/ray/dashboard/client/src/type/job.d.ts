import { Actor } from "./actor";
import { Worker } from './worker'

export interface Job {
  "id": string,
  "name": string,
  "owner": string,
  "language": string,
  "driverEntry": string,
}

export interface JobInfo extends Job {
  "url": string,
  "driverArgs": string[],
  "customConfig": {
    [k: string]: string
  },
  "jvmOptions": string,
  "dependencies": {
    [language: string]: string[]
  },
  "state": string,
  "driverStarted": boolean,
  "submitTime": string,
  "startTime": null| string| number,
  "endTime": null| string| number,
}

export interface JobDetail {
  "jobInfo": JobInfo,
  "jobActors": Actor[],
  "jobWorkers": Worker[]
}

export interface JobDetailRsp {
  "result": JobDetail,
  "timestamp": number,
  "error": null | string
}

export interface JobListRsp {
  "result": Job[],
  "timestamp": number,
  "error": null | string
}