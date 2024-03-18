import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { text } from "express";
import { NotFoundException } from "@nestjs/common";

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(service.getTodos()).toEqual([]);
  });

  it('should return a single todo', () => {
    service.createTodo({text: 'test'});
    expect(service.getTodos()).toEqual([{text: 'test'}]);
  });

  it('should return two todo', () => {
    service.createTodo({text: 'test'});
    service.createTodo({text: 'test'});
    expect(service.getTodos()).toEqual([
      {text: 'test', id: expect.any(String)},
      {text: 'test', id: expect.any(String)}
    ]);
  });

  it("should ", () => {
    const createdTodo = service.createTodo({text: 'test'});
    const todo = service.getTodo(createdTodo.id);
    expect(todo).toEqual({text: 'test', id: expect.any(String)});
  });

  it("should not find 42", () => {
    const todo = service.getTodo('42');
    expect(todo).toEqual(undefined);
  });

  it("should return the updated todo", () => {
    const todo = service.createTodo({'text': 'test'});
    const todo2 = service.updateTodo(todo.id, 'nem');
    expect(service.getTodo(todo.id)).toEqual({text: 'nem', id: todo.id});
  });

  it("should return undefined when given nonexistent id", () => {
    expect(() => service.updateTodo('1', 'test')).toThrow(NotFoundException);
  });
});
