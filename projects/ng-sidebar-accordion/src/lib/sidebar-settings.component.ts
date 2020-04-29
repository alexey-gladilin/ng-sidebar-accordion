import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

type position = 'left' | 'top' | 'right' | 'bottom';
type mode = 'push' | 'over';

@Component({
  selector: 'ng-sidebar-settings',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarSettingsComponent {

  @Output() modeChange = new EventEmitter<SidebarSettingsComponent>();
  @Output() positionChange = new EventEmitter<SidebarSettingsComponent>();

  private _position: position;

  @Input() get position(): position {
    return this._position;
  };

  set position(value: position) {
    this._position = value;
    this.positionChange.emit(this);
  }

  private _mode: mode;

  @Input() get mode(): mode {
    return this._mode;
  }

  set mode(value: mode) {
    this._mode = value;
    this.modeChange.emit(this);
  }
}
