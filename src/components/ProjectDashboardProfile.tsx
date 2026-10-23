"use client";
import { useCallback, useState, useSyncExternalStore } from "react";
import { useI18n } from "@/components/Providers";
import { dashboardCategories, medicalSpecialties, projectDashboardProfiles, resolveDashboardProfile } from "@/config/project-dashboard";

const eventName = "automed-dashboard-profile";
function subscribe(notify: () => void) {
  window.addEventListener(eventName, notify);
  window.addEventListener("storage", notify);
  return () => { window.removeEventListener(eventName, notify); window.removeEventListener("storage", notify); };
}
export function useProjectDashboardProfile(projectId: string) {
  const initial = projectDashboardProfiles[projectId];
  const fallback = `${initial?.category ?? "general"}:${initial?.specialty ?? "general"}`;
  const key = `automed-dashboard-profile:${projectId}`;
  const read = useCallback(() => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } }, [key, fallback]);
  const value = useSyncExternalStore(subscribe, read, () => fallback);
  const setProfile = (category: string, specialty: string) => {
    try { localStorage.setItem(key, `${category}:${specialty}`); } catch { return false; }
    window.dispatchEvent(new Event(eventName));
    return true;
  };
  return { ...resolveDashboardProfile(value), setProfile };
}
export default function ProjectDashboardProfile({ projectId }: { projectId: string }) {
  const { t } = useI18n();
  const { category, specialty, setProfile } = useProjectDashboardProfile(projectId);
  const [saveFailed, setSaveFailed] = useState(false);
  const save = (categoryId: string, specialtyId: string) => setSaveFailed(!setProfile(categoryId, specialtyId));
  return <div className="project-profile-controls">
    <label><span>{t({ ar: "نوع النشاط", en: "Business activity" })}</span>
      <select aria-label={t({ ar: "نوع النشاط", en: "Business activity" })} value={category.id} onChange={event => save(event.target.value, specialty.id)}>
        {dashboardCategories.map(item => <option key={item.id} value={item.id}>{t(item.label)}</option>)}
      </select>
    </label>
    {category.id === "medical" && <label><span>{t({ ar: "التخصص", en: "Specialty" })}</span>
      <select aria-label={t({ ar: "التخصص", en: "Specialty" })} value={specialty.id} onChange={event => save(category.id, event.target.value)}>
        {medicalSpecialties.map(item => <option key={item.id} value={item.id}>{t(item.label)}</option>)}
      </select>
    </label>}
    {saveFailed && <p role="alert">{t({ ar: "تعذّر حفظ الاختيار. اسمح بالتخزين المحلي في المتصفح ثم حاول مرة أخرى.", en: "Could not save this choice. Allow browser storage and try again." })}</p>}
    <p>{t({ ar: "يُحفظ اختيار العرض لهذا المشروع على هذا الجهاز فقط. لا يغيّر بيانات المشروع أو صلاحياته.", en: "This project's view is saved on this device only. Project data and permissions stay unchanged." })}</p>
  </div>;
}
