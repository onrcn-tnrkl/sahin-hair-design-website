import { z } from "zod";
import {
  apiError,
  assertSameOrigin,
  getEligibleStaff,
  readJson,
  serviceIdsSchema,
} from "@/lib/booking-server";

const schema = z.object({ serviceIds: serviceIdsSchema });

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { serviceIds } = await readJson(request, schema);
    const staff = await getEligibleStaff(serviceIds);
    return Response.json(
      staff.map(({ id, full_name }) => ({ id, full_name })),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return apiError(error);
  }
}
