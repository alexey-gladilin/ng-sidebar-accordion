import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {SidebarAccordionModule} from 'ng-sidebar-accordion';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SidebarAccordionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
