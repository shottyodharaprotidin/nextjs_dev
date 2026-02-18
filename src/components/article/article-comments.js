"use client";

import { useState, useEffect } from 'react';
import { getCommentsByArticle, createComment } from '@/services/commentService';
import { formatDate } from '@/lib/strapi';
import Link from 'next/link';
import { useTranslations } from '@/lib/translations';

const ArticleComments = ({ articleSlug, articleDocumentId, locale = 'bn' }) => {
  const { t } = useTranslations(locale);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [displayCount, setDisplayCount] = useState(20); // Show 20 comments initially
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    subject: '',
    message: ''
  });
  const [replyTo, setReplyTo] = useState(null); // { id: 1, name: 'Author Name' }

  useEffect(() => {
    fetchComments();
  }, [articleSlug]);

  const fetchComments = async () => {
    try {
      const response = await getCommentsByArticle(articleSlug);
      setComments(response.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReply = (commentId, authorName) => {
    setReplyTo({ id: commentId, name: authorName });
    const formElement = document.getElementById('comment-form');
    if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createComment(
        articleDocumentId, 
        formData.name, 
        formData.email, 
        formData.message,
        formData.website,
        formData.subject,
        replyTo ? replyTo.id : null
      );
      
      // Reset form and refresh comments
      setFormData({ name: '', email: '', website: '', subject: '', message: '' });
      setReplyTo(null);
      await fetchComments();
      alert("Comment submitted successfully!"); 
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to render a single comment item
  const renderCommentItem = (comment, isReply = false) => {
      const data = comment.attributes || comment;
      const date = new Date(data.createdAt).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
      });

      return (
        <li key={comment.id}>
            <div className="comment-main-level">
                <div className="comment-avatar">
                    <img src="/default.jpg" alt={data.authorName} />
                </div>
                <div className="comment-box">
                    <div className="comment-content">
                        <div className="comment-header">
                            <cite className="comment-author">{data.authorName || t('anonymous')}</cite>
                            <time dateTime={data.createdAt} className="comment-datetime">
                                {date}
                            </time>
                        </div>
                        <p>{data.content}</p>
                        {!isReply && (
                            <button 
                                onClick={() => handleReply(comment.id, data.authorName)} 
                                className="btn btn-news"
                                style={{ cursor: 'pointer' }}
                            >
                                {t('reply')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* Nested Replies */}
            {data.children && data.children.length > 0 && (
                <ul className="comments-list reply-list">
                    {data.children.map(child => renderCommentItem(child, true))}
                </ul>
            )}
        </li>
      );
  };

  if (loading) return <div>Loading comments...</div>;

  const displayedComments = comments.slice(0, displayCount);
  const hasMoreComments = comments.length > displayCount;

  return (
    <>
      <div className="comments-container">
        <h3>{t('comments')} ({comments.length})</h3>
        <ul className="comments-list">
          {displayedComments.map(comment => renderCommentItem(comment))}
        </ul>
        {hasMoreComments && (
          <div className="text-center mt-3 mb-3">
            <button 
              type="button"
              className="btn btn-news"
              onClick={() => setDisplayCount(prev => prev + 20)}
            >
              {t('loadMoreComments')}
            </button>
          </div>
        )}
      </div>

      <form className="comment-form" id="comment-form" onSubmit={handleSubmit}>
        <h3>
            <strong>{t('leaveAComment').split(' ')[0]}</strong> {t('leaveAComment').split(' ').slice(1).join(' ')} {replyTo && <span style={{fontSize: '0.6em'}}>({t('replyingTo')} {replyTo.name} - <button type="button" onClick={handleCancelReply} style={{background:'none', border:'none', color:'red', cursor:'pointer'}}>{t('cancel')}</button>)</span>}
        </h3>
        <div className="row">
            <div className="col-sm-6">
                <div className="form-group">
                    <label htmlFor="name">{t('fullName')}*</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder={t('yourName')}
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="col-sm-6">
                <label htmlFor="email">{t('email')}*</label>
                <div className="form-group">
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder={t('yourEmailAddress')}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="col-sm-6">
                <div className="form-group">
                    <label htmlFor="website">{t('website')}</label>
                    <input
                        type="text"
                        className="form-control"
                        id="website"
                        name="website"
                        placeholder={t('yourWebsiteUrl')}
                        value={formData.website}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="col-sm-6">
                <label htmlFor="subject">{t('subject')}</label>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        id="subject"
                        name="subject"
                        placeholder={t('writeSubjectHere')}
                        value={formData.subject}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
        <div className="form-group">
            <label htmlFor="message">{t('message')}</label>
            <textarea
                className="form-control"
                id="message"
                name="message"
                placeholder={t('yourComment')}
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
            />
        </div>
        <button type="submit" className="btn btn-news" disabled={submitting}>
            {submitting ? t('submit')+'...' : t('submit')}
        </button>
      </form>
    </>
  );
};

export default ArticleComments;
