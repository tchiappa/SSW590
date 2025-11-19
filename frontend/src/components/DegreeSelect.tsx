import {useEffect, useState} from "react";
import {type Program} from "../types/Program";
import {Field, Label} from "../ui/fieldset.tsx";
import {Select} from "../ui/select.tsx";
import {API_BASE_URL} from "../config";

interface DegreeSelectProps {
    value?: string;
    onChange?: (value: string) => void;
}

export function DegreeSelect({ value, onChange }: DegreeSelectProps) {
    const [degrees, setDegrees] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/degrees`)
            .then(response => response.json())
            .then(data => {
                setDegrees(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching degrees:', error);
                setLoading(false);
            });
    }, []);

    return <div className="mt-8">
        <Field>
            <Label>Degree</Label>
            <Select
                name="degree"
                disabled={loading}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            >
                <option value="">None</option>
                {degrees.map(degree => (
                    <option key={degree.program_id} value={degree.program_id}>
                        {degree.name}
                    </option>
                ))}
            </Select>
        </Field>
    </div>;
}