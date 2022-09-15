import os from "os";
import express from "express";

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getMemUsage = () => {
  const bytesUsed = os.totalmem() - os.freemem();
  const utilization = bytesUsed / os.totalmem();

  return `Currently using: ${utilization.toFixed(2)}%, ${formatBytes(
    bytesUsed
  )}`;
};

const startResourceMonitor = (port = 4000) => {
  const app = express();
  const appPort = port || 4000;
  const intervalDelay = 30000;

  setInterval(() => {
    console.log(getMemUsage());
  }, intervalDelay);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/usage", (req, res) => {
    res.send(getMemUsage());
  });

  app.listen(appPort, () => {
    console.log(`Resource monitor listening on port ${appPort}, `);
    console.log(getMemUsage());
  });
};

// test
// startResourceMonitor();

export { startResourceMonitor };
