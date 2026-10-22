import { proxyDashboardRequest } from "@/lib/backend/dashboard-proxy";

export const dynamic = "force-dynamic";

export async function POST() {
  return proxyDashboardRequest("/api/installations/refresh", {
    method: "POST",
    body: {},
  });
}
