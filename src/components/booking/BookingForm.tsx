"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { serviceSlug } from "@/lib/service-slug";

type Service = {
  id: string;
  category_id: string;
  name: string;
  base_price: number;
};

type Category = {
  id: string;
  name: string;
  services: Service[];
};

type Staff = { id: string; full_name: string };
type Step = "selection" | "details" | "success";

async function requestJson<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      typeof result?.error === "string" ? result.error : "İşlem tamamlanamadı.",
    );
  }
  return result as T;
}

function getToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

const priceFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export function BookingForm() {
  const searchParams = useSearchParams();
  const requestedService = searchParams.get("service");
  const restartToken = searchParams.get("restart");
  const [categories, setCategories] = useState<Category[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<Step>("selection");
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [calendarWarning, setCalendarWarning] = useState("");
  const [openCategory, setOpenCategory] = useState("");
  const [today] = useState(getToday);

  useEffect(() => {
    if (!restartToken) return;
    setSelectedServices([]);
    setSelectedStaff("");
    setDate("");
    setSelectedTime("");
    setSlots([]);
    setName("");
    setPhone("");
    setStep("selection");
    setLoadingStaff(false);
    setLoading(false);
    setError("");
    setCalendarWarning("");
  }, [restartToken]);

  useEffect(() => {
    let active = true;
    requestJson<Category[]>("/api/booking/catalog")
      .then((catalog) => {
        if (!active) return;
        setCategories(catalog);
        setOpenCategory(catalog[0]?.id ?? "");
        if (requestedService) {
          const match = catalog
            .flatMap((category) => category.services)
            .find((service) => serviceSlug(service.name) === requestedService);
            if (match) {
              setLoadingStaff(true);
              setSelectedServices([match.id]);
            }
        }
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Hizmetler yüklenemedi.");
      })
      .finally(() => {
        if (active) setLoadingCatalog(false);
      });
    return () => {
      active = false;
    };
  }, [requestedService]);

  useEffect(() => {
    let active = true;
    if (selectedServices.length === 0) return () => { active = false; };
    requestJson<Staff[]>("/api/booking/staff", { serviceIds: selectedServices })
      .then((result) => {
        if (active) {
          setStaff(result);
          setLoadingStaff(false);
        }
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Personel listesi yüklenemedi.");
        if (active) setLoadingStaff(false);
      })
    return () => {
      active = false;
    };
  }, [selectedServices]);

  const selectedServiceRows = categories
    .flatMap((category) => category.services)
    .filter((service) => selectedServices.includes(service.id));
  const total = selectedServiceRows.reduce((sum, service) => sum + service.base_price, 0);

  function toggleService(id: string) {
    setError("");
    setSlots([]);
    setSelectedTime("");
    setStaff([]);
    setSelectedStaff("");
    const next = selectedServices.includes(id)
      ? selectedServices.filter((value) => value !== id)
      : [...selectedServices, id];
    setSelectedServices(next);
    setLoadingStaff(next.length > 0);
  }

  function startNewAppointment() {
    setSelectedServices([]);
    setSelectedStaff("");
    setDate("");
    setSelectedTime("");
    setSlots([]);
    setName("");
    setPhone("");
    setStep("selection");
    setLoadingStaff(false);
    setError("");
    setCalendarWarning("");
  }

  async function searchSlots(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSelectedTime("");
    setSlots([]);
    if (selectedServices.length === 0 || !date) {
      setError("Lütfen en az bir hizmet ve randevu tarihi seçin.");
      return;
    }
    if (new Date(`${date}T00:00:00.000Z`).getUTCDay() === 0) {
      setError("Pazar günleri randevu alınamamaktadır.");
      return;
    }
    setLoading(true);
    try {
      const available = await requestJson<string[]>("/api/booking/available-slots", {
        date,
        serviceIds: selectedServices,
        staffId: selectedStaff || null,
      });
      setSlots(available);
      if (available.length === 0) setError("Bu tarihte uygun saat bulunamadı. Başka bir gün deneyin.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Uygun saatler alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  async function submitAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await requestJson<{ calendarWarning?: string }>("/api/booking/appointments", {
        date,
        serviceIds: selectedServices,
        staffId: selectedStaff || null,
        time: selectedTime,
        name,
        phone,
      });
      setCalendarWarning(result.calendarWarning ?? "");
      setStep("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Randevu oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "success") {
    return (
      <div className="form-success" role="status">
        <span aria-hidden="true">✓</span>
        <h2>Randevun oluşturuldu.</h2>
        <p>Seçtiğin hizmet ve saat için randevu kaydın alındı.</p>
        {calendarWarning && <p className="field-error mt-3">{calendarWarning}</p>}
        <button className="button button-dark mt-6" type="button" onClick={startNewAppointment}>
          Yeni randevu oluştur
        </button>
      </div>
    );
  }

  if (loadingCatalog) {
    return <p className="text-sm text-muted" role="status">Hizmetler yükleniyor…</p>;
  }

  if (step === "details") {
    return (
      <form className="booking-form" onSubmit={submitAppointment} noValidate>
        <div>
          <p className="eyebrow">Randevu özeti</p>
          <h2 className="mt-2 font-serif text-3xl">Son bir adım.</h2>
        </div>
        <div className="border-y border-line py-4">
          {selectedServiceRows.map((service) => (
            <div key={service.id} className="flex justify-between gap-4 py-2 text-sm">
              <span>{service.name}</span>
              <strong>{priceFormatter.format(service.base_price)}</strong>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-line pt-3 text-sm font-semibold">
            <span>Toplam</span><span>{priceFormatter.format(total)}</span>
          </div>
          <p className="mt-3 text-xs text-muted">
            {date} · {selectedTime}
            {selectedStaff && ` · ${staff.find((member) => member.id === selectedStaff)?.full_name ?? ""}`}
          </p>
        </div>
        <label>
          Ad soyad
          <input
            autoComplete="name"
            maxLength={120}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Adınız ve soyadınız"
          />
        </label>
        <label>
          Telefon
          <input
            autoComplete="tel"
            type="tel"
            maxLength={40}
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+90 5XX XXX XX XX"
          />
        </label>
        {error && <p className="field-error" role="alert">{error}</p>}
        {selectedServices.length > 0 && !loadingStaff && staff.length === 0 && (
          <p className="text-sm text-muted">Seçilen hizmetler için uygun personel bulunamadı.</p>
        )}
        <div className="flex flex-wrap gap-3">
          <button className="button button-outline-dark" type="button" onClick={() => setStep("selection")}>
            Geri dön
          </button>
          <button className="button button-dark" type="submit" disabled={loading}>
            {loading ? "Kaydediliyor…" : "Randevuyu onayla"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form className="booking-form" onSubmit={searchSlots} noValidate>
      <div>
        <p className="eyebrow">Randevu oluştur</p>
        <h2 className="mt-2 font-serif text-3xl">Hizmetini seç.</h2>
        <p className="mt-2 text-xs leading-6 text-muted">Birden fazla hizmet seçebilirsin.</p>
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}
      {categories.length === 0 ? (
        <p className="text-sm text-muted">Şu anda listelenecek hizmet bulunmuyor.</p>
      ) : (
        <div className="grid gap-3">
          {categories.map((category) => (
            <section key={category.id} className="border border-line">
              <button
                type="button"
                className="flex w-full items-center justify-between bg-cream px-4 py-4 text-left text-xs font-semibold uppercase tracking-[.15em]"
                aria-expanded={openCategory === category.id}
                onClick={() => setOpenCategory(openCategory === category.id ? "" : category.id)}
              >
                {category.name}<span aria-hidden="true">{openCategory === category.id ? "−" : "+"}</span>
              </button>
              {openCategory === category.id && (
                <div className="grid divide-y divide-line px-4">
                  {category.services.map((service) => (
                    <label
                      key={service.id}
                      className={`booking-service-option ${selectedServices.includes(service.id) ? "booking-service-selected" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                      />
                      <span className="flex-1">{service.name}</span>
                      <strong>{priceFormatter.format(service.base_price)}</strong>
                    </label>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          Personel tercihi
          <select
            value={selectedStaff}
            disabled={selectedServices.length === 0 || staff.length === 0}
            onChange={(event) => {
              setSelectedStaff(event.target.value);
              setSlots([]);
              setSelectedTime("");
            }}
          >
            <option value="">Fark etmez (herhangi biri)</option>
            {staff.map((member) => <option key={member.id} value={member.id}>{member.full_name}</option>)}
          </select>
        </label>
        <label>
          Randevu tarihi
          <input
            type="date"
            required
            min={today}
            max={addDays(today, 7)}
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setSlots([]);
              setSelectedTime("");
            }}
          />
        </label>
      </div>
      <button
        className="button button-dark w-full sm:w-auto"
        type="submit"
        disabled={loading || selectedServices.length === 0 || !date || staff.length === 0}
      >
        {loading ? "Saatler kontrol ediliyor…" : "Uygun saatleri gör"}
      </button>
      {slots.length > 0 && (
        <fieldset className="grid gap-3 border-t border-line pt-5">
          <legend className="eyebrow">Uygun saatler</legend>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((time) => (
              <button
                key={time}
                type="button"
                aria-pressed={selectedTime === time}
                className={`booking-time ${selectedTime === time ? "booking-time-selected" : ""}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
          <button
            className="button button-copper w-full sm:w-auto"
            type="button"
            disabled={!selectedTime}
            onClick={() => {
              setError("");
              setStep("details");
            }}
          >
            Bu saati seç
          </button>
        </fieldset>
      )}
    </form>
  );
}
