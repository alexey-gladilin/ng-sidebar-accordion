import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import {position, SidebarAccordionComponent, SidebarComponent} from 'ng-sidebar-accordion';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {

  @ViewChild('slSectionModeElmPosition') slSectionModeElmPosition: ElementRef;
  @ViewChild('slSectionModeElmMode') slSectionModeElmMode: ElementRef;
  @ViewChild('accordion') accordion: SidebarAccordionComponent;
  @ViewChild('txtSidebarOpenedChanged') txtSidebarOpenedChanged: ElementRef;

  theme = 'light'

  constructor(private cdRef: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  onChangeTheme() {
    this.theme !== 'light' ? this.theme = 'light' : this.theme = 'dark';
    document.getElementsByTagName('html')[0].setAttribute('theme', this.theme);
  }

  onSidebarOpenedChange(e: SidebarComponent): void {
    this.txtSidebarOpenedChanged.nativeElement.value +=
      `position: ${e.position}, index: ${this.accordion.getSidebarIndex(e)} (${e.opened ? 'open' : 'close'})\r\n`;
  }

  onSidebarResizableBegin(e: position): void {
    this.txtSidebarOpenedChanged.nativeElement.value +=
      `sidebar begin of resizable: ${e}\r\n`;
  }

  onSidebarResizableEnd(e: position): void {
    this.txtSidebarOpenedChanged.nativeElement.value +=
      `sidebar end of resizable: ${e}\r\n`;
  }

  getMode(position: string): string {
    const sidebarSettings = this.accordion && this.accordion.sideBarSettingsList
      ? this.accordion.sideBarSettingsList.find(s => s.position === position)
      : null;

    if (sidebarSettings) {
      return `(mode: ${sidebarSettings.mode})`;
    }
    return '';
  }

  onApplyClick() {
    const sidebarSettings = this.accordion.sideBarSettingsList
      .find(s => s.position === this.slSectionModeElmPosition.nativeElement.value);

    if (sidebarSettings) {
      sidebarSettings.mode = this.slSectionModeElmMode.nativeElement.value;
    }
  }
}
