import React from "react";
import { useState, useEffect } from "react";
import {
  Dropdown,
  IDropdownOption,
  DropdownMenuItemType,
  CompoundButton,
} from "@fluentui/react";
import { fetch } from "@tauri-apps/api/http";
import { open } from "@tauri-apps/api/dialog";
import Clock from "./Clock";

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
    data: c,
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

  const [selectedPath, setSelectedPath] = useState(null);
  useEffect(() => {
    (async () => {
      const res = await fetch<{
        status: string;
        result: Contest[];
      }>("https://codeforces.com/api/contest.list?gym=false");
      if (res.ok && res.data.status == "OK") {
        setContests(res.data.result);
      } else {
        setErrors("Failed to fetch contests.");
      }
    })();
  }, [setContests, setErrors]);

  const chooseCodePath = async () => {
    const path = await open({ directory: true });
    setSelectedPath(path);
  };

  return (
    <div className="container">
      <Dropdown
        label="Contest"
        placeholder="Choose a contest"
        options={buildContestOptions(contests)}
        selectedKey={selectedContest?.key || undefined}
        onChange={(_e, item) => setSelectedContest(item.data)}
        className="contest_option"
      />
      <CompoundButton
        text="Choose code path"
        onClick={chooseCodePath}
        allowDisabledFocus
        secondaryText={selectedPath}
        className="path"
      />

      <Clock contest={selectedContest} />
    </div>
  );
}
