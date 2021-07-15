import axios from "axios"

export type UpdateResponse = {
  session: string
  publishedMessages: string
  storedMessages: string
  subscribers: string
}

export const postUpdate = async (
  token: string,
  update: unknown
): Promise<UpdateResponse> => {
  const res = (
    await axios.post("https://api.pogify.net/v2/session/update", update, {
      headers: {
        "X-SESSION-TOKEN": token,
      },
    })
  ).data

  return {
    publishedMessages: res.published_messages,
    subscribers: res.subscribers,
    session: res.channel,
    storedMessages: res.stored_messages,
  }
}
