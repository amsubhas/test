import type { Metadata } from "next";
import NexBuildRedirect from "./redirect";

export const metadata: Metadata = {
  title: "NexBuild | BuildMate Construction Technology Platform",
  description:
    "NexBuild powers BuildMate — NexGiga's comprehensive BIM and construction technology platform for digital twin workflows, clash detection, and real-time project collaboration.",
  robots: { index: false, follow: false }, // redirect page — no indexing needed
};

export default function NexBuildPage() {
  return <NexBuildRedirect />;
}
