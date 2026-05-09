import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  // Course APIs (Phase 2)
  getCourses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/courses`);
  }

  getCoursesByClass(classLevel: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/courses/class/${classLevel}`);
  }

  // Student APIs (Phase 2)
  getStudentProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/students/profile`);
  }

  enrollInCourse(courseId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/students/enroll/${courseId}`, {});
  }
}
