"use client";

import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Column, Task } from "@/types";
import { useTaskStore } from "@/lib/store";
import { BoardColumn } from "./Column";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskDialog } from "@/components/task/TaskDialog";

export function Board() {
    const {
        columns,
        tasks,
        setColumns,
        setTasks,
        addColumn,
    } = useTaskStore();

    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState<string | undefined>(undefined);

    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveColumn = active.data.current?.type === "Column";
        if (isActiveColumn) {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
            const overColumnIndex = columns.findIndex((col) => col.id === overId);
            setColumns(arrayMove(columns, activeColumnIndex, overColumnIndex));
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";

        if (!isActiveTask) return;

        // Dropping a Task over another Task
        if (isActiveTask && isOverTask) {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);

            if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                const newTasks = [...tasks];
                newTasks[activeIndex].columnId = tasks[overIndex].columnId;
                setTasks(arrayMove(newTasks, activeIndex, overIndex - 1));
            } else {
                setTasks(arrayMove(tasks, activeIndex, overIndex));
            }
        }

        const isOverColumn = over.data.current?.type === "Column";

        // Dropping a Task over a Column
        if (isActiveTask && isOverColumn) {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const newTasks = [...tasks];
            newTasks[activeIndex].columnId = overId as string;
            setTasks(arrayMove(newTasks, activeIndex, activeIndex));
        }
    }

    const handleAddTask = (columnId: string) => {
        setSelectedColumnId(columnId);
        setTaskToEdit(null);
        setIsTaskDialogOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setTaskToEdit(task);
        setIsTaskDialogOpen(true);
    };

    return (
        <div className="m-auto flex h-full w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
            >
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <BoardColumn
                                    key={col.id}
                                    column={col}
                                    tasks={tasks.filter((task) => task.columnId === col.id)}
                                    onAddTask={handleAddTask}
                                    onEditTask={handleEditTask}
                                />
                            ))}
                        </SortableContext>
                    </div>
                    <Button
                        onClick={() => addColumn(`Column ${columns.length + 1}`)}
                        className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-secondary/50 hover:bg-secondary border-2 border-dashed border-primary/20 hover:border-primary p-4 flex gap-2 items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Add Column
                    </Button>
                </div>

                {mounted && createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <BoardColumn
                                column={activeColumn}
                                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                                onAddTask={() => { }}
                            />
                        )}
                        {activeTask && <TaskCard task={activeTask} />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
            <TaskDialog
                open={isTaskDialogOpen}
                onOpenChange={setIsTaskDialogOpen}
                initialColumnId={selectedColumnId}
                taskToEdit={taskToEdit}
            />
        </div>
    );
}
