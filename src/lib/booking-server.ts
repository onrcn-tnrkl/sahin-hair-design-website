import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { google } from "googleapis";
import { z } from "zod";

type Staff = {
  id: string;
  full_name: string;
  google_calendar_id: string | null;
};

type Service = {
  id: string;
  category_id: string;
  name: string;
  base_price: number | string;
};

export class BookingError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
    this.name = "BookingError";
  }
}

let supabase: SupabaseClient | undefined;

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new BookingError("Randevu sistemi yapılandırılmamış.", 503);
  }
  supabase ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return supabase;
}

export function assertSameOrigin(request: Request) {
  const configuredOrigin = process.env.SITE_URL;
  const requestOrigin = request.headers.get("origin");
  if (!configuredOrigin || !requestOrigin) {
    throw new BookingError("İstek kaynağı doğrulanamadı.", 403);
  }

  try {
    if (new URL(configuredOrigin).origin !== requestOrigin) {
      throw new BookingError("Bu kaynaktan işlem yapılamaz.", 403);
    }
  } catch (error) {
    if (error instanceof BookingError) throw error;
    throw new BookingError("SITE_URL yapılandırması geçersiz.", 503);
  }
}

export function apiError(error: unknown) {
  if (error instanceof BookingError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error("Randevu API hatası:", error);
  return Response.json(
    { error: "İşlem tamamlanamadı. Lütfen daha sonra tekrar deneyin." },
    { status: 500 },
  );
}

export const serviceIdsSchema = z
  .array(z.string().trim().min(1).max(100))
  .min(1)
  .max(10)
  .refine((ids) => new Set(ids).size === ids.length, "Hizmetler tekrar edemez.");

export const availabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceIds: serviceIdsSchema,
  staffId: z.string().trim().min(1).max(100).nullable(),
});

export const bookingSchema = availabilitySchema.extend({
  time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(1).max(40),
});

export async function readJson<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<T> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BookingError("İstek gövdesi geçerli JSON olmalıdır.");
  }
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new BookingError("Randevu bilgilerini kontrol edip tekrar deneyin.");
  }
  return result.data;
}

function getIstanbulDate() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function shiftDate(date: string, days: number) {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function validateAppointmentDate(date: string) {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new BookingError("Geçerli bir tarih seçin.");
  }
  if (date < getIstanbulDate() || date > shiftDate(getIstanbulDate(), 7)) {
    throw new BookingError("Randevu tarihi bugünden sonraki 7 gün içinde olmalıdır.");
  }
  if (parsed.getUTCDay() === 0) {
    throw new BookingError("Pazar günleri randevu alınamamaktadır.");
  }
}

export async function getCatalog() {
  const client = getSupabase();
  const [categoryResult, serviceResult] = await Promise.all([
    client.from("service_categories").select("id,name,sort_order").order("sort_order"),
    client.from("services").select("id,category_id,name,base_price"),
  ]);
  if (categoryResult.error) throw categoryResult.error;
  if (serviceResult.error) throw serviceResult.error;

  const services = (serviceResult.data ?? []) as Service[];
  return (categoryResult.data ?? []).map((category) => ({
    id: category.id,
    name: category.name,
    services: services
      .filter((service) => service.category_id === category.id)
      .map((service) => ({
        ...service,
        base_price: Number(service.base_price),
      })),
  }));
}

export async function getActiveStaff() {
  const { data, error } = await getSupabase()
    .from("staff")
    .select("id,full_name,is_owner")
    .eq("is_active", true)
    .order("is_owner", { ascending: false })
    .order("full_name");
  if (error) throw error;
  return data ?? [];
}

export async function getEligibleStaff(serviceIds: string[], staffId?: string | null) {
  const client = getSupabase();
  const { data: relations, error: relationError } = await client
    .from("staff_services")
    .select("staff_id")
    .in("service_id", serviceIds);
  if (relationError) throw relationError;

  const serviceCounts = new Map<string, number>();
  for (const relation of relations ?? []) {
    serviceCounts.set(
      relation.staff_id,
      (serviceCounts.get(relation.staff_id) ?? 0) + 1,
    );
  }
  const eligibleIds = [...serviceCounts]
    .filter(([, count]) => count === serviceIds.length)
    .map(([id]) => id);
  if (eligibleIds.length === 0) return [] as Staff[];

  let query = client
    .from("staff")
    .select("id,full_name,google_calendar_id")
    .in("id", eligibleIds)
    .eq("is_active", true);
  if (staffId) query = query.eq("id", staffId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Staff[];
}

export async function getDbSlots(
  date: string,
  serviceIds: string[],
  staffId: string | null,
): Promise<string[]> {
  const { data, error } = await getSupabase().rpc("get_available_slots_v4", {
    p_date: date,
    p_service_ids: serviceIds,
    p_staff_id: staffId,
  });
  if (error) throw error;
  return (data ?? []).map((item: { available_time: string }) =>
    item.available_time.slice(0, 5),
  );
}

async function getCalendarBusySlots(calendarId: string, date: string) {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) {
    throw new BookingError("Google Takvim bağlantısı yapılandırılmamış.", 503);
  }

  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  const calendar = google.calendar({ version: "v3", auth });
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: `${date}T00:00:00+03:00`,
      timeMax: `${shiftDate(date, 1)}T00:00:00+03:00`,
      timeZone: "Europe/Istanbul",
      items: [{ id: calendarId }],
    },
  });
  return response.data.calendars?.[calendarId]?.busy ?? [];
}

function slotOverlapsBusyTime(date: string, time: string, busy: Array<{ start?: string | null; end?: string | null }>) {
  const slotStart = new Date(`${date}T${time}:00+03:00`).getTime();
  const slotEnd = slotStart + 60 * 60 * 1000;
  return busy.some(({ start, end }) => {
    if (!start || !end) return false;
    return slotStart < new Date(end).getTime() && slotEnd > new Date(start).getTime();
  });
}

export async function getAvailableSlots(
  date: string,
  serviceIds: string[],
  staffId: string | null,
): Promise<string[]> {
  validateAppointmentDate(date);
  const [dbSlots, staff] = await Promise.all([
    getDbSlots(date, serviceIds, staffId),
    getEligibleStaff(serviceIds, staffId),
  ]);
  if (staff.length === 0 || dbSlots.length === 0) return [];

  const freeByStaff = await Promise.all(
    staff.map(async (member) => ({
      member,
      busy: member.google_calendar_id
        ? await getCalendarBusySlots(member.google_calendar_id, date)
        : [],
    })),
  );
  return dbSlots.filter((time) =>
    freeByStaff.some(({ busy }) => !slotOverlapsBusyTime(date, time, busy)),
  );
}

async function createGoogleEvent(
  calendarId: string,
  details: { name: string; phone: string; services: string; date: string; time: string },
) {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) {
    throw new Error("Google Takvim bağlantısı yapılandırılmamış.");
  }

  const start = new Date(`${details.date}T${details.time}:00+03:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const toLocalDateTime = (value: Date) => {
    const parts = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Europe/Istanbul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).format(value);
    return parts.replace(" ", "T");
  };
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  await google.calendar({ version: "v3", auth }).events.insert({
    calendarId,
    requestBody: {
      summary: `✂️ ${details.name} - Randevu`,
      description: `Hizmetler: ${details.services}\nTelefon: ${details.phone}`,
      start: { dateTime: toLocalDateTime(start), timeZone: "Europe/Istanbul" },
      end: { dateTime: toLocalDateTime(end), timeZone: "Europe/Istanbul" },
    },
  });
}

export async function createAppointment(
  input: z.infer<typeof bookingSchema>,
) {
  validateAppointmentDate(input.date);
  const client = getSupabase();
  const { data: services, error: serviceError } = await client
    .from("services")
    .select("id,name,base_price")
    .in("id", input.serviceIds);
  if (serviceError) throw serviceError;
  if (!services || services.length !== input.serviceIds.length) {
    throw new BookingError("Seçilen hizmetlerden biri artık kullanılamıyor.");
  }

  const staff = await getEligibleStaff(input.serviceIds, input.staffId);
  if (staff.length === 0) {
    throw new BookingError("Seçilen hizmetler için uygun personel bulunamadı.");
  }

  let targetStaff: Staff | undefined;
  for (const member of staff) {
    const [available, busy] = await Promise.all([
      getDbSlots(input.date, input.serviceIds, member.id),
      member.google_calendar_id
        ? getCalendarBusySlots(member.google_calendar_id, input.date)
        : Promise.resolve([]),
    ]);
    if (
      available.includes(input.time) &&
      !slotOverlapsBusyTime(input.date, input.time, busy)
    ) {
      targetStaff = member;
      break;
    }
  }
  if (!targetStaff) {
    throw new BookingError("Seçtiğiniz saat az önce doldu. Lütfen yeniden saat seçin.", 409);
  }

  const { data: existingCustomer, error: customerLookupError } = await client
    .from("customers")
    .select("id,is_blocked")
    .eq("phone", input.phone)
    .maybeSingle();
  if (customerLookupError) throw customerLookupError;
  if (existingCustomer?.is_blocked) {
    throw new BookingError("Randevu oluşturma yetkiniz bulunmuyor.", 403);
  }

  let customerId = existingCustomer?.id;
  if (!customerId) {
    const { data: newCustomer, error } = await client
      .from("customers")
      .insert({ full_name: input.name, phone: input.phone })
      .select("id")
      .single();
    if (error) throw error;
    customerId = newCustomer.id;
  }

  const startsAt = `${input.date}T${input.time}:00`;
  const [hour, minute] = input.time.split(":").map(Number);
  const endsAtDate = new Date(`${input.date}T${String(hour).padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00+03:00`);
  endsAtDate.setTime(endsAtDate.getTime() + 60 * 60 * 1000);
  const endsAt = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(endsAtDate).replace(" ", "T");
  const totalPrice = services.reduce((total, service) => total + Number(service.base_price), 0);

  const { data: appointment, error: appointmentError } = await client
    .from("appointments")
    .insert({
      customer_id: customerId,
      starts_at: startsAt,
      ends_at: endsAt,
      total_price: totalPrice,
      status: "confirmed",
    })
    .select("id")
    .single();
  if (appointmentError) throw appointmentError;

  const { error: detailsError } = await client.from("appointment_services").insert(
    services.map((service) => ({
      appointment_id: appointment.id,
      service_id: service.id,
      staff_id: targetStaff.id,
      price_at_time: service.base_price,
    })),
  );
  if (detailsError) {
    const { error: rollbackError } = await client
      .from("appointments")
      .delete()
      .eq("id", appointment.id);
    if (rollbackError) {
      console.error("Eksik randevu kaydı geri alınamadı:", rollbackError);
    }
    throw detailsError;
  }

  let calendarWarning: string | undefined;
  if (targetStaff.google_calendar_id) {
    try {
      await createGoogleEvent(targetStaff.google_calendar_id, {
        name: input.name,
        phone: input.phone,
        services: services.map((service) => service.name).join(", "),
        date: input.date,
        time: input.time,
      });
    } catch (error) {
      console.error("Google Takvim etkinliği oluşturulamadı:", error);
      calendarWarning = "Randevu kaydedildi; takvim bildirimi oluşturulamadı. Salonla telefonla iletişime geçebilirsiniz.";
    }
  }

  return { appointmentId: appointment.id, calendarWarning };
}
