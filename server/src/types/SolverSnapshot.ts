export interface IAssignment {
  studentId: string;
  projectId: string;
}

export interface ISolverSnapshot {
  createdAt: Date;
  profile: string;
  result: IAssignment[];
  studentCount: number;
  projectCount: number;
  inputHash?: string;
}