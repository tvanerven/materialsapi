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
    const body = document.body;
    const html = document.documentElement;

    const height = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);

    const scroll = document.body.clientHeight + window.scrollY;
    const footer = document.getElementById('footer');

    if (footer == null) {
      return;
    }

    footer.hidden = scroll !== height;
  }
}
