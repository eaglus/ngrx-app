import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { get } from 'lodash';

import { CallWrapup, Call } from '../../serverApi';
import { LoadOne, Update } from '../callExplorer.actions';
import { StateSegment } from '../callExplorer.reducer';
import { createCallByIdSelector, selectIsLoading } from '../callExplorer.selectors';

@Component({
    selector: 'app-card',
    templateUrl: './callCard.component.html',
    styleUrls: ['./callCard.component.scss']
})
export class CallCardComponent {
    private form = this.formBuilder.group({
        wrapupName: [null, [Validators.required]],
        wrapupComment: [null, Validators.required],
    });

    private readonlyFields = [
        [{
            name: 'Call id',
            code: 'callId'
        },
        {
            name: 'Channel',
            code: 'channel'
        }],
        [{
            name: 'Call start',
            code: 'callStart'
        },
        {
            name: 'Call end',
            code: 'callEnd'
        }],
        [{
            name: 'Call duration',
            code: 'callDuration'
        },
        {
            name: 'Dialing duration',
            code: 'dialingDuration'
        }],
        [{
            name: 'Ivr duration',
            code: 'ivrDuration'
        },
        {
            name: 'Wait duration',
            code: 'waitDuration'
        }],
        [{
            name: 'Talk duration',
            code: 'talkDuration'
        },
        {
            name: 'Contact phone',
            code: 'contact.phone'
        }],
        [{
            name: 'Wrapup id',
            code: 'callWrapups[0].wrapupId'
        }],
    ];

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
            const wrapup = get<CallWrapup>(call, 'data.callWrapups[0]');
            if (wrapup) {
                const { wrapupName, wrapupComment } = wrapup;
                this.form.reset({
                    wrapupName,
                    wrapupComment
                });
            }
        });
  }

  getField(call: Call, path: string) {
      return get(call, 'data.' + path);
  }

  updateCall(call: Call) {
      this.store.dispatch(Update.started(call));
  }

  hasError(controlName: string, errorCode: string) {
    const control = this.form.controls[controlName];
    return control.hasError(errorCode);
  }
}
