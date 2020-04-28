import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {SidebarComponent} from "../sidebar.component";

export type position = 'all' | 'left' | 'top' | 'right' | 'bottom';

@Component({
  selector: 'ng-sidebar-accordion',
  template: `
    <div [ngClass]="_getClassName('left')">
      <div
        *ngIf="_isResizableGutter('left')"
        class="ng-sidebar-accordion__gutter-vertical"
        (mousedown)="_beginSidebarResize('left', $event)"
      >
      </div>
      <ng-content select="ng-sidebar[position=left]"></ng-content>
    </div>
    <div [ngClass]="_getClassName('top')">
      <div
        *ngIf="_isResizableGutter('top')"
        class="ng-sidebar-accordion__gutter-horizontal"
        (mousedown)="_beginSidebarResize('top', $event)"
      >
      </div>
      <ng-content select="ng-sidebar[position=top]"></ng-content>
    </div>
    <div [ngClass]="_getClassName('right')">
      <div
        *ngIf="_isResizableGutter('right')"
        class="ng-sidebar-accordion__gutter-vertical"
        (mousedown)="_beginSidebarResize('right', $event)"
      >
      </div>
      <ng-content select="ng-sidebar[position=right]"></ng-content>
    </div>
    <div class="ng-sidebar-accordion__content-pane">
      <ng-content select="ng-sidebar-accordion-content"></ng-content>
    </div>
    <div [ngClass]="_getClassName('bottom')">
      <div
        *ngIf="_isResizableGutter('bottom')"
        class="ng-sidebar-accordion__gutter-horizontal"
        (mousedown)="_beginSidebarResize('bottom', $event)"
      >
      </div>
      <ng-content select="ng-sidebar[position=bottom]"></ng-content>
    </div>
  `,
  styleUrls: ['./sidebar-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarAccordionComponent implements OnInit, OnDestroy {

  @HostBinding('class.ng-sidebar-accordion') classNameSidebarAccordion = true;

  @Input() @HostBinding('style.width') width: string;
  @Input() @HostBinding('style.height') height: string;
  @Input() @HostBinding('class') className: string;
  @Input() sidebarResizable: false;
  private _sidebars: Array<SidebarComponent> = [];
  private _resizeSidebar: {
    position: position,
    mouseClientX: number,
    mouseClientY: number,
    spaceContent: number
  };

  constructor(private element: ElementRef, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  ngOnDestroy(): void {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
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

  _isResizableGutter(position: position): boolean {
    if (!position || !this.sidebarResizable) {
      return false;
    }

    const groupByPosition = this.groupBy(this._sidebars, 'position');

    if (groupByPosition.hasOwnProperty(position)) {
      return !!groupByPosition[position].find(s => s.opened);
    }

    return false;
  }

  _getClassName(position: position): string {

    return `ng-sidebar-accordion__${position}-pane${
      (this._resizeSidebar && this._resizeSidebar.position === position
        ?
        ` ng-sidebar-accordion__${position}-pane_resizable`
        : '')
    }`;
  }

  _beginSidebarResize(position: position, e: MouseEvent): void {
    const root = document.documentElement;

    this._resizeSidebar = {
      position,
      mouseClientX: e.clientX,
      mouseClientY: e.clientY,
      spaceContent: +getComputedStyle(root)
        .getPropertyValue(`--ng-sidebar-accordion-space__sidebar-content-${position}`)
        .replace('px', '')
    };
  }

  open(value: position, index: number = 0): void {

    this.sidebarToggle(value, index, true);
  }

  close(value: position): void {
    this.sidebarToggle(value, null, false);
  }

  onMouseMove = (e: MouseEvent): void => {
    if (!this._resizeSidebar) {
      return;
    }

    const root = document.documentElement;

    const getDiffPositionValue = () => {
      switch (this._resizeSidebar.position) {
        case 'left':
          return e.clientX - this._resizeSidebar.mouseClientX;
        case 'right':
          return (e.clientX - this._resizeSidebar.mouseClientX) * -1;
        case 'top':
          return e.clientY - this._resizeSidebar.mouseClientY;
        case 'bottom':
          return (e.clientY - this._resizeSidebar.mouseClientY) * -1;
        default:
          return 0;
      }
    }

    let positionValue = getDiffPositionValue() + this._resizeSidebar.spaceContent;

    const spaceSidebarHeaderBorder = +getComputedStyle(root)
      .getPropertyValue(`--ng-sidebar-accordion-space__sidebar-header-border`)
      .replace('px', '');

    if (positionValue < 0) {
      positionValue = 0;
    }

    root.style.setProperty(`--ng-sidebar-accordion-space__sidebar-content-${this._resizeSidebar.position}`,
      positionValue + 'px');

    // this.correctMaxSizeSidebars();
    if (this._resizeSidebar.position === 'left' || this._resizeSidebar.position === 'right') {
      if (this.element.nativeElement.scrollWidth > this.element.nativeElement.clientWidth + spaceSidebarHeaderBorder) {
        positionValue -= this.element.nativeElement.scrollWidth - (this.element.nativeElement.clientWidth + spaceSidebarHeaderBorder);

        root.style.setProperty(`--ng-sidebar-accordion-space__sidebar-content-${this._resizeSidebar.position}`,
          positionValue + 'px');
      }
    } else if (this._resizeSidebar.position === 'top' || this._resizeSidebar.position === 'bottom') {
      if (this.element.nativeElement.scrollHeight > this.element.nativeElement.clientHeight + spaceSidebarHeaderBorder) {
        positionValue -= this.element.nativeElement.scrollHeight - (this.element.nativeElement.clientHeight + spaceSidebarHeaderBorder);

        root.style.setProperty(`--ng-sidebar-accordion-space__sidebar-content-${this._resizeSidebar.position}`,
          positionValue + 'px');
      }
    }
  }

  onMouseUp = (): void => {
    delete this._resizeSidebar;
  }

  private sidebarToggle(position: position, index: number, opened: boolean): void {
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

    const root = document.documentElement;
    const animationDuration = +getComputedStyle(root)
      .getPropertyValue(`--ng-sidebar-accordion-animation-duration`)
      .replace('s', '')

    setTimeout(() => this.correctMaxSizeSidebars(), 1000 * animationDuration);
  }

  private correctMaxSizeSidebars() {
    const root = document.documentElement;

    const spaceSidebarHeaderBorder = +getComputedStyle(root)
      .getPropertyValue(`--ng-sidebar-accordion-space__sidebar-header-border`)
      .replace('px', '');

    const outOfScreenWidth = this.element.nativeElement.scrollWidth - (this.element.nativeElement.clientWidth + spaceSidebarHeaderBorder);
    const outOfScreenHeight = this.element.nativeElement.scrollHeight - (this.element.nativeElement.clientHeight + spaceSidebarHeaderBorder);

    let openedSidebarsW;
    let openedSidebarsH;
    if (outOfScreenWidth > 0) {
      openedSidebarsW = this._sidebars
        .filter(s => (s.position === 'left' || s.position === 'right') && s.opened);

      openedSidebarsW.forEach(s => {

        let spaceSidebar = +getComputedStyle(root)
          .getPropertyValue(`--ng-sidebar-accordion-space__sidebar-content-${s.position}`)
          .replace('px', '');

        if (spaceSidebar < 0) {
          spaceSidebar *= -1;
        }

        root.style.setProperty(`--ng-sidebar-accordion-space__sidebar-content-${s.position}`,
          spaceSidebar - (outOfScreenWidth / openedSidebarsW.length) + 'px');
      });
    }
    if (outOfScreenHeight > 0) {
      openedSidebarsH = this._sidebars
        .filter(s => (s.position === 'top' || s.position === 'bottom') && s.opened);

      openedSidebarsH.forEach(s => {

        let spaceSidebar = +getComputedStyle(root)
          .getPropertyValue(`--ng-sidebar-accordion-space__sidebar-content-${s.position}`)
          .replace('px', '');

        if (spaceSidebar < 0) {
          spaceSidebar *= -1;
        }

        root.style.setProperty(`--ng-sidebar-accordion-space__sidebar-content-${s.position}`,
          spaceSidebar - (outOfScreenHeight / openedSidebarsH.length) + 'px');
      });
    }

    console.log('width:', outOfScreenWidth, ' height:', outOfScreenHeight, openedSidebarsW, openedSidebarsH);
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
      this.cdRef.markForCheck();
    });
  }

  private unsubscribe(): void {
    this._sidebars.forEach(sidebar => {
      sidebar.toggle.unsubscribe();
      sidebar.openedChange.unsubscribe();
    });
  }
}
