import React, { useState } from 'react'
import MainWindow from './MainWindow';
import "./index.css"
import { useQueryClient } from '@tanstack/react-query';
import type { Messages } from './Charts';


const App = () => {
  const queryClient = useQueryClient();
  const [msgs, setMsgs] = useState<Messages>([])
  React.useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8000/stream')
    websocket.onopen = () => {
      console.log('connected')
    }
    websocket.onmessage = (e) => {
      try {
        const msg = JSON.parse(JSON.parse(e.data)) as number[]
        setMsgs((old = []) => [msg, ...old])
      } catch (error) {
        console.error(error);
      }
    }

    return () => {
      console.log("close ws");
      websocket.close()
    }
  }, [queryClient])

  return (
    <MainWindow defultMsgs={msgs} />
  )
}

export default App