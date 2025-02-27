import { PactV4, V3MockServer } from '@pact-foundation/pact';
import { TaskService } from './tasks.service';
import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import axios from 'axios';

const provider = new PactV4({
  consumer: 'TodoListFrontend',
  provider: 'TodoListBackend',
  port: 8080,
  dir: "/home/thecooldrop/code/todo-list-angular-spring-oidc/frontend/pacts",
});

describe('GET v1 Tasks', () => {


  let taskService: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptorsFromDi()), TaskService],
    });
    taskService = TestBed.inject(TaskService);
  });



    it('should returns a list of Tasks (v4)', async () => {

        await provider.addInteraction()
            .given('There are tasks')
            .uponReceiving('a request for all tasks')
            .withRequest("GET", "/api/v1/tasks")
            .willRespondWith(200, (builder) => {
                builder.headers({"Content-Type":"application/json"})
                builder.jsonBody(["First Task"]);
            })
            .executeTest((mockserver) => {
                return taskService.getTasks().toPromise().then((res) => {
                    console.log(res)
                    expect(res).toEqual(["First Task"]);
                });
            })

    });
});
