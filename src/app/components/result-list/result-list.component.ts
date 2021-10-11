import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterContentChecked, AfterViewChecked, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Material } from '../../common/material';
import { Concept } from '../../common/concept';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialService } from '../../services/material.service';

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
export class ResultListComponent implements OnChanges, OnInit, AfterViewChecked {
  @Input() conceptFilter: Concept[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator | null;
  @ViewChild(MatSort) sort!: MatSort | null;

  dataSource: MatTableDataSource<Material> | undefined;
  columnsToDisplay = ['name', 'author'];
  expandedMaterial: Material | null | undefined;

  constructor(
    private materialService: MaterialService
  ) { }

  ngOnChanges(): void {
    if (this.dataSource == null) {
      return;
    }
    this.updateMaterialList();
  }

  ngOnInit(): void {
    this.updateMaterialList();
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
    const rdfAbout = [];
    for (const concept of this.conceptFilter) {
      rdfAbout.push(concept.rdfAbout);
    }
    return rdfAbout;
  }

}