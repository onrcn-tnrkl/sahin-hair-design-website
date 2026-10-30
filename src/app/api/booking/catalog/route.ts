import { apiError, getCatalog } from "@/lib/booking-server";

export async function GET() {
  try {
    return Response.json(await getCatalog(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}
