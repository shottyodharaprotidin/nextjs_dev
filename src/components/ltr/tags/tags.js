
import { useLanguage } from '@/lib/LanguageContext';

const dictionary = {
    en: {
        title: 'Tags',
        dummyTag: 'Tag'
    },
    bn: {
        title: 'ট্যাগ',
        dummyTag: 'ট্যাগ'
    }
};

const Tags = ({ data = [], isLoading = false }) => {
    const { locale } = useLanguage();
    const t = dictionary[locale] || dictionary.bn;
    const tags = isLoading ? Array(10).fill({ attributes: { name: t.dummyTag, slug: '#' } }) : data;

    if (!isLoading && tags.length === 0) return null;

    return (
        <div className="panel_inner mb-0">
        <div className="panel_header">
          <h4>
            <strong>{t.title} </strong>
          </h4>
        </div>
        <div className="panel_body">
          <div className="tags-inner d-flex flex-wrap gap-2">
            {tags.map((tag, i) => {
                const t = tag.attributes || tag;
                return (
                    <a
                        key={i}
                        href={t.slug !== '#' ? `/bn/topic/${t.slug}` : '#'}
                        className="ui tag text-uppercase fw-semibold border"
                    >
                        {t.name}
                    </a>
                );
            })}
          </div>
        </div>
      </div>
    );
};

export default Tags;