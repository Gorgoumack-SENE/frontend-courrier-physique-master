import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Courrier } from 'src/app/demo/api/courrier';
import { CourrierService } from 'src/app/demo/service/courrier.service';
import { Expediteur } from 'src/app/demo/api/expediteur';
import { Destinataire } from 'src/app/demo/api/destinataire';
import { Statut } from 'src/app/demo/api/statut';
import { ExpediteurService } from 'src/app/demo/service/expediteur.service';
import { DestinataireService } from 'src/app/demo/service/destinataire.service';
import { StatutService } from 'src/app/demo/service/statut.service';

@Component({
  templateUrl: './crud.component.html',
  providers: [MessageService]
})
export class CrudComponent implements OnInit {

  courrierDialog: boolean = false;
  deleteCourrierDialog: boolean = false;
  deleteCourriersDialog: boolean = false;

  courriers: Courrier[] = [];
  courrier: Courrier = {};
  selectedCourriers: Courrier[] = [];
  submitted: boolean = false;

  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  // Dropdowns
  expediteurs: Expediteur[] = [];
  destinataires: Destinataire[] = [];
  statuts: Statut[] = [];

  // Champs temporaires pour dropdown
  selectedExpediteurId?: number;
  selectedDestinataireId?: number;
  selectedStatutId?: number;

  constructor(
    private courrierService: CourrierService,
    private expediteurService: ExpediteurService,
    private destinataireService: DestinataireService,
    private statutService: StatutService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadCourriers();
    this.loadExpediteurs();
    this.loadDestinataires();
    this.loadStatuts();

    this.cols = [
      { field: 'numero', header: 'Numéro' },
      { field: 'dateReception', header: 'Date réception' },
      { field: 'objet', header: 'Objet' },
      { field: 'expediteur.nom', header: 'Expéditeur' },
      { field: 'destinataire.nom', header: 'Destinataire' },
      { field: 'statut.libelle', header: 'Statut' }
    ];
  }

  // Chargement des données
  loadCourriers() {
    this.courrierService.getAll().then(data => this.courriers = data);
  }

  loadExpediteurs() {
    this.expediteurService.getAll().then(data => this.expediteurs = data);
  }

  loadDestinataires() {
    this.destinataireService.getAll().then(data => this.destinataires = data);
  }

  loadStatuts() {
    this.statutService.getAll().then(data => this.statuts = data);
  }

  // Ouverture du formulaire
  openNew() {
    this.courrier = {};
    this.submitted = false;
    this.selectedExpediteurId = undefined;
    this.selectedDestinataireId = undefined;
    this.selectedStatutId = undefined;
    this.courrierDialog = true;
  }

  // Edition
  editCourrier(courrier: Courrier) {
    this.courrier = { ...courrier };
    this.selectedExpediteurId = courrier.expediteur?.id;
    this.selectedDestinataireId = courrier.destinataire?.id;
    this.selectedStatutId = courrier.statut?.id;
    this.courrierDialog = true;
  }

  // Suppression
  deleteCourrier(courrier: Courrier) {
    this.deleteCourrierDialog = true;
    this.courrier = { ...courrier };
  }

  deleteSelectedCourriers() {
    this.deleteCourriersDialog = true;
  }

  confirmDeleteSelected() {
    this.deleteCourriersDialog = false;
    this.selectedCourriers.forEach(c => {
      if (c.id) {
        this.courrierService.delete(c.id).then(() => {
          this.courriers = this.courriers.filter(val => val.id !== c.id);
        });
      }
    });
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Courriers supprimés', life: 3000 });
    this.selectedCourriers = [];
  }

  confirmDelete() {
    if (this.courrier.id) {
      this.courrierService.delete(this.courrier.id).then(() => {
        this.courriers = this.courriers.filter(val => val.id !== this.courrier.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Courrier supprimé', life: 3000 });
        this.courrier = {};
        this.deleteCourrierDialog = false;
      });
    }
  }

  hideDialog() {
    this.courrierDialog = false;
    this.submitted = false;
  }

  // Enregistrement save
  saveCourrier() {
    this.submitted = true;

    if (this.courrier.numero?.trim()) {
      const payload: Courrier = {
        ...this.courrier,
        expediteur: { id: this.selectedExpediteurId! },
        destinataire: { id: this.selectedDestinataireId! },
        statut: { id: this.selectedStatutId! }
      };

      if (this.courrier.id) {
        this.courrierService.update(payload).then(updated => {
          const index = this.findIndexById(updated.id!);
          this.courriers[index] = updated;
          this.courriers = [...this.courriers];
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Courrier mis à jour', life: 3000 });
        });
      } else {
        this.courrierService.create(payload).then(created => {
          this.courriers.push(created);
          this.courriers = [...this.courriers];
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Courrier créé', life: 3000 });
        });
        console.log("courrier enrigistrer", this.courriers) ;
      }

      this.courrierDialog = false;
      this.courrier = {};
    }
  }

  findIndexById(id: number): number {
    return this.courriers.findIndex(c => c.id === id);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
