import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import {Heading} from "./ui/heading";
import {DegreeSelect} from "./components/DegreeSelect";
import {CertificateSelect} from "./components/CertificateSelect.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App>
          <Heading>SSW590 - Group Project</Heading>
          <DegreeSelect/>
          <CertificateSelect/>
      </App>
  </StrictMode>,
)
