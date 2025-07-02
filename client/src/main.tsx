import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
const queryClient = new QueryClient()


const app =
  <QueryClientProvider client={queryClient}>

    <StrictMode>
      <App />
    </StrictMode>,
  </QueryClientProvider>
createRoot(document.getElementById('root')!).render(app)
