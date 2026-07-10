import type { Metadata } from "next";
import AdminForm from "@/components/admin-form";
import { snapshottablePieces } from "@/lib/work";

export const metadata: Metadata = {
  title: "new snapshot",
  robots: { index: false, follow: false },
};

export default function Admin() {
  return <AdminForm pieces={snapshottablePieces()} />;
}
