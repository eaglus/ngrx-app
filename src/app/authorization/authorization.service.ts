import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';

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
      tap(isAuthorized => {
        if (!isAuthorized) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
