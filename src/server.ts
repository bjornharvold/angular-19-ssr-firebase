import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import axios from 'axios';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const OG_DATA = {
  title: 'Default Title',
  description: 'Default Description',
  image: 'https://yourdomain.com/default-image.jpg',
  url: `https://yourdomain.com`
};

// Function to fetch Open Graph data from an API
async function fetchMetaTags(urlName: string) {
  try {
    // console.log('retrieve OG data');
    const response = await axios.get(`https://your-api.com/users/${urlName}/og-data`);
    return response.data; // Assuming API returns { title, description, image, url }
  } catch (error) {
    console.error('Error fetching Open Graph data:', error);
    return OG_DATA;
  }
}

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', async(req, res, next) => {
  // console.log('req', req);
  const originalUrl = req.originalUrl;
  // console.log('originalUrl', req.originalUrl);

  let urlName = null;

  // Extract user ID if URL contains it (e.g., /profile/123)
  if (originalUrl.length > 1) {
    // console.log('originalUrl', req.originalUrl.split('/'));
    urlName = originalUrl.split('/')[1];
  }

  let metaTags: any;
  if (urlName != null) {
    // console.log('urlName', urlName);

    metaTags = await fetchMetaTags(urlName);
  } else {
    metaTags = OG_DATA;
  }
  
  // console.log(metaTags);

  angularApp
    .handle(req, { metaTags : metaTags })
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
