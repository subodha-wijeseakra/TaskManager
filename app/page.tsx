import { Board } from "@/components/board/Board";
import { CalendarView } from "@/components/calendar/CalendarView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <ModeToggle />
      </div>

      <Tabs defaultValue="board" className="w-full h-full flex flex-col flex-1">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-4">
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="board" className="flex-1 h-full">
          <Board />
        </TabsContent>
        <TabsContent value="calendar" className="flex-1 h-full">
          <CalendarView />
        </TabsContent>
      </Tabs>
    </main>
  );
}
