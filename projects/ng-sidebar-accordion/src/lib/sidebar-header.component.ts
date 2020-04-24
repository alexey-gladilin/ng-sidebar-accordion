import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output
} from '@angular/core';
import {SidebarComponent} from './sidebar.component';

@Component({
  selector: 'ng-sidebar-header',
  template: `
    <ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarHeaderComponent implements OnInit, OnDestroy {

  @HostBinding('class.ng-sidebar-header') classNameSidebarHeader = true;
  @Input() @HostBinding('class') className: string;

  @Output() clicked = new EventEmitter<MouseEvent>();

  constructor(@Optional() private _container: SidebarComponent) {
    if (!this._container) {
      throw new Error('<ng-sidebar-header> must be inside a <ng-sidebar></ng-sidebar>.');
    }
  }

  @HostListener('mouseup', ['$event']) onHeaderClick(e) {
    this.clicked.emit(e);
  }

  ngOnInit(): void {
    this._container._addHeader(this);
  }

  ngOnDestroy(): void {
    this._container._removeHeader(this);
  }
}