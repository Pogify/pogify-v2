import axios from "axios"
import promiseRetry from "promise-retry"

export type SessionClaimChallenge = {
  checksum: string
  difficulty: number
  issued: number
  sessionId: string
}

const fetchQuestion = (): Promise<SessionClaimChallenge> =>
  promiseRetry<SessionClaimChallenge>(
    async () =>
      (await axios.get("https://api.pogify.net/v2/session/issue")).data
  )

export default fetchQuestion
