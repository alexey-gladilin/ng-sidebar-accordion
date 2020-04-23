import {Component, Optional} from '@angular/core';
import {SidebarComponent} from '../sidebar/sidebar.component';

@Component({
  selector: 'ng-sidebar-header',
  template: `
    <ng-content></ng-content>`
})
export class SidebarHeaderComponent {
  constructor(@Optional() private container: SidebarComponent) {
    if (!this.container) {
      throw new Error('<ng-sidebar-header> must be inside a <ng-sidebar></ng-sidebar>.');
    }
  }
}
