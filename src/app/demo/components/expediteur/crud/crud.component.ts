import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Expediteur } from 'src/app/demo/api/expediteur';
import { ExpediteurService } from 'src/app/demo/service/expediteur.service';

@Component({
  templateUrl: './crud.component.html',
  providers: [MessageService]
})
export class CrudComponent implements OnInit {

  expediteurDialog: boolean = false;
  deleteExpediteurDialog: boolean = false;
  deleteExpediteursDialog: boolean = false;

  expediteurs: Expediteur[] = [];
  expediteur: Expediteur = {};
  selectedExpediteurs: Expediteur[] = [];
  submitted: boolean = false;

  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(private expediteurService: ExpediteurService, private messageService: MessageService) { }

  ngOnInit() {
    this.loadExpediteurs();

    this.cols = [
      { field: 'nom', header: 'Nom' },
      { field: 'email', header: 'Email' },
      { field: 'telephone', header: 'Téléphone' },
      { field: 'adresse', header: 'Adresse' }
    ];
  }

  loadExpediteurs() {
    this.expediteurService.getAll().then(data => this.expediteurs = data);
  }

  openNew() {
    this.expediteur = {};
    this.submitted = false;
    this.expediteurDialog = true;
  }

  editExpediteur(expediteur: Expediteur) {
    this.expediteur = { ...expediteur };
    this.expediteurDialog = true;
  }

  deleteExpediteur(expediteur: Expediteur) {
    this.deleteExpediteurDialog = true;
    this.expediteur = { ...expediteur };
  }

  deleteSelectedExpediteurs() {
    this.deleteExpediteursDialog = true;
  }

  confirmDeleteSelected() {
    this.deleteExpediteursDialog = false;
    this.selectedExpediteurs.forEach(e => {
      if (e.id) {
        this.expediteurService.delete(e.id).then(() => {
          this.expediteurs = this.expediteurs.filter(val => val.id !== e.id);
        });
      }
    });
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Expéditeurs supprimés', life: 3000 });
    this.selectedExpediteurs = [];
  }

  confirmDelete() {
    if (this.expediteur.id) {
      this.expediteurService.delete(this.expediteur.id).then(() => {
        this.expediteurs = this.expediteurs.filter(val => val.id !== this.expediteur.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Expéditeur supprimé', life: 3000 });
        this.expediteur = {};
        this.deleteExpediteurDialog = false;
      });
    }
  }

  hideDialog() {
    this.expediteurDialog = false;
    this.submitted = false;
  }

  saveExpediteur() {
    this.submitted = true;

    if (this.expediteur.nom?.trim()) {
      if (this.expediteur.id) {
        this.expediteurService.update(this.expediteur).then(updated => {
          this.expediteurs[this.findIndexById(updated.id!)] = updated;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Expéditeur mis à jour', life: 3000 });
          this.expediteurs = [...this.expediteurs];
        });
      } else {
        this.expediteurService.create(this.expediteur).then(created => {
          this.expediteurs.push(created);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Expéditeur créé', life: 3000 });
          this.expediteurs = [...this.expediteurs];
        });
      }

      this.expediteurDialog = false;
      this.expediteur = {};
    }
  }

  findIndexById(id: number): number {
    return this.expediteurs.findIndex((e) => e.id === id);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
