import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Concept } from '../../models/concept';
import { ConceptService } from '../../services/concept.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  readonly SEARCH_BAR_LIMIT = 10;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  conceptCtrl = new FormControl();
  filteredConcepts: Observable<Concept[] | undefined> | undefined;
  concepts: Concept[] = [];
  allConcepts: Concept[] | undefined;

  private searchBarChangeSubject = new Subject<Concept[]>();
  searchBarChange = this.searchBarChangeSubject.asObservable();

  @ViewChild('conceptInput')
  conceptInput!: ElementRef<HTMLInputElement>;

  constructor(
    private conceptService: ConceptService,
    private snackBar: MatSnackBar
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
      this.addConceptInSearchBar(concept);
    }

    event.chipInput?.clear();

    this.conceptCtrl.setValue(null);
  }

  addConceptInSearchBar(concept: Concept | undefined): void {
    if (concept == null) {
      return;
    }

    const conceptAlreadySet = this.concepts.some((c: Concept) => c.label === concept.label);
    if (conceptAlreadySet) {
      this.snackBar.open('Term already selected!', 'Hide',
        {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      return;
    }

    if (this.concepts.length === this.SEARCH_BAR_LIMIT) {
      this.concepts[this.SEARCH_BAR_LIMIT - 1] = concept;
    } else {
      this.concepts.push(concept);
    }
    this.searchBarChangeSubject.next(this.concepts);
  }

  remove(concept: Concept): void {
    const index = this.concepts.indexOf(concept);

    if (index >= 0) {
      this.concepts.splice(index, 1);
      this.searchBarChangeSubject.next(this.concepts);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.allConcepts == null) {
      return;
    }

    const concept = this.allConcepts.find((concept: Concept) => concept.label === event.option.viewValue);
    this.addConceptInSearchBar(concept);
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
