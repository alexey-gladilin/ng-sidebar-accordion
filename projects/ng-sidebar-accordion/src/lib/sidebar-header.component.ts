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
import {SidebarComponent} from './sidebar/sidebar.component';

@Component({
  selector: 'ng-sidebar-header',
  template: `
    <ng-content></ng-content>`,
  styles: [`
    :host {
      user-select: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarHeaderComponent implements OnInit, OnDestroy {

  @Input() @HostBinding('class') className: string;
  @Input() @HostBinding('style.width') width: string;
  @Input() @HostBinding('style.height') height: string;

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
