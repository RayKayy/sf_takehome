import fastify from 'fastify';
import loader from './loaders';

async function startServer() {
  const { fastifyApp } = await loader({ fastifyApp: fastify() });
  console.log('Testing');
  fastifyApp.listen({ port: 3000 });
}

startServer();
