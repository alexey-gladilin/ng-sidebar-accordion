import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import {SidebarAccordionComponent} from 'ng-sidebar-accordion';

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
    const sidebarSettings = this.accordion.sideBarSettingsList.find(s => s.position === this.slSectionModeElmPosition.nativeElement.value);
    if (sidebarSettings) {
      sidebarSettings.mode = this.slSectionModeElmMode.nativeElement.value;
    }
  }
}
