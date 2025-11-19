import {useEffect, useState} from "react";
import {type Program} from "../types/Program";
import {Field, Label} from "../ui/fieldset.tsx";
import {Select} from "../ui/select.tsx";
import {API_BASE_URL} from "../config";

interface CertificateSelectProps {
    value?: string;
    onChange?: (value: string) => void;
}

export function CertificateSelect({ value, onChange }: CertificateSelectProps) {
    const [certificates, setCertificates] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/certificates`)
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

    return <div className="mt-8">
        <Field>
            <Label>Certificate</Label>
            <Select
                name="certificate"
                disabled={loading}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            >
                <option value="">None</option>
                {certificates.map(certificate => (
                    <option key={certificate.program_id} value={certificate.program_id}>
                        {certificate.name}
                    </option>
                ))}
            </Select>
        </Field>
    </div>;
}