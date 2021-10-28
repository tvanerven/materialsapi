import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { EnvironmentService } from './services/environment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('searchBar') searchBar!: SearchBarComponent;

  constructor(
    private envService: EnvironmentService
  ) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.showHideFooter);

    const content = document.getElementById('content');
    if (content != null) {
      new ResizeObserver(() => this.showHideFooter()).observe(content);
    }
  }

  get apiUrl(): string {
    return this.envService.environment.apiUrl;
  }

  showHideFooter(): void {
    const d = document;
    const body = d.body;

    const height = Math.max(
      body.scrollHeight, d.documentElement.scrollHeight,
      body.offsetHeight, d.documentElement.offsetHeight,
      body.clientHeight, d.documentElement.clientHeight
    );

    const scroll = Math.round(body.clientHeight + window.scrollY);
    const footer = d.getElementById('footer');

    if (footer == null) {
      return;
    }

    footer.hidden = !(scroll >= height - 10);
  }
}
