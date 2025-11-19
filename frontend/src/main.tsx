import {StrictMode, useState} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import {Heading} from "./ui/heading";
import {DegreeSelect} from "./components/DegreeSelect";
import {CertificateSelect} from "./components/CertificateSelect.tsx";
import {ClassList} from "./components/ClassList.tsx";

function Main() {
    const [selectedDegree, setSelectedDegree] = useState<string>('');
    const [selectedCertificate, setSelectedCertificate] = useState<string>('');

    return (
        <App>
            <Heading>SSW590 - Group Project</Heading>
            <DegreeSelect value={selectedDegree} onChange={setSelectedDegree}/>
            <CertificateSelect value={selectedCertificate} onChange={setSelectedCertificate}/>
            <ClassList degreeId={selectedDegree} certificateId={selectedCertificate}/>
        </App>
    );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Main/>
  </StrictMode>,
)
