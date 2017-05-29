import { TessellateServer, Problem } from '../src'

const server = new TessellateServer();

server.use((_, next) => {
  console.log('Hi, this is middleware.');
  return next();
});

server.router.get('/', ctx => ctx.body = 'Hello!');

server.router.get('/teapot', ctx => ctx.throw(
  new Problem({
    title: 'Teapot',
    detail: 'I am a teapot.',
    status: 418
  }))
);

server.start(3001);
