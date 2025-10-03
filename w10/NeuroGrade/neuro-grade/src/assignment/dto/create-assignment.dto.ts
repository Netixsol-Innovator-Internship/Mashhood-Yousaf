export class CreateAssignmentDto {
  readonly title: string;
  readonly description: string;
  readonly instructions: string;
  readonly minLength: number;
  readonly maxMarks: number;
  readonly gradingMode: 'strict' | 'loose';
  readonly teacherName: string;
}
