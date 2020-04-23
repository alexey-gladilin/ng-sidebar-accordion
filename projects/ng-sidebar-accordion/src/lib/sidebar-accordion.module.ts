import {NgModule} from '@angular/core';
import {SidebarComponent} from './sidebar/sidebar.component';
import {CommonModule} from '@angular/common';
import {SidebarHeaderComponent} from './sidebar-header.component';
import {SidebarAccordionComponent} from './sidebar-accordion/sidebar-accordion.component';
import {SidebarContentComponent} from './sidebar-content.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SidebarComponent, SidebarHeaderComponent, SidebarAccordionComponent, SidebarContentComponent],
  exports: [SidebarComponent, SidebarHeaderComponent, SidebarAccordionComponent, SidebarContentComponent]
})
export class SidebarAccordionModule {
}
