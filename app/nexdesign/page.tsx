import type { Metadata } from "next";
import NexDesignPage from "@/components/wings/NexDesignPage";

export const metadata: Metadata = {
  title: "NexDesign | Creative Intelligence Studio",
  description:
    "NexDesign engineers transcendent experiences at the frontier of design and technology — brand identity, UI/UX, 3D visualisation, motion design, and immersive AR/VR experiences.",
  openGraph: {
    title: "NexDesign | Creative Intelligence Studio",
    description:
      "Where imagination meets execution. Brand systems, product design, 3D rendering, and spatial computing experiences that make ideas real.",
  },
};

export default function NexDesign() {
  return <NexDesignPage />;
}
