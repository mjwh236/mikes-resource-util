/**
 * TODO
 * Delete logs after X days
 * UI Dashboard
 */

import os from "os";
import fs from "fs";
import express from "express";

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getMemUsageString = () => {
  const bytesUsed = os.totalmem() - os.freemem();
  const utilization = bytesUsed / os.totalmem();

  return `Currently using: ${utilization.toFixed(2)}%, ${formatBytes(
    bytesUsed
  )}`;
};

const getMemUsage = () => {
  const bytesUsed = os.totalmem() - os.freemem();
  const utilization = bytesUsed / os.totalmem();

  return {
    percent: `${utilization.toFixed(2)}%`,
    bytesUsed: bytesUsed,
    amountUsed: formatBytes(bytesUsed),
  };
};

const logRamUsage = (dir) => {
  const timeStamp = Date.now();
  const data = JSON.stringify({ time: timeStamp, ...getMemUsage() });

  fs.writeFileSync(`${dir}/${timeStamp}.json`, data);
};

/**
 *
 * @param {number} port The port to host the resource monitor
 * @param {*} delay The interval polling rate delay
 * @param {*} dir The directory to store the resource logs
 */
const startResourceMonitor = (port, delay, dir) => {
  const app = express();
  const appPort = port || 4000;
  const intervalDelay = delay || 30000;
  const logsDir = dir || "logs";

  if (!fs.existsSync(logsDir)) {
    console.log(`directory: ${logsDir} does not exist... creating it`);
    fs.mkdirSync(logsDir);
  }

  setInterval(() => {
    console.log(getMemUsageString());
    logRamUsage(logsDir);
  }, intervalDelay);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/usage", (req, res) => {
    res.send(getMemUsageString());
  });

  app.listen(appPort, () => {
    console.log(`Resource monitor listening on port ${appPort}, `);
    console.log(getMemUsageString());
    logRamUsage(logsDir);
  });
};

// test
// startResourceMonitor();

export { startResourceMonitor };
