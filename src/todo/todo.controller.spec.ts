import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { Todo, TodoService } from "./todo.service";
import any = jasmine.any;
import { NotFoundException } from "@nestjs/common";

describe('TodoController', () => {
  let controller: TodoController;

  beforeEach(async () => {
    const mockTodoService = {
      getTodo: (id: string) => {
      if(id==='42'){
        return {text: 'test'}
      }},
      getTodos: () => [{text: 'test'}],
      createTodo: () => [{text: 'test', id: '0123'}],
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [{
        provide: TodoService,
        useValue: mockTodoService,
      }],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should return the list of todos', () => {
    const todos = controller.getTodos();
    expect(todos).toEqual([{text: 'test'}]);
  });

  it("should return the single todo returned by todoService.getTodo()", () => {
    const todo = controller.getTodo('42');
    expect(todo).toEqual({text: 'test'});
  });

  it("should return the two todos returned by todoService.getTodos()", () => {
    const todo = controller.createTodo('test');
    expect(todo).toEqual([{text: 'test', id: expect.any(String)}]);
  });

  it("should return the updated todo", () => {
    const todo1 = controller.createTodo('text');
    const todo = controller.updateTodo(todo1.id, 'nem');
    expect(todo).toEqual({text: 'nem', id: '1'});
  });

  it("should return undefined when given nonexistent id", () => {
    expect(() => controller.updateTodo('1', 'test')).toThrow(NotFoundException);
  });
});
