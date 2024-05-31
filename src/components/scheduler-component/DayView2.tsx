import React, { useState, useRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface Todo {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
}

const generateTimeSlots = () => {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    slots.push(`${i.toString().padStart(2, "0")}:00`);
    slots.push(`${i.toString().padStart(2, "0")}:30`);
  }
  return slots;
};

const slotHeight = 30; // Height of each time slot in pixels

const calculateNearestTimeSlot = (offsetY: number, timeSlots: string[]) => {
  const index = Math.round(offsetY / slotHeight);
  return timeSlots[Math.min(Math.max(index, 0), timeSlots.length - 1)];
};

const calculateDurationInPixels = (startTime: string, endTime: string) => {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  const start = startHours * 60 + startMinutes;
  const end = endHours * 60 + endMinutes;
  return ((end - start) / 30) * slotHeight;
};

interface DraggableEventProps {
  todo: Todo;
  onDragEnd: (id: number, newStartTime: string, newEndTime: string) => void;
}

const DraggableEvent: React.FC<DraggableEventProps> = ({ todo, onDragEnd }) => {
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [initialY, setInitialY] = useState(0);
  const eventRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setDragging(true);
    setInitialY(e.clientY);
    e.dataTransfer.setData("text/plain", todo.id.toString());
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDragging(false);
    const dropY = e.clientY;
    const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
    if (dropTarget && dropTarget.getAttribute("data-time")) {
      const newStart = calculateNearestTimeSlot(
        dropY - dropTarget.getBoundingClientRect().top,
        timeSlots
      );
      const newEnd = calculateNearestTimeSlot(
        dropY -
          dropTarget.getBoundingClientRect().top +
          calculateDurationInPixels(todo.startTime, todo.endTime),
        timeSlots
      );
      onDragEnd(todo.id, newStart, newEnd);
    }
  };

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setResizing(true);
    setInitialY(e.clientY);
  };

  const handleResizeEnd = (e: React.MouseEvent<HTMLDivElement>) => {
    setResizing(false);
    const newEnd = calculateNearestTimeSlot(
      e.clientY -
        initialY +
        calculateDurationInPixels(todo.startTime, todo.endTime),
      timeSlots
    );
    onDragEnd(todo.id, todo.startTime, newEnd);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`p-2 border rounded bg-blue-300 ${
        dragging ? "opacity-50" : "opacity-100"
      }`}
      style={{
        height: calculateDurationInPixels(todo.startTime, todo.endTime),
      }}
    >
      {todo.title}
      <div
        className="resize-handle"
        onMouseDown={handleResizeStart}
        onMouseUp={handleResizeEnd}
      />
    </div>
  );
};

const DayView2 = () => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: "Meeting with team", startTime: "09:00", endTime: "10:00" },
    { id: 2, title: "Lunch Break", startTime: "12:00", endTime: "12:30" },
    { id: 3, title: "Project Work", startTime: "14:30", endTime: "16:00" },
  ]);

  const timeSlots = generateTimeSlots();

  const handlePreviousDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(currentDate.getDate() - 1);
    setCurrentDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDay);
  };

  const handleAddEvent = (event: React.FormEvent) => {
    event.preventDefault();
    setSelectedTimeSlot(null);
  };

  const handleDragEnd = (
    id: number,
    newStartTime: string,
    newEndTime: string
  ) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, startTime: newStartTime, endTime: newEndTime }
          : todo
      )
    );
  };

  return (
    <div className="flex flex-col bg-gray-100 mb-[50px]">
      <header className="flex justify-between px-3 items-center h-[50px] bg-white">
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={handlePreviousDay}
        >
          Previous
        </button>
        <span className="text-xl">{currentDate.toDateString()}</span>
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={handleNextDay}
        >
          Next
        </button>
      </header>

      <div className="flex flex-col">
        {timeSlots.map((hour) => (
          <div
            key={hour}
            data-time={hour}
            className="border-b flex flex-row items-center border-gray-300 h-[30px]"
            onClick={() => setSelectedTimeSlot(hour)}
          >
            <div className="border-r text-center text-xs text-gray-500 flex items-start justify-center border-gray-300 h-[30px] w-[50px]">
              {hour}
            </div>
            <div className="h-[30px]" style={{ width: "calc(100% - 50px)" }}>
              {todos
                .filter((todo) => todo.startTime <= hour && todo.endTime > hour)
                .map((todo) => (
                  <DraggableEvent
                    key={todo.id}
                    todo={todo}
                    onDragEnd={handleDragEnd}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTimeSlot && (
        <Drawer isOpen={true} onClose={() => setSelectedTimeSlot(null)}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add Event</DrawerTitle>
              <DrawerDescription>
                Adding event for {selectedTimeSlot}
              </DrawerDescription>
            </DrawerHeader>
            <form onSubmit={handleAddEvent}>
              <input
                type="text"
                placeholder="Event Title"
                className="border p-2 w-full mb-4"
                required
              />
              <DrawerFooter>
                <Button type="submit">Add Event</Button>
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTimeSlot(null)}
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default DayView2;
