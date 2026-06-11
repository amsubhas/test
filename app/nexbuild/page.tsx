import type { Metadata } from "next";
import NexBuildPage from "@/components/wings/NexBuildPage";

export const metadata: Metadata = {
  title: "NexBuild | Smart Construction & BIM Technology",
  description:
    "NexBuild is NexGiga's smart construction wing — delivering LOD 100-500 BIM, digital twin implementation, clash detection, and the BuildMate platform for end-to-end construction management.",
  alternates: { canonical: "https://nexgiga.sharvasit.in/nexbuild" },
};

export default function NexBuildRoute() {
  return <NexBuildPage />;
}
