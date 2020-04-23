import {NgModule} from '@angular/core';
import {SidebarComponent} from './sidebar/sidebar.component';
import {CommonModule} from '@angular/common';
import {SidebarHeaderComponent} from './sidebar-header/sidebar-header.component';
import {SidebarAccordionComponent} from './sidebar-accordion/sidebar-accordion.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SidebarComponent, SidebarHeaderComponent, SidebarAccordionComponent],
  exports: [SidebarComponent, SidebarHeaderComponent, SidebarAccordionComponent]
})
export class NgSidebarAccordionModule {
}
