import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import './app/arrayUtils';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
