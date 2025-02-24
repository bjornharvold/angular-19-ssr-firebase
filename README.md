# Angular 19 SSR + Firebase integration

Here's what's been done to this repo so far:

- I created this Angular repo with Nx and chose to enable SSR support when Nx asked me
- In this demo, I wanted to be able to create some OpenGraph data for my Angular app. You can see that test code in: src/server.ts. I then investigate the contents of the request context in AppComponent and use the meta service to set my OG properties.
- I then added firebase and initialized it with `firebase init`, where I said I needed functions and hosting to my Firebase app. 
- Firebase created the directory `functions`.
- I install express and axios to `functions` package.json. Don't know if express is needed however.

## Run locally

- Type `npm install`
- Type `npx nx serve`
- Open up a browser at http://localhost:4200
- Verify that OpenGraph metadata properties have been set on the page under the head element.

## Build

- Type `npx nx build`

## Deploy to Firebase

To test this for yourself using your Firebase instance, you will need to:

- Type `npx nx build`
- Type `npx firebase login`
- Create a new Firebase project externally (you need to be on the Blaze plan for Firebase Functions to work) 
- Change the name in .firebaserc to match your Firebase project ID.
- Type `npx firebase deploy`
- Sit back and wait as it takes a while to deploy for the first time.

## TODO

There is no up-to-date documentation anywhere on how to write the functions/index.ts file to integrate with the dist/server. Angular 18 information on how to do it can be found here: https://medium.com/@sehban.alam/deploying-angular-ssr-on-firebase-hosting-for-optimized-performance-and-seo-3bbd6f6a2246