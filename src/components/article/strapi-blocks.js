'use native';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function StrapiBlocks({ content }) {
  if (!content) return null;

  // Handle Markdown string (user's current setup)
  if (typeof content === 'string') {
    return (
      <div className="post_details_inner">
        <div className="post_details_block">
            <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
                // Custom Mappings to match post-template/page.js exactly
                p: ({node, ...props}) => <p {...props} />, // Standard p matches .post_details_block p
                
                // Lists
                ul: ({node, ...props}) => <ul className="arrow_list" {...props} />,
                ol: ({node, ...props}) => <ol {...props} />, // Standard ol, globals.css covers it or default
                
                // Quotes - Template uses div.article_comment, NOT blockquote
                blockquote: ({node, ...props}) => <div className="article_comment" {...props} />,
                
                // Images - Template uses figure.align-left (or right)
                img: ({node, ...props}) => {
                    return (
                        <figure className="align-left">
                            <img 
                                src={props.src} 
                                alt={props.alt} 
                                className="img-fluid"
                                {...props}
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
                }
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
                    return (
                    <figure className="align-left">
                        <img
                            src={image.url}
                            alt={image.alternativeText || ''}
                            width={image.width}
                            height={image.height}
                            className="img-fluid"
                        />
                        {image.caption && <figcaption>{image.caption}</figcaption>}
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
