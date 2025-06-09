"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2 } from "lucide-react";

export default function CheckInPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    // TODO: Implement actual check-in logic
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Welcome to YChurch</h1>
          <p className="text-muted-foreground">Quick and easy check-in for today's service</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Service</CardTitle>
              <CardDescription>
                {format(new Date(), "EEEE, MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Main Service</p>
                  <p className="text-sm text-muted-foreground">10:00 AM - 12:00 PM</p>
                </div>
                <Button
                  size="lg"
                  onClick={handleCheckIn}
                  disabled={isCheckedIn}
                  className={isCheckedIn ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {isCheckedIn ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Checked In
                    </>
                  ) : (
                    "Check In"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Calendar</CardTitle>
              <CardDescription>View upcoming services</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Attendance History</CardTitle>
            <CardDescription>Track your participation in services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* TODO: Add attendance history list */}
              <p className="text-muted-foreground text-center py-4">
                Your attendance history will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 