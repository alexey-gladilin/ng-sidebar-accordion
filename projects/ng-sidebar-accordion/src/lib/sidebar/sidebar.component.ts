import {Component, OnInit, Input, Optional, HostBinding} from '@angular/core';
import {SidebarAccordionComponent} from '../sidebar-accordion/sidebar-accordion.component';

@Component({
  selector: 'ng-sidebar',
  template: `
    <div class="ng-sidebar__header">
      <ng-content select="ng-sidebar-header, [ng-sidebar-header]"></ng-content>
    </div>
    <div class="ng-sidebar__content">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @HostBinding('class.ng-sidebar') classNameNgSidebar = true;

  /**
   * Наименование css класса для стилизации компонента
   */
  @Input() @HostBinding('class') className: string;

  /**
   * Позиционирование панели
   */
  @Input() @HostBinding('attr.position') position: 'left' | 'right' | 'top' | 'bottom';

  constructor(@Optional() private container: SidebarAccordionComponent) {
    if (!this.container) {
      throw new Error('<ng-sidebar-accordion> must be inside a <ng-sidebar-accordion></ng-sidebar-accordion>.');
    }
  }

  ngOnInit(): void {
  }

}
