import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Concept } from '../../models/concept';
import { ConceptService } from '../../services/concept.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  conceptCtrl = new FormControl();
  filteredConcepts: Observable<Concept[] | undefined> | undefined;
  concepts: Concept[] = [];
  allConcepts: Concept[] | undefined;

  @ViewChild('conceptInput')
  conceptInput!: ElementRef<HTMLInputElement>;

  constructor(
    private conceptService: ConceptService
  ) { }

  ngOnInit(): void {
    this.conceptService.getConcepts().subscribe({
      next: (response) => {
        this.allConcepts = response.sort((c1, c2) => c1.label.localeCompare(c2.label));
        this.filteredConcepts = this.conceptCtrl.valueChanges.pipe(
          startWith(null),
          map((conceptLabel: string | Concept | null) => {
            if (conceptLabel != null) {
              if (typeof (conceptLabel) === 'string') {
                return this._filter(conceptLabel);
              } else {
                return this._filter(conceptLabel.label);
              }
            }
            return this.allConcepts?.slice();
          }
          ));
      }
    });
  }

  add(event: MatChipInputEvent): void {
    if (this.allConcepts == null) {
      return;
    }

    const value = (event.value || '').toLowerCase().trim();

    if (value) {
      const concept = this.allConcepts.find((concept: Concept) => concept.label.toLowerCase() === value);
      if (concept && !this.concepts.includes(concept)) {
        this.concepts.push(concept);
        this.concepts = [...this.concepts];
      }
    }

    event.chipInput?.clear();

    this.conceptCtrl.setValue(null);
  }

  remove(concept: Concept): void {
    const index = this.concepts.indexOf(concept);

    if (index >= 0) {
      this.concepts.splice(index, 1);
      this.concepts = [...this.concepts];
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.allConcepts == null) {
      return;
    }

    const concept = this.allConcepts.find((concept: Concept) => concept.label === event.option.viewValue);
    if (concept && !this.concepts.includes(concept)) {
      this.concepts.push(concept);
      this.concepts = [...this.concepts];
    }
    this.conceptInput.nativeElement.value = '';
    this.conceptCtrl.setValue(null);
  }

  private _filter(conceptLabel: string): Concept[] {
    if (this.allConcepts == null) {
      return [];
    }

    const filterValue = conceptLabel.toLowerCase();

    return this.allConcepts.filter(concept => concept.label.toLowerCase().includes(filterValue));
  }

}
