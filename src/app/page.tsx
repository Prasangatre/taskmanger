import Image from "next/image";
import { INITIAL_COMMENTS, INITIAL_TASKS } from "./utils/mock-data";
import TaskTable from "./table/page";

export default function Home() {

  return (
    <div>
      <TaskTable initialTask={INITIAL_TASKS} initialComment={INITIAL_COMMENTS} />
    </div>
  );
}
