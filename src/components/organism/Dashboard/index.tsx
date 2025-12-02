import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../ui/card";

export function DashboardCard() {
  return (
    <Card className="aspect-auto">
      <CardHeader>
        <CardTitle>
          <div className="flex w-full place-content-between items-center">
            <p className=" text-md">Total Activa Tags</p>
            <div className="flex gap-1 items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <p>Online</p>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-bold text-2xl">
          48<span className="font-light text-sm">/50</span> Devices
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-end gap-2">
          <p className="text-sm font-light">Last updated</p>
          <p className="text-sm font-light">5 minute</p>
        </div>
      </CardFooter>
    </Card>
  );
}
