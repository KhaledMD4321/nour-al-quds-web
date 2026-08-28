/**
 * حالة التحميل بين الصفحات — بدل الشاشة البيضاء.
 * هيكل عظمي بسيط بألوان الهوية يوحي بشكل الصفحة الجاية.
 */
export default function Loading() {
  return (
    <main id="main" className="flex-1" aria-busy="true" aria-live="polite">
      <div className="wrap" style={{ paddingBlock: 48 }}>
        <span className="sr-only">جارٍ التحميل…</span>
        <div className="skel skel--eyebrow" />
        <div className="skel skel--title" />
        <div className="skel skel--line" />
        <div className="skel skel--line skel--short" />
        <div className="skelgrid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skel skel--card" />
          ))}
        </div>
      </div>
    </main>
  );
}
