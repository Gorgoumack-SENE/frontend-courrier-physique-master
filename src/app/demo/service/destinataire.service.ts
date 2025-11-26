import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Destinataire } from 'src/app/demo/api/destinataire';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class DestinataireService {
  
  private baseUrl = `${environment.apiBaseUrl}/destinataire`;

  constructor(private http: HttpClient) {}

  getAll(): Promise<Destinataire[]> {
    return firstValueFrom(this.http.get<Destinataire[]>(this.baseUrl));
  }
  getById(id: number): Promise<Destinataire> {
    return firstValueFrom(this.http.get<Destinataire>(`${this.baseUrl}/${id}`));
  }
  create(c: Destinataire): Promise<Destinataire> {
    return firstValueFrom(this.http.post<Destinataire>(this.baseUrl, c));
  }
  update(c: Destinataire): Promise<Destinataire> {
    return firstValueFrom(this.http.put<Destinataire>(`${this.baseUrl}/${c.id}`, c));
  }
  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${id}`));
  }
}
