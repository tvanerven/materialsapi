import { Component, ViewChild } from '@angular/core';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { EnvironmentService } from './services/environment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('searchBar') searchBar!: SearchBarComponent;

  constructor(
    private envService: EnvironmentService
  ) { }

  get apiUrl(): string {
    return this.envService.environment.apiUrl;
  }

}
