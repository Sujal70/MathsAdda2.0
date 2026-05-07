import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Update this to your Render URL
const API_BASE_URL = 'https://maths-adda-backend.onrender.com/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  // Auth APIs
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password });
  }

  register(data: { name: string; email: string; password: string; phone: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  // Course APIs
  getCourses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/courses`);
  }

  getCoursesByClass(classLevel: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/courses/class/${classLevel}`);
  }

  // Student APIs
  getStudentProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/students/profile`);
  }

  enrollInCourse(courseId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/students/enroll/${courseId}`, {});
  }
}