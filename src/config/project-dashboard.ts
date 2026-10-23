import type { Bilingual } from "@/components/Providers";

export type ActivityCard = { title: Bilingual; source: Bilingual };
export type DashboardCategory = { id: string; label: Bilingual; focus: Bilingual; cards: ActivityCard[] };
const card = (ar: string, en: string, sourceAr: string, sourceEn: string): ActivityCard => ({
  title: { ar, en }, source: { ar: sourceAr, en: sourceEn },
});
export const dashboardCategories: DashboardCategory[] = [
  { id: "general", label: { ar: "مشروع عام", en: "General business" }, focus: { ar: "متابعة الطلبات والمدفوعات", en: "Orders and payment follow-up" }, cards: [
    card("طلبات تحتاج إجراء", "Orders needing action", "حالات تنفيذ الطلبات", "Order fulfilment statuses"),
    card("مهام متأخرة", "Overdue tasks", "المهام ومواعيد استحقاقها", "Tasks and due dates"),
    card("طلبات تواصل جديدة", "New enquiries", "طلبات التواصل وحالتها", "Enquiries and their statuses"),
  ] },
  { id: "restaurant", label: { ar: "مطعم أو كافيه", en: "Restaurant or café" }, focus: { ar: "تجهيز الطلبات وتسليمها في وقتها", en: "Preparation and on-time handover" }, cards: [
    card("طلبات بانتظار التأكيد", "Awaiting confirmation", "تأكيد الطلبات", "Order confirmations"),
    card("طلبات قيد التجهيز", "Being prepared", "حالات المطبخ", "Kitchen statuses"),
    card("طلبات تأخر تسليمها", "Late handovers", "موعد التسليم وحالة التوصيل", "Handover times and delivery statuses"),
  ] },
  { id: "pharmacy", label: { ar: "صيدلية", en: "Pharmacy" }, focus: { ar: "مراجعة الطلبات وتوافر الأصناف", en: "Order review and stock availability" }, cards: [
    card("طلبات تحتاج مراجعة", "Orders needing review", "حالة مراجعة الطلبات", "Order review statuses"),
    card("أصناف ناقصة", "Out-of-stock items", "كميات المخزون", "Inventory quantities"),
    card("طلبات بانتظار الصرف", "Awaiting dispensing", "حالة صرف الطلبات", "Dispensing statuses"),
  ] },
  { id: "dental", label: { ar: "عيادة أسنان", en: "Dental clinic" }, focus: { ar: "مواعيد اليوم ومتابعة الزيارات", en: "Appointments and visit follow-up" }, cards: [
    card("مواعيد تحتاج تأكيد", "Appointments to confirm", "المواعيد وتأكيد الحضور", "Appointments and attendance confirmation"),
    card("مرضى في الانتظار", "Patients waiting", "تسجيل الوصول وحالة الزيارة", "Check-in and visit statuses"),
    card("جلسات متابعة مستحقة", "Follow-up sessions due", "خطة الجلسات ومواعيد المتابعة", "Session plans and follow-up dates"),
  ] },
  { id: "medical", label: { ar: "عيادة طبية", en: "Medical clinic" }, focus: { ar: "تنظيم المواعيد والزيارات والمتابعة", en: "Appointments, visits and follow-up" }, cards: [
    card("مواعيد تحتاج تأكيد", "Appointments to confirm", "المواعيد وتأكيد الحضور", "Appointments and attendance confirmation"),
    card("زيارات في الانتظار", "Visits waiting", "تسجيل الوصول وحالة الزيارة", "Check-in and visit statuses"),
    card("متابعات مستحقة", "Follow-ups due", "مواعيد المتابعة", "Follow-up dates"),
  ] },
  { id: "company", label: { ar: "شركة أو أعمال B2B", en: "Company or B2B" }, focus: { ar: "طلبات العملاء والتحصيل والتسليمات", en: "Client requests, collections and deliverables" }, cards: [
    card("طلبات عملاء مفتوحة", "Open client requests", "طلبات العملاء وحالتها", "Client requests and statuses"),
    card("عروض أسعار تحتاج متابعة", "Quotes to follow up", "عروض الأسعار ومراحلها", "Quotes and their stages"),
    card("تسليمات مستحقة", "Deliverables due", "المشاريع ومواعيد التسليم", "Projects and delivery dates"),
  ] },
  { id: "telecom", label: { ar: "محل اتصالات وإلكترونيات", en: "Telecom and electronics" }, focus: { ar: "طلبات الخدمات والتفعيل والصيانة", en: "Service requests, activations and repairs" }, cards: [
    card("تفعيلات معلّقة", "Pending activations", "حالات تفعيل الخدمات", "Service activation statuses"),
    card("أجهزة قيد الصيانة", "Devices under repair", "تذاكر الصيانة", "Repair tickets"),
    card("طلبات جاهزة للاستلام", "Ready for collection", "حالات جاهزية الطلبات", "Collection readiness statuses"),
  ] },
  { id: "retail", label: { ar: "متجر تجزئة", en: "Retail store" }, focus: { ar: "المبيعات والمخزون وتجهيز الطلبات", en: "Sales, stock and order preparation" }, cards: [
    card("طلبات تحتاج تجهيز", "Orders to prepare", "حالة تجهيز الطلبات", "Order preparation statuses"),
    card("أصناف قاربت النفاد", "Low-stock items", "المخزون وحدود إعادة الطلب", "Stock and reorder thresholds"),
    card("مرتجعات تحتاج مراجعة", "Returns to review", "طلبات المرتجعات", "Return requests"),
  ] },
  { id: "ecommerce", label: { ar: "متجر إلكتروني", en: "Online store" }, focus: { ar: "تأكيد الطلبات والشحن والمرتجعات", en: "Confirmation, shipping and returns" }, cards: [
    card("طلبات لم تُشحن", "Unshipped orders", "حالات الشحن", "Shipping statuses"),
    card("شحنات متأخرة", "Delayed shipments", "شركة الشحن ومواعيد التسليم", "Carrier events and delivery dates"),
    card("مرتجعات مفتوحة", "Open returns", "حالات المرتجعات", "Return statuses"),
  ] },
  { id: "services", label: { ar: "خدمات وصيانة", en: "Services and maintenance" }, focus: { ar: "حجوزات الخدمة وتوزيع المهام", en: "Service bookings and task assignment" }, cards: [
    card("حجوزات تحتاج تأكيد", "Bookings to confirm", "حجوزات الخدمة", "Service bookings"),
    card("مهام لم تُسند", "Unassigned jobs", "إسناد مهام الفريق", "Team job assignments"),
    card("زيارات متأخرة", "Overdue visits", "مواعيد الزيارات وحالتها", "Visit schedules and statuses"),
  ] },
  { id: "beauty", label: { ar: "صالون أو مركز تجميل", en: "Salon or beauty centre" }, focus: { ar: "الحجوزات والجلسات وحضور العملاء", en: "Bookings, sessions and attendance" }, cards: [
    card("حجوزات تحتاج تأكيد", "Bookings to confirm", "حجوزات الجلسات", "Session bookings"),
    card("جلسات اليوم", "Today's sessions", "جدول الجلسات", "Session schedule"),
    card("متابعات العملاء", "Client follow-ups", "تواريخ متابعة العملاء", "Client follow-up dates"),
  ] },
  { id: "education", label: { ar: "مركز تعليمي أو تدريب", en: "Education or training" }, focus: { ar: "التسجيل والحضور وجدول الدورات", en: "Enrolment, attendance and courses" }, cards: [
    card("تسجيلات تحتاج تأكيد", "Enrolments to confirm", "طلبات التسجيل", "Enrolment requests"),
    card("حصص اليوم", "Today's classes", "جدول الحصص", "Class schedule"),
    card("غياب يحتاج متابعة", "Absences to follow up", "سجلات الحضور", "Attendance records"),
  ] },
  { id: "realestate", label: { ar: "عقارات", en: "Real estate" }, focus: { ar: "الاستفسارات والمعاينات والمتابعات", en: "Enquiries, viewings and follow-ups" }, cards: [
    card("استفسارات لم تُتابع", "Enquiries to follow up", "العملاء المحتملون والمتابعات", "Leads and follow-ups"),
    card("معاينات تحتاج تأكيد", "Viewings to confirm", "مواعيد المعاينات", "Viewing appointments"),
    card("عروض تنتظر الرد", "Offers awaiting response", "العروض ومراحل التفاوض", "Offers and negotiation stages"),
  ] },
  { id: "logistics", label: { ar: "شحن وتوصيل", en: "Shipping and delivery" }, focus: { ar: "إسناد الشحنات ومتابعة التسليم", en: "Shipment assignment and delivery" }, cards: [
    card("شحنات لم تُسند", "Unassigned shipments", "إسناد الشحنات", "Shipment assignments"),
    card("تسليمات متأخرة", "Late deliveries", "التتبع ومواعيد التسليم", "Tracking and delivery times"),
    card("محاولات تسليم فاشلة", "Failed delivery attempts", "نتائج محاولات التسليم", "Delivery attempt results"),
  ] },
];

export const medicalSpecialties = [
  { id: "general", label: { ar: "طب عام", en: "General medicine" } },
  { id: "internal", label: { ar: "باطنة", en: "Internal medicine" } },
  { id: "pediatrics", label: { ar: "أطفال", en: "Paediatrics" } },
  { id: "dermatology", label: { ar: "جلدية", en: "Dermatology" } },
  { id: "gynecology", label: { ar: "نساء وتوليد", en: "Obstetrics and gynaecology" } },
  { id: "orthopedics", label: { ar: "عظام", en: "Orthopaedics" } },
  { id: "ophthalmology", label: { ar: "عيون", en: "Ophthalmology" } },
  { id: "ent", label: { ar: "أنف وأذن وحنجرة", en: "ENT" } },
  { id: "cardiology", label: { ar: "قلب", en: "Cardiology" } },
  { id: "neurology", label: { ar: "مخ وأعصاب", en: "Neurology" } },
  { id: "physiotherapy", label: { ar: "علاج طبيعي", en: "Physiotherapy" } },
  { id: "nutrition", label: { ar: "تغذية", en: "Nutrition" } },
  { id: "other", label: { ar: "تخصص آخر", en: "Other specialty" } },
];

const specialtyCards: Record<string, ActivityCard[]> = {
  internal: [card("زيارات متابعة مستحقة", "Follow-up visits due", "مواعيد المتابعة", "Follow-up appointments"), card("مستندات تحتاج استلام", "Documents awaiting receipt", "حالة استلام المستندات", "Document receipt statuses")],
  pediatrics: [card("زيارات متابعة الأطفال", "Child follow-up visits", "حجوزات المتابعة", "Follow-up bookings"), card("مواعيد لم تُؤكد", "Unconfirmed appointments", "تأكيد المواعيد", "Appointment confirmations")],
  dermatology: [card("جلسات اليوم", "Today's sessions", "جدول الجلسات", "Session schedule"), card("جلسات متابعة مستحقة", "Follow-up sessions due", "مواعيد المتابعة", "Follow-up dates")],
  gynecology: [card("زيارات متابعة مستحقة", "Follow-up visits due", "مواعيد المتابعة", "Follow-up appointments"), card("حجوزات تحتاج إعادة جدولة", "Bookings to reschedule", "طلبات إعادة الجدولة", "Rescheduling requests")],
  orthopedics: [card("زيارات متابعة مستحقة", "Follow-up visits due", "مواعيد المتابعة", "Follow-up appointments"), card("زيارات لم تُغلق", "Visits awaiting closure", "حالات الزيارات", "Visit statuses")],
  ophthalmology: [card("مواعيد فحوص اليوم", "Today's examination bookings", "حجوزات الفحوص", "Examination bookings"), card("زيارات متابعة مستحقة", "Follow-up visits due", "مواعيد المتابعة", "Follow-up appointments")],
  ent: [card("زيارات اليوم", "Today's visits", "جدول الزيارات", "Visit schedule"), card("زيارات متابعة مستحقة", "Follow-up visits due", "مواعيد المتابعة", "Follow-up appointments")],
  cardiology: [card("حجوزات فحوص تحتاج تأكيد", "Examination bookings to confirm", "حجوزات الفحوص وحالتها", "Examination bookings and statuses"), card("زيارات متابعة مستحقة", "Follow-up visits due", "مواعيد المتابعة", "Follow-up appointments")],
  neurology: [card("زيارات متابعة مستحقة", "Follow-up visits due", "مواعيد المتابعة", "Follow-up appointments"), card("حجوزات تحتاج إعادة جدولة", "Bookings to reschedule", "طلبات إعادة الجدولة", "Rescheduling requests")],
  physiotherapy: [card("جلسات اليوم", "Today's sessions", "جدول الجلسات", "Session schedule"), card("جلسات متابعة مستحقة", "Follow-up sessions due", "خطة الجلسات ومواعيد المتابعة", "Session plans and follow-up dates")],
  nutrition: [card("جلسات المتابعة", "Follow-up sessions", "حجوزات المتابعة", "Follow-up bookings"), card("حجوزات تحتاج إعادة جدولة", "Bookings to reschedule", "طلبات إعادة الجدولة", "Rescheduling requests")],
};

export type ProjectDashboardSettings = { category: string; specialty: string | null };
export function isValidDashboardSettings(value: unknown): value is ProjectDashboardSettings {
  if (!value || typeof value !== "object") return false;
  const { category, specialty } = value as ProjectDashboardSettings;
  return dashboardCategories.some(item => item.id === category)
    && (category === "medical"
      ? medicalSpecialties.some(item => item.id === specialty)
      : specialty === null);
}
export function resolveDashboardProfile(value: string) {
  const [categoryId, specialtyId] = value.split(":");
  const category = dashboardCategories.find(item => item.id === categoryId) ?? dashboardCategories[0];
  const specialty = medicalSpecialties.find(item => item.id === specialtyId) ?? medicalSpecialties[0];
  const specific = specialtyCards[specialty.id];
  const cards = category.id === "medical" && specific
    ? [category.cards[0], ...specific] : category.cards;
  return { category, specialty, cards };
}
