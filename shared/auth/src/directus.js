import { createDirectus, rest, authentication } from '@directus/sdk';

// The URL should point to your Directus backend.
// For local development, this is often http://localhost:8055
// In a Vite project, environment variables are accessed via `import.meta.env`
// and must be prefixed with `VITE_` to be exposed to the client.
const directusUrl = import.meta.env.VITE_DIRECTUS_ADMIN_DOMAIN;
console.log('Initializing Directus with URL:', directusUrl);
const directus = createDirectus(directusUrl)
  .with(authentication('cookie'))
  .with(rest());

export { directus };