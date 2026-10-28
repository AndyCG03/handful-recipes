import type { Metadata } from "next";
import { AskPage } from "./AskPage";

export const metadata: Metadata = { title: "A few questions", robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  return <AskPage token={(await params).token} />;
}
