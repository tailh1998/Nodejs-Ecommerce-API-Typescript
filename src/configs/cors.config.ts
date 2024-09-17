import { ENVIRONMENT, WHITELIST_DOMAINS } from "~/constants"
import { ForbiddenError } from "~/core/error.response"

type StaticOrigin = boolean | string | RegExp | Array<boolean | string | RegExp>

type CustomOrigin = (
  requestOrigin: string | undefined,
  callback: (err: Error | null, origin?: StaticOrigin) => void
) => void

interface CorsOptions {
  /**
   * @default '*''
   */
  origin?: StaticOrigin | CustomOrigin | undefined
  /**
   * @default 'GET,HEAD,PUT,PATCH,POST,DELETE'
   */
  methods?: string | string[] | undefined
  allowedHeaders?: string | string[] | undefined
  exposedHeaders?: string | string[] | undefined
  credentials?: boolean | undefined
  maxAge?: number | undefined
  /**
   * @default false
   */
  preflightContinue?: boolean | undefined
  /**
   * @default 204
   */
  optionsSuccessStatus?: number | undefined
}

export const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin && process.env.NODE_ENV === ENVIRONMENT.DEV) {
      return callback(null, true)
    }

    if (origin && WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true)
    }

    return callback(new ForbiddenError(`::[ERROR]::${origin} not allowed by our CORS Policy.`))
  },
  optionsSuccessStatus: 200,
  credentials: true
}
