"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { GripVertical } from "lucide-react";

interface TaskCardProps {
    task: Task;
    onEditTask?: (task: Task) => void;
}

export function TaskCard({ task, onEditTask }: TaskCardProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
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
                className="opacity-30 bg-primary/10 border-2 border-primary rounded-lg h-[100px]"
            />
        );
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card
                onClick={() => onEditTask?.(task)}
                className="cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
            >
                <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between space-y-0">
                    <Badge variant={task.priority === "High" ? "destructive" : "secondary"}>
                        {task.priority}
                    </Badge>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-3">
                    <p className="text-sm font-medium leading-none">{task.content}</p>
                    {task.dueDate && (
                        <p className="text-xs text-muted-foreground mt-2">
                            Due: {format(new Date(task.dueDate), "MMM d")}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
