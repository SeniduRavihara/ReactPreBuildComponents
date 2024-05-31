// import useData from "@/hooks/useData";
import { useEffect, useState } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const generateTimeSlots = () => {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    slots.push(`${i.toString().padStart(2, "0")}:00`);
    slots.push(`${i.toString().padStart(2, "0")}:15`);
    slots.push(`${i.toString().padStart(2, "0")}:30`);
    slots.push(`${i.toString().padStart(2, "0")}:45`);
  }
  return slots;
};

const DayView = () => {
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [slectedTimeSlot, setSlectedTimeSlot] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [title, setTitle] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [todos, setTodos] = useState([
    // Sample todos for demonstration
    { id: 1, title: "Meeting with team", time: "09:00" },
    { id: 2, title: "Lunch Break", time: "12:00" },
    { id: 3, title: "Project Work", time: "14:30" },
  ]);

  console.log(todos);

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      if (touchEndX < touchStartX - 50) {
        handleNextDay();
      }
      if (touchEndX > touchStartX + 50) {
        handlePreviousDay();
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const handleAddEventClick = () => {
    // alert("Add event clicked");
  };

  const handleAddEvennt = (title, startTime, endTime) => {
    setTodos([{ title, startTime, endTime }]);
  };

  const handleClickSlot = (hour: string) => {
    setSlectedTimeSlot(hour);
  };

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

  const getTodoForTimeSlot = (time: string) => {
    return todos.find((todo) => todo.time === time);
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

      <div></div>

      <div className="flex flex-col">
        {generateTimeSlots().map((slot) => {
          const todo = getTodoForTimeSlot(slot);
          return (
            <div key={slot}>
              {slot.split(":")[1] == "00" && (
                <div className="border-b border-gray-300 h-[44px] flex flex-row items-center">
                  <div
                    className={`border-r text-center text-xs text-gray-500 flex items-start justify-center border-gray-300 h-[44px] w-[50px]`}
                  >
                    {slot}
                  </div>
                  <div
                    className="h-[44px]"
                    style={{ width: "calc(100% - 50px)" }}
                    onClick={() => handleClickSlot(slot)}
                  >
                    {slectedTimeSlot === slot && (
                      <Drawer
                        open={showAddDrawer}
                        onOpenChange={setShowAddDrawer}
                      >
                        <DrawerTrigger
                          onClick={() => handleAddEventClick()}
                          className="bg-sky-400 text-white px-4 h-full w-full rounded"
                        >
                          Add Event
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                            <DrawerDescription>
                              This action cannot be undone. This action cannot
                              be undone. This action cannot be undone. This
                              action cannot be undone. This action cannot be
                              undone. This action cannot be undone.
                            </DrawerDescription>

                            <Input
                              type="text"
                              placeholder="Add a title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                            />
                            <input
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                            />
                            <input
                              type="time"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                            />
                          </DrawerHeader>
                          <div className="h-[350px]"></div>

                          <DrawerFooter>
                            <Button
                              onClick={() =>
                                handleAddEvennt(title, startTime, endTime)
                              }
                            >
                              Submit
                            </Button>
                            <DrawerClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* <div className="day-view">
        {timeSlots.map((slot) => {
          const todo = getTodoForTimeSlot(slot);
          return (
            <div key={slot} className="time-slot">
              <div className="time-label">{slot}</div>
              <div className="todo-item">
                {todo ? <div className="todo">{todo.title}</div> : null}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="absolute top-[50px] pointer-events-none ml-[50px] h-[690px]"
        style={{ width: "calc(100% - 50px)" }}
      ></div> */}
    </div>
  );
};
export default DayView;
