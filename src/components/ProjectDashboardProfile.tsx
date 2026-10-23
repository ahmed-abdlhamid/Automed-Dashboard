"use client";
import { useId, useState, useTransition } from "react";
import { useI18n } from "@/components/Providers";
import { dashboardCategories, medicalSpecialties, type ProjectDashboardSettings } from "@/config/project-dashboard";
import { saveProjectDashboardSettings } from "@/app/(dashboard)/settings/actions";

export default function ProjectDashboardProfile({ projectId, initial, available }: {
  projectId: string; initial: ProjectDashboardSettings | null; available: boolean;
}) {
  const { t } = useI18n();
  const categoryId = useId();
  const specialtyId = useId();
  const [category, setCategory] = useState(initial?.category ?? "");
  const [specialty, setSpecialty] = useState(initial?.specialty ?? "general");
  const [message, setMessage] = useState<"saved" | "error" | null>(null);
  const [pending, startTransition] = useTransition();
  return <form className="project-profile-controls" onSubmit={event => {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      try {
        const result = await saveProjectDashboardSettings(projectId, { category, specialty: category === "medical" ? specialty : null });
        setMessage(result.ok ? "saved" : "error");
      } catch { setMessage("error"); }
    });
  }}>
    <label htmlFor={categoryId}><span>{t({ ar: "نوع المشروع", en: "Project category" })}</span>
      <select id={categoryId} aria-label={t({ ar: "نوع المشروع", en: "Project category" })} required disabled={pending || !available} value={category} onChange={event => { setCategory(event.target.value); setMessage(null); }}>
        <option value="" disabled>{t({ ar: "اختَر نوع المشروع", en: "Choose a category" })}</option>
        {dashboardCategories.map(item => <option key={item.id} value={item.id}>{t(item.label)}</option>)}
      </select>
    </label>
    {category === "medical" && <label htmlFor={specialtyId}><span>{t({ ar: "التخصص", en: "Specialty" })}</span>
      <select id={specialtyId} aria-label={t({ ar: "التخصص", en: "Specialty" })} disabled={pending || !available} value={specialty} onChange={event => { setSpecialty(event.target.value); setMessage(null); }}>
        {medicalSpecialties.map(item => <option key={item.id} value={item.id}>{t(item.label)}</option>)}
      </select>
    </label>}
    <p>{t({ ar: "اختَر النشاط مرة واحدة عند تجهيز المشروع. يدخل العميل ليجد إعداداته جاهزة، ويمكنك تعديلها هنا لاحقًا.", en: "Choose the activity when setting up the project. Clients receive a ready workspace; you can update its settings here later." })}</p>
    {!available && <p role="alert">{t({ ar: "تعذّر تحميل إعدادات المشروع. أعد تحميل الصفحة أو تواصل مع مسؤول النظام.", en: "Project settings could not be loaded. Reload the page or contact your system administrator." })}</p>}
    <button type="submit" className="project-profile-save" disabled={!category || pending || !available}>
      {pending ? t({ ar: "جارٍ الحفظ…", en: "Saving…" }) : t({ ar: "حفظ إعدادات المشروع", en: "Save project settings" })}
    </button>
    {message === "error" && <p role="alert">{t({ ar: "لم تُحفظ الإعدادات. تحقق من اتصالك وصلاحية الأدمن ثم حاول مجددًا.", en: "Settings were not saved. Check your connection and admin access, then retry." })}</p>}
    {message === "saved" && <p role="status">{t({ ar: "تم حفظ إعدادات المشروع لجميع مستخدميه.", en: "Project settings saved for all its users." })}</p>}
  </form>;
}
