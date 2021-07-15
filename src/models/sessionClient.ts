interface EventData {
  timestamp: number
}

/**
 * subscribes to session
 */
export default class SessionClient extends EventSource {
  constructor(
    sessionId: string,
    public options: { log: boolean } = { log: false }
  ) {
    super(`https://messages.pogify.net/sub/${sessionId}.b1`)
  }

  lastMessage?: Date

  addEventListener = (
    type: keyof EventSourceEventMap,
    listener: (ev: Event | MessageEvent<EventData>) => unknown
  ): void => {
    if (type === "message") {
      super.addEventListener(type, (ev) => {
        const data = ev.data as EventData

        // if the received message is stale then silently ignore
        if (data.timestamp < Date.now()) {
          // unless logging is turned on
          if (this.options.log) {
            // eslint-disable-next-line no-console
            console.log("stale message ignored", ev)
          }

          return
        }

        listener(ev)
      })
    } else {
      super.addEventListener(type, listener)
    }
  }
}
