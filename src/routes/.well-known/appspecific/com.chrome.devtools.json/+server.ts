// src/routes/.well-known/appspecific/com.chrome.devtools.json/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    return new Response('{}', {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
};