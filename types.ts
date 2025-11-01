
export enum Severity {
  Critical = 'Critical',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export interface Bug {
  id: string;
  projectId: string;
  title: string;
  description: string;
  severity: Severity;
}

export interface Project {
  id: string;
  name: string;
  url: string;
}

export interface SuggestedBug {
  title: string;
  description: string;
}
