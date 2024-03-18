import { Get, Injectable, NotFoundException } from "@nestjs/common";
import { IsNotEmpty, IsNumber, IsString, ValidationError } from "class-validator";
import { PrismaService } from "../prisma/prisma.service";

export class Todo{
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsNumber()
  id: number
}

export class CreateTodo {
  @IsNotEmpty()
  @IsString()
  text: string;
}

@Injectable()
export class TodoService {
  constructor(
    private readonly prismaService: PrismaService) { }
  getTodos() {
    return this.todos;
  }

  createTodo(input: CreateTodo) {
    if(input.text === undefined){
      throw new ValidationError();
    }
    const todo: Todo = {
      text: input.text,
      id: Math.random()*100,
    }
    this.todos.push(todo);
    return todo;
  }

  getTodo(id: number){
    const todo = this.todos.find(item => item.id === id);
    if(todo === undefined){
      throw new NotFoundException();
    }
    return todo;
  }

  private readonly todos: Todo[] = [];

  updateTodo(id: number, todoIn: CreateTodo) {
      const todo = this.todos.find(item => item.id === id);
      if(todo === undefined) {
        throw new NotFoundException();
      }
      else {
        todo.text = todoIn.text;
      }
    return todo;
  }

  deleteTodo(id: number){
    const todo = this.todos.findIndex(item => item.id === id);
    if(todo === -1) {
      throw new NotFoundException();
    }
    else {
      return this.todos.splice(todo, 1);
    }
  }
}
