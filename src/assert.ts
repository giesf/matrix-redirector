import nativeAssert from 'assert'
import { HTTPException } from 'hono/http-exception'

export function assert(value: unknown, message?: string): asserts value {
    return nativeAssert(value, new HTTPException(400, { message }))
}