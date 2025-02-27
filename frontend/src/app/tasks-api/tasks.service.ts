import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getTasks() {
    console.log("in service");
    return this.http.get("http://localhost:8080/api/v1/tasks");
  }
}