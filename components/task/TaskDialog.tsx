"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useTaskStore } from "@/lib/store";
import { Task, Priority } from "@/types";
import { toast } from "sonner";

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    taskToEdit?: Task | null;
    initialColumnId?: string;
}

export function TaskDialog({
    open,
    onOpenChange,
    taskToEdit,
    initialColumnId,
}: TaskDialogProps) {
    const { addTask, updateTask, deleteTask } = useTaskStore();
    const [content, setContent] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("Medium");
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        if (taskToEdit) {
            setContent(taskToEdit.content);
            setDescription(taskToEdit.description || "");
            setPriority(taskToEdit.priority);
            setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : undefined);
        } else {
            setContent("");
            setDescription("");
            setPriority("Medium");
            setDueDate(undefined);
        }
    }, [taskToEdit, open]);

    const handleSave = () => {
        if (!content.trim()) return;

        if (taskToEdit) {
            updateTask(taskToEdit.id, {
                content,
                description,
                priority,
                dueDate,
            });
            toast.success("Task updated");
        } else if (initialColumnId) {
            // @ts-ignore
            addTask(initialColumnId, { content, description, priority, dueDate });
            toast.success("Task created");
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{taskToEdit ? "Edit Task" : "Add Task"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Input
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Task content"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Task description"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Priority</Label>
                            <Select
                                value={priority}
                                onValueChange={(value) => setPriority(value as Priority)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Due Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "justify-start text-left font-normal",
                                            !dueDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={dueDate}
                                        onSelect={setDueDate}
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                <DialogFooter className="gap-2">
                    {taskToEdit && (
                        <Button
                            variant="destructive"
                            onClick={() => {
                                deleteTask(taskToEdit.id);
                                toast.success("Task deleted");
                                onOpenChange(false);
                            }}
                        >
                            Delete
                        </Button>
                    )}
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
