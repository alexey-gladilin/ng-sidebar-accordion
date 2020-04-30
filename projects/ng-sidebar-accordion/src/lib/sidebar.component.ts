import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output
} from '@angular/core';
import {SidebarAccordionComponent} from './sidebar-accordion/sidebar-accordion.component';
import {SidebarHeaderComponent} from "./sidebar-header.component";
import {SidebarContentComponent} from "./sidebar-content.component";
import {SidebarOpenedEventArgs} from "./sidebar-opened.event-args";

@Component({
  selector: 'ng-sidebar',
  template: `
    <ng-content select="ng-sidebar-header, [ng-sidebar-header]"></ng-content>
    <ng-content select="ng-sidebar-content, [ng-sidebar-content]"></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input() @HostBinding('attr.position') position: 'left' | 'right' | 'top' | 'bottom';
  @Input() @HostBinding('class.ng-sidebar') classNameSidebar = true;
  @Input() @HostBinding('class') className: string;
  @Input() @HostBinding('style') style: CSSStyleDeclaration;

  @Output() headerClicked = new EventEmitter<SidebarComponent>();
  @Output() openedChange = new EventEmitter<SidebarOpenedEventArgs>();

  @HostBinding('class.ng-sidebar_opened') classNameSidebarOpened = false;

  private _headers: Array<SidebarHeaderComponent> = [];
  private _contents: Array<SidebarContentComponent> = [];

  constructor(@Optional() private _container: SidebarAccordionComponent) {
    if (!this._container) {
      throw new Error('<ng-sidebar-accordion> must be inside a <ng-sidebar-accordion></ng-sidebar-accordion>.');
    }
  }

  private _opened = false;

  @Input() get opened(): boolean {
    return this._opened;
  };

  set opened(value: boolean) {
    if (this._opened !== value) {
      this._opened = value;
      this.classNameSidebarOpened = value;
      this.openedChange.emit({sender: this, opened: value});
    }
  }

  get _headersLength() {
    return this._headers.length;
  }

  get _contentsLength() {
    return this._contents.length;
  }

  ngOnInit(): void {
    this._container._addSidebar(this);
  }

  ngOnDestroy(): void {
    this._container._removeSidebar(this);
    this.unsubscribe();
  }

  _addHeader(header: SidebarHeaderComponent): void {
    if (this._headersLength > 0) {
      throw new Error('<ng-sidebar-header> must be only one.');
    }

    this._headers.push(header);
    this.subscribe(header);
  }

  _removeHeader(header: SidebarHeaderComponent): void {
    const index = this._headers.indexOf(header);
    if (index !== -1) {
      this._headers.splice(index, 1);
    }
  }

  _addContent(content: SidebarContentComponent): void {
    if (this._contentsLength > 0) {
      throw new Error('<ng-sidebar-content> must be only one.');
    }

    this._contents.push(content);
  }

  _removeContent(content: SidebarContentComponent): void {
    const index = this._contents.indexOf(content);
    if (index !== -1) {
      this._contents.splice(index, 1);
    }
  }

  open(): void {
    this.opened = true;
  }

  close(): void {
    this.opened = false;
  }

  private subscribe(header: SidebarHeaderComponent): void {
    header.clicked.subscribe(() => {
      this.headerClicked.emit(this);
    });
  }

  private unsubscribe(): void {
    this._headers.forEach(header => header.clicked.unsubscribe());
  }
}
