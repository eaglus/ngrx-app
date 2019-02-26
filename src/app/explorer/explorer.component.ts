import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { selectCalls } from './explorer.selectors';
import { LoadAll } from './explorer.actions';
import { State } from '../reducers';

@Component({
  selector: 'explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent {
  private calls$ = this.store.pipe(map(selectCalls));

  constructor(private store: Store<State>) {
    console.log('explorer store', store);
    store.dispatch(LoadAll.started());
    this.calls$.subscribe(calls => console.log('calls', calls));
  }
}
