import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { Prisma, PrismaClient, Status } from '@prisma/client';

type DefaultValues = 'id' | 'userId' | 'createdAt' | 'updatedAt';

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

  fastifyApp.post<{
    Body: Omit<Prisma.ToDoCreateInput, DefaultValues>;
  }>(
    '/todos',
    {
      schema: {
        description: 'Create a new todo item',
        tags: ['todo'],
        body: {
          type: 'object',
          required: ['name', 'status', 'dueDate'],
          properties: {
            name: {
              type: 'string',
              description: 'todo item name',
            },
            description: {
              type: 'string',
              description: 'todo item description',
            },
            status: {
              type: 'string',
              default: Status.PENDING,
              enum: [Status.PENDING, Status.COMPLETED, Status.IN_PROGRESS],
              description: 'todo item status',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'todo item due date',
            },
          },
        },
      },
    },
    async (req, res) => {
      const toDoItem = req.body;
      const foundToDo = await prismaClient.toDo.create({
        data: {
          userId: 'testId',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...toDoItem,
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
