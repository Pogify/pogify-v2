import promiseRetry from "promise-retry"
import { SessionClaim } from "../api/session/answerChallenge"
import newSession from "../api/session/newSession"
import refreshSessionAccessToken from "../api/session/refreshSessionAccessToken"
import type { UpdateResponse } from "../api/session/postUpdate"
import { postUpdate } from "../api/session/postUpdate"

export default class SessionHost {
  static new = async (): Promise<SessionHost> => {
    const sessionClaim = await newSession()

    return new SessionHost(sessionClaim)
  }

  static recoverExisting = async (
    oldToken: string,
    refreshToken: string
  ): Promise<SessionHost> => {
    const sessionClaim = await refreshSessionAccessToken(oldToken, refreshToken)

    return new SessionHost(sessionClaim)
  }

  constructor(sessionClaim: SessionClaim) {
    this._createdAt = new Date()

    this.setProperties(sessionClaim)
  }

  private setProperties(sessionClaim: SessionClaim) {
    this._lastRefreshedAt = new Date()
    this._sessionId = sessionClaim.session
    this._tokenTTL = sessionClaim.expiresIn
    this._token = sessionClaim.token
    this._refreshToken = sessionClaim.refreshToken
    this._alive = true
  }

  protected _sessionId!: string

  get sessionId(): string {
    return this._sessionId
  }

  protected _createdAt: Date

  get createdAt(): Date {
    return this._createdAt
  }

  protected _tokenTTL!: number

  get tokenTTL(): number {
    return this._tokenTTL
  }

  get expiresIn(): number {
    return Date.now() - this._lastRefreshedAt.getTime()
  }

  protected _token!: string

  get token(): string {
    return this._token
  }

  protected _refreshToken!: string

  get refreshToken(): string {
    return this._refreshToken
  }

  protected _lastRefreshedAt!: Date

  get lastRefreshedAt(): Date {
    return this._lastRefreshedAt
  }

  protected _alive!: boolean

  get alive(): boolean {
    return this._alive
  }

  protected fetchNewToken = async (): Promise<void> => {
    const sessionClaimWithNewTokens = await refreshSessionAccessToken(
      this.token,
      this.refreshToken
    )

    this.setProperties(sessionClaimWithNewTokens)
  }

  postUpdate = async (update: unknown): Promise<UpdateResponse> => {
    const res = await promiseRetry(
      // eslint-disable-next-line consistent-return
      async (retry) => {
        try {
          return await postUpdate(this.token, update)
        } catch (e) {
          if (e.statusCode === 401) {
            await this.fetchNewToken()
          } else if (
            e.statusCode === 400 &&
            e.response.body === "refresh token expired"
          )
            retry(e)
        }
      },
      { factor: 1.2, retries: 5 }
    )

    // this block shouldn't ever be called but its to keep typescript happy.
    // ts doesn't pick up on how promiseRetry would throw an error.
    if (!res) return Promise.reject(new Error("it didn't work"))

    return res
  }

  saveSession = (): void => {
    window.localStorage.setItem("pogify::accessToken", this.token)
    window.localStorage.setItem("pogify::refreshToken", this.refreshToken)
  }
}
