import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, Clock } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WaIcon } from "@/components/WaIcon";
import { getBlogPosts, getBlogPost } from "@/lib/cms";
import { site, waLink } from "@/lib/site";

export const revalidate = 300;

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "المقال غير موجود" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    inLanguage: "ar",
    author: { "@type": "Organization", name: site.fullName },
    publisher: { "@type": "Organization", name: site.fullName },
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="wrap">
        <Breadcrumb
          items={[
            { label: "الرئيسية", href: "/" },
            { label: "المدونة", href: "/blog" },
            { label: post.title },
          ]}
        />

        <article className="post">
          <header className="post__head">
            <h1>{post.title}</h1>
            <div className="postcard__meta">
              <span>
                <CalendarDays aria-hidden="true" /> {post.dateDisplay}
              </span>
              <span>
                <Clock aria-hidden="true" /> {post.readMinutes} دقائق قراءة
              </span>
            </div>
          </header>

          {post.sections.map((section, i) => (
            <section key={i}>
              {section.heading && <h2>{section.heading}</h2>}
              {section.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </section>
          ))}

          <div className="post__cta">
            <div>
              <b>محتاج مساعدة في الاختيار أو تسعيرة؟</b>
              <span>فريقنا بيرد على واتساب بالأسعار والتوافر.</span>
            </div>
            <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener noreferrer">
              <WaIcon /> كلمنا واتساب
            </a>
          </div>
        </article>
      </div>
    </main>
  );
}
