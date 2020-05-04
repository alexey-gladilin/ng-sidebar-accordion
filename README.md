# ng-sidebar-accordion

[![NPM](https://nodei.co/npm/ng-sidebar-accordion.png?compact=true)](https://nodei.co/npm/ng-sidebar-accordion)

An Angular sidebar accordion component.

[Demo](https://alexey-gladilin.github.io/ng-sidebar-accordion/)

## Installation

```shell
npm install ng-sidebar-accordion
```

## Changelog

See the [releases page](https://github.com/alexey-gladilin/ng-sidebar-accordion/releases) on GitHub.


## Usage

Add `SidebarAccordionModule` to your app module

```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {SidebarAccordionModule} from 'ng-sidebar-accordion';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SidebarAccordionModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

In your app component, simply use add a `<ng-sidebar-accordion>` wrapper, then place your `<ng-sidebar>`(s) and content within it.
Your page content should be in container `<ng-sidebar-accordion-content>`.

```typescript
@Component({
  selector: 'app',
  template: `
    <!-- Container for sidebar(s) + page content -->
    <ng-sidebar-accordion #accordion>
      <!-- A sidebar -->
      <ng-sidebar position="right" [opened]="true">
        <ng-sidebar-header>
          <div>
            <div>right-pane0-header-row1</div>
            <div>right-pane0-header-row2</div>
          </div>
        </ng-sidebar-header>
        
        <ng-sidebar-content>
          right-pane0-content
        </ng-sidebar-content>
      </ng-sidebar>

      <!-- Page content -->
      <ng-sidebar-accordion-content>
        <button
          (click)="accordion.open('right')">
          open
        </button>
        <button
          (click)="accordion.close('right')">
          close
        </button>
      </ng-sidebar-accordion-content>
    </ng-sidebar-accordion>
  `
})
class AppComponent {  
}
```

## Functions

The SidebarAccordion has a few public functions:

| Function | Description |
| -------- | ----------- |
| `open(position, index)` | Opens sidebars. positions - ('all', 'left', 'top', 'right', 'bottom'); index - position the side panel |
| `close(position)` | Closes sidebars. positions - ('all', 'left', 'top', 'right', 'bottom'); |
| `getSidebarIndex(sidebar)` | returns the index of the sidebar in an array of a specific position. |

The Sidebar has a few public functions:

| Function | Description |
| -------- | ----------- |
| `open()` | Opens this sidebar. |
| `close()` | Closes this sidebar. |

## Styling

Various class names are attached to the sidebar and container for easier styling.

### SidebarAccordion

| Class name | Description |
| ---------- | ----------- |
| `ng-sidebar-accordion` | Always present on the container element. |
| `ng-sidebar-accordion__left-pane` | Always present on the element where panels are placed on the left edge. |
| `ng-sidebar-accordion__top-pane` | Always present on the element where panels are placed at the top edge. |
| `ng-sidebar-accordion__right-pane` | Always present on the element where panels are placed on the right edge. |
| `ng-sidebar-accordion__bottom-pane` | Always present on the element where panels are placed along the bottom edge. |
| `ng-sidebar-accordion__left-pane_resizable` | Appears when resizing the panel is allowed. Left pane. |
| `ng-sidebar-accordion__top-pane_resizable` | Appears when resizing the panel is allowed. Top pane. |
| `ng-sidebar-accordion__right-pane_resizable` | Appears when resizing the panel is allowed. Right pane. |
| `ng-sidebar-accordion__bottom-pane_resizable` | Appears when resizing the panel is allowed. Bottom pane. |
| `ng-sidebar-accordion__left-pane_over` | Appears when panel mode is set to`over'. Left pane. |
| `ng-sidebar-accordion__top-pane_over` | Appears when panel mode is set to`over'. Top pane. |
| `ng-sidebar-accordion__right-pane_over` | Appears when panel mode is set to`over'. Right side. |
| `ng-sidebar-accordion__bottom-pane_over` | Appears when panel mode is set to`over'. Bottom pane. |
| `ng-sidebar-accordion-content` | Always present on the element where the main content is placed. |
| `ng-sidebar-accordion__gutter-horizontal` | Appears when resizing the panel is allowed. |
| `ng-sidebar-accordion__gutter-vertical` | Appears when resizing the panel is allowed. |

### Sidebar

| Class name | Description |
| ---------- | ----------- |
| `ng-sidebar` | Sidebar element. |
| `ng-sidebar-header` | The title of the sidebar. |
| `ng-sidebar-header__content` | Content of the sidebar header. |
| `ng-sidebar-content` | Contents of the sidebar. |
| `ng-sidebar_opened` | Appears when the sidebar is open. |

All the above classes are always present on the element.

## Options

### `<ng-sidebar-accordion>`

#### Inputs

| Property name | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| `width` | string | | Width of the component. |
| `height` | string | | Height of the component. |
| `className` | string | | Css class. |
| `sidebarResizable` | boolean | false | A flag that specifies whether or not the sidebar can be resized. |

#### Outputs

 | Property name | Callback arguments | Description |
 | ------------- | ------------------ | ----------- |
| `sidebarResizableBegin` | position | Emitted when the sidebar size change starts. |
| `sidebarResizableEnd` | position | Emitted when the sidebar size change ends. |
| `sidebarOpenedChange` | SidebarComponent | Emitted when sidebar state changes. |
  
  
`position: 'left', 'right', 'top', 'bottom'`  

### `<ng-sidebar>`

#### Inputs

| Property name | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| `position` | 'left', 'right', 'top', 'bottom' | | The position where to place the sidebar. |
| `className` | string | | Css class. |
| `opened` | boolean | false | State sidebar. |
 
 
#### Outputs
 
 | Property name | Callback arguments | Description |
 | ------------- | ------------------ | ----------- |
 | `openedChange` | `{ sender: SidebarComponent, opened: boolean }` | Emitted when the sidebar state changes. |
 | `headerClicked` | `SidebarComponent` | Emitted when the sidebar header clicked. |
 | `headerTouchMoved` | `SidebarMouseTouchEventArgs` | Emitted when the sidebar header touch moved |
 | `headerTouchEnded` | `SidebarMouseTouchEventArgs` | Emitted when the sidebar header touch ended |
 

### `<ng-sidebar-settings>`

Used to configure sidebar mode

#### Inputs

| Property name | Type | Default | Description |
| ------------- | ---- | ------- | ----------- |
| `position` | 'left', 'right', 'top', 'bottom' | The sidebar position for which settings are applied. |
| `mode` | 'push', 'over' | Sidebars mode. |
 
 
#### Outputs
 
 | Property name | Callback arguments | Description |
 | ------------- | ------------------ | ----------- |
 | `modeChange` | `SidebarSettingsComponent` | Emitted when the mode is change. |
 | `positionChange` | `SidebarSettingsComponent` | Emitted when the position is change. |
