import { Typography } from "@material-ui/core";
import React from "react";
import { formatDuration } from "../../../../common/formatUtils";
import { Accessor } from "../../../../common/tableUtils";
import {
  ClusterFeature,
  NodeFeatureData,
  NodeFeature,
  NodeInfoFeature,
  WorkerFeatureData,
  WorkerFeature,
} from "./types";

const getUptime = (bootTime: number) => Date.now() / 1000 - bootTime;

export const ClusterUptime: ClusterFeature = ({ nodes }) => (
  <Typography color="textSecondary" component="span" variant="inherit">
    N/A
  </Typography>
);

export const NodeUptime: NodeFeature = ({ node }) => (
  <React.Fragment>{formatDuration(getUptime(node.boot_time))}</React.Fragment>
);

export const nodeUptimeAccessor: Accessor<NodeFeatureData> = ({ node }) =>
  getUptime(node.boot_time);

export const WorkerUptime: WorkerFeature = ({ worker }) => (
  <React.Fragment>
    {formatDuration(getUptime(worker.create_time))}
  </React.Fragment>
);

const workerUptimeAccessor: Accessor<WorkerFeatureData> = ({ worker }) =>
  getUptime(worker.create_time);

const uptimeFeature: NodeInfoFeature = {
  id: "uptime",
  NodeFeature: NodeUptime,
  WorkerFeature: WorkerUptime,
  nodeAccessor: nodeUptimeAccessor,
  workerAccessor: workerUptimeAccessor,
};

export default uptimeFeature;
