import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { tap, distinctUntilChanged, filter } from 'rxjs/operators';

import { StateSegment } from './authorization.reducer';
import { selectIsAuthorized } from './authorization.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<StateSegment>,
    private router: Router
  ) {}

  canActivate() {
    return this.store.pipe(
      select(selectIsAuthorized),
      distinctUntilChanged(),
      filter(isAuthorized => !isAuthorized),
      tap(() => {
        this.router.navigate(['/login']);
      })
    );
  }
}
