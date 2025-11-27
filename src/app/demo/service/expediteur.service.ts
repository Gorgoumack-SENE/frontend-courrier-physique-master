import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expediteur } from 'src/app/demo/api/expediteur';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class ExpediteurService {
  
  private baseUrl = `${environment.apiBaseUrl}/expediteur`;

  constructor(private http: HttpClient) {}

  getAll(): Promise<Expediteur[]> {
    return firstValueFrom(this.http.get<Expediteur[]>(this.baseUrl));
  }
  getById(id: number): Promise<Expediteur> {
    return firstValueFrom(this.http.get<Expediteur>(`${this.baseUrl}/${id}`));
  }
  create(c: Expediteur): Promise<Expediteur> {
    return firstValueFrom(this.http.post<Expediteur>(this.baseUrl, c));
  }
  update(c: Expediteur): Promise<Expediteur> {
    return firstValueFrom(this.http.put<Expediteur>(`${this.baseUrl}/${c.id}`, c));
  }
  delete(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${id}`));
  }
}
