import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { get } from 'lodash';

import { CallWrapup } from '../../serverApi';
import { LoadOne } from '../callExplorer.actions';
import { StateSegment } from '../callExplorer.reducer';
import { createCallByIdSelector, selectIsLoading } from '../callExplorer.selectors';

//callId, channel, callStart, callEnd, callDuration, dialingDuration, ivrDuration, waitDuration, talkDuration, contact phone, wrapupId, wrapupName*, wrapupComment*

@Component({
    selector: 'card',
    templateUrl: './callCard.component.html',
    styleUrls: ['./callCard.component.scss']
})
export class CallCardComponent {
    private form = this.formBuilder.group({
        wrapupName: [null, [Validators.required]],
        wrapupComment: [null, Validators.required],
    });
    
    public isLoading$ = this.store.pipe(map(selectIsLoading));
    private id$ = this.route.paramMap.pipe(
        map(params => params.get('id'))
    );

    public call$ = this.id$.pipe(switchMap(id =>
        this.store.pipe(map(createCallByIdSelector(id)))        
    ));

    constructor(
        private store: Store<StateSegment>,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
    ) {
        this.id$.subscribe(id =>
            this.store.dispatch(LoadOne.started(id))
        );
    
        this.call$.subscribe(call => {
            const wrapup = get<CallWrapup>(call, ['callWrapups', 0]);
            if (wrapup) {
                const { wrapupName, wrapupComment } = wrapup;
                this.form.reset({
                    wrapupName,
                    wrapupComment
                });
            }
        });
  }

  updateCall() {
      console.log('Update');
  }

  hasError(controlName: string, errorCode: string) {
    const control = this.form.controls[controlName];
    return control.hasError(errorCode);
  }
}
