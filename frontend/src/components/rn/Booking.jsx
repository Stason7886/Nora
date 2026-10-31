import { useEffect, useState } from "react";
import axios from "axios";
import { format as fmt } from "date-fns";
import { ru } from "date-fns/locale";
import { motion } from "framer-motion";
import { CalendarDays, Check, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reveal, TicketButton } from "./ui";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
export const FORMATS = ["День рождения", "Вечеринка", "Корпоратив", "Свадьба", "Фотосъёмка", "Мастер-класс", "Другое"];
const field = "w-full border-0 border-b border-[#1c1613]/40 bg-transparent px-0 py-3 text-base text-[var(--ink)] placeholder:text-[#6b5e52] focus:border-[var(--crimson)] focus:outline-none focus:ring-0 transition-colors";
const label = "eyebrow text-[0.7rem] text-[var(--ink-soft)]";
const EMPTY = { name: "", phone: "", format: "", guests: "", comment: "", promo_code: "" };

const Success = ({ data, onReset }) => (
  <motion.div data-testid="booking-success" initial={{ opacity: 0, scale: 0.9, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} className="py-10 text-center">
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--crimson)] text-[var(--cream)]"><Check className="h-8 w-8" /></div>
    <h3 className="font-display text-3xl font-bold">Заявка принята!</h3>
    <p className="mt-3 text-[var(--ink-soft)]">{data.format}, {fmt(new Date(data.date), "d MMMM yyyy", { locale: ru })}. Мы свяжемся с вами по номеру {data.phone}.</p>
    {data.discount > 0 && <p data-testid="booking-success-discount" className="mt-3 font-hand text-2xl text-[var(--crimson)]">Скидка {data.discount}% от Чеширского кота применена</p>}
    <button data-testid="booking-new-btn" onClick={onReset} className="mt-8 font-serif-rn text-sm font-bold uppercase tracking-[0.22em] underline underline-offset-4">Новая заявка</button>
  </motion.div>
);

export const Booking = () => {
  const [form, setForm] = useState(EMPTY);
  const [date, setDate] = useState();
  const [dateOpen, setDateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);

  useEffect(() => {
    const apply = () => { const c = localStorage.getItem("rn_promo"); if (c) setForm((f) => ({ ...f, promo_code: c })); };
    apply();
    window.addEventListener("rn-promo", apply);
    return () => window.removeEventListener("rn-promo", apply);
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const submit = async (e) => {
    e.preventDefault();
    if (!date || !form.format) { toast.error("Выберите дату и формат праздника"); return; }
    setLoading(true);
    try {
      const payload = { ...form, date: fmt(date, "yyyy-MM-dd"), guests: form.guests ? Number(form.guests) : null };
      const res = await axios.post(`${API}/bookings`, payload);
      setDone(res.data);
      toast.success("Заявка отправлена — кролик уже бежит к нам!");
    } catch (err) {
      const d = err?.response?.data?.detail;
      toast.error(typeof d === "string" ? d : Array.isArray(d) ? (d[0]?.msg ?? "Проверьте поля формы").replace("Value error, ", "") : "Не удалось отправить заявку");
    } finally { setLoading(false); }
  };

  return (
    <section id="contacts" data-testid="booking-section" className="relative overflow-hidden bg-[var(--night)] px-6 py-24 sm:px-10 lg:py-32">
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 items-start gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <Reveal><p className="eyebrow text-[var(--gold)]">Контакты · Бронирование</p></Reveal>
          <Reveal delay={0.1}><h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-[var(--cream)] sm:text-5xl">Приглашение на&nbsp;безумное чаепитие</h2></Reveal>
          <Reveal delay={0.2}><p className="mt-6 max-w-md text-sm leading-relaxed text-[#d9cfbd] sm:text-base">Выберите дату и формат праздника — мы перезвоним, расскажем о свободных зонах и соберём для вас свою сказку.</p></Reveal>
          <Reveal delay={0.3}><p className="mt-8 flex items-center gap-3 font-hand text-xl text-[var(--gold)]"><Sparkles className="h-5 w-5" />Говорят, Чеширский кот иногда дарит промокоды…</p></Reveal>
        </div>
        <Reveal delay={0.15} className="lg:col-span-7">
          <div className="parchment relative p-7 shadow-[0_40px_80px_rgba(0,0,0,0.6)] outline outline-1 -outline-offset-[12px] outline-[#1c1613]/30 sm:p-12">
            {done ? <Success data={done} onReset={() => { setDone(null); setForm({ ...EMPTY, promo_code: localStorage.getItem("rn_promo") || "" }); setDate(undefined); }} /> : (
              <form onSubmit={submit} data-testid="booking-form" className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
                <label className="block"><span className={label}>Ваше имя *</span><input data-testid="booking-name-input" required minLength={2} value={form.name} onChange={set("name")} placeholder="Алиса" className={field} /></label>
                <label className="block"><span className={label}>Телефон *</span><input data-testid="booking-phone-input" required type="tel" minLength={6} value={form.phone} onChange={set("phone")} placeholder="+7 (___) ___-__-__" className={field} /></label>
                <div><span className={label}>Дата праздника *</span>
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <button type="button" data-testid="booking-date-trigger" className={`${field} flex items-center justify-between text-left`}>
                        <span className={date ? "" : "text-[#6b5e52]"}>{date ? fmt(date, "d MMMM yyyy", { locale: ru }) : "Выберите дату"}</span><CalendarDays className="h-4 w-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent data-testid="booking-calendar" className="w-auto border-[#1c1613]/20 bg-[#f5eedd] p-0" align="start">
                      <Calendar mode="single" locale={ru} selected={date} onSelect={(d) => { setDate(d); setDateOpen(false); }} disabled={{ before: today }} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div><span className={label}>Формат праздника *</span>
                  <Select value={form.format} onValueChange={(v) => setForm((f) => ({ ...f, format: v }))}>
                    <SelectTrigger data-testid="booking-format-select" className="h-auto rounded-none border-0 border-b border-[#1c1613]/40 bg-transparent px-0 py-3 text-base text-[var(--ink)] shadow-none focus:ring-0 data-[placeholder]:text-[#6b5e52]"><SelectValue placeholder="Что празднуем?" /></SelectTrigger>
                    <SelectContent className="border-[#1c1613]/20 bg-[#f5eedd] text-[var(--ink)]">
                      {FORMATS.map((f, i) => <SelectItem key={f} value={f} data-testid={`booking-format-${i}`}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <label className="block"><span className={label}>Гостей</span><input data-testid="booking-guests-input" type="number" min={1} max={500} value={form.guests} onChange={set("guests")} placeholder="20" className={field} /></label>
                <label className="block"><span className={label}>Промокод</span><input data-testid="booking-promo-input" value={form.promo_code} onChange={set("promo_code")} placeholder="Если кот был щедр" className={`${field} uppercase ${form.promo_code ? "text-[var(--crimson)] font-semibold" : ""}`} /></label>
                <label className="block sm:col-span-2"><span className={label}>Пожелания</span><textarea data-testid="booking-comment-input" rows={3} value={form.comment} onChange={set("comment")} placeholder="Тематика, зона, время…" className={`${field} resize-none`} /></label>
                <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[var(--ink-soft)]">Нажимая кнопку, вы соглашаетесь на обработку контактных данных.</p>
                  {loading ? <Loader2 data-testid="booking-loading" className="h-8 w-8 animate-spin text-[var(--crimson)]" /> : <TicketButton testId="booking-submit-btn">Отправить</TicketButton>}
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
