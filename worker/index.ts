import app from "vinext/server/fetch-handler";
import { authenticatedRequest, type AccessSettings } from "./access";

export default {
  async fetch(request: Request, env: Cloudflare.Env & AccessSettings, ctx: ExecutionContext) {
    const url = new URL(request.url);
    const protectedRequest = url.pathname === "/yonetim" || url.pathname.startsWith("/yonetim/") ||
      !["GET", "HEAD", "OPTIONS"].includes(request.method);
    const authenticated = await authenticatedRequest(request, env);
    if (protectedRequest && !authenticated.owner) {
      return new Response("Yönetici girişi gerekli. Cloudflare Access üzerinden giriş yapın.", {
        status: 401, headers: { "Cache-Control": "private, no-store", "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    if (url.pathname === "/signin-with-chatgpt") {
      return new Response(null, { status: 302, headers: { Location: "/yonetim", "Cache-Control": "no-store" } });
    }
    if (url.pathname === "/signout-with-chatgpt") {
      return new Response(null, { status: 302, headers: { Location: "/cdn-cgi/access/logout", "Cache-Control": "no-store" } });
    }
    const response = await app.fetch(authenticated.request, env, ctx);
    if (protectedRequest || authenticated.owner) {
      const privateResponse = new Response(response.body, response);
      privateResponse.headers.set("Cache-Control", "private, no-store");
      return privateResponse;
    }
    return response;
  },
};
