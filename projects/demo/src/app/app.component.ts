import {Component, ElementRef, ViewChild} from '@angular/core';
import {SidebarAccordionComponent} from 'ng-sidebar-accordion';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('slPosition') slPosition: ElementRef;
  @ViewChild('slMode') slMode: ElementRef;
  @ViewChild('accordion') accordion: SidebarAccordionComponent;

  private _theme = ''

  onChangeTheme() {
    this._theme ? this._theme = null : this._theme = 'dark';
    document.getElementsByTagName('html')[0].setAttribute('theme', this._theme);
  }

  onApplyClick() {
    const sidebarSettings = this.accordion.sideBarSettingsList.find(s => s.position === this.slPosition.nativeElement.value);
    if (sidebarSettings) {
      sidebarSettings.mode = this.slMode.nativeElement.value;
    }
  }
}
