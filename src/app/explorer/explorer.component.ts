import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { State } from '../reducers';

@Component({
  selector: 'explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent {

  constructor(private store: Store<State>) {
    console.log('explorer store', store);
  }
}
