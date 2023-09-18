// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  corlief: 'http://localhost:8888',
  deck: 'https://deck-staging.sinfo.org',
  frontend: 'http://localhost:4200',
  google: {
    clientId: '475922911787-2eunqihjt791ul7kfi1ji185o7mlehq2.apps.googleusercontent.com'
  },
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
