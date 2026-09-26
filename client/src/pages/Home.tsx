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
  credits: number;
  semester: number;
};

const courses: Course[] = [
  { id: 1, name: "اللغة العربية", code: "UNI 101", type: "جامعة", credits: 2, semester: 1 },
  { id: 2, name: "اللغة الإنجليزية (1)", code: "ENG 101", type: "جامعة", credits: 2, semester: 1 },
  { id: 3, name: "الرياضيات (1)", code: "MATH 101", type: "إجبارية", credits: 2, semester: 1 },
  { id: 4, name: "الفيزياء العامة", code: "PHYS 101", type: "إجبارية", credits: 2, semester: 1 },
  { id: 5, name: "الرسم الهندسي", code: "ENGR 101", type: "إجبارية", credits: 2, semester: 1 },
  { id: 6, name: "مهارات الحاسوب", code: "CS 101", type: "جامعة", credits: 2, semester: 1 },
  { id: 7, name: "الثقافة الوطنية", code: "UNI 102", type: "جامعة", credits: 2, semester: 2 },
  { id: 8, name: "اللغة الإنجليزية (2)", code: "ENG 102", type: "جامعة", credits: 2, semester: 2 },
  { id: 9, name: "الرياضيات (2)", code: "MATH 102", type: "إجبارية", credits: 2, semester: 2 },
  { id: 10, name: "الكيمياء العامة", code: "CHEM 101", type: "إجبارية", credits: 2, semester: 2 },
  { id: 11, name: "مقدمة في الهندسة", code: "ENGR 102", type: "إجبارية", credits: 2, semester: 2 },
  { id: 12, name: "الاحتمالات والإحصاء", code: "STAT 201", type: "إجبارية", credits: 2, semester: 3 },
  { id: 13, name: "البرمجة الهندسية", code: "CS 201", type: "إجبارية", credits: 2, semester: 3 },
  { id: 14, name: "الجيولوجيا العامة", code: "GEOL 201", type: "إجبارية", credits: 2, semester: 3 },
  { id: 15, name: "السلامة المهنية", code: "HSE 201", type: "إجبارية", credits: 2, semester: 3 },
  { id: 16, name: "ميكانيكا الموائع", code: "PET 201", type: "إجبارية", credits: 3, semester: 3 },
  { id: 17, name: "الجيولوجيا البترولية", code: "PET 202", type: "إجبارية", credits: 3, semester: 3 },
  { id: 18, name: "خواص الصخور والسوائل", code: "PET 203", type: "إجبارية", credits: 3, semester: 4 },
  { id: 19, name: "هندسة المكامن (1)", code: "PET 204", type: "إجبارية", credits: 3, semester: 4 },
  { id: 20, name: "هندسة الحفر (1)", code: "PET 205", type: "إجبارية", credits: 3, semester: 4 },
  { id: 21, name: "هندسة الإنتاج (1)", code: "PET 206", type: "إجبارية", credits: 3, semester: 4 },
  { id: 22, name: "البتروفيزياء", code: "PET 207", type: "إجبارية", credits: 3, semester: 4 },
  { id: 23, name: "الرياضيات الهندسية", code: "MATH 301", type: "إجبارية", credits: 3, semester: 4 },
  { id: 24, name: "اقتصاديات النفط والغاز", code: "PET 301", type: "إجبارية", credits: 3, semester: 5 },
  { id: 25, name: "هندسة المكامن (2)", code: "PET 302", type: "إجبارية", credits: 3, semester: 5 },
  { id: 26, name: "هندسة الحفر (2)", code: "PET 303", type: "إجبارية", credits: 3, semester: 5 },
  { id: 27, name: "هندسة الإنتاج (2)", code: "PET 304", type: "إجبارية", credits: 3, semester: 5 },
  { id: 28, name: "اختبارات الآبار", code: "PET 305", type: "إجبارية", credits: 3, semester: 5 },
  { id: 29, name: "تسجيلات الآبار", code: "PET 306", type: "إجبارية", credits: 3, semester: 5 },
  { id: 30, name: "هندسة الغاز الطبيعي", code: "PET 307", type: "إجبارية", credits: 3, semester: 5 },
  { id: 31, name: "المحاكاة المكمنية", code: "PET 308", type: "اختيارية", credits: 3, semester: 6 },
  { id: 32, name: "هندسة خطوط الأنابيب", code: "PET 309", type: "إجبارية", credits: 3, semester: 6 },
  { id: 33, name: "منشآت الإنتاج السطحية", code: "PET 310", type: "إجبارية", credits: 3, semester: 6 },
  { id: 34, name: "التحفيز البترولي", code: "PET 311", type: "اختيارية", credits: 3, semester: 6 },
  { id: 35, name: "الحفر الاتجاهي", code: "PET 312", type: "إجبارية", credits: 3, semester: 6 },
  { id: 36, name: "إدارة المشاريع الهندسية", code: "ENGR 301", type: "جامعة", credits: 3, semester: 6 },
  { id: 37, name: "التدريب الحقلي", code: "PET 401", type: "إجبارية", credits: 3, semester: 7 },
  { id: 38, name: "تطوير الحقول النفطية", code: "PET 402", type: "إجبارية", credits: 3, semester: 7 },
  { id: 39, name: "الهندسة البحرية", code: "PET 403", type: "اختيارية", credits: 3, semester: 7 },
  { id: 40, name: "التحكم في الآبار", code: "PET 404", type: "إجبارية", credits: 3, semester: 7 },
  { id: 41, name: "هندسة التآكل", code: "PET 405", type: "اختيارية", credits: 3, semester: 7 },
  { id: 42, name: "البيئة وصناعة النفط", code: "PET 406", type: "إجبارية", credits: 3, semester: 7 },
  { id: 43, name: "المنشآت البترولية", code: "PET 407", type: "إجبارية", credits: 3, semester: 7 },
  { id: 44, name: "الطرق العددية", code: "MATH 401", type: "اختيارية", credits: 3, semester: 7 },
  { id: 45, name: "مشروع التخرج (1)", code: "PET 408", type: "إجبارية", credits: 3, semester: 8 },
  { id: 46, name: "مشروع التخرج (2)", code: "PET 409", type: "إجبارية", credits: 3, semester: 8 },
  { id: 47, name: "إدارة المكامن", code: "PET 410", type: "إجبارية", credits: 3, semester: 8 },
  { id: 48, name: "الاستخلاص المعزز للنفط", code: "PET 411", type: "اختيارية", credits: 3, semester: 8 },
  { id: 49, name: "تقنيات الغاز المسال", code: "PET 412", type: "اختيارية", credits: 3, semester: 8 },
  { id: 50, name: "تحليل البيانات البترولية", code: "PET 413", type: "اختيارية", credits: 3, semester: 8 },
  { id: 51, name: "أخلاقيات المهنة", code: "UNI 401", type: "جامعة", credits: 3, semester: 8 },
  { id: 52, name: "ندوة هندسية", code: "ENGR 402", type: "اختيارية", credits: 3, semester: 8 },
  { id: 53, name: "نمذجة ومحاكاة", code: "PET 414", type: "اختيارية", credits: 3, semester: 8 },
  { id: 54, name: "إدارة العمليات", code: "PET 415", type: "اختيارية", credits: 3, semester: 8 },
  { id: 55, name: "الاستدامة في الطاقة", code: "PET 416", type: "اختيارية", credits: 3, semester: 8 },
  { id: 56, name: "موضوعات خاصة في النفط", code: "PET 417", type: "اختيارية", credits: 3, semester: 8 },
  { id: 57, name: "حلقة بحث", code: "PET 418", type: "اختيارية", credits: 3, semester: 8 },
];

const TOTAL_CREDITS = courses.reduce((sum, course) => sum + course.credits, 0);
const defaultCompleted = [1, 2, 3, 4, 16, 17, 18, 19, 20, 21];
const typeFilters = ["الكل", "إجبارية", "اختيارية", "جامعة"] as const;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
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
  const [studentName, setStudentName] = useState(() => readStorage("oil-gas-student-name", ""));
  const [nameDraft, setNameDraft] = useState(studentName);
  const [editingName, setEditingName] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(() => !localStorage.getItem("oil-gas-student-name"));
  const [completed, setCompleted] = useState<number[]>(() => readStorage("oil-gas-completed-courses", defaultCompleted));
  const [query, setQuery] = useState("");
  const [semester, setSemester] = useState("الكل");
  const [typeFilter, setTypeFilter] = useState<(typeof typeFilters)[number]>("الكل");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    if (studentName.trim()) localStorage.setItem("oil-gas-student-name", JSON.stringify(studentName));
    else localStorage.removeItem("oil-gas-student-name");
  }, [studentName]);

  useEffect(() => {
    localStorage.setItem("oil-gas-completed-courses", JSON.stringify(completed));
  }, [completed]);

  const completedCourses = useMemo(() => courses.filter((course) => completed.includes(course.id)), [completed]);
  const completedCredits = completedCourses.reduce((sum, course) => sum + course.credits, 0);
  const remainingCredits = TOTAL_CREDITS - completedCredits;
  const percentage = Math.round((completedCredits / TOTAL_CREDITS) * 100);
  const displayName = studentName || "مهندس مستجد";
  const remainingCourseList = courses.filter((course) => !completed.includes(course.id));
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

  function printReport() {
    toast.success("التقرير جاهز للطباعة أو الحفظ كملف PDF");
    window.setTimeout(() => window.print(), 180);
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
          <button className="ghost-button print-hide" onClick={printReport}><Printer size={17} /> <span>تقرير PDF</span></button>
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
              <label><span>الفصل</span><div className="select-wrap"><select value={semester} onChange={(event) => setSemester(event.target.value)} aria-label="تصفية حسب الفصل"><option value="الكل">كل الفصول</option>{[1, 2, 3, 4, 5, 6, 7, 8].map((item) => <option key={item} value={item}>الفصل {item}</option>)}</select><ChevronDown size={15} /></div></label>
              <label><span>نوع المادة</span><div className="select-wrap"><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as (typeof typeFilters)[number])} aria-label="تصفية حسب النوع">{typeFilters.map((item) => <option key={item} value={item}>{item === "الكل" ? "كل الأنواع" : item}</option>)}</select><ChevronDown size={15} /></div></label>
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
                  <span className="course-credits"><strong>{course.credits}</strong><small>وحدات</small></span>
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

      <footer className="footer print-hide"><span><span className="footer-mark"><Fuel size={14} /></span> بوابة الطالب · هندسة النفط والغاز</span><span>جامعة الزاوية · ليبيا</span><button onClick={printReport}><FileText size={14} /> طباعة التقرير</button></footer>

      <section className="print-report" aria-label="التقرير الأكاديمي للطباعة">
        <header className="report-header">
          <div className="report-brand"><span className="report-logo"><Fuel size={25} /></span><div><strong>جامعة الزاوية</strong><small>كلية الهندسة · قسم هندسة النفط والغاز</small></div></div>
          <div className="report-title"><span>التقرير الأكاديمي</span><strong>سجل التقدم نحو التخرج</strong></div>
        </header>
        <div className="report-student"><span>اسم الطالب</span><strong>{displayName}</strong><span>تاريخ الإصدار</span><strong>{new Intl.DateTimeFormat("ar-LY", { dateStyle: "long" }).format(new Date())}</strong></div>
        <div className="report-summary"><div><span>نسبة الإنجاز</span><strong>{percentage}%</strong></div><div><span>الوحدات المنجزة</span><strong>{completedCredits} / {TOTAL_CREDITS}</strong></div><div><span>المواد المكتملة</span><strong>{completedCourses.length} / {courses.length}</strong></div></div>
        <ReportTable title="المواد المنجزة" items={completedCourses} totalCredits={completedCredits} done />
        <ReportTable title="المواد المتبقية" items={remainingCourseList} totalCredits={remainingCredits} />
        <footer className="report-footer"><span>بوابة الطالب · جامعة الزاوية</span><span>هندسة النفط والغاز · {percentage}% إنجاز</span></footer>
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

function ReportTable({ title, items, totalCredits, done = false }: { title: string; items: Course[]; totalCredits: number; done?: boolean }) {
  return (
    <section className="report-table-section">
      <div className="report-section-title"><h2>{title}</h2><span className={done ? "report-done" : "report-remaining"}>{items.length} مادة · {totalCredits} وحدة</span></div>
      <table><thead><tr><th>المادة</th><th>الرمز</th><th>الفصل</th><th>النوع</th><th>الوحدات</th></tr></thead><tbody>{items.length ? items.map((course) => <tr key={course.id}><td>{course.name}</td><td dir="ltr">{course.code}</td><td>{course.semester}</td><td>{course.type}</td><td>{course.credits}</td></tr>) : <tr><td colSpan={5}>لا توجد مواد في هذه القائمة</td></tr>}</tbody></table>
    </section>
  );
}
