import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Destinataire } from 'src/app/demo/api/destinataire';
import { DestinataireService } from 'src/app/demo/service/destinataire.service';

@Component({
  templateUrl: './crud.component.html',
  providers: [MessageService]
})
export class CrudComponent implements OnInit {

  destinataireDialog: boolean = false;
  deleteDestinataireDialog: boolean = false;
  deleteDestinatairesDialog: boolean = false;

  destinataires: Destinataire[] = [];
  destinataire: Destinataire = {};
  selectedDestinataires: Destinataire[] = [];
  submitted: boolean = false;

  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(private destinataireService: DestinataireService, private messageService: MessageService) { }

  ngOnInit() {
    this.loadDestinataires();

    this.cols = [
      { field: 'nom', header: 'Nom' },
      { field: 'email', header: 'Email' },
      { field: 'telephone', header: 'Téléphone' },
      { field: 'adresse', header: 'Adresse' }
    ];
  }

  loadDestinataires() {
    this.destinataireService.getAll().then(data => this.destinataires = data);
  }

  openNew() {
    this.destinataire = {};
    this.submitted = false;
    this.destinataireDialog = true;
  }

  editDestinataire(destinataire: Destinataire) {
    this.destinataire = { ...destinataire };
    this.destinataireDialog = true;
  }

  deleteDestinataire(destinataire: Destinataire) {
    this.deleteDestinataireDialog = true;
    this.destinataire = { ...destinataire };
  }

  deleteSelectedDestinataires() {
    this.deleteDestinatairesDialog = true;
  }

  confirmDeleteSelected() {
    this.deleteDestinatairesDialog = false;
    this.selectedDestinataires.forEach(d => {
      if (d.id) {
        this.destinataireService.delete(d.id).then(() => {
          this.destinataires = this.destinataires.filter(val => val.id !== d.id);
        });
      }
    });
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Destinataires supprimés', life: 3000 });
    this.selectedDestinataires = [];
  }

  confirmDelete() {
    if (this.destinataire.id) {
      this.destinataireService.delete(this.destinataire.id).then(() => {
        this.destinataires = this.destinataires.filter(val => val.id !== this.destinataire.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Destinataire supprimé', life: 3000 });
        this.destinataire = {};
        this.deleteDestinataireDialog = false;
      });
    }
  }

  hideDialog() {
    this.destinataireDialog = false;
    this.submitted = false;
  }

  saveDestinataire() {
    this.submitted = true;

    if (this.destinataire.nom?.trim()) {
      if (this.destinataire.id) {
        this.destinataireService.update(this.destinataire).then(updated => {
          this.destinataires[this.findIndexById(updated.id!)] = updated;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Destinataire mis à jour', life: 3000 });
          this.destinataires = [...this.destinataires];
        });
      } else {
        this.destinataireService.create(this.destinataire).then(created => {
          this.destinataires.push(created);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Destinataire créé', life: 3000 });
          this.destinataires = [...this.destinataires];
        });
      }

      this.destinataireDialog = false;
      this.destinataire = {};
    }
  }

  findIndexById(id: number): number {
    return this.destinataires.findIndex((d) => d.id === id);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
