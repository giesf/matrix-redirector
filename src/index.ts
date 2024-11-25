import { Hono } from 'hono'
import { assert } from './assert'
import matrixSdk from 'matrix-js-sdk'
import { uiForFlows } from './ui'
import { html } from 'hono/html'
import { findRoomWithUser } from './room'
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { handleSearchParams } from './params'
import { wrap } from './html'


const app = new Hono()
const matrixCookieName = "matrix-auth"


app.get('/', async (c) => {

  const loginFlowHint = c.req.query("loginflowHint")
  const { userId, homeserver, frontend, searchParamsAsString } = handleSearchParams(c.req)
  const access_token = getCookie(c, matrixCookieName)

  if (access_token) {
    const matrixClient = matrixSdk.createClient({
      baseUrl: homeserver.startsWith("http") ? homeserver : 'https://' + homeserver,
      accessToken: access_token
    })

    try {
      if (c.req.header("Sec-Purpose")?.includes("prefetch")) return c.text("")
      const roomId = await findRoomWithUser(matrixClient, userId)

      return c.redirect(frontend + roomId)
    } catch (err) {
      console.log(err)
      return c.html(wrap("Error: User not found", html`<p>User not found</p>`))
    }
  }
  const matrixClient = matrixSdk.createClient({
    baseUrl: homeserver.startsWith("http") ? homeserver : 'https://' + homeserver
  })

  const flows = (await matrixClient.loginFlows()).flows.map(flow => flow.type)
  console.log(loginFlowHint)

  if (loginFlowHint) {
    console.log(loginFlowHint)
    assert(flows.includes(loginFlowHint), "Login flow not available")

  }

  const uiHtml = uiForFlows(loginFlowHint ? [loginFlowHint] : flows, { homeserver, userId, searchParamsAsString })

  return c.html(wrap("Sign in with  Matrix...", uiHtml))

})

app.post("/pw-login", async (c) => {
  const body = await c.req.parseBody<{ userId: string, password: string }>();

  const { userId, homeserver, searchParamsAsString } = handleSearchParams(c.req)

  console.log(body)
  assert(typeof body.password == "string" && typeof body.userId == "string", "Credentials need to be provided")



  const matrixClient = matrixSdk.createClient({
    baseUrl: homeserver.startsWith("http") ? homeserver : 'https://' + homeserver
  })
  const loginRes = await matrixClient.loginWithPassword(body.userId, body.password)

  console.log(loginRes);

  setCookie(c, matrixCookieName, loginRes.access_token, {
    path: "/",
    httpOnly: true,
    secure: true,
  });

  return c.redirect("../?" + searchParamsAsString)
})

app.get("/sso", async (c) => {

  const { userId, homeserver, searchParamsAsString } = handleSearchParams(c.req)

  const matrixClient = matrixSdk.createClient({
    baseUrl: homeserver.startsWith("http") ? homeserver : 'https://' + homeserver
  })

  const url = new URL(c.req.url)
  const redirectURL = await matrixClient.getSsoLoginUrl(url.protocol + url.host + "/sso-callback?" + searchParamsAsString)

  console.log(redirectURL);

  return c.redirect(redirectURL)
})

app.get("/sso-callback", async (c) => {
  const loginToken = c.req.query("loginToken");
  assert(typeof loginToken == "string", "loginToken must be defined")

  const { userId, homeserver, searchParamsAsString } = handleSearchParams(c.req)


  const matrixClient = matrixSdk.createClient({
    baseUrl: homeserver.startsWith("http") ? homeserver : 'https://' + homeserver
  })

  try {

    const loginRes = await matrixClient.loginWithToken(loginToken)
    setCookie(c, matrixCookieName, loginRes.access_token, {
      path: "/",
      httpOnly: true,
      secure: true,
    });
    return c.redirect("../?" + searchParamsAsString)

  } catch (err) {
    console.log(err)
    return c.html(wrap("Error could not log in", html`<p>Login unsuccessful`), 400)
  }

})

app.get("/logout", async (c) => {

  const redirecTo = c.req.query("redirectTo")

  deleteCookie(c, matrixCookieName)

  if (!redirecTo) {
    return c.html(wrap("Successfully logged out", "<p>You have been successfully logged out!</p>"))
  }

  return c.redirect(redirecTo)

})

export default app
