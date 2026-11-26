import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { NetworkOnly, Serwist } from "serwist";

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

const swSelf = self as unknown as ServiceWorkerGlobalScope;

const serwist = new Serwist({
    precacheEntries: swSelf.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        {
            matcher: ({ url }) => url.pathname.startsWith("/api/trpc"),
            handler: new NetworkOnly(),
        },
        ...defaultCache,
    ],
});

serwist.addEventListeners();
