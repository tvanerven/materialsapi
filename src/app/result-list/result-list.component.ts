import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MATERIALS } from '../../assets/materials';
import { Material } from '../common/material';
import { CONCEPTS } from '../../assets/concepts';
import { Concept } from '../common/concept';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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
export class ResultListComponent implements OnChanges, AfterViewInit {
  @Input() conceptFilter: Concept[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource(MATERIALS);
  columnsToDisplay = ['name', 'author'];
  expandedMaterial: Material | null | undefined;

  ngOnChanges() {
    if (this.conceptFilter.length > 0) {
      this.dataSource.data = MATERIALS;
    }

    this.dataSource.data = MATERIALS.filter((material: Material) => {
      for (const conceptFilter of this.conceptFilter) {
        if (!material.concept.includes(conceptFilter.rdfAbout)) {
          return false;
        }
      }
      return true;
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getConcept(rdfABout: string): Concept | undefined {
    return CONCEPTS.find((concept: Concept) => concept.rdfAbout === rdfABout);
  }
}