import { TessellateServer, Problem, log } from '../src'

const server = new TessellateServer();

server.use((_, next) => {
  console.log('Hi, this is middleware.');
  return next();
});

server.router.get('/', ctx => ctx.body = 'Hello!');

server.router.get('/teapot', ctx => {
  log.warn("It's a teapot!");
  ctx.throw(new Problem({
    title: 'Teapot',
    detail: 'I am a teapot.',
    status: 418
  }));
});

server.router.get('/error', ctx => {
  log.error("An error occurred!");
  ctx.throw(new Error('An error.'));
});

server.start(3001, 3002);
log.info('Running on http://localhost:3001');
log.info('Metrics at http://localhost:3002/metrics');
