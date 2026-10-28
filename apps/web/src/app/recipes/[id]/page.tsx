import type { Metadata } from "next";
import { OwnerRecipePage } from "./OwnerRecipePage";

export const metadata: Metadata = { title: "Your recipe", robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OwnerRecipePage id={id} />;
}
