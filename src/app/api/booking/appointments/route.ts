import {
  apiError,
  assertSameOrigin,
  bookingSchema,
  createAppointment,
  readJson,
} from "@/lib/booking-server";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = await readJson(request, bookingSchema);
    return Response.json(await createAppointment(input), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
