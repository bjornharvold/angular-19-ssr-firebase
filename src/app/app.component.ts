import { Component, inject, REQUEST_CONTEXT } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { Meta } from '@angular/platform-browser';

@Component({
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private meta = inject(Meta);

  title = 'with-ssr';

  private reqContext = inject(REQUEST_CONTEXT, { optional: true }) as {
    metaTags: any;
  };

  constructor() {
    if (this.reqContext != null && this.reqContext.metaTags != null) {
      const og = this.reqContext.metaTags;

      this.meta.addTags([
        { property: 'og:title', content: og.title },
        { property: 'og:description', content: og.description },
        { property: 'og:image', content: og.image },
        { property: 'og:url', content: og.url },
      ]);
    }
  }
}
