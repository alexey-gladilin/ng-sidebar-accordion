import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'ng-sidebar-accordion',
  template: `
    <div class="ng-sidebar-accordion__left-pane">
      <ng-content select="ng-sidebar[position=left]"></ng-content>
    </div>
    <div class="ng-sidebar-accordion__top-pane">
      <ng-content select="ng-sidebar[position=top]"></ng-content>
    </div>
    <div class="ng-sidebar-accordion__right-pane">
      <ng-content select="ng-sidebar[position=right]"></ng-content>
    </div>
    <div class="ng-sidebar-accordion__content-pane">
      <ng-content></ng-content>
    </div>
    <div class="ng-sidebar-accordion__bottom-pane">
      <ng-content select="ng-sidebar[position=bottom]"></ng-content>
    </div>
  `,
  styleUrls: ['./sidebar-accordion.component.scss']
})
export class SidebarAccordionComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
