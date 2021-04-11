import answerChallenge, {
  SessionClaim,
  SessionClaimSolution,
} from "./answerChallenge"
import fetchChallenge, { SessionClaimChallenge } from "./fetchChallenge"

const newSession = async (): Promise<SessionClaim> => {
  const challenge = await fetchChallenge()

  const solution = await findSolution(challenge)

  return answerChallenge(solution)
}

export default newSession

const findSolution = async ({
  sessionId,
  issued,
  difficulty,
  checksum,
}: SessionClaimChallenge): Promise<SessionClaimSolution> => {
  const nonce = `${sessionId}.${issued}`

  let solution = Math.floor(Math.random() * 10000000)

  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const hash = await sha256(solution + nonce)
    const hashInBinary = hex2bin(hash)

    if (hashInBinary.startsWith("0".repeat(difficulty))) {
      return {
        checksum,
        hash,
        issued,
        sessionId,
        solution: String(solution),
      }
    }
    solution += 1
  }
}

async function sha256(message: string) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message)

  // hash the message
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  // convert bytes to hex string
  return hashArray.map((b) => `00${b.toString(16)}`.slice(-2)).join("")
}

function hex2bin(hex: string): string {
  const splitHexString = hex.match(/.{1,2}/g)

  if (splitHexString === null) {
    throw new Error("not a valid hex string")
  }

  return splitHexString
    .map((hexChar) => parseInt(hexChar, 16).toString(2).padStart(8, "0"))
    .join("")
}
