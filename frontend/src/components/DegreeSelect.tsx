import {useEffect, useState} from "react";
import {type Program} from "../types/Program";
import {Field, Label} from "../ui/fieldset.tsx";
import {Select} from "../ui/select.tsx";

export function DegreeSelect() {
    const [degrees, setDegrees] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/api/degrees')
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

    return <Field>
        <Label>Degree</Label>
        <Select name="degree" disabled={loading}>
            <option value="">None</option>
            {degrees.map(degree => (
                <option key={degree.program_id} value={degree.program_id}>
                    {degree.name}
                </option>
            ))}
        </Select>
    </Field>;
}