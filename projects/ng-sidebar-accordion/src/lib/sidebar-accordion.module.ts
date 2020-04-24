import {NgModule} from '@angular/core';
import {SidebarComponent} from './sidebar.component';
import {CommonModule} from '@angular/common';
import {SidebarHeaderComponent} from './sidebar-header.component';
import {SidebarAccordionComponent} from './sidebar-accordion/sidebar-accordion.component';
import {SidebarContentComponent} from './sidebar-content.component';
import {SidebarAccordionContentComponent} from './sidebar-accordion-content.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SidebarHeaderComponent,
    SidebarContentComponent,
    SidebarComponent,
    SidebarAccordionContentComponent,
    SidebarAccordionComponent
  ],
  exports: [
    SidebarHeaderComponent,
    SidebarContentComponent,
    SidebarComponent,
    SidebarAccordionContentComponent,
    SidebarAccordionComponent
  ]
})
export class SidebarAccordionModule {
}
