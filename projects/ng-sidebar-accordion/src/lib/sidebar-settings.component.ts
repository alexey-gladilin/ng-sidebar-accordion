import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

type Position = 'left' | 'top' | 'right' | 'bottom';
type Mode = 'push' | 'over';

@Component({
  selector: 'ng-sidebar-settings',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarSettingsComponent {
  @Output() modeChange = new EventEmitter<SidebarSettingsComponent>();
  @Output() positionChange = new EventEmitter<SidebarSettingsComponent>();

  private _position: Position;

  @Input() get position(): Position {
    return this._position;
  }

  set position(value: Position) {
    this._position = value;
    this.positionChange.emit(this);
  }

  private _mode: Mode;

  @Input() get mode(): Mode {
    return this._mode;
  }

  set mode(value: Mode) {
    this._mode = value;
    this.modeChange.emit(this);
  }
}
