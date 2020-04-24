import {ChangeDetectionStrategy, Component, HostBinding, Input, OnDestroy} from '@angular/core';
import {SidebarComponent} from "../sidebar.component";

export type position = 'all' | 'left' | 'top' | 'right' | 'bottom';

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
      <ng-content select="ng-sidebar-accordion-content"></ng-content>
    </div>
    <div class="ng-sidebar-accordion__bottom-pane">
      <ng-content select="ng-sidebar[position=bottom]"></ng-content>
    </div>
  `,
  styleUrls: ['./sidebar-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarAccordionComponent implements OnDestroy {

  @HostBinding('class.ng-sidebar-accordion') classNameSidebarAccordion = true;

  @Input() @HostBinding('style.width') width: string;
  @Input() @HostBinding('style.height') height: string;
  @Input() @HostBinding('class') className: string;

  private _sidebars: Array<SidebarComponent> = [];

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

  open(value: position, index: number = 0): void {

    this.sidebarToggle(value, index, true);
  }

  close(value: position): void {
    this.sidebarToggle(value, null, false);
  }

  private sidebarToggle(position: position, index: number, opened: boolean) {
    const groupByPosition = this.groupBy(this._sidebars, 'position');

    if (groupByPosition.hasOwnProperty('left')) {
      groupByPosition['left'].reverse();
    }

    if (groupByPosition.hasOwnProperty('top')) {
      groupByPosition['top'].reverse();
    }

    switch (position) {
      case 'all':
        Object.keys(groupByPosition).forEach(key => {
          opened
            ? groupByPosition[key][index].open()
            : index
            ? groupByPosition[key][index].close()
            : groupByPosition[key].forEach(s => s.close());
        })
        break;
      default:
        opened
          ? groupByPosition[position][index].open()
          : index
          ? groupByPosition[position][index].close()
          : groupByPosition[position].forEach(s => s.close());
        break;
    }
  }

  private groupBy = (xs, key) => {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

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
