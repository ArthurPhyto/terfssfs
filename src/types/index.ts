export interface TargetURL {
  url: string;
  percentage: number;
  id: string;
}

export interface RandomURL {
  id: string;
  path: string;
  targets: TargetURL[];
  projectId: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
}