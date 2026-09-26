import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  FileText,
  Filter,
  Fuel,
  GraduationCap,
  LayoutDashboard,
  Link2,
  Map,
  Menu,
  Pencil,
  Printer,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
type Course = {
  id: number;
  name: string;
  code: string;
  type: "إجبارية" | "اختيارية" | "جامعة";
  credits: number | null;
  semester: number;
};

const courses: Course[] = [
  { id: 1, name: "اللغة الإنجليزية 1 – English Language 1", code: "GH141", type: "جامعة", credits: 2, semester: 1 },
  { id: 2, name: "اللغة العربية 1 – Arabic Language 1", code: "GH150", type: "جامعة", credits: 2, semester: 1 },
  { id: 3, name: "رياضيات 1 – Mathematics 1", code: "GS101", type: "إجبارية", credits: 3, semester: 1 },
  { id: 4, name: "فيزياء 1 – Physics 1", code: "GS111", type: "إجبارية", credits: 3, semester: 1 },
  { id: 5, name: "الكيمياء العامة – General Chemistry", code: "GS115", type: "إجبارية", credits: 3, semester: 1 },
  { id: 6, name: "الجيولوجيا الفيزيائية – Physical Geology", code: "GLE211", type: "إجبارية", credits: 3, semester: 1 },
  { id: 7, name: "ميكانيكا هندسية 1 – Eng. Mechanics 1", code: "GE121", type: "إجبارية", credits: 3, semester: 1 },
  { id: 8, name: "رسم هندسي – Engineering Drawing", code: "GS126", type: "إجبارية", credits: 3, semester: 1 },
  { id: 9, name: "اللغة الإنجليزية 2 – English Language 2", code: "GH142", type: "جامعة", credits: 2, semester: 2 },
  { id: 10, name: "اللغة العربية 2 – Arabic Language 2", code: "GH151", type: "جامعة", credits: 2, semester: 2 },
  { id: 11, name: "رياضيات 2 – Mathematics 2", code: "GS102", type: "إجبارية", credits: 4, semester: 2 },
  { id: 12, name: "فيزياء 2 – Physics 2", code: "GS112", type: "إجبارية", credits: 3, semester: 2 },
  { id: 13, name: "معمل كيمياء – Chemistry Lab", code: "GS115L", type: "إجبارية", credits: 1, semester: 2 },
  { id: 14, name: "كيمياء فيزيائية – Physical Chemistry", code: "GHE211", type: "إجبارية", credits: 3, semester: 2 },
  { id: 15, name: "علم المعادن والصخور – Mineralogy & Petrology", code: "GLE221", type: "إجبارية", credits: 3, semester: 2 },
  { id: 16, name: "جيولوجيا إنشائية – Structural Geology", code: "GLE222", type: "إجبارية", credits: 3, semester: 2 },
  { id: 17, name: "علم الرسوبيات – Sedimentation", code: "GLE223", type: "إجبارية", credits: 3, semester: 2 },
  { id: 18, name: "خواص المواد – Properties of Materials", code: "GS133", type: "إجبارية", credits: 3, semester: 2 },
  { id: 19, name: "اللغة الإنجليزية 3 – English Language 3", code: "GH343", type: "جامعة", credits: 3, semester: 3 },
  { id: 20, name: "رياضيات 3 – Mathematics 3", code: "GS203", type: "إجبارية", credits: 3, semester: 3 },
  { id: 21, name: "معمل كيمياء فيزيائية 1 – Physical Chemistry Lab 1", code: "GHE211L", type: "إجبارية", credits: 1, semester: 3 },
  { id: 22, name: "معمل فيزياء 1 – Physics Lab 1", code: "GS112L", type: "إجبارية", credits: 1, semester: 3 },
  { id: 23, name: "ميكانيكا الموائع – Fluid Mechanics", code: "CHE311", type: "إجبارية", credits: 3, semester: 3 },
  { id: 24, name: "ميكانيكا الصخور والتربة – Rock Mechanics & Soil Mechanics", code: "GLE314", type: "إجبارية", credits: 3, semester: 3 },
  { id: 25, name: "المساحة والجيوديسية – Survey", code: "GPE205", type: "إجبارية", credits: 3, semester: 3 },
  { id: 26, name: "مقدمة في الهندسة الجيوفيزيائية – Intro. to Geophysics Engineering", code: "GPE324", type: "إجبارية", credits: 3, semester: 3 },
  { id: 27, name: "الاحتمالات والإحصاء – Probability & Statistics", code: "GS206", type: "إجبارية", credits: 3, semester: 3 },
  { id: 28, name: "كتابة التقارير – Technical Writing", code: "GH152", type: "جامعة", credits: 1, semester: 3 },
  { id: 29, name: "الثقافة الوطنية – National Culture", code: "GH299", type: "جامعة", credits: 2, semester: 3 },
  { id: 30, name: "جيولوجيا البترول 1 – Petroleum Geology 1", code: "GLE391", type: "إجبارية", credits: 3, semester: 4 },
  { id: 31, name: "الجيوكيمياء – Geochemistry", code: "GLE421", type: "إجبارية", credits: 3, semester: 4 },
  { id: 32, name: "الاستشعار عن بُعد والفوتوجيولوجيا – Remote Sensing & Photogeology", code: "GLE313", type: "إجبارية", credits: 3, semester: 4 },
  { id: 33, name: "علم الطبقات – Stratigraphy", code: "GLE311", type: "إجبارية", credits: 3, semester: 4 },
  { id: 34, name: "الأشعة السينية – X-Ray", code: "GLE411", type: "اختيارية", credits: 3, semester: 4 },
  { id: 35, name: "برمجة الحاسوب 1 – Computer Programming 1", code: "GS200", type: "إجبارية", credits: 3, semester: 4 },
  { id: 36, name: "ميكانيكا هندسية 2 – Eng. Mechanics 2", code: "GE222", type: "إجبارية", credits: 3, semester: 4 },
  { id: 37, name: "هندسة الحفر – Drilling Engineering", code: "PTE373", type: "إجبارية", credits: 3, semester: 5 },
  { id: 38, name: "إدارة المشاريع – Projects Management", code: "GLE425", type: "إجبارية", credits: 3, semester: 5 },
  { id: 39, name: "الجيولوجيا الاقتصادية – Economic Geology", code: "GLE412", type: "إجبارية", credits: 3, semester: 5 },
  { id: 40, name: "رياضيات 4 – Mathematics 4", code: "GS204", type: "إجبارية", credits: 3, semester: 5 },
  { id: 41, name: "علم المياه – Hydrology", code: "GLE426", type: "إجبارية", credits: 3, semester: 5 },
  { id: 42, name: "سجلات الآبار 1 – Well Logging 1", code: "GPE371", type: "إجبارية", credits: 3, semester: 5 },
  { id: 43, name: "الهندسة الجيوتقنية – Geo-Engineering", code: "GLE413", type: "إجبارية", credits: 3, semester: 5 },
  { id: 44, name: "التحليل العددي – Numerical Analysis", code: "GS309", type: "إجبارية", credits: 3, semester: 5 },
  { id: 45, name: "تحليل الأحواض – Basins Analysis", code: "GLE577", type: "اختيارية", credits: 3, semester: 6 },
  { id: 46, name: "سريان المياه الجوفية – Ground Water Flow", code: "GLE507", type: "اختيارية", credits: 3, semester: 6 },
  { id: 47, name: "سجلات الآبار 2 – Well Logging 2", code: "GLE524", type: "إجبارية", credits: 3, semester: 6 },
  { id: 48, name: "جيولوجيا ليبيا – Geology of Libya", code: "GLE471", type: "إجبارية", credits: 3, semester: 6 },
  { id: 49, name: "خواص صخور المكامن – Reservoir Rock Properties", code: "GLE417", type: "إجبارية", credits: 3, semester: 6 },
  { id: 50, name: "الجيولوجيا تحت السطحية – Subsurface Geology", code: "GLE423", type: "إجبارية", credits: 3, semester: 6 },
  { id: 51, name: "مبادئ التتابع الطبقي – Principles of Sequence Stratigraphy", code: "GLE523", type: "اختيارية", credits: 3, semester: 6 },
  { id: 52, name: "تطبيقات الحاسب في الجيولوجيا والجيوفيزياء – Computer Applications in Geology & Geophysics", code: "GLE415", type: "اختيارية", credits: 3, semester: 6 },
  { id: 53, name: "الجيوكيمياء النفطية – Petroleum Geochemistry", code: "GLE533", type: "اختيارية", credits: 3, semester: 7 },
  { id: 54, name: "جيولوجيا البترول 2 – Petroleum Geology 2", code: "GLE555", type: "إجبارية", credits: 3, semester: 7 },
  { id: 55, name: "تفسير المقطعيات السيزمية – Seismic Data Interpretation", code: "GPE573", type: "إجبارية", credits: 3, semester: 7 },
  { id: 56, name: "الجيولوجيا الحقلية (مخيّم) – Field Geology", code: "GLE523", type: "إجبارية", credits: 4, semester: 7 },
  { id: 57, name: "الندوة الجيولوجية والجيوفيزيائية – Geological & Geophysical Seminar", code: "GLE522", type: "اختيارية", credits: 1, semester: 7 },
  { id: 58, name: "مادة اختيارية 1 – Elective 1", code: "—", type: "اختيارية", credits: null, semester: 8 },
  { id: 59, name: "مشروع التخرج 1 – Graduate Project 1", code: "GLE595", type: "إجبارية", credits: 2, semester: 8 },
  { id: 60, name: "مشروع التخرج 2 – Graduate Project 2", code: "GLE599", type: "إجبارية", credits: 4, semester: 8 },
];

const TOTAL_CREDITS = courses.reduce((sum, course) => sum + (course.credits ?? 0), 0);
const defaultCompleted: number[] = [];
const typeFilters = ["الكل", "إجبارية", "اختيارية", "جامعة"] as const;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}
function readStudentName() {
  const saved = readStorage<string | null>("oil-gas-student-name-v2", null);
  return saved && !["محمد حسن", "Mohammed Hassan", "محمد الرواب"].includes(saved.trim()) ? saved : "";
}

function ProgressRing({ percentage }: { percentage: number }) {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-ring" aria-label={`نسبة الإنجاز ${percentage}%`}>
      <svg viewBox="0 0 190 190" role="img">
        <defs>
          <linearGradient id="goldGradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="48%" stopColor="#F5B301" />
            <stop offset="100%" stopColor="#B97900" />
          </linearGradient>
          <filter id="softGoldGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle className="ring-track" cx="95" cy="95" r={radius} />
        <circle
          className="ring-value"
          cx="95"
          cy="95"
          r={radius}
          stroke="url(#goldGradient)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#softGoldGlow)"
        />
      </svg>
      <div className="ring-label">
        <strong>{percentage}%</strong>
        <span>منجز</span>
      </div>
    </div>
  );
}

function StatCard({ label, value, caption, tone, icon }: { label: string; value: string; caption: string; tone: "gold" | "blue" | "green" | "muted"; icon: React.ReactNode }) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{caption}</small>
      </div>
    </article>
  );
}

export default function Home() {
  const [studentName, setStudentName] = useState(readStudentName);
  const [nameDraft, setNameDraft] = useState(studentName);
  const [editingName, setEditingName] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(() => !readStudentName());
  const [completed, setCompleted] = useState<number[]>(() => readStorage("oil-gas-completed-courses-v2", defaultCompleted));
  const [query, setQuery] = useState("");
  const [semester, setSemester] = useState("الكل");
  const [typeFilter, setTypeFilter] = useState<(typeof typeFilters)[number]>("الكل");
  const [openFilter, setOpenFilter] = useState<"semester" | "type" | "reportSemester" | null>(null);
  const [reportSemester, setReportSemester] = useState("الكل");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (studentName.trim()) localStorage.setItem("oil-gas-student-name-v2", JSON.stringify(studentName));
    else localStorage.removeItem("oil-gas-student-name-v2");
  }, [studentName]);

  useEffect(() => {
    localStorage.setItem("oil-gas-completed-courses-v2", JSON.stringify(completed));
  }, [completed]);
  useEffect(() => {
    const restoreAfterPrint = () => document.body.classList.remove("printing-report");
    window.addEventListener("afterprint", restoreAfterPrint);
    return () => window.removeEventListener("afterprint", restoreAfterPrint);
  }, []);

  const completedCourses = useMemo(() => courses.filter((course) => completed.includes(course.id)), [completed]);
  const completedCredits = completedCourses.reduce((sum, course) => sum + (course.credits ?? 0), 0);
  const remainingCredits = TOTAL_CREDITS - completedCredits;
  const percentage = Math.round((completedCredits / TOTAL_CREDITS) * 100);
  const displayName = studentName || "مهندس مستجد";
  const remainingCourseList = courses.filter((course) => !completed.includes(course.id));
  const reportCourses = reportSemester === "الكل" ? courses : courses.filter((course) => course.semester === Number(reportSemester));
  const reportCompletedCourses = reportCourses.filter((course) => completed.includes(course.id));
  const reportRemainingCourses = reportCourses.filter((course) => !completed.includes(course.id));
  const reportTotalCredits = reportCourses.reduce((sum, course) => sum + (course.credits ?? 0), 0);
  const reportCompletedCredits = reportCompletedCourses.reduce((sum, course) => sum + (course.credits ?? 0), 0);
  const reportRemainingCredits = reportTotalCredits - reportCompletedCredits;
  const reportPercentage = reportTotalCredits ? Math.round((reportCompletedCredits / reportTotalCredits) * 100) : 0;
  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        const matchesQuery = `${course.name} ${course.code}`.toLowerCase().includes(query.toLowerCase());
        const matchesSemester = semester === "الكل" || course.semester === Number(semester);
        const matchesType = typeFilter === "الكل" || course.type === typeFilter;
        return matchesQuery && matchesSemester && matchesType;
      }),
    [query, semester, typeFilter],
  );

  function toggleCourse(id: number) {
    setCompleted((current) => (current.includes(id) ? current.filter((courseId) => courseId !== id) : [...current, id]));
  }

  function saveName() {
    const trimmedName = nameDraft.trim();
    if (!trimmedName && onboardingOpen) {
      toast.error("اكتب اسمك أولاً للمتابعة");
      return;
    }
    const nextName = trimmedName || "مهندس مستجد";
    setStudentName(nextName);
    setNameDraft(nextName);
    setEditingName(false);
    setOnboardingOpen(false);
    toast.success("تم تحديث اسم الطالب");
  }

  function resetProgress() {
    const confirmed = window.confirm("هل تريد إعادة كل المواد إلى حالة متبقية؟");
    if (!confirmed) return;
    setCompleted([]);
    toast.success("تمت إعادة ضبط التقدم");
  }

  function downloadPdfDirect() {
    const report = document.querySelector(".print-report") as HTMLElement | null;
    if (!report) {
      toast.error("تعذر تجهيز التقرير");
      return;
    }
    const previousStyle = report.getAttribute("style");
    document.body.classList.add("printing-report");
    Object.assign(report.style, { display: "block", position: "static", width: "100%", padding: "0", margin: "0", background: "#fff", color: "#17202a" });
    window.setTimeout(() => {
      window.print();
      window.setTimeout(() => {
        document.body.classList.remove("printing-report");
        if (previousStyle === null) report.removeAttribute("style");
        else report.setAttribute("style", previousStyle);
      }, 300);
    }, 120);
  }
  return (
    <div className="app-shell" dir="rtl">
      <div className="ambient-grid" aria-hidden="true" />
      <header className="topbar print-hide">
        <a className="brand-lockup" href="#top" aria-label="بوابة الطالب - العودة إلى الأعلى">
          <span className="brand-mark"><Fuel size={19} strokeWidth={2.5} /></span>
          <span>
            <strong>بوابة الطالب</strong>
            <small>هندسة النفط والغاز</small>
          </span>
        </a>
        <nav className={`topnav ${showMobileMenu ? "is-open" : ""}`} aria-label="التنقل الرئيسي">
          <a className="active" href="#dashboard" onClick={() => setShowMobileMenu(false)}><LayoutDashboard size={16} /> لوحة التقدم</a>
          <a href="#courses" onClick={() => setShowMobileMenu(false)}><BookOpen size={16} /> المواد الدراسية</a>
          <a href="#resources" onClick={() => setShowMobileMenu(false)}><Link2 size={16} /> الروابط المهمة</a>
        </nav>
        <div className="top-actions">
          <button className="icon-button menu-button" aria-label="فتح القائمة" onClick={() => setShowMobileMenu((current) => !current)}>
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button className="ghost-button print-hide" onClick={downloadPdfDirect}><Printer size={17} /> <span>طباعة / حفظ PDF</span></button>
        </div>
      </header>

      <main id="top" className="page-content">
        <section id="dashboard" className="welcome-section">
          <div className="welcome-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> الفصل الدراسي الحالي · 2024 / 2025</div>
            <h1>مسارك نحو التخرج<br /><em>أوضح من أي وقت.</em></h1>
            <p>تابع تقدمك في منهج هندسة النفط والغاز، وخطّط خطوتك القادمة بثقة.</p>
            <div className="student-identity">
              <div className="avatar"><GraduationCap size={24} /></div>
              <div className="student-name-wrap">
                {editingName ? (
                  <div className="name-editor">
                    <input autoFocus value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && saveName()} aria-label="اسم الطالب" />
                    <button onClick={saveName} aria-label="حفظ الاسم"><Check size={16} /></button>
                    <button onClick={() => { setNameDraft(studentName); setEditingName(false); }} aria-label="إلغاء"><X size={16} /></button>
                  </div>
                ) : (
                  <div className="name-line"><strong>{displayName}</strong><button className="edit-name" onClick={() => { setNameDraft(displayName); setEditingName(true); }} aria-label="تعديل اسم الطالب"><Pencil size={14} /></button></div>
                )}
                <span className="student-badge">مهندس مستجد <span>🛠️</span></span>
              </div>
            </div>
          </div>
          <div className="hero-progress-card">
            <div className="card-topline"><span>الإنجاز الكلي</span><span className="live-dot"><i /> محفوظ محلياً</span></div>
            <div className="ring-wrap"><ProgressRing percentage={percentage} /></div>
            <div className="hero-progress-meta"><strong>{completedCredits} <small>/ {TOTAL_CREDITS} وحدة</small></strong><span>{completedCourses.length} من {courses.length} مادة مكتملة</span></div>
            <div className="micro-progress"><div style={{ width: `${percentage}%` }} /></div>
            <p className="hero-note"><Sparkles size={16} /> كل مادة تنجزها تقرّبك من الخريج الذي تريد أن تكونه.</p>
          </div>
        </section>

        <section className="stats-grid" aria-label="ملخص التقدم">
          <StatCard label="إجمالي الوحدات" value={`${TOTAL_CREDITS}`} caption="وحدة دراسية في الخطة" tone="gold" icon={<BookOpen size={20} />} />
          <StatCard label="الوحدات المنجزة" value={`${completedCredits}`} caption={`من أصل ${TOTAL_CREDITS} وحدة`} tone="green" icon={<CheckCircle2 size={20} />} />
          <StatCard label="الوحدات المتبقية" value={`${remainingCredits}`} caption="وحدة حتى إتمام الخطة" tone="blue" icon={<ArrowUpLeft size={20} />} />
          <StatCard label="المواد المكتملة" value={`${completedCourses.length}`} caption={`من أصل ${courses.length} مادة`} tone="muted" icon={<GraduationCap size={20} />} />
        </section>

        <section className="graduation-path card-surface">
          <div className="section-heading compact-heading">
            <div><span className="section-kicker">01 · الخطة الأكاديمية</span><h2>مسار التخرج الأكاديمي</h2></div>
            <span className="path-percent">{percentage}% مكتمل</span>
          </div>
          <div className="path-track"><div className="path-fill" style={{ width: `${percentage}%` }}><span /></div></div>
          <div className="path-labels"><span>بداية الرحلة</span><span>{completedCredits} وحدة منجزة</span><span>متطلبات التخرج · {TOTAL_CREDITS}</span></div>
        </section>

        <section id="courses" className="courses-section">
          <div className="section-heading">
            <div><span className="section-kicker">02 · سجل المواد</span><h2>خطة دراستك، في مكان واحد</h2><p>اضغط على أي مادة لتحديدها كمنجزة أو إعادتها إلى القائمة.</p></div>
            <div className="course-count"><strong>{completedCourses.length}</strong><span>مكتملة<br />من {courses.length}</span></div>
          </div>

          <div className="course-toolbar card-surface">
            <div className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم المادة أو رمزها..." aria-label="البحث في المواد" />{query && <button onClick={() => setQuery("")} aria-label="مسح البحث"><X size={15} /></button>}</div>
            <div className="toolbar-selects">
              <FilterDropdown label="الفصل الدراسي" value={semester === "الكل" ? "كل الفصول" : `الفصل ${semester}`} open={openFilter === "semester"} onToggle={() => setOpenFilter((current) => current === "semester" ? null : "semester")} options={[{ value: "الكل", label: "كل الفصول" }, ...[1, 2, 3, 4, 5, 6, 7, 8].map((item) => ({ value: String(item), label: `الفصل ${item}` }))]} selected={semester} onChange={(value) => { setSemester(value); setOpenFilter(null); }} />
              <FilterDropdown label="نوع المادة" value={typeFilter === "الكل" ? "كل الأنواع" : typeFilter} open={openFilter === "type"} onToggle={() => setOpenFilter((current) => current === "type" ? null : "type")} options={typeFilters.map((item) => ({ value: item, label: item === "الكل" ? "كل الأنواع" : item }))} selected={typeFilter} onChange={(value) => { setTypeFilter(value as (typeof typeFilters)[number]); setOpenFilter(null); }} />
            </div>
          </div>

          <div className="list-helper"><span><SlidersHorizontal size={15} /> تظهر {filteredCourses.length} مادة</span><span><CircleHelp size={15} /> اضغط على المادة لتحديدها كمنجزة</span></div>
          <div className="course-list">
            {filteredCourses.length === 0 ? (
              <div className="empty-courses card-surface"><Filter size={24} /><strong>لا توجد مواد مطابقة</strong><span>جرّب تغيير كلمة البحث أو التصفية.</span></div>
            ) : filteredCourses.map((course) => {
              const isDone = completed.includes(course.id);
              return (
                <button key={course.id} className={`course-row ${isDone ? "is-done" : ""}`} onClick={() => toggleCourse(course.id)} aria-pressed={isDone}>
                  <span className={`course-status ${isDone ? "done" : ""}`}>{isDone ? <Check size={16} strokeWidth={3} /> : <span />}</span>
                  <span className="course-main"><strong>{course.name}</strong><small>{course.code}</small></span>
                  <span className="course-semester">الفصل {course.semester}</span>
                  <span className={`type-chip type-${course.type === "إجبارية" ? "required" : course.type === "اختيارية" ? "elective" : "university"}`}>{course.type}</span>
                  <span className="course-credits"><strong>{course.credits ?? "—"}</strong><small>{course.credits === null ? "بدون وحدات" : "وحدات"}</small></span>
                  <span className="course-arrow"><ArrowUpLeft size={16} /></span>
                </button>
              );
            })}
          </div>
        </section>

        <section id="resources" className="resources-section">
          <div className="section-heading"><div><span className="section-kicker">03 · بوابتك إلى الجامعة</span><h2>روابط مهمة وأدوات سريعة</h2><p>كل ما تحتاجه لتبقى قريباً من خطتك ومصادرك.</p></div></div>
          <div className="resource-grid">
            <a className="resource-card" href="https://student.alzu.edu.ly" target="_blank" rel="noreferrer"><span className="resource-icon cyan"><Link2 size={20} /></span><span><strong>منظومة الطالب</strong><small>الدخول إلى النظام الأكاديمي</small></span><ExternalLink size={16} /></a>
            <a className="resource-card" href="#courses"><span className="resource-icon gold"><Map size={20} /></span><span><strong>خريطة المواد</strong><small>استعرض الخطة الدراسية كاملة</small></span><ArrowUpLeft size={16} /></a>
            <a className="resource-card" href="https://www.alzu.edu.ly" target="_blank" rel="noreferrer"><span className="resource-icon purple"><GraduationCap size={20} /></span><span><strong>عن الكلية والقسم</strong><small>جامعة الزاوية · كلية الهندسة</small></span><ExternalLink size={16} /></a>
            <button className="resource-card reset-card" onClick={resetProgress}><span className="resource-icon red"><RotateCcw size={20} /></span><span><strong>إعادة ضبط التقدم</strong><small>مسح المواد المنجزة والبدء من جديد</small></span><RotateCcw size={16} /></button>
          </div>
        </section>
      </main>

      <footer className="footer print-hide"><span><span className="footer-mark"><Fuel size={14} /></span> بوابة الطالب · هندسة النفط والغاز</span><span>جامعة الزاوية · ليبيا</span><span className="designer-credit">المصمم: المهندس: Mohammed Alrawab</span></footer>

      <section className="print-report" aria-label="التقرير الأكاديمي للطباعة">
        <header className="report-header">
          <div className="report-brand"><span className="report-logo"><Fuel size={25} /></span><div><strong>جامعة الزاوية</strong><small>كلية الهندسة · قسم هندسة النفط والغاز</small></div></div>
          <div className="report-title"><span>التقرير الأكاديمي</span><strong>سجل التقدم نحو التخرج</strong></div>
        </header>
        <div className="report-student"><span>اسم الطالب</span><strong>{displayName}</strong><span>تاريخ الإصدار</span><strong>{new Intl.DateTimeFormat("ar-LY", { dateStyle: "long" }).format(new Date())}</strong></div>
        <div className="report-summary"><div><span>نسبة الإنجاز {reportSemester === "الكل" ? "العامة" : `· الفصل ${reportSemester}`}</span><strong>{reportPercentage}%</strong></div><div><span>الوحدات المنجزة</span><strong>{reportCompletedCredits} / {reportTotalCredits}</strong></div><div><span>المواد المكتملة</span><strong>{reportCompletedCourses.length} / {reportCourses.length}</strong></div></div>
        <ReportTable title={`المواد المنجزة${reportSemester === "الكل" ? "" : ` · الفصل ${reportSemester}`}`} items={reportCompletedCourses} totalCredits={reportCompletedCredits} done />
        <ReportTable title={`المواد المتبقية${reportSemester === "الكل" ? "" : ` · الفصل ${reportSemester}`}`} items={reportRemainingCourses} totalCredits={reportRemainingCredits} />
        <footer className="report-footer"><span>بوابة الطالب · جامعة الزاوية</span><span>هندسة النفط والغاز · {reportPercentage}% إنجاز</span></footer>
      </section>

      {onboardingOpen && (
        <div className="onboarding-backdrop" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
          <div className="onboarding-modal">
            <div className="onboarding-glow" aria-hidden="true" />
            <span className="onboarding-logo"><Fuel size={28} /></span>
            <span className="onboarding-kicker">أهلاً بك في رحلتك</span>
            <h2 id="welcome-title">جاهز تبدأ<br /><em>مسارك نحو التخرج؟</em></h2>
            <p>خلّينا نعرف اسمك حتى نجهّز لك لوحة تقدم شخصية ومحفوظة على جهازك.</p>
            <label className="onboarding-label" htmlFor="onboarding-name">اسم الطالب</label>
            <input id="onboarding-name" className="onboarding-input" autoFocus value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && saveName()} placeholder="اكتب اسمك هنا" />
            <button className="primary-button" onClick={saveName}>ابدأ رحلتي <ArrowUpLeft size={18} /></button>
            <small className="onboarding-note"><span /> يُحفظ اسمك محلياً على هذا الجهاز فقط</small>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterDropdown({ label, value, options, selected, open, onToggle, onChange }: { label: string; value: string; options: { value: string; label: string }[]; selected: string; open: boolean; onToggle: () => void; onChange: (value: string) => void }) {
  return (
    <div className="filter-dropdown">
      <span className="filter-label">{label}</span>
      <button className={`filter-trigger ${open ? "is-open" : ""}`} onClick={onToggle} aria-expanded={open} aria-haspopup="listbox"><span>{value}</span><ChevronDown size={15} /></button>
      {open && <div className="filter-menu" role="listbox" aria-label={label}>{options.map((option) => <button key={option.value} role="option" aria-selected={selected === option.value} className={selected === option.value ? "selected" : ""} onClick={() => onChange(option.value)}>{selected === option.value ? <Check size={15} /> : <span className="option-dot" />}{option.label}</button>)}</div>}
    </div>
  );
}

function ReportTable({ title, items, totalCredits, done = false }: { title: string; items: Course[]; totalCredits: number; done?: boolean }) {
  return (
    <section className="report-table-section">
      <div className="report-section-title"><h2>{title}</h2><span className={done ? "report-done" : "report-remaining"}>{items.length} مادة · {totalCredits} وحدة</span></div>
      <table><thead><tr><th>المادة</th><th>الرمز</th><th>الفصل</th><th>النوع</th><th>الوحدات</th></tr></thead><tbody>{items.length ? items.map((course) => <tr key={course.id}><td>{course.name}</td><td dir="ltr">{course.code}</td><td>{course.semester}</td><td>{course.type}</td><td>{course.credits ?? "—"}</td></tr>) : <tr><td colSpan={5}>لا توجد مواد في هذه القائمة</td></tr>}</tbody></table>
    </section>
  );
}
