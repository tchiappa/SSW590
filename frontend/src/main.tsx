import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {Heading} from "./components/heading.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App>
          <Heading>SSW590 - Group Project</Heading>
      </App>
  </StrictMode>,
)
