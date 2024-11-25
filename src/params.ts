import { HonoRequest } from "hono";
import { assert } from "./assert"



export function handleSearchParams(req: HonoRequest) {

    const defaultFrontend = "https://app.element.io/#/room/"

    const userId = req.query("userId");
    const homeserver = req.query("homeserver");
    const frontend = req.query("frontend") || defaultFrontend
    assert(typeof homeserver == "string", "homeserver must be defined")
    assert(typeof userId == "string", "userId must be defined")



    const searchParams = new URLSearchParams()
    searchParams.set("userId", userId)
    searchParams.set("homeserver", homeserver)
    searchParams.set("frontend", frontend)

    return {
        frontend, userId, homeserver, searchParamsAsString: searchParams.toString()
    }
}