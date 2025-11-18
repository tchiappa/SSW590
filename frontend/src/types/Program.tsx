export interface Program {
    program_id: number;
    name: string;
    type: string;
    parent_program_id: number | null;
}