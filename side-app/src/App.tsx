import React from "react";
import { useState, useEffect } from "react";
import { Text } from "@fluentui/react";
import {
  Dropdown,
  IDropdownOption,
  DropdownMenuItemType,
} from "@fluentui/react";
import { fetch } from "@tauri-apps/api/http";

type Phase =
  | "BEFORE"
  | "CODING"
  | "PENDING_SYSTEM_TEST"
  | "SYSTEM_TEST"
  | "FINISHED";

type Contest = {
  id: number;
  name: string;
  phase: Phase;
  relativeTimeSeconds: number;
  startTimeSeconds: number;
  type: string;
  frozen: boolean;
  durationSeconds: number;
};

function contest2Option(c: Contest): IDropdownOption {
  return {
    key: c.id,
    text: c.name,
  };
}

function buildContestOptions(contests: Contest[]): IDropdownOption[] {
  const c1 = contests
    .filter((c) => c.phase === "BEFORE" || c.phase === "CODING")
    .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
    .map(contest2Option);
  const c2 = contests
    .filter((c) => c.phase !== "BEFORE" && c.phase !== "CODING")
    .slice(0, 20)
    .sort((a, b) => b.startTimeSeconds - a.startTimeSeconds)
    .map(contest2Option);
  return [
    {
      key: "current_upcoming",
      text: "Current or upcoming contests",
      itemType: DropdownMenuItemType.Header,
    },
    ...c1,
    { key: "divider_1", text: "-", itemType: DropdownMenuItemType.Divider },
    {
      key: "past",
      text: "Past contests",
      itemType: DropdownMenuItemType.Header,
    },
    ...c2,
  ];
}

export default function App() {
  const [errors, setErrors] = useState<string>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState(null);
  useEffect(() => {
    (async () => {
      const res = await fetch<{
        status: string;
        result: Contest[];
      }>("https://codeforces.com/api/contest.list");
      if (res.ok && res.data.status == "OK") {
        setContests(res.data.result);
      } else {
        setErrors("Failed to fetch contests.");
      }
    })();
  }, [setContests, setErrors]);
  return (
    <div>
      <Dropdown
        label="Contest"
        placeholder="Choose a contest"
        options={buildContestOptions(contests)}
        selectedKey={selectedContest || undefined}
        onChange={(_e, item) => setSelectedContest(item.key)}
      />
    </div>
  );
}
