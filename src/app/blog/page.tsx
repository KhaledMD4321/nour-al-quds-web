import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock, ArrowLeft } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BLOG_POSTS } from "@/lib/blog";

export const metadata: Metadata = {
  title: "المدونة — أدلة ونصائح السباكة",
  description:
    "أدلة عملية من فريق نور القدس: الفرق بين أنظمة المواسير، اختيار الوصلات، ونصائح الشراء الصح للتأسيس.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <main className="flex-1">
      <div className="wrap">
        <Breadcrumb items={[{ label: "الرئيسية", href: "/" }, { label: "المدونة" }]} />

        <div className="catintro">
          <span className="eyebrow">Blog</span>
          <h1>المدونة</h1>
          <p>أدلة عملية ونصائح من خبرة السوق — عشان تشتري صح من أول مرة.</p>
        </div>

        <div className="posts" style={{ paddingBottom: 60 }}>
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="postcard">
              <div className="postcard__meta">
                <span>
                  <CalendarDays aria-hidden="true" /> {post.dateDisplay}
                </span>
                <span>
                  <Clock aria-hidden="true" /> {post.readMinutes} دقائق قراءة
                </span>
              </div>
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
              <Link className="postcard__more" href={`/blog/${post.slug}`}>
                اقرأ المقال <ArrowLeft aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
