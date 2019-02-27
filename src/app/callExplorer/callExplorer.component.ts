import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


import { selectCalls, selectIsLoading } from './callExplorer.selectors';
import { LoadAll } from './callExplorer.actions';
import { StateSegmentWithDeps } from './callExplorer.reducer';
import { Call } from '../serverApi';

@Component({
  selector: 'explorer',
  templateUrl: './callExplorer.component.html',
  styleUrls: ['./callExplorer.component.scss']
})
export class CallExplorerComponent {
  public calls$ = this.store.pipe(map(selectCalls));
  public isLoading$ = this.store.pipe(map(selectIsLoading));
  public columnsToDisplay = ['callId', '​callStart​', '​callDuration', 'agent', 'wrapupName'];

  constructor(
    private store: Store<StateSegmentWithDeps>,
    private router: Router,    
  ) {
    store.dispatch(LoadAll.started());
  }

  onRowClick(call: Call) {
    this.router.navigate(['call', call.callId]);
  }
}
