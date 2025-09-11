"use client";

import { useRouter } from "next/navigation";

export default function AssetDashboardPage() {
  const router = useRouter();

  router.push("/dashboard");

  return <div className="space-y-6"></div>;
}
