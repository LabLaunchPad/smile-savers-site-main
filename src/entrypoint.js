import { onRequestPost as chatPost, onRequestOptions as chatOptions } from '../functions/api/chat.js';
import { onRequestPost as contactPost, onRequestOptions as contactOptions } from '../functions/api/contact.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Mock Pages context object to match what the existing functions expect
    const context = {
      request,
      env,
      waitUntil: ctx.waitUntil ? ctx.waitUntil.bind(ctx) : () => {},
      next: () => {
        return env.ASSETS.fetch(request);
      }
    };

    // Route for the AI chat assistant
    if (url.pathname === '/api/chat') {
      if (request.method === 'OPTIONS') {
        return chatOptions(context);
      }
      if (request.method === 'POST') {
        return chatPost(context);
      }
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Route for the contact form submissions
    if (url.pathname === '/api/contact') {
      if (request.method === 'OPTIONS') {
        return contactOptions(context);
      }
      if (request.method === 'POST') {
        return contactPost(context);
      }
      return new Response('Method Not Allowed', { status: 405 });
    }

    // Default fallback: serve static assets built by Astro (from the ASSETS binding)
    return env.ASSETS.fetch(request);
  }
};
