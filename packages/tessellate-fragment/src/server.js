// @flow

import Koa from 'koa';
import morgan from 'koa-morgan';
import cluster from 'cluster';
import { cpus } from 'os';
import nconf from './nconf';
import logger from './logger';
import routes from './routes';
import error from './error';
import './actions';

const log = logger('server');
const numberOfWorkers = nconf.get('NUMBER_OF_WORKERS') || cpus().length;

export function init(): Koa {
  const app = new Koa();
  const morganFormat = nconf.get('MORGAN_FORMAT');
  const morganSkip = (req, res) => res.statusCode < nconf.get('MORGAN_THRESHOLD');

  return app.use(morgan(morganFormat, { skip: morganSkip })).use(error).use(routes);
}

export function start(port: number | string = nconf.get('APP_PORT')) {
  if (cluster.isMaster) {
    registerMasterToWorkerEvents();
    spawnWorkers(numberOfWorkers);
  } else {
    init().listen(port);
    log.info('listening on port %d', port);
  }
}

function spawnWorkers(numberOfWorkers) {
  log.info(`Spawning ${numberOfWorkers} worker(s)`);
  for (let i = 0; i < numberOfWorkers; i++) {
    cluster.fork();
  }
}

function registerMasterToWorkerEvents() {
  // Ignoring cluster.on() flow errors because of a bug in flow,
  // https://github.com/facebook/flow/issues/3507

  // $FlowIgnore
  cluster.on('fork', handleWorkerFork);
  // $FlowIgnore
  cluster.on('exit', handleWorkerExit);
}

function handleWorkerFork(worker) {
  log.info(`New worker with pid ${worker.process.pid} spawned`);
}

function handleWorkerExit(worker, code) {
  log.info(`Worker ${worker.process.pid} exited with signal code ${code}`);
  restartWorker();
}

function restartWorker() {
  const numberOfActiveWorkers = Object.keys(cluster.workers).length;

  if (numberOfActiveWorkers < numberOfWorkers) {
    spawnWorkers(1);
  }

  if (cluster.isWorker) {
    main();
  }
}

export function main() {
  start();
}

if (require.main === module) {
  start();
}
