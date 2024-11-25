import { html } from "hono/html"





export function uiForFlows(flows: string[], options: {
    userId: string,
    homeserver: string,
    searchParamsAsString: string,
}) {



    const innerHTML = `
        <img src="https://matrix.org/images/matrix-logo-white.svg"  style="height: 48pt;margin-bottom: 1.5rem;" />
        <h2>Sign into <span>${options.homeserver}</span></h2>
        ${flows.includes("m.login.password") && html`<form action="pw-login?${options.searchParamsAsString}" method="post">
            <label>Username</label>
            <input name="userId"  type="userId" />
            <label>Password</label>
            <input name="password" type="password"  />
            <button type="submit">Sign in</button>
        </form>`}

        ${flows.includes("m.login.sso") && html`
            <p class="center" style="text-align:center;">or</p>
            <div><a href="sso?${options.searchParamsAsString}" style="display:block;width:100%;"><button class="contrast" type="button" style="width:100%;">Sign in with SSO</button></a></div>`}
    `



    return innerHTML
}