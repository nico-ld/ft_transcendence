'use client';

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export function GrafanaModal({ userId }: { userId: number }) {
  const [open, setOpen] = useState(false);

  // Replace with your Grafana dashboard UID
  const DASHBOARD_UID = "user-metrics";

  return (
    <>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => setOpen(true)}
      >
        Show Metrics in Grafana
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[90vw] max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Live User Metrics</DialogTitle>
          </DialogHeader>
          <iframe
            src={`http://${window.location.hostname}:3000/d/${DASHBOARD_UID}?var-user_id=${userId}&kiosk`}
            className="w-full h-[calc(80vh-100px)] border-0"
            allowFullScreen
          />
        </DialogContent>
      </Dialog>
    </>
  );
}