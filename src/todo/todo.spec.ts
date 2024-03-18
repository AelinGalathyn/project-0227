import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodoModule } from "./todo.module";
import { Todo } from "./todo.service";

describe('TodoController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/todos (GET)', () => {
    return request(app.getHttpServer())
      .get('/todos')
      .expect(200)
      .expect([]);
  });

  it('/todos (POST)', () => {
    return request(app.getHttpServer())
      .post('/todos')
      .send({ text : 'test' })
      .expect(201)
      .expect((response) => {
        expect(response.body).toEqual({ text : 'test', id : expect.any(Number)})
      });
  })

  it('/todos (POST) 2', () => {
    return request(app.getHttpServer())
      .post('/todos')
      .send({ text : '' })
      .expect(400)
  })

  it("/todo (POST) nincs text", () => {
    return request(app.getHttpServer())
      .post('/todo')
      .expect(400)
  })

  it("/todo (POST) extra mező", () => {
    return request(app.getHttpServer())
      .post('/todo')
      .send({text: "test", date: "03.12."})
      .expect(400)
  });

  it("/todo (POST) nem jó a text típusa", () => {
    return request(app.getHttpServer())
      .post('/todo')
      .send({text: 0})
      .expect(400)
  });

  it("/todo:id (GET) nem létező id", () => {
    return request(app.getHttpServer())
      .get('/todo/10')
      .expect(404)
  });

  it('/todo/id (GET) exists', async() => {
    const req = await request(app.getHttpServer())
      .post('/todo')
      .send({text : 'test'});
    const todo = req.body as Todo;

    return request(app.getHttpServer())
      .get(`/todo/${todo.id}`)
      .expect(200)
      .expect(todo)
  })

  it("/todo/id (PUT) üres text", async () => {
    const req = await request(app.getHttpServer())
      .post('/todo')
      .send({text : 'test'});
    const todo = req.body as Todo;

    return request(app.getHttpServer())
      .put(`/todo/${todo.id}`)
      .expect(400)
  });

  it("/todo/id (PUT) updatel", async () => {
    const req = await request(app.getHttpServer())
      .post('/todo')
      .send({text : 'test'});
    const todo = req.body as Todo;

    return request(app.getHttpServer())
      .put(`/todo/${todo.id}`)
      .send({text: "updated"})
      .expect(200);
  });

  it("/todo/id (DELETE) nem találja meg az idt", () => {
    return request(app.getHttpServer())
      .delete(`/todo/1`)
      .expect(404);
  });

  it("/todo/id (DELETE) kitörli", async () => {
    const req = await request(app.getHttpServer())
      .post('/todo')
      .send({text : 'test'});
    const todo = req.body as Todo;

    const req2 = await request(app.getHttpServer())
      .get('/todo');
    const todos = req2.body;
    console.log(todos);

    const req3 = await request(app.getHttpServer())
      .delete(`/todo/${todo.id}`)
    const todos2 = req3.body;
    console.log(todos2);

    return todos.find(item => item.id === todo.id) && !todos2.find(item => item.id === todo.id);
  });
});