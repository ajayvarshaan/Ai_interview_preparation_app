import React, { useState } from "react";
import { LuCopy, LuCheck, LuCode } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const AIResponsePreview = ({ content }) => {
  if (!content) return null;

  return (
    <div className="w-full text-[14px] text-gray-800 leading-[1.7]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const isInline = !className;
            return !isInline ? (
              <CodeBlock
                code={String(children).replace(/\n$/, "")}
                language={language}
              />
            ) : (
              <code className="px-1.5 py-[2px] bg-gray-200 text-[#d73a49] text-[0.88em] font-mono rounded-sm" {...props}>
                {children}
              </code>
            );
          },
          p({ children }) {
            return <p className="mb-3 leading-[1.7]">{children}</p>;
          },
          strong({ children }) {
            return <strong className="font-semibold text-gray-900">{children}</strong>;
          },
          em({ children }) {
            return <em className="italic text-gray-600">{children}</em>;
          },
          ul({ children }) {
            return <ul className="list-disc pl-6 mb-3 space-y-2.5 marker:text-gray-800">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal pl-6 mb-3 space-y-2.5">{children}</ol>;
          },
          li({ children }) {
            return <li className="text-gray-800 leading-[1.7] pl-1">{children}</li>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-600 my-3">
                {children}
              </blockquote>
            );
          },
          h1({ children }) {
            return <h1 className="text-xl font-bold text-gray-900 mb-3 mt-4">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg font-semibold text-gray-900 mb-2 mt-4">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-base font-semibold text-gray-900 mb-2 mt-3">{children}</h3>;
          },
          h4({ children }) {
            return <h4 className="text-sm font-semibold text-gray-900 mb-1 mt-3">{children}</h4>;
          },
          a({ children, href }) {
            return (
              <a href={href} className="text-blue-600 hover:text-blue-700 underline">
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3">
                <table className="min-w-full border border-gray-300 rounded-lg text-sm">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-gray-100 text-gray-800 font-semibold">{children}</thead>;
          },
          tbody({ children }) {
            return <tbody className="divide-y divide-gray-200">{children}</tbody>;
          },
          tr({ children }) {
            return <tr className="hover:bg-gray-50">{children}</tr>;
          },
          th({ children }) {
            return <th className="px-3 py-2 text-left border-b border-gray-300">{children}</th>;
          },
          td({ children }) {
            return <td className="px-3 py-2 text-gray-700">{children}</td>;
          },
          hr() {
            return <hr className="my-4 border-t border-gray-300" />;
          },
          img({ src, alt }) {
            return <img src={src} alt={alt} className="max-w-full rounded-lg my-3" />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <LuCode size={16} className="text-gray-500" />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {language || "code"}
          </span>
        </div>
        <button
          onClick={copyCode}
          className="flex text-gray-600 hover:text-gray-700 focus:outline-none relative"
          aria-label="Copy code"
        >
          {copied ? (
            <LuCheck size={16} className="text-green-600" />
          ) : (
            <LuCopy size={16} />
          )}
        </button>
        {copied && (
          <span className="absolute top-8 right-4">
            Copied!
          </span>
        )}
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          fontSize: "13px",
        }}
        showLineNumbers={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default AIResponsePreview;
