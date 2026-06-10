import type { Metadata } from "next";
import NexTechPage from "@/components/wings/NexTechPage";

export const metadata: Metadata = {
  title: "NexTech | AI, Robotics & IoT Engineering",
  description:
    "NexTech is NexGiga's intelligence wing — deploying AI models, industrial robotics, IoT sensor networks, digital twins, and simulation systems that turn data into autonomous real-world action.",
  openGraph: {
    title: "NexTech | AI, Robotics & IoT Engineering",
    description:
      "From machine learning pipelines and edge computing to collaborative robotics and digital twins — NexTech makes the physical world as programmable as software.",
  },
};

export default function NexTech() {
  return <NexTechPage />;
}
