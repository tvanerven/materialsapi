import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CONCEPTS } from '../../assets/concepts';
import { Concept } from '../common/concept';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  conceptCtrl = new FormControl();
  filteredConcepts: Observable<Concept[]>;
  concepts: Concept[] = [];
  allConcepts: Concept[] = CONCEPTS.sort();

  @ViewChild('fruitInput')
  conceptInput!: ElementRef<HTMLInputElement>;

  constructor() {
    this.filteredConcepts = this.conceptCtrl.valueChanges.pipe(
      startWith(null),
      map((conceptLabel: string | Concept | null) => {
        if (conceptLabel != null) {
          if (typeof (conceptLabel) === 'string') {
            return this._filter(conceptLabel)
          } else {
            return this._filter(conceptLabel.label);
          }
        }
        return this.allConcepts.slice()
      }
      ));
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').toLowerCase().trim();

    if (value) {
      const concept = this.allConcepts.find((concept: Concept) => concept.label.toLowerCase() === value);
      if (concept && !this.concepts.includes(concept)) {
        this.concepts.push(concept);
      }
    }

    event.chipInput!.clear();

    this.conceptCtrl.setValue(null);
  }

  remove(concept: Concept): void {
    const index = this.concepts.indexOf(concept);

    if (index >= 0) {
      this.concepts.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const concept = this.allConcepts.find((concept: Concept) => concept.label === event.option.viewValue);
    if (concept && !this.concepts.includes(concept)) {
      this.concepts.push(concept);
    }
    this.conceptInput.nativeElement.value = '';
    this.conceptCtrl.setValue(null);
    console.log(this.concepts);
  }

  private _filter(conceptLabel: string): Concept[] {
    const filterValue = conceptLabel.toLowerCase();

    return this.allConcepts.filter(concept => concept.label.toLowerCase().includes(filterValue));
  }

}
