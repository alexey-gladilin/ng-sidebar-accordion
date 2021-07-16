import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'ng-sidebar-content',
  template: ` <ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarContentComponent implements OnInit, OnDestroy {
  @HostBinding('class.ng-sidebar-content') classNameSidebarContent = true;
  @Input() @HostBinding('class') className: string;

  constructor(
    @Optional() private _container: SidebarComponent,
    public element: ElementRef
  ) {
    if (!this._container) {
      throw new Error(
        '<ng-sidebar-content> must be inside a <ng-sidebar></ng-sidebar>.'
      );
    }
  }

  ngOnInit(): void {
    this._container._addContent(this);
  }

  ngOnDestroy(): void {
    this._container._removeContent(this);
  }
}
