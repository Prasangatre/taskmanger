import Image from "next/image";
import { INITIAL_COMMENTS, INITIAL_TASKS } from "./utils/mock-data";
import TaskTable from "./table/page";

export default function Home() {
  console.log(INITIAL_TASKS, "IT");
  console.log(INITIAL_COMMENTS, "IC");
  return (
    <div>
      <TaskTable initialTask={INITIAL_TASKS} initialComment={INITIAL_COMMENTS} />
    </div>
  );
}
