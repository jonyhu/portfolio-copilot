import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Function to preprocess content and convert **INSIGHTS:** style headers to proper markdown
function preprocessContent(content: string): string {
  // Convert **SECTION:** patterns to proper markdown headers
  const processed = content.replace(/\*\*([A-Z\s]+):\*\*/g, (match, sectionName) => {
    return `\n### ${sectionName.trim()}\n\n`;
  });
  
  return processed;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const processedContent = preprocessContent(content);
  
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom styling for different markdown elements
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-gray-900 mb-3 mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <div className="mt-6 mb-4 first:mt-0">
              <span className="analysis-section-header">
                {children}
              </span>
            </div>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-gray-800 mb-2 mt-4">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-gray-700 mb-4 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 leading-relaxed">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-700">
              {children}
            </em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-300 pl-4 py-2 my-4 bg-blue-50 rounded-r-lg">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-gray-300 my-6" />,
          code: ({ children }) => (
            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
              {children}
            </pre>
          )
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}