import React, { useState, useEffect } from "react";
import { Event } from "@/api/entities";
import { EventRegistration } from "@/api/entities";
import { User } from "@/api/entities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpcomingEvents from "../components/events/UpcomingEvents";
import RealDealSessions from "../components/events/RealDealSessions";
import EventCalendar from "../components/events/EventCalendar";
import HostEventButton from "../components/events/HostEventButton";
import FeaturedEvent from "../components/events/FeaturedEvent";
import MyEvents from "../components/events/MyEvents";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      const allEvents = await Event.list();
      setEvents(allEvents);
    } catch (error) {
      console.error("Error loading events:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with CTA */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gator Events</h1>
          <p className="text-gray-600 mt-1">
            Connect, learn, and grow with fellow Gators
          </p>
        </div>
        {user?.type === "alumni" && <HostEventButton />}
      </div>

      {/* Featured Upcoming Event */}
      <FeaturedEvent />

      {/* Main Content */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="real_deal">Real Deal Sessions</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          {user?.type === "alumni" && (
            <TabsTrigger value="my_events">My Events</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="upcoming">
          <UpcomingEvents events={events} />
        </TabsContent>

        <TabsContent value="real_deal">
          <RealDealSessions events={events.filter(e => e.type === "real_deal_session")} />
        </TabsContent>

        <TabsContent value="calendar">
          <EventCalendar events={events} />
        </TabsContent>

        {user?.type === "alumni" && (
          <TabsContent value="my_events">
            <MyEvents userId={user.id} events={events} onUpdate={loadData} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}