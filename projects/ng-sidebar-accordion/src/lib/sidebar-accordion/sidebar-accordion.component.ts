import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList
} from '@angular/core';
import {SidebarComponent} from "../sidebar.component";
import {SidebarSettingsComponent} from "../sidebar-settings.component";
import {SidebarOpenedEventArgs} from "../sidebar-opened.event-args";
import {SidebarMouseTouchEventArgs} from "../sidebar-mouse-touch.event-args";

export type position = 'all' | 'left' | 'top' | 'right' | 'bottom';

@Component({
  selector: 'ng-sidebar-accordion',
  template: `
    <div [ngClass]="_getClassName('left')" [ngStyle]="_getStyle('left')">
      <div
        *ngIf="_isResizableGutter('left')"
        class="ng-sidebar-accordion__gutter-vertical"
        (mousedown)="_onSidebarResizeBegin('left', $event)"
      >
      </div>
      <ng-content select="ng-sidebar[position=left]"></ng-content>
    </div>
    <div [ngClass]="_getClassName('top')" [ngStyle]="_getStyle('top')">
      <div
        *ngIf="_isResizableGutter('top')"
        class="ng-sidebar-accordion__gutter-horizontal"
        (mousedown)="_onSidebarResizeBegin('top', $event)"
      >
      </div>
      <ng-content select="ng-sidebar[position=top]"></ng-content>
    </div>
    <div [ngClass]="_getClassName('right')" [ngStyle]="_getStyle('right')">
      <div
        *ngIf="_isResizableGutter('right')"
        class="ng-sidebar-accordion__gutter-vertical"
        (mousedown)="_onSidebarResizeBegin('right', $event)"
      >
      </div>
      <ng-content select="ng-sidebar[position=right]"></ng-content>
    </div>
    <div class="ng-sidebar-accordion__content-pane" [ngStyle]="_getStyle()">
      <ng-content select="ng-sidebar-accordion-content"></ng-content>
    </div>
    <div [ngClass]="_getClassName('bottom')" [ngStyle]="_getStyle('bottom')">
      <div
        *ngIf="_isResizableGutter('bottom')"
        class="ng-sidebar-accordion__gutter-horizontal"
        (mousedown)="_onSidebarResizeBegin('bottom', $event)"
      >
      </div>
      <ng-content select="ng-sidebar[position=bottom]"></ng-content>
    </div>
  `,
  styleUrls: ['./sidebar-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarAccordionComponent implements AfterViewInit, OnInit, OnDestroy {

  @HostBinding('class.ng-sidebar-accordion') classNameSidebarAccordion = true;

  @Input() @HostBinding('style.width') width: string;
  @Input() @HostBinding('style.height') height: string;
  @Input() @HostBinding('class') className: string;
  @Input() sidebarResizable: false;

  @Output() sidebarResizableBegin = new EventEmitter<position>();
  @Output() sidebarResizableEnd = new EventEmitter<position>();
  @Output() sidebarOpenedChange = new EventEmitter<SidebarComponent>();

  @ContentChildren(SidebarSettingsComponent) sideBarSettingsList: QueryList<SidebarSettingsComponent>;

  private _sidebars: Array<SidebarComponent> = [];
  private _resizeSidebar: {
    position: position,
    mouseClientX: number,
    mouseClientY: number,
    spaceContent: number
  };

  constructor(private element: ElementRef, private cdRef: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    const groupSettings = this.groupBy(this.sideBarSettingsList.toArray(), 'position');

    Object.keys(groupSettings)
      .forEach(key => {
        if (groupSettings[key].length > 1) {
          throw new Error('<ng-sidebar-settings> ng-sidebar-settings can\'t be more than one with the same position.')
        }
      });

    this.sidebarSettingsSubscribe();
  }

  ngOnInit(): void {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  ngOnDestroy(): void {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.sidebarUnsubscribe();
    this.sidebarSettingsUnsubscribe();
  }

  _addSidebar(sidebar: SidebarComponent): void {
    this._sidebars.push(sidebar);
    this.sidebarSubscribe(sidebar);
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
    const sideBarSettings = this.sideBarSettingsList.filter(s => s.position === position);

    return `ng-sidebar-accordion__${position}-pane${
      (this._resizeSidebar && this._resizeSidebar.position === position
        ?
        ` ng-sidebar-accordion__${position}-pane_resizable`
        : '')
    }${
      (sideBarSettings.length > 0 && sideBarSettings[0].mode === 'over'
          ? ` ng-sidebar-accordion__${position}-pane_over`
          : ''
      )
    }`;
  }

  _getStyle(position?: position) {
    const root = document.documentElement;
    const spaceSidebarHeader = +getComputedStyle(root)
      .getPropertyValue(`--ng-sidebar-accordion-space__sidebar-header`)
      .replace('px', '');

    const spaceSidebarHeaderBorder = +getComputedStyle(root)
      .getPropertyValue(`--ng-sidebar-accordion-space__sidebar-header-border`)
      .replace('px', '');

    const leftPaneIsOver = this.sideBarSettingsList.filter(s => s.position === 'left' && s.mode === 'over').length > 0;
    const topPaneIsOver = this.sideBarSettingsList.filter(s => s.position === 'top' && s.mode === 'over').length > 0;
    const rightPaneIsOver = this.sideBarSettingsList.filter(s => s.position === 'right' && s.mode === 'over').length > 0;
    const bottomPaneIsOver = this.sideBarSettingsList.filter(s => s.position === 'bottom' && s.mode === 'over').length > 0;

    const leftSidebarCount = this._sidebars.filter(s => s.position === 'left' && s._headersLength > 0).length;
    const topSidebarCount = this._sidebars.filter(s => s.position === 'top' && s._headersLength > 0).length;
    const rightSidebarCount = this._sidebars.filter(s => s.position === 'right' && s._headersLength > 0).length;
    const bottomSidebarCount = this._sidebars.filter(s => s.position === 'bottom' && s._headersLength > 0).length;

    let style: any = {};

    switch (position) {
      case 'top':
      case 'bottom':
        const currentPaneIsOver = this.sideBarSettingsList.filter(s => s.position === position && s.mode === 'over').length > 0;

        if (currentPaneIsOver) {
          if (leftPaneIsOver) {
            style.left = leftSidebarCount * spaceSidebarHeader + spaceSidebarHeaderBorder + 'px';
          } else {
            style.left = '0';
          }
          if (rightPaneIsOver) {
            style.right = rightSidebarCount * spaceSidebarHeader + spaceSidebarHeaderBorder + 'px';
          } else {
            style.right = '0';
          }
          return style;
        } else {
          if (leftPaneIsOver) {
            style.paddingLeft = leftSidebarCount * spaceSidebarHeader + spaceSidebarHeaderBorder + 'px';
          }

          if (rightPaneIsOver) {
            style.paddingRight = rightSidebarCount * spaceSidebarHeader + spaceSidebarHeaderBorder + 'px';
          }
          return style;
        }
      case undefined:
      case null:
        if (leftPaneIsOver) {
          style.paddingLeft = leftSidebarCount * spaceSidebarHeader + spaceSidebarHeaderBorder + 'px';
        }
        if (topPaneIsOver) {
          style.paddingTop = topSidebarCount * spaceSidebarHeader + spaceSidebarHeaderBorder + 'px';
        }
        if (rightPaneIsOver) {
          style.paddingRight = rightSidebarCount * spaceSidebarHeader + spaceSidebarHeaderBorder + 'px';
        }
        if (bottomPaneIsOver) {
          style.paddingBottom = bottomSidebarCount * spaceSidebarHeader + spaceSidebarHeaderBorder + 'px';
        }

        return style;
      default:
        return null;
    }
  }

  _onSidebarResizeBegin(position: position, e: MouseEvent): void {
    const root = document.documentElement;

    this._resizeSidebar = {
      position,
      mouseClientX: e.clientX,
      mouseClientY: e.clientY,
      spaceContent: +getComputedStyle(root)
        .getPropertyValue(`--ng-sidebar-accordion-space__sidebar-content-${position}`)
        .replace('px', '')
    };

    this.sidebarResizableBegin.emit(position);
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

    if (positionValue < 0) {
      positionValue = 0;
    }

    root.style.setProperty(`--ng-sidebar-accordion-space__sidebar-content-${this._resizeSidebar.position}`,
      positionValue + 'px');

    this.correctMaxSizeSidebars();
  }

  onMouseUp = (): void => {
    if (this._resizeSidebar) {
      const position = this._resizeSidebar.position;
      delete this._resizeSidebar;

      this.sidebarResizableEnd.emit(position);
    }
  }

  getSidebarIndex(sidebar: SidebarComponent): number {

    if (!sidebar) {
      return -1;
    }

    const groupByPosition = this.groupBy(this._sidebars, 'position');

    if (groupByPosition.hasOwnProperty('left')) {
      groupByPosition['left'].reverse();
    }

    if (groupByPosition.hasOwnProperty('top')) {
      groupByPosition['top'].reverse();
    }

    if (groupByPosition.hasOwnProperty(sidebar.position)) {
      return groupByPosition[sidebar.position].findIndex(s => s === sidebar);
    }

    return -1;
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
  }

  private correctMaxSizeSidebars() {

    const setSpaceSidebar = (openedSidebars, outOfScreenSize) => {
      openedSidebars.forEach(s => {

        let spaceSidebar = +getComputedStyle(root)
          .getPropertyValue(`--ng-sidebar-accordion-space__sidebar-content-${s.position}`)
          .replace('px', '');

        if (spaceSidebar < 0) {
          spaceSidebar *= -1;
        }

        let spaceValue = spaceSidebar - outOfScreenSize;

        if (spaceValue < 0) {
          spaceValue = 0;
        }

        root.style.setProperty(`--ng-sidebar-accordion-space__sidebar-content-${s.position}`,
          spaceValue + 'px');
      });
    }

    const root = document.documentElement;

    const spaceSidebarHeaderBorder = +getComputedStyle(root)
      .getPropertyValue(`--ng-sidebar-accordion-space__sidebar-header-border`)
      .replace('px', '');

    const outOfScreenWidth = this.element.nativeElement.scrollWidth - (this.element.nativeElement.clientWidth + spaceSidebarHeaderBorder);
    const outOfScreenHeight = this.element.nativeElement.scrollHeight - (this.element.nativeElement.clientHeight + spaceSidebarHeaderBorder);

    if (outOfScreenWidth > 0) {
      const openedSidebarsW = this._sidebars
        .filter(s => (s.position === 'left' || s.position === 'right') && s.opened
          && !this.sideBarSettingsList.find(ss => ss.position === s.position && ss.mode === 'over'));
      setSpaceSidebar(openedSidebarsW, outOfScreenWidth);
    }
    if (outOfScreenHeight > 0) {
      const openedSidebarsH = this._sidebars
        .filter(s => (s.position === 'top' || s.position === 'bottom') && s.opened
          && !this.sideBarSettingsList.find(ss => ss.position === s.position && ss.mode === 'over'));

      setSpaceSidebar(openedSidebarsH, outOfScreenHeight);
    }

  }

  private groupBy = (xs, key) => {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  private sidebarSubscribe(sidebar: SidebarComponent): void {
    sidebar.headerClicked.subscribe((e: SidebarComponent) => {
      e.opened ? e.close() : e.open();
    });

    sidebar.headerTouchMoved.subscribe((e: SidebarMouseTouchEventArgs) => {
      const isAllowResizable = this._sidebars
        .filter(s => s.position === e.sender.position && s.opened).length > 0;

      if (this.sidebarResizable && isAllowResizable) {

        const groupByPosition = this.groupBy(this._sidebars, 'position');

        if (groupByPosition.hasOwnProperty('left')) {
          groupByPosition['left'].reverse();
        }

        if (groupByPosition.hasOwnProperty('top')) {
          groupByPosition['top'].reverse();
        }

        // move only first sidebar
        if (e.sender === groupByPosition[e.sender.position][0]) {
          if (!this._resizeSidebar) {
            this._onSidebarResizeBegin(e.sender.position, {
              clientX: e.originalEvent.touches[0].clientX,
              clientY: e.originalEvent.touches[0].clientY
            } as MouseEvent);
          } else {
            this.onMouseMove({
              clientX: e.originalEvent.touches[0].clientX,
              clientY: e.originalEvent.touches[0].clientY
            } as MouseEvent);
          }
        }
      }
    });

    sidebar.headerTouchEnded.subscribe((e: SidebarMouseTouchEventArgs) => {
      if (this._resizeSidebar) {
        this.onMouseUp();
      } else {
        e.sender.opened ? e.sender.close() : e.sender.open();
      }
    });

    sidebar.openedChange.subscribe((e: SidebarOpenedEventArgs) => {
      if (e.opened) {
        this._sidebars.filter(s => s.opened && s != e.sender &&
          s.position === e.sender.position
        ).forEach(s => s.close());
      }
      this.cdRef.markForCheck();

      const root = document.documentElement;
      const animationDuration = +getComputedStyle(root)
        .getPropertyValue(`--ng-sidebar-accordion-animation-duration`)
        .replace('s', '');

      setTimeout(() => this.correctMaxSizeSidebars(), 1000 * animationDuration);

      this.sidebarOpenedChange.emit(e.sender);
    });
  }

  private sidebarUnsubscribe(): void {
    this._sidebars.forEach(sidebar => {
      sidebar.headerClicked.unsubscribe();
      sidebar.openedChange.unsubscribe();
      sidebar.headerTouchMoved.unsubscribe();
      sidebar.headerTouchEnded.unsubscribe();
    });
  }

  private sidebarSettingsSubscribe() {
    this.sideBarSettingsList.forEach(s => {
      s.modeChange.subscribe(() => {
        this.cdRef.markForCheck();
      });

      s.positionChange.subscribe(() => {
        this.cdRef.markForCheck();
      })
    });
  }

  private sidebarSettingsUnsubscribe() {
    this.sideBarSettingsList.forEach(s => {
      s.modeChange.unsubscribe();
      s.positionChange.unsubscribe();
    })
  }
}
