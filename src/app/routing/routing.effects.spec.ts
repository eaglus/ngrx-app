import { Observable } from 'rxjs';
import { AnyAction } from 'typescript-fsa';

import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { marbles } from 'rxjs-marbles/jasmine';
import { Router } from '@angular/router';

import { navigateToLogin } from './routing.actions';
import { RoutingEffects } from './routing.effects';

describe('Routing Effects', () => {
  let effects: RoutingEffects;

  let actions: Observable<AnyAction>;

  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [
        RoutingEffects,
        provideMockActions(() => actions),
        {
          provide: Router,
          useFactory:  () => router
        },
      ],
    });
  });

  describe('Navigate', () => {
    it('Navigate action should call router.navigate', marbles(m => {
      actions = m.cold('a--|', {
        a: navigateToLogin,
      });

      router = {
        navigate: (commands: any[]) => {
          expect(commands).toEqual(['login']);
        }
      } as Router;

      spyOn(router, 'navigate').and.callThrough();

      effects = TestBed.get(RoutingEffects);
      m.expect(effects.route$).toBeObservable('---|');

      m.flush();
      expect(router.navigate).toHaveBeenCalled();
    }));

  });
});
