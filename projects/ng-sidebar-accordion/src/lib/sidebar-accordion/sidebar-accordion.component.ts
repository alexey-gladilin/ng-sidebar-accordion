import {ChangeDetectionStrategy, Component, HostBinding, Input, OnDestroy} from '@angular/core';
import {SidebarComponent} from "../sidebar/sidebar.component";

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
  styleUrls: ['./sidebar-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarAccordionComponent implements OnDestroy {

  @Input() @HostBinding('class') className: string;

  private _sidebars: Array<SidebarComponent> = [];

  constructor() {
    // console.log('sidebarAccordion')
  }


  ngOnDestroy(): void {
    this.unsubscribe();
  }

  _addSidebar(sidebar: SidebarComponent): void {
    this._sidebars.push(sidebar);
    this.subscribe(sidebar);
  }

  _removeSidebar(sidebar: SidebarComponent): void {
    const index = this._sidebars.indexOf(sidebar);
    if (index !== -1) {
      this._sidebars.splice(index, 1);
    }
  }

  private subscribe(sidebar: SidebarComponent): void {
    sidebar.toggle.subscribe((e: SidebarComponent) => {
      e.opened ? e.close() : e.open();
    });
    sidebar.openedChange.subscribe((e: { sender: SidebarComponent, opened: boolean }) => {
      if (e.opened) {
        this._sidebars.filter(s => s.opened && s != e.sender &&
          s.position === e.sender.position
        ).forEach(s => s.close());
      }
    });
  }

  private unsubscribe(): void {
    this._sidebars.forEach(sidebar => {
      sidebar.toggle.unsubscribe();
      sidebar.openedChange.unsubscribe();
    });
  }

}
