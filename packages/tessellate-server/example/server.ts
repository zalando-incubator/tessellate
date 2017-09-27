import { TessellateServer, Problem, log, request } from '../src'

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

server.router.get('/zalando', async ctx => {
  const response = await request({
    method: 'GET',
    uri: 'https://api.github.com/users/zalando',
    json: true,
    headers: {
      'User-Agent': 'tessellate'
    }
  });
  ctx.body = response.body;
});

server.start(3001, 3002);
log.info('Running on http://localhost:3001');
log.info('Metrics at http://localhost:3002/metrics');
