import {useEffect, useState} from "react";
import {type Program} from "../types/Program";
import {Field, Label} from "../ui/fieldset.tsx";
import {Select} from "../ui/select.tsx";

export function CertificateSelect() {
    const [certificates, setCertificates] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/api/certificates')
            .then(response => response.json())
            .then(data => {
                setCertificates(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching certificates:', error);
                setLoading(false);
            });
    }, []);

    return <Field>
        <Label>Certificate</Label>
        <Select name="certificate" disabled={loading}>
            <option value="">None</option>
            {certificates.map(certificate => (
                <option key={certificate.program_id} value={certificate.program_id}>
                    {certificate.name}
                </option>
            ))}
        </Select>
    </Field>;
}