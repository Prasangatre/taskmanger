export type TaskStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
export type Priority = "Low" | "Medium" | "High" | "Urgent";

export interface Task {
  id: number;
  name: string;
  labels: string[];
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  priority: Priority;
}

export interface Comment {
  id: number;
  content: string;
  name_of_sender: string;
  created_at: string;
  task_id: number;
}

export const generateDummyTasks = (count: number): Task[] => {
  const taskNames = [
    "File upload for chats",
    "User authentication flow",
    "API rate limiting",
    "Database optimization",
    "Mobile responsive design",
    "Payment integration",
    "Search functionality",
    "Email notifications",
    "Analytics dashboard",
    "Performance monitoring",
  ];

  const labels = [
    "Update pending",
    "In review",
    "Blocked",
    "Ready for QA",
    "Critical",
    "Enhancement",
    "Bug fix",
    "Feature request",
  ];

  const statuses: TaskStatus[] = ["OPEN", "IN_PROGRESS", "CLOSED"];
  const priorities: Priority[] = ["Low", "Medium", "High", "Urgent"];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: taskNames[Math.floor(Math.random() * taskNames.length)],
    labels: [labels[Math.floor(Math.random() * labels.length)]],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    created_at: new Date(
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
    ).toISOString(),
    updated_at: new Date(
      Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
    ).toISOString(),
    priority: priorities[Math.floor(Math.random() * priorities.length)],
  }));
};

export const generateDummyComments = (
  taskId: number,
  count: number
): Comment[] => {
  const senderNames = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "Alex Brown",
  ];

  const commentContents = [
    "Let's prioritize this for next sprint",
    "I've started working on this",
    "Needs more clarification",
    "This looks good to me",
    "Can we discuss this in the next meeting?",
    "I've added some test cases",
    "Documentation has been updated",
    "Ready for review",
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    content:
      commentContents[Math.floor(Math.random() * commentContents.length)],
    name_of_sender: senderNames[Math.floor(Math.random() * senderNames.length)],
    created_at: new Date(
      Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
    ).toISOString(),
    task_id: taskId,
  }));
};

// Initial dummy data
export const INITIAL_TASKS = generateDummyTasks(100);
export const INITIAL_COMMENTS = INITIAL_TASKS.reduce((acc, task) => {
  return [...acc, ...generateDummyComments(task.id, 2)];
}, [] as Comment[]);
