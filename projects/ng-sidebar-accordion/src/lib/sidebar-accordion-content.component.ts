import {ChangeDetectionStrategy, Component, HostBinding, Input, Optional} from '@angular/core';
import {SidebarAccordionComponent} from "./sidebar-accordion/sidebar-accordion.component";

@Component({
  selector: 'ng-sidebar-accordion-content',
  template: `
    <ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarAccordionContentComponent {

  @HostBinding('class.ng-sidebar-accordion-content') classNameSidebarAccordionContent = true;
  @Input() @HostBinding('class') className: string;

  constructor(@Optional() private _container: SidebarAccordionComponent) {
    if (!this._container) {
      throw new Error('<ng-sidebar-accordion-content> must be inside a <ng-sidebar-accordion></ng-sidebar-accordion>.');
    }
  }
}
