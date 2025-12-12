"use client";

import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Task } from "@/types";
import { useTaskStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

interface BoardColumnProps {
    column: Column;
    tasks: Task[];
    onAddTask: (columnId: string) => void;
    onEditTask?: (task: Task) => void;
}

export function BoardColumn({ column, tasks, onAddTask, onEditTask }: BoardColumnProps) {
    const { deleteColumn, updateColumn } = useTaskStore();
    const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(column.title);

    const handleTitleSubmit = () => {
        if (title.trim() !== column.title) {
            updateColumn(column.id, title);
        }
        setIsEditing(false);
    };

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
                className="opacity-30 bg-primary/10 border-2 border-primary rounded-lg w-[350px] h-[500px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="w-[350px] h-[500px] flex flex-col"
        >
            <Card className="h-full flex flex-col bg-secondary/20">
                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-2">
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing"
                        >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>

                        {isEditing ? (
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={handleTitleSubmit}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleTitleSubmit();
                                    if (e.key === "Escape") {
                                        setTitle(column.title);
                                        setIsEditing(false);
                                    }
                                }}
                                autoFocus
                                className="h-8 w-[200px]"
                            />
                        ) : (
                            <CardTitle
                                className="text-base font-semibold cursor-pointer"
                                onDoubleClick={() => setIsEditing(true)}
                            >
                                {column.title}
                            </CardTitle>
                        )}
                        {tasks.length}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteColumn(column.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto">
                    <SortableContext items={tasksIds}>
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} onEditTask={onEditTask} />
                        ))}
                    </SortableContext>
                </CardContent>
                <div className="p-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={() => onAddTask(column.id)}
                    >
                        <Plus className="h-4 w-4" />
                        Add Task
                    </Button>
                </div>
            </Card>
        </div>
    );
}
