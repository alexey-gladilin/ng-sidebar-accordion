import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demo';

  private _theme = ''

  onChangeTheme() {
    this._theme ? this._theme = null : this._theme = 'dark';
    document.getElementsByTagName('html')[0].setAttribute('theme', this._theme);
  }
}
