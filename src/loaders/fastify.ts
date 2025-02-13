import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { PrismaClient } from '@prisma/client';

export default async ({
  fastifyApp,
  prismaClient,
}: {
  fastifyApp: FastifyInstance;
  prismaClient: PrismaClient;
}) => {
  await fastifyApp.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Sleekflow ToDo',
        description: 'Testing the Sleekflow ToDo API',
        version: '0.1.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
      tags: [{ name: 'todo', description: 'Todo related end-points' }],
      // components: {
      //   securitySchemes: {
      //     apiKey: {
      //       type: 'apiKey',
      //       name: 'apiKey',
      //       in: 'header',
      //     },
      //   },
      // },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
    },
  });

  fastifyApp.get<{
    Params: { id: string };
  }>(
    '/todos/:id',
    {
      schema: {
        description: 'Get a todo item by id',
        tags: ['todo'],
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'todo item id',
            },
          },
        },
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const foundToDo = await prismaClient.toDo.findUnique({
        where: {
          id,
        },
      });
      res.code(200).send(foundToDo);
    }
  );

  await fastifyApp.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
  });

  await fastifyApp.ready();
  console.log(fastifyApp.swagger());
};
