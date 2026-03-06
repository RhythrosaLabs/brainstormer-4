import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Calendar as CalendarIcon } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add days from previous month to fill the first week
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Add days from next month to fill the last week
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddEvent = () => {
    if (!selectedDate) return;

    const newEvent: Event = {
      id: Date.now().toString(),
      title: 'New Event',
      description: '',
      start: selectedDate,
      end: new Date(selectedDate.getTime() + 60 * 60 * 1000), // 1 hour duration
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };

    setEvents([...events, newEvent]);
    setShowEventModal(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1a1a1a] text-white">
      {/* Calendar Header */}
      <div className="p-4 border-b border-[#333] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CalendarIcon size={24} className="text-gray-400" />
          <div>
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="text-sm text-gray-400">
              {selectedDate ? selectedDate.toLocaleDateString() : 'No date selected'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* View Switcher */}
          <div className="flex bg-[#242424] rounded-lg p-1">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded ${
                view === 'month' ? 'bg-[#333] text-white' : 'text-gray-400'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded ${
                view === 'week' ? 'bg-[#333] text-white' : 'text-gray-400'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1 rounded ${
                view === 'day' ? 'bg-[#333] text-white' : 'text-gray-400'
              }`}
            >
              Day
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-[#333] rounded"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 hover:bg-[#333] rounded"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-[#333] rounded"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <button
            onClick={() => {
              if (selectedDate) setShowEventModal(true);
            }}
            disabled={!selectedDate}
            className="px-4 py-2 bg-gradient-to-r from-[#ff1b6b] to-[#45caff] rounded-lg flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            <Plus size={16} />
            Add Event
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-4 overflow-auto">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-sm text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth(currentDate).map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const dayEvents = getEventsForDate(date);

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`min-h-[120px] p-2 rounded cursor-pointer ${
                  isCurrentMonth
                    ? isSelected
                      ? 'bg-[#45caff] bg-opacity-20'
                      : 'bg-[#242424] hover:bg-[#333]'
                    : 'bg-[#1a1a1a] text-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isToday ? 'bg-[#45caff] px-2 py-0.5 rounded' : ''}`}>
                    {date.getDate()}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-xs text-gray-400">{dayEvents.length} events</span>
                  )}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded truncate"
                      style={{ backgroundColor: event.color }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#242424] rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-gray-400" />
              <h3 className="text-lg font-medium">Add Event</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full bg-[#333] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                  placeholder="Event title"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  className="w-full bg-[#333] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                  placeholder="Event description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Time</label>
                  <input
                    type="time"
                    className="w-full bg-[#333] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Time</label>
                  <input
                    type="time"
                    className="w-full bg-[#333] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Color</label>
                <input
                  type="color"
                  className="w-full h-10 bg-[#333] rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 hover:bg-[#333] rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-gradient-to-r from-[#ff1b6b] to-[#45caff] rounded hover:opacity-90"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}