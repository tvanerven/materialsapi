import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewChecked, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Material } from '../../models/material';
import { Concept } from '../../models/concept';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialService } from '../../services/material.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))]),
  ],
})
export class ResultListComponent implements OnInit, AfterViewChecked {
  @Input() searchBar: SearchBarComponent | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator | null;
  @ViewChild(MatSort) sort!: MatSort | null;

  dataSource: MatTableDataSource<Material> | undefined;
  columnsToDisplay = ['name', 'author', 'date'];
  expandedMaterial: Material | null | undefined;

  constructor(
    private materialService: MaterialService
  ) { }

  ngOnInit(): void {
    this.updateMaterialList();
    this.searchBar?.searchBarChange.subscribe({
      next: () => this.updateMaterialList()
    });
  }

  ngAfterViewChecked(): void {
    if (this.dataSource == null) {
      return;
    }

    if (this.dataSource.paginator == null && this.paginator != null) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.dataSource.sort == null && this.paginator != null) {
      this.dataSource.sort = this.sort;
    }
  }

  updateMaterialList(): void {
    this.materialService.getMaterials(this.getRdfAboutFilter()).subscribe({
      next: (response) => {
        response.sort((m1, m2) => m1.name.localeCompare(m2.name));

        if (this.dataSource == null) {
          this.dataSource = new MatTableDataSource(response);
        } else {
          this.dataSource.data = response;

          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }
        }
      },
      error: (error) => {
        if (error.status === 404) {
          if (this.dataSource == null) {
            return;
          }
          this.dataSource.data = [];
        }
      }
    });
  }

  getRdfAboutFilter(): string[] {
    if (this.searchBar == null) {
      return [];
    }

    const rdfAbout = [];
    for (const concept of this.searchBar.concepts) {
      rdfAbout.push(concept.rdfAbout);
    }
    return rdfAbout;
  }

  onClickConcept(concept: Concept): void {
    if (this.searchBar == null) {
      return;
    }
    this.searchBar.addConceptInSearchBar(concept);
  }

}