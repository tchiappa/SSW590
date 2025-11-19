import { Navbar, NavbarItem, NavbarSection } from './ui/navbar'
import { Sidebar } from './ui/sidebar'
import { StackedLayout } from './ui/stacked-layout'
import { Heading } from "./ui/heading.tsx";
import { DegreeSelect } from "./components/DegreeSelect.tsx";
import { CertificateSelect } from "./components/CertificateSelect.tsx";
import { ClassList } from "./components/ClassList.tsx";
import { useState } from "react";

export default function App() {
    const [selectedDegree, setSelectedDegree] = useState<string>('');
    const [selectedCertificate, setSelectedCertificate] = useState<string>('');

    return (
        <StackedLayout
            navbar={<Navbar><NavbarSection>
                <NavbarItem href="/">SSW590 - Group Project</NavbarItem>
            </NavbarSection></Navbar>}
            sidebar={<Sidebar></Sidebar>}
        >
            <Heading>Programs</Heading>
            <DegreeSelect value={selectedDegree} onChange={setSelectedDegree}/>
            <CertificateSelect value={selectedCertificate} onChange={setSelectedCertificate}/>
            <ClassList degreeId={selectedDegree} certificateId={selectedCertificate}/>
        </StackedLayout>
    )
}