import { Module, ValidationPipe } from "@nestjs/common";
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { APP_PIPE } from "@nestjs/core";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [TodoController],
  providers: [TodoService, {
    provide: APP_PIPE,
    useValue: new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  }, PrismaService],
})
export class TodoModule {}
