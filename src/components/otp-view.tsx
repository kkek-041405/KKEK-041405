
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, ShieldAlert } from "lucide-react";

export default function OtpView() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-yellow-500/10 p-4 rounded-full w-fit mb-4">
            <KeyRound className="h-10 w-10 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">One-Time Passwords</CardTitle>
          <CardDescription className="text-md">
            This feature is currently under construction.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
            <ShieldAlert className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              The OTP view will be implemented soon. It will securely fetch and display your one-time passwords from Firebase Realtime Database.
            </p>
        </CardContent>
      </Card>
    </main>
  );
}
