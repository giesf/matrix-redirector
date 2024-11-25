import { html } from "hono/html";
import { HtmlEscapedString, raw } from "hono/utils/html";


export function wrap(title: string, innerHTML: string | HtmlEscapedString | Promise<HtmlEscapedString>) {

    return html`<!doctype html>
<html lang=en>
    <head>
        <meta charset=utf-8>
        <title>${title}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" >
    </head>
    <body>
        <div class="container" style="max-width: 40rem;margin-top: 4rem;"> 
        ${raw(innerHTML)}
        </div>
    </body>
</html>`
}