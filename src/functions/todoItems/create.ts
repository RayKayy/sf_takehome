import { PrismaClient, ToDo } from '@prisma/client';

export default async (todoItem: ToDo, prismaClient: PrismaClient) => {
  const newTodoItem = await prismaClient.toDo.create({
    data: todoItem,
  });
  return newTodoItem;
};
