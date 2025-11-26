import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Statut } from 'src/app/demo/api/statut';
import { StatutService } from 'src/app/demo/service/statut.service';

@Component({
  templateUrl: './crud.component.html',
  providers: [MessageService]
})
export class CrudComponent implements OnInit {

  statutDialog: boolean = false;
  deleteStatutDialog: boolean = false;
  deleteStatutsDialog: boolean = false;

  statuts: Statut[] = [];
  statut: Statut = {};
  selectedStatuts: Statut[] = [];
  submitted: boolean = false;

  cols: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(private statutService: StatutService, private messageService: MessageService) { }

  ngOnInit() {
    this.loadStatuts();

    this.cols = [
      { field: 'libelle', header: 'Libellé' }
    ];
  }

  loadStatuts() {
    this.statutService.getAll().then(data => this.statuts = data);
  }

  openNew() {
    this.statut = {};
    this.submitted = false;
    this.statutDialog = true;
  }

  editStatut(statut: Statut) {
    this.statut = { ...statut };
    this.statutDialog = true;
  }

  deleteStatut(statut: Statut) {
    this.deleteStatutDialog = true;
    this.statut = { ...statut };
  }

  deleteSelectedStatuts() {
    this.deleteStatutsDialog = true;
  }

  confirmDeleteSelected() {
    this.deleteStatutsDialog = false;
    this.selectedStatuts.forEach(s => {
      if (s.id) {
        this.statutService.delete(s.id).then(() => {
          this.statuts = this.statuts.filter(val => val.id !== s.id);
        });
      }
    });
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Statuts supprimés', life: 3000 });
    this.selectedStatuts = [];
  }

  confirmDelete() {
    if (this.statut.id) {
      this.statutService.delete(this.statut.id).then(() => {
        this.statuts = this.statuts.filter(val => val.id !== this.statut.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Statut supprimé', life: 3000 });
        this.statut = {};
        this.deleteStatutDialog = false;
      });
    }
  }

  hideDialog() {
    this.statutDialog = false;
    this.submitted = false;
  }

  saveStatut() {
    this.submitted = true;

    if (this.statut.libelle?.trim()) {
      if (this.statut.id) {
        this.statutService.update(this.statut).then(updated => {
          this.statuts[this.findIndexById(updated.id!)] = updated;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Statut mis à jour', life: 3000 });
          this.statuts = [...this.statuts];
        });
      } else {
        this.statutService.create(this.statut).then(created => {
          this.statuts.push(created);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Statut créé', life: 3000 });
          this.statuts = [...this.statuts];
        });
      }

      this.statutDialog = false;
      this.statut = {};
    }
  }

  findIndexById(id: number): number {
    return this.statuts.findIndex((s) => s.id === id);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
