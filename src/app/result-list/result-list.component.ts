import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, OnChanges } from '@angular/core';
import { MATERIALS } from '../../assets/materials';
import { Material } from '../common/material';
import { CONCEPTS } from '../../assets/concepts';
import { Concept } from '../common/concept';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ResultListComponent implements OnChanges {
  @Input() conceptFilter: Concept[] = [];

  dataSource = MATERIALS;
  columnsToDisplay = ['name', 'author'];
  expandedMaterial: Material | null | undefined;

  ngOnChanges() {
    if (this.conceptFilter.length > 0) {
      this.dataSource = MATERIALS;
    }
    this.dataSource = MATERIALS.filter((material: Material) => {
      for (const conceptFilter of this.conceptFilter) {
        if (!material.concept.includes(conceptFilter.rdfAbout)) {
          return false;
        }
      }
      return true;
    });
  }

  getConcept(rdfABout: string): Concept | undefined {
    return CONCEPTS.find((concept: Concept) => concept.rdfAbout === rdfABout);
  }
}