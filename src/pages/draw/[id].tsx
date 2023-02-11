import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  HandRaisedIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { Size, Event } from "../../components/Draw/types/types";
import { useRouter } from "next/router";

const Drawer = dynamic(() => import("../../components/Draw/Drawer"), {
  ssr: false,
});
type Props = {
  event: Event;
};

export default function Draw({}: Props) {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setsize] = useState<Size>({
    width: 0,
    height: 0,
  });

  const [event, setevent] = useState<Event>("DRAW");

  const [loading, setloading] = useState(true);
  const [valid, setvalid] = useState(false);

  function handleLoading(value: boolean) {
    setloading(value);
  }

  function handleValid(value: boolean) {
    setvalid(value);
  }

  useEffect(() => {
    if (containerRef.current) {
      setsize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      className={clsx(
        "relative mx-auto h-screen max-w-screen-2xl overflow-hidden border-2",
        event === "GRAB" && "cursor-grab",
        event === "DRAW" && "cursor-crosshair",
        event === "ERASE" && "cursor-pointer"
      )}
      ref={containerRef}
    >
      {loading && (
        <>
          <div className="flex h-full w-full items-center justify-center">
            <h1 className="text-center text-2xl font-semibold text-blue-500">
              Loading Drawer ....
            </h1>
          </div>
        </>
      )}

      {!loading && !valid && (
        <>
          <div className="flex h-full w-full items-center justify-center">
            <h1 className="text-center text-2xl font-semibold text-blue-500">
              Ooooops, room is full
            </h1>
            <p className="text-center text-xl text-blue-500">
              Please wait for a while and refresh
            </p>
          </div>
        </>
      )}

      {!loading && valid && (
        <>
          <button
            className="absolute top-10 left-10 z-20 rounded border-2 p-2 transition-all hover:border-black"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={() => router.push("/")}
          >
            <ChevronLeftIcon className="h-5 w-5 outline-current" />
          </button>
          <div className="absolute top-10 left-1/2 z-20 flex w-fit -translate-x-1/2 gap-5 rounded-md border-2 bg-white px-5 py-1 shadow">
            <button
              onClick={() => setevent("GRAB")}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
              className={clsx(
                "cursor-pointer rounded-md p-1 transition-colors hover:bg-gray-200",
                event === "GRAB" && "bg-gray-200"
              )}
            >
              <HandRaisedIcon className="h-5 w-5 text-black" />
            </button>
            <button
              onClick={() => setevent("DRAW")}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
              className={clsx(
                "cursor-pointer rounded-md p-1 transition-colors hover:bg-gray-200",
                event === "DRAW" && "bg-gray-200"
              )}
            >
              <PencilIcon className="h-5 w-5 text-black" />
            </button>
            <button
              onClick={() => setevent("ERASE")}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
              className={clsx(
                "cursor-pointer rounded-md p-1 transition-colors hover:bg-gray-200",
                event === "ERASE" && "bg-gray-200"
              )}
            >
              <TrashIcon className="h-5 w-5 text-black" />
            </button>
          </div>
        </>
      )}
      <Drawer
        event={event}
        size={size}
        handleLoading={handleLoading}
        handleValid={handleValid}
        loading={loading}
        valid={valid}
      />
    </div>
  );
}
