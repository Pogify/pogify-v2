import axios from "axios"
import promiseRetry from "promise-retry"

export type SessionClaimSolution = {
  sessionId: string
  issued: number
  checksum: string
  solution: string
  hash: string
}

export type SessionClaim = {
  expiresIn: number
  refreshToken: string
  session: string
  token: string
}

const answerQuestion = (answer: SessionClaimSolution): Promise<SessionClaim> =>
  promiseRetry(
    async () =>
      (await axios.post("https://api.pogify.net/v2/session/claim", answer)).data
  )

export default answerQuestion
