import { useState } from "react"
import logo from "./logo.svg"
import "./App.css"
import newSession from "./api/session/newSession"
import SessionHost from "./models/sessionHost"

function App(): JSX.Element {
  const [session, setSession] = useState<null | SessionHost>(null)

  const onClick = async () => {
    const sessionHost = await SessionHost.new()
    console.log(sessionHost)
    // @ts-expect-error | skenf
    window.sessionHost = sessionHost
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

        <button type="button" onClick={onClick}>
          thing
        </button>
      </header>
    </div>
  )
}

export default App
