import React, { useState } from "react";
import { Column, Id, Task } from "./types";
import { PlusCircleIcon, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[]
}

const Column = (props: Props) => {

  const { column, deleteColumn, updateColumn, createTask,deleteTask,updateTask, tasks } = props;
  const [editMode, setEditMode] = useState(false)

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        bg-columnBackgroundColor
        opacity-40
        border-2
        border-pink-500
        w-[350px]
        h-[500px]
        max-h-[500px]
        rounded-md
        flex
        flex-col
        "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundCOlor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="flex item-center justify-between bg-mainBackgroundColor h-[60px] text-md cursor-grab rounded-md rounded-b-none p-3 font-bold border-4 border-columnBackgroundColor"
      >
        <div className="flex gap-2">
          <div className="flex justify-center bg-columnBackgroundColor px-2 py-1 border-b border-white  text-sm rounded-full">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="
        stroke-gray-500
        hover:stroke-white
        hover:bg-columnBackgroundColor
        rounded
        px-1
        py-2
        "
        >
          <Trash2 />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
          {
            tasks.map(task => (
           
                 <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask} />
            
            )
             
            )
          }
        </div>

      <button
      onClick={()=>{
        createTask(column.id)
      }}
      className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4">
  <PlusCircleIcon /> Add Task
      </button>

  
    </div>
  );
};

export default Column;
