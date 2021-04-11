import axios from "axios"
import { SessionClaim } from "../api/session/answerChallenge"
import newSession from "../api/session/newSession"
import refreshSessionAccessToken from "../api/session/refreshSessionAccessToken"

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

  protected fetchNewToken = async (): Promise<void> => {
    const sessionClaimWithNewTokens = await refreshSessionAccessToken(
      this.token,
      this.refreshToken
    )

    this.setProperties(sessionClaimWithNewTokens)
  }

  postUpdate = (update: unknown): void => {
    axios.post("https://api.pogify.net/v2/session/update", update, {
      headers: {
        "X-SESSION-TOKEN": this.token,
      },
    })
  }
}
