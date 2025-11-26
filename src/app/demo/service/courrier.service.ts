import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Courrier } from 'src/app/demo/api/courrier';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class CourrierService {
  
  private baseUrl = `${environment.apiBaseUrl}/destinataire`;

  constructor(private http: HttpClient) {}

  getAll(): Promise<Courrier[]> {
    return firstValueFrom(this.http.get<Courrier[]>(this.baseUrl));
  }
  getById(id: number): Promise<Courrier> {
    return firstValueFrom(this.http.get<Courrier>(`${this.baseUrl}/${id}`));
  }
  create(c: Courrier): Promise<Courrier> {
    return firstValueFrom(this.http.post<Courrier>(this.baseUrl, c));
  }
  update(c: Courrier): Promise<Courrier> {
    return firstValueFrom(this.http.put<Courrier>(`${this.baseUrl}/${c.id}`, c));
  }
  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${id}`));
  }
}
