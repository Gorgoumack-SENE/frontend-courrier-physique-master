import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Statut } from 'src/app/demo/api/statut';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class StatutService {
  
  private baseUrl = `${environment.apiBaseUrl}/statut`;

  constructor(private http: HttpClient) {}

  getAll(): Promise<Statut[]> {
    return firstValueFrom(this.http.get<Statut[]>(this.baseUrl));
  }
  getById(id: number): Promise<Statut> {
    return firstValueFrom(this.http.get<Statut>(`${this.baseUrl}/${id}`));
  }
  create(c: Statut): Promise<Statut> {
    return firstValueFrom(this.http.post<Statut>(this.baseUrl, c));
  }
  update(c: Statut): Promise<Statut> {
    return firstValueFrom(this.http.put<Statut>(`${this.baseUrl}/${c.id}`, c));
  }
  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${id}`));
  }
}
