'use native';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function StrapiBlocks({ content }) {
  if (!content) return null;

  // Handle Markdown string (user's current setup)
  if (typeof content === 'string') {
    // Detect CKEditor HTML output (contains HTML tags like <p>, <h2>, <figure>, etc.)
    const isHTML = /<[a-z][\s\S]*>/i.test(content);
    if (isHTML) {
      const parseOptions = {
        replace: (domNode) => {
          if (domNode.type === 'tag') {
            // Unordered Lists
            if (domNode.name === 'ul') {
              domNode.attribs = domNode.attribs || {};
              domNode.attribs.class = domNode.attribs.class ? `${domNode.attribs.class} arrow_list` : 'arrow_list';
               return domNode;
            }

            // Blockquotes
            if (domNode.name === 'blockquote') {
              domNode.name = 'div';
              domNode.attribs = domNode.attribs || {};
              domNode.attribs.class = domNode.attribs.class ? `${domNode.attribs.class} article_comment` : 'article_comment';
              // Convert inner <cite> or <footer> or <p> tags holding citation
              if (domNode.children) {
                domNode.children.forEach(child => {
                  if (child.type === 'tag' && (child.name === 'cite' || child.name === 'footer')) {
                    child.name = 'div';
                    child.attribs = child.attribs || {};
                    child.attribs.class = 'customers';
                  }
                });
              }
              return domNode;
            }

            // Unwrap images from <p> tags so CKEditor's float classes work natively
            if (domNode.name === 'p' && domNode.children) {
               const hasImage = domNode.children.some(child => child.type === 'tag' && child.name === 'img');
               if (hasImage) {
                 return <>{domToReact(domNode.children, parseOptions)}</>;
               }
            }

            // Images: just add img-fluid class, keep CKEditor's native output as-is
            if (domNode.name === 'img') {
               domNode.attribs = domNode.attribs || {};
               domNode.attribs.class = domNode.attribs.class ? `${domNode.attribs.class} img-fluid` : 'img-fluid';
               return domNode;
            }
          }
        }
      };

      // Ensure html-react-parser is imported
      const parse = require('html-react-parser').default;
      const { domToReact } = require('html-react-parser');

      return (
        <div className="post_details_inner">
          <div className="post_details_block">
            {parse(content, parseOptions)}
          </div>
        </div>
      );
    }

    // Otherwise render as Markdown
    return (
      <div className="post_details_inner">
        <div className="post_details_block">
            <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
                // Custom Mappings to match post-template/page.js exactly
                p: ({node, children, ...props}) => {
                    let hasImage = false;
                    if (node && node.children) {
                        hasImage = node.children.some(child => child.type === 'element' && child.tagName === 'img');
                    }
                    if (hasImage) {
                        return <div className="article-p" {...props}>{children}</div>;
                    }
                    return <p {...props}>{children}</p>;
                },
                
                // Lists
                ul: ({node, ...props}) => <ul className="arrow_list" {...props} />,
                ol: ({node, ...props}) => <ol {...props} />, // Standard ol, globals.css covers it or default
                
                // Quotes - Template uses div.article_comment, NOT blockquote
                blockquote: ({node, ...props}) => <div className="article_comment" {...props} />,
                
                // Images - Template uses figure.align-left (or right)
                img: ({node, ...props}) => {
                    let alignClass = ""; // Default to full-width (no float)
                    let src = props.src;
                    
                    // Parse from URL hash (e.g., image.png#align-right)
                    if (src && src.includes('#')) {
                        const parts = src.split('#');
                        src = parts[0];
                        const hash = parts[1];
                        if (['align-left', 'align-right', 'align-center'].includes(hash)) {
                            alignClass = hash;
                        }
                    }

                    // Parse from alt text (e.g., ![align-right My Image](url))
                    if (props.alt) {
                        if (props.alt.includes('align-left')) alignClass = 'align-left';
                        if (props.alt.includes('align-right')) alignClass = 'align-right';
                        if (props.alt.includes('align-center')) alignClass = 'align-center';
                    }

                    const cleanAlt = props.alt ? props.alt.replace(/align-(left|right|center)/, '').trim() : '';

                    return (
                        <figure className={alignClass}>
                            <img 
                                src={src} 
                                alt={cleanAlt} 
                                className="img-fluid"
                            />
                            {props.title && <figcaption>{props.title}</figcaption>}
                        </figure>
                    )
                },
                
                // Links
                a: ({node, ...props}) => <Link href={props.href} {...props}>{props.children}</Link>,
                 
                // Tables
                table: ({node, ...props}) => <table className="table table-bordered table-striped" {...props} />,

                code({node, inline, className, children, ...props}) {
                    return (
                        <code className={className} {...props}>
                        {children}
                        </code>
                    )
                },
                
                // Strikethrough
                del: ({node, ...props}) => <del {...props} />,
            }}
            >
            {content}
            </ReactMarkdown>
        </div>
      </div>
    );
  }

  // Handle JSON Blocks (future-proof) - Mirroring same structure
  return (
    <div className="post_details_inner">
        <div className="post_details_block">
            <BlocksRenderer
                content={content}
                blocks={{
                paragraph: ({ children }) => <p>{children}</p>,
                heading: ({ children, level }) => {
                    const Tag = `h${level}`;
                    return <Tag>{children}</Tag>;
                },
                list: ({ children, format }) => {
                    if (format === 'ordered') {
                    return <ol>{children}</ol>;
                    }
                    return <ul className="arrow_list">{children}</ul>; 
                },
                quote: ({ children }) => (
                    <div className="article_comment">
                    {children}
                    </div>
                ),
                image: ({ image }) => {
                    if (!image) return null;
                    
                    let alignClass = ""; // Default to full-width (no float)
                    
                    // Parse alignment from alt text or caption in Strapi
                    if (image.alternativeText) {
                        if (image.alternativeText.includes('align-left')) alignClass = 'align-left';
                        if (image.alternativeText.includes('align-right')) alignClass = 'align-right';
                        if (image.alternativeText.includes('align-center')) alignClass = 'align-center';
                    }
                    if (image.caption) {
                        if (image.caption.includes('align-left')) alignClass = 'align-left';
                        if (image.caption.includes('align-right')) alignClass = 'align-right';
                        if (image.caption.includes('align-center')) alignClass = 'align-center';
                    }

                    const cleanAlt = image.alternativeText ? image.alternativeText.replace(/align-(left|right|center)/g, '').trim() : '';
                    const cleanCaption = image.caption ? image.caption.replace(/align-(left|right|center)/g, '').trim() : '';

                    return (
                    <figure className={alignClass}>
                        <img
                            src={image.url}
                            alt={cleanAlt}
                            width={image.width}
                            height={image.height}
                            className="img-fluid"
                        />
                        {cleanCaption && <figcaption>{cleanCaption}</figcaption>}
                    </figure>
                    );
                },
                link: ({ children, url }) => (
                    <Link href={url}>{children}</Link>
                ),
                }}
                modifiers={{
                    bold: ({ children }) => <strong>{children}</strong>,
                    italic: ({ children }) => <em>{children}</em>,
                    underline: ({ children }) => <u>{children}</u>,
                    strikethrough: ({ children }) => <del>{children}</del>,
                    code: ({ children }) => <code>{children}</code>,
                }}
            />
        </div>
    </div>
  );
}
