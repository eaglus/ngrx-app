import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';
import { get } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

import { CallWrapup, Call } from '../../serverApi';
import { LoadOne, Update } from '../callExplorer.actions';
import { StateSegment } from '../callExplorer.reducer';
import { createCallByIdSelector, selectIsLoading, selectError } from '../callExplorer.selectors';

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
            name: this.translate.get('Call id'),
            code: 'callId'
        },
        {
            name: this.translate.get('Channel'),
            code: 'channel'
        }],
        [{
            name: this.translate.get('Call start'),
            code: 'callStart'
        },
        {
            name: this.translate.get('Call end'),
            code: 'callEnd'
        }],
        [{
            name: this.translate.get('Call duration'),
            code: 'callDuration'
        },
        {
            name: this.translate.get('Dialing duration'),
            code: 'dialingDuration'
        }],
        [{
            name: this.translate.get('Ivr duration'),
            code: 'ivrDuration'
        },
        {
            name: this.translate.get('Wait duration'),
            code: 'waitDuration'
        }],
        [{
            name: this.translate.get('Talk duration'),
            code: 'talkDuration'
        },
        {
            name: this.translate.get('Contact phone'),
            code: 'contact.phone'
        }],
        [{
            name: this.translate.get('Wrapup id'),
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

    public error$ = this.store.pipe(map(selectError));

    constructor(
        private store: Store<StateSegment>,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
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
      const wrapups = call.data.callWrapups;
      const { controls } = this.form;
      const updated: Call = {
          ...call,
          data: {
              ...call.data,
              callWrapups: [
                  {
                      ...wrapups[0],
                      wrapupName: controls.wrapupName.value,
                      wrapupComment: controls.wrapupComment.value,
                  },
                  ...wrapups.slice(1)
              ]
          }
      };
      this.store.dispatch(Update.started(updated));
  }

  hasError(controlName: string, errorCode: string) {
    const control = this.form.controls[controlName];
    return control.hasError(errorCode);
  }
}
