import {
  apiError,
  assertSameOrigin,
  availabilitySchema,
  getAvailableSlots,
  readJson,
} from "@/lib/booking-server";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = await readJson(request, availabilitySchema);
    const slots = await getAvailableSlots(input.date, input.serviceIds, input.staffId);
    return Response.json(slots, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return apiError(error);
  }
}
