# NgrxApp

Тестовое задание: приложение на Angular 7.
Что делает: авторизует пользователя, показывает список звонков, даёт редактировать некоторые поля этих звонков.
Поскольку серверное api больше не работает (задание делалось 2 года назад), использую вместо него заглушку.
Есть поддержка двух локализаций - русской и английской.
В приложении используется библиотека ngRx (аналог redux для angular).
Для тестов эффектов из ngRx используется библиотека rx-marbles.
В localstorage сохраняется имя авторизованнного юзера и выбранный язык.
Для автоматического обновления элементов интерфейса используется фильтр async, для перевода строчки - фильтр translate.
Для контроля доступности роутов используется гард AuthGuard, который перенаправляет на страницу авторизации, если надо

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
