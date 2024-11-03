"use client";
import React, { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Task, TaskStatus } from "../utils/mock-data";
import { Comment } from "../utils/type";
import { DetailModal } from "../components/detail-modal";
import { Search } from "lucide-react";

const columnHelper = createColumnHelper<Task>();

const TaskTable = ({
  initialComment,
  initialTask,
}: {
  initialComment: Comment[];
  initialTask: Task[];
}) => {
  const [allTasks, setAllTasks] = useState<Task[]>(initialTask);
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState<TaskStatus>("OPEN");
  const [comments, setComments] = useState<Comment[]>(initialComment);
  const [hasMore, setHasMore] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const ITEMS_PER_PAGE = 10;

  const statusCounts = {
    OPEN: allTasks?.filter((task) => task.status === "OPEN").length,
    IN_PROGRESS: allTasks?.filter((task) => task.status === "IN_PROGRESS")
      .length,
    CLOSED: allTasks?.filter((task) => task.status === "CLOSED").length,
  };

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
      enableColumnFilter: true,
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => info.getValue(),
      enableColumnFilter: true,
    }),
    columnHelper.accessor("priority", {
      header: "Priority",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded text-sm ${
            info.getValue() === "Urgent"
              ? "bg-red-100 text-red-800"
              : info.getValue() === "High"
              ? "bg-orange-100 text-orange-800"
              : info.getValue() === "Medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {info.getValue()}
        </span>
      ),
      enableColumnFilter: true,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span className="px-2 py-1 rounded text-sm">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("created_at", {
      header: "Created",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor("labels", {
      header: "Labels",
      cell: (info) => (
        <div className="flex gap-1">
          {info.getValue().map((label, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
            >
              {label}
            </span>
          ))}
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: displayedTasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
  });

  useEffect(() => {
    if (displayedTasks.length > 0) {
      setHoveredIndex(0);
    }
  }, [displayedTasks]);

  useEffect(() => {
    setPage(0);
    setDisplayedTasks([]);
    setHasMore(true);
    loadMoreTasks(0);
  }, [activeTab, allTasks]);

  const loadMoreTasks = async (currentPage: number) => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const filteredTasks = allTasks?.filter(
        (task) => task.status === activeTab
      );
      const startIndex = currentPage * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newTasks = filteredTasks.slice(startIndex, endIndex);

      if (newTasks.length === 0 || newTasks.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }
      setTimeout(() => {
        setDisplayedTasks((prev) =>
          currentPage === 0 ? newTasks : [...prev, ...newTasks]
        );
        setPage(currentPage);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
    setAllTasks((prevTasks) => {
      return prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updated_at: new Date().toISOString() }
          : task
      );
    });
  };
  const navigateModalTask = (direction: "next" | "previous") => {
    if (!selectedTask) return;
    console.log(navigateModalTask);
    const currentIndex = displayedTasks.findIndex(
      (task) => task.id === selectedTask.id
    );
    console.log(currentIndex, "CI");
    let newIndex;

    if (direction === "next") {
      newIndex =
        currentIndex < displayedTasks.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex =
        currentIndex > 0 ? currentIndex - 1 : displayedTasks.length - 1;
    }

    setSelectedTask(displayedTasks[newIndex]);
    setHoveredIndex(newIndex);
  };
  const handleKeyDown = (e: KeyboardEvent) => {
    const maxIndex = displayedTasks.length - 1;

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        if (!selectedTask) {
          setHoveredIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!selectedTask) {
          setHoveredIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
        }
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (selectedTask) {
          navigateModalTask("previous");
        }
        break;
      case "ArrowRight":
        e.preventDefault();
        if (selectedTask) {
          navigateModalTask("next");
        }
        break;
      case "Enter":
        e.preventDefault();
        if (!selectedTask && displayedTasks[hoveredIndex]) {
          setSelectedTask(displayedTasks[hoveredIndex]);
        }
        break;
      case "Escape":
        if (selectedTask) {
          setSelectedTask(null);
        }
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [displayedTasks, hoveredIndex, selectedTask]);

  const observerTarget = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMoreTasks(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore, page]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        {(["OPEN", "IN_PROGRESS", "CLOSED"] as TaskStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              activeTab === status
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            <span>{status.replace("_", " ")}</span>
            <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-sm">
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                onClick={() => setSelectedTask(row.original)}
                onMouseEnter={() => setHoveredIndex(index)}
                className={`cursor-pointer ${
                  index === hoveredIndex ? "bg-orange-50" : "hover:bg-gray-50"
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div ref={observerTarget} className="h-4" />
        {loading && (
          <div className="text-center py-4">Loading more tasks...</div>
        )}
        {!hasMore && displayedTasks.length > 0 && (
          <div className="text-center py-4 text-gray-500">
            No more tasks to load
          </div>
        )}
      </div>

      {selectedTask && (
        <DetailModal
          onStatusChange={handleStatusChange}
          setSelectedTask={setSelectedTask}
          comments={comments}
          setComments={setComments}
          selectedTask={selectedTask}
        />
      )}
    </div>
  );
};

export default TaskTable;
