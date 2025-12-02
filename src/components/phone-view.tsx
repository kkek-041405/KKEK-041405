
"use client";

import { Phone } from "lucide-react";

export default function PhoneView() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="text-center">
            <Phone className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-semibold text-foreground">Phone View</h1>
            <p className="text-muted-foreground mt-2">This is the placeholder for the Phone view.</p>
        </div>
    </main>
  );
}
