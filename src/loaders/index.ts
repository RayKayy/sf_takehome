import { FastifyInstance } from 'fastify';

import fastifyLoader from './fastify';
import prismaLoader from './prisma';

export default async ({ fastifyApp }: { fastifyApp: FastifyInstance }) => {
  const prismaClient = await prismaLoader();
  await fastifyLoader({ fastifyApp, prismaClient });
  return { fastifyApp };
};
