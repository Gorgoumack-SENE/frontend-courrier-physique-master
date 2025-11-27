import { Expediteur } from './expediteur';
import { Destinataire } from './destinataire';
import { Statut } from './statut';


export interface Courrier {
  id?: number;
  numero?: string;
  dateReception?: Date; // ou Date
  objet?: string;
  expediteur?: Expediteur;
  destinataire?: Destinataire;
  statut?: Statut;
}


