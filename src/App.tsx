import { useState } from "react"
import logo from "./logo.svg"
import "./App.css"
import SessionHost from "./models/sessionHost"
import SessionClient from "./models/sessionClient"

function App(): JSX.Element {
  const [session, setSession] = useState<null | SessionHost>(null)

  const onClick = async () => {
    const sessionHost = await SessionHost.new()
    console.log(sessionHost)
    setSession(sessionHost)
    // @ts-expect-error | skenf
    window.sessionHost = sessionHost
  }

  const postUpdate = () => {
    console.log("out", Date.now())
    session?.postUpdate(Date.now())
  }

  const subscribe = () => {
    if (!session) return
    const sessionClient = new SessionClient(session.sessionId)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

        <button type="button" onClick={onClick}>
          create
        </button>
        <button type="button" onClick={postUpdate}>
          post
        </button>
        <button type="button" onClick={subscribe}>
          subscribe
        </button>
      </header>
    </div>
  )
}

export default App
