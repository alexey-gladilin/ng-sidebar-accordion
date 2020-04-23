import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgSidebarAccordionModule} from 'ng-sidebar-accordion';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgSidebarAccordionModule,
    NgSidebarAccordionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
