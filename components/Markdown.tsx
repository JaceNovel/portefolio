import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        a: ({ href, children, ...props }) => (
          <a href={href} target="_blank" rel="noreferrer" {...props}>
            {children}
          </a>
        ),
        img: ({ alt, src, ...props }) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={alt ?? ""}
            src={src}
            loading="lazy"
            className="my-4 rounded-xl border border-zinc-200"
            {...props}
          />
        ),
        code: ({ children, ...props }) => <code className="rounded bg-zinc-100 px-1 py-0.5" {...props}>{children}</code>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
