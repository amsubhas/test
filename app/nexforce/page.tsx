import type { Metadata } from "next";
import NexForcePage from "@/components/wings/NexForcePage";

export const metadata: Metadata = {
  title: "NexForce | Workforce Intelligence at Scale",
  description:
    "NexForce delivers human intelligence at scale — workforce planning, BOT models, managed operations, compliance teams, industrial staffing, and project resource management.",
};

export default function NexForce() {
  return <NexForcePage />;
}
