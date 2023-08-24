import { PlusCircle } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Column as Col, Id, Task } from "./types";
import Column from "./Column";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Col[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Col | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 300
    }
  }))

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const deleteColumn = (id: Id) => {
    console.log("new")
    const filterColumn = columns.filter((col) => col.id !== id);
    setColumns(filterColumn);
  };

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }
  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }
  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }



  const onDragStart = (e : DragStartEvent) => {
    console.log("DRAG START", e)
    if(e.active.data.current?.type === "Column"){
      setActiveColumn(e.active.data.current.column)
      return;
    }
}


const onDragEnd = (e : DragEndEvent) => {

      const {active, over} = e

      if(!over) return

      const activeColumnId = active.id
      const overColumnId = over.id

      if(activeColumnId == overColumnId) return

      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex((col) => col.id === activeColumnId);
        const overColumnIndex = columns.findIndex((col) => col.id === overColumnId);

        return arrayMove(columns, activeColumnIndex, overColumnIndex)

      })

}










  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="mx-auto flex gap-4">
          <div className="flex md:flex-row flex-col space-y-4 md:space-y-0 md:space-x-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <Column key={col.id} column={col} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} deleteTask={deleteTask}  updateTask={updateTask} tasks={
                  tasks.filter(task => task.columnId === col.id)
                }/>
              ))}
            </SortableContext>
          </div>

          <button
            onClick={() => {
              createNewColumn();
            }}
            className="flex flex-row h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4
            ring-rose-500 hover:ring-2 gap-2 items-center justify-center "
          >
            <PlusCircle />
            <span> Add Column</span>
          </button>
        </div>
        {createPortal (
            <DragOverlay>
          {activeColumn && (
          <Column column={activeColumn} deleteColumn={deleteColumn}  updateColumn={updateColumn} createTask={createTask}/>
          )}
        </DragOverlay>, document.body
        )
        }
      
      </DndContext>
    </div>
  );
};

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
