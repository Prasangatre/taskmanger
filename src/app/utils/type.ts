export type TaskStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type SortingType = "CREATION" | "UPDATE";
export type SortingOrder = "ASC" | "DESC";

export interface Task {
  id: number;
  name: string;
  labels: string[];
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  priority: Priority;
  assignee: Assignee;
  due_date: string;
  description: string;
  estimate_points?: number;
  sprint?: string;
  project?: string;
  reporter?: Assignee;
}

export interface PageDetails {
  page_size: number;
  offset: number;
  sorting_type?: SortingType;
  sorting_order?: SortingOrder;
}

export interface TasksRequest {
  task_status: TaskStatus;
  page_details: PageDetails;
  filters?: {
    priority?: Priority[];
    assignee?: string[];
    labels?: string[];
    search?: string;
  };
}

export interface Assignee {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface Comment {
  id: number;
  content: string;
  name_of_sender: string;
  created_at: string;
  task_id: number;
}
