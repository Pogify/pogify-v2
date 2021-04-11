import axios from "axios"
import promiseRetry from "promise-retry"
import { SessionClaim } from "./answerChallenge"

const refreshSessionAccessToken = (
  sessionToken: string,
  refreshToken: string
): Promise<SessionClaim> =>
  promiseRetry<SessionClaim>(
    async () =>
      (
        await axios.post("https://api.pogify.net/v2/session/refresh", null, {
          params: {
            sessionToken,
            refreshToken,
          },
        })
      ).data
  )

export default refreshSessionAccessToken
