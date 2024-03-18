import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CreateTodo, Todo, TodoService } from "./todo.service";

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getTodos() {
    return this.todoService.getTodos()
  }

  @Get(':id')
  getTodo(@Param('id')id: number) {
    return this.todoService.getTodo(+id);
  }

  @Post()
  createTodo(@Body() todo : CreateTodo) {
    return this.todoService.createTodo(todo);
  }

  @Put(':id')
  updateTodo(@Param('id')id: number, @Body()todo: CreateTodo) {
    return this.todoService.updateTodo(+id, todo);
  }

  @Delete(':id')
  deleteTodo(@Param('id')id: number){
    return this.todoService.deleteTodo(+id);
  }
}
