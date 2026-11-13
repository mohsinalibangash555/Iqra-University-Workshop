import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import CommandSheet from "@/components/CommandSheet";

export const metadata: Metadata = {
  title: "Git commands",
  description: "Git command sheet for the Iqra workshop wall.",
};

export default function GitPage() {
  return (
    <>
      <PageHeader
        kicker="Reference"
        title="Git commands"
        lede="Run these from the root of your fork. Angle brackets are placeholders. Copy a command, swap in your username, then run it."
      />
      <CommandSheet />
    </>
  );
}
