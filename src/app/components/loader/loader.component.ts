import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  color = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  isLoading: boolean | undefined;

  constructor(
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.loaderService.isLoadingSubj.subscribe({
      next: (value) => {
        setTimeout(() => {
          this.isLoading = value;
        }, 0);
      }
    });
  }
}
