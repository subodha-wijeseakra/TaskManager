"use client";

import { useState } from "react";
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    startOfMonth,
    startOfWeek,
    subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { TaskDialog } from "@/components/task/TaskDialog";
import { Task } from "@/types";

export function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { tasks } = useTaskStore();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsDialogOpen(true);
    };

    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const startDate = startOfWeek(firstDayOfMonth);
    const endDate = endOfWeek(lastDayOfMonth);

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    return (
        <div className="flex flex-col h-full w-full p-4 gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                    {format(currentDate, "MMMM yyyy")}
                </h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={goToToday}>
                        Today
                    </Button>
                    <Button variant="outline" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden border border-muted">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div
                        key={day}
                        className="bg-background p-2 text-center text-sm font-medium text-muted-foreground"
                    >
                        {day}
                    </div>
                ))}
                {days.map((day, dayIdx) => {
                    const dayTasks = tasks.filter(
                        (task) => task.dueDate && isSameDay(new Date(task.dueDate), day)
                    );

                    return (
                        <div
                            key={day.toString()}
                            className={`min-h-[120px] bg-background p-2 transition-colors hover:bg-muted/50 ${!isSameMonth(day, currentDate) ? "text-muted-foreground bg-muted/20" : ""
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span
                                    className={`text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full ${isSameDay(day, new Date())
                                        ? "bg-primary text-primary-foreground"
                                        : ""
                                        }`}
                                >
                                    {format(day, "d")}
                                </span>
                            </div>
                            <div className="mt-2 flex flex-col gap-1">
                                {dayTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="text-xs p-1 rounded bg-primary/10 border border-primary/20 truncate cursor-pointer hover:bg-primary/20"
                                        title={task.content}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTaskClick(task);
                                        }}
                                    >
                                        {task.content}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <TaskDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                taskToEdit={selectedTask}
                initialColumnId="todo" // Default fallback, though taskToEdit takes precedence
            />
        </div>
    );
}
