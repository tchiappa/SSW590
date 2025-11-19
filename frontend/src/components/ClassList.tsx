import { useEffect, useState } from "react";
import { type Course } from "../types/Course";
import { API_BASE_URL } from "../config";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "../ui/table";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";

interface ClassListProps {
    degreeId: string;
    certificateId: string;
}

export function ClassList({ degreeId, certificateId }: ClassListProps) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!degreeId && !certificateId) {
            setCourses([]);
            return;
        }

        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (degreeId) params.append('degreeId', degreeId);
        if (certificateId) params.append('certificateId', certificateId);

        fetch(`${API_BASE_URL}/api/class-list?${params.toString()}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch class list');
                }
                return response.json();
            })
            .then(data => {
                setCourses(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching class list:', error);
                setError('Failed to load class list. Please try again.');
                setLoading(false);
            });
    }, [degreeId, certificateId]);

    if (!degreeId && !certificateId) {
        return (
            <div className="mt-8">
                <Heading level={2}>Class List</Heading>
                <Text className="mt-2">Please select a degree or certificate to view the class list.</Text>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="mt-8">
                <Heading level={2}>Class List</Heading>
                <Text className="mt-2">Loading courses...</Text>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-8">
                <Heading level={2}>Class List</Heading>
                <Text className="mt-2 text-red-600">{error}</Text>
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="mt-8">
                <Heading level={2}>Class List</Heading>
                <Text className="mt-2">No courses found for the selected program(s).</Text>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <Heading level={2}>Class List</Heading>
            <Text className="mt-2 mb-4">
                Found {courses.length} course{courses.length !== 1 ? 's' : ''} for your selection.
            </Text>
            <Table striped>
                <TableHead>
                    <TableRow>
                        <TableHeader>Course ID</TableHeader>
                        <TableHeader>Title</TableHeader>
                        <TableHeader>Credits</TableHeader>
                        <TableHeader>Requirement Types</TableHeader>
                        <TableHeader>Programs</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courses.map((course) => (
                        <TableRow key={course.course_id}>
                            <TableCell className="font-medium">{course.course_id}</TableCell>
                            <TableCell>{course.title}</TableCell>
                            <TableCell>{course.credits}</TableCell>
                            <TableCell className="whitespace-normal">
                                {course.requirement_types.split(', ').map((type, idx) => (
                                    <div key={idx}>{type}</div>
                                ))}
                            </TableCell>
                            <TableCell className="whitespace-normal">
                                {course.program_names.split(', ').map((program, idx) => (
                                    <div key={idx}>{program}</div>
                                ))}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
