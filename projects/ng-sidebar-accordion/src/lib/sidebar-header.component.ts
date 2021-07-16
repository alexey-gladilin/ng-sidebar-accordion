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
  Output,
} from '@angular/core';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'ng-sidebar-header',
  template: ` <div class="ng-sidebar-header__content">
    <div class="ng-sidebar-header__wrapper">
      <ng-content></ng-content>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarHeaderComponent implements OnInit, OnDestroy {
  @HostBinding('class.ng-sidebar-header') classNameSidebarHeader = true;
  @Input() @HostBinding('class') className: string;

  @Output() clicked = new EventEmitter<MouseEvent>();
  @Output() touchMoved = new EventEmitter<TouchEvent>();
  @Output() touchEnded = new EventEmitter<TouchEvent>();

  constructor(@Optional() private _container: SidebarComponent) {
    if (!this._container) {
      throw new Error(
        '<ng-sidebar-header> must be inside a <ng-sidebar></ng-sidebar>.'
      );
    }
  }

  @HostListener('click', ['$event']) onHeaderClick(e) {
    this.clicked.emit(e);
  }

  @HostListener('touchmove', ['$event']) onHeaderTouchMove(e: TouchEvent) {
    e.preventDefault();
    this.touchMoved.emit(e);
  }

  @HostListener('touchend', ['$event']) onHeaderTouchEnd(e: TouchEvent) {
    e.preventDefault();
    this.touchEnded.emit(e);
  }

  ngOnInit(): void {
    this._container._addHeader(this);
  }

  ngOnDestroy(): void {
    this._container._removeHeader(this);
  }
}
