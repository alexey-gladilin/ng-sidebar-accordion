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
import {SidebarAccordionComponent} from '../sidebar-accordion/sidebar-accordion.component';
import {SidebarHeaderComponent} from "../sidebar-header.component";
import {SidebarContentComponent} from "../sidebar-content.component";

@Component({
  selector: 'ng-sidebar',
  template: `
    <ng-content select="ng-sidebar-header, [ng-sidebar-header]"></ng-content>
    <ng-content select="ng-sidebar-content, [ng-sidebar-content]"></ng-content>
  `,
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input() @HostBinding('attr.position') position: 'left' | 'right' | 'top' | 'bottom';
  @Input() @HostBinding('class.ng-sidebar') classNameSidebar = true;
  @Input() @HostBinding('class') className: string;
  @Input() @HostBinding('style') style: CSSStyleDeclaration;
  @Input() opened = false;

  @Output() toggle = new EventEmitter<SidebarComponent>();
  @Output() openedChange = new EventEmitter<{ sender: SidebarComponent, opened: boolean }>();

  private _headers: Array<SidebarHeaderComponent> = [];
  private _contents: Array<SidebarContentComponent> = [];

  constructor(@Optional() private _container: SidebarAccordionComponent) {
    if (!this._container) {
      throw new Error('<ng-sidebar-accordion> must be inside a <ng-sidebar-accordion></ng-sidebar-accordion>.');
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

    if (!header.className) {
      header.className = '';
    }

    header.className +=
      (header.className.length > 0 ? ' ' : '')
      + 'ng-sidebar__ng-sidebar-header';

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

    if (!content.className) {
      content.className = '';
    }

    content.className +=
      (content.className.length > 0 ? ' ' : '')
      + 'ng-sidebar__ng-sidebar-content';

    this._contents.push(content);
  }

  _removeContent(content: SidebarContentComponent): void {
    const index = this._contents.indexOf(content);
    if (index !== -1) {
      this._contents.splice(index, 1);
    }
  }

  open(): void {

    const content = this.getContentComponent();

    if (content) {
      this.opened = true;

      content.className +=
        (content.className.length > 0 ? ' ' : '') +
        'ng-sidebar__ng-sidebar-content_open';

      this.openedChange.emit({sender: this, opened: true});
    }
  }

  close(): void {
    const content = this.getContentComponent();

    if (content) {
      this.opened = false;
      content.className = content.className.replace('ng-sidebar__ng-sidebar-content_open', '');
      this.openedChange.emit({sender: this, opened: false});
    }
  }

  private subscribe(header: SidebarHeaderComponent): void {
    header.clicked.subscribe(() => {
      this.toggle.emit(this);
    });
  }

  private unsubscribe(): void {
    this._headers.forEach(header => header.clicked.unsubscribe());
  }

  private getContentComponent() {
    return this._contents[0];
  }

  private getHeaderComponent() {
    return this._headers[0];
  }
}
