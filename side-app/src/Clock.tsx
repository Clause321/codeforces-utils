import React from "react";
import { useState, useEffect } from "react";
import { Text } from "@fluentui/react";

function getTwoDigits(n: number): string {
  if (n < 10) {
    return `0${n}`;
  } else {
    return `${n}`;
  }
}

function getTimes(n: number): [number, string, string, string] {
  const s = n % 60;
  n = (n - s) / 60;
  const m = n % 60;
  n = (n - m) / 60;
  const h = n % 24;
  n = (n - h) / 24;
  return [n, getTwoDigits(h), getTwoDigits(m), getTwoDigits(s)];
}

export default function Clock(props) {
  const [time, setTime] = useState(null);
  useEffect(() => {
    const id = setInterval(() => setTime(Math.floor(Date.now() / 1000)), 100);
    return () => clearInterval(id);
  });

  let display = "-- : -- : --";
  let subText = "Previous contest";

  if (props.contest) {
    const relative = time - props.contest.startTimeSeconds;
    const isBefore = relative < 0;
    const left =
      props.contest.startTimeSeconds + props.contest.durationSeconds - time;
    const isInProgress = left > 0 && !isBefore;

    if (isInProgress) {
      const t = getTimes(left);
      display = `${t[1]} : ${t[2]} : ${t[3]}`;
      subText = "Let's go!";
    } else if (isBefore) {
      const t = getTimes(-relative);
      display = `${t[1]} : ${t[2]} : ${t[3]}`;
      subText = `${t[0]} days before start`;
    }
  }

  return (
    <div className="clock">
      <Text variant={"medium"} block>
        {subText}
      </Text>
      <Text variant={"mega"} block>
        {display}
      </Text>
    </div>
  );
}
