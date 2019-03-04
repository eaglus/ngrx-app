import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { Call, CallData } from '../serverApi';
import { Navigate } from '../routing';

import { selectCalls, selectIsLoading, selectError } from './callExplorer.selectors';
import { LoadAll } from './callExplorer.actions';
import { StateSegmentWithDeps } from './callExplorer.reducer';

@Component({
  selector: 'app-call-explorer',
  templateUrl: './callExplorer.component.html',
  styleUrls: ['./callExplorer.component.scss']
})
export class CallExplorerComponent {
  public calls$ = this.store.pipe(map(selectCalls));
  public isLoading$ = this.store.pipe(map(selectIsLoading));
  public error$ = this.store.pipe(map(selectError));
  public columnsToDisplay = ['callId', '​callStart​', '​callDuration', 'agent', 'wrapupName'];

  constructor(
    private store: Store<StateSegmentWithDeps>,
  ) {
    store.dispatch(LoadAll.started());
  }

  onRowClick(data: CallData) {
    this.store.dispatch(Navigate(['call', data.id]));
  }

  getData(calls: Call[]) {
    return calls.map(call => call.data);
  }
}
