
const Tags = ({ data = [], isLoading = false }) => {
    const tags = isLoading ? Array(10).fill({ attributes: { name: 'ট্যাগ', slug: '#' } }) : data;

    if (!isLoading && tags.length === 0) return null;

    return (
        <div className="panel_inner mb-0">
        <div className="panel_header">
          <h4>
            <strong>ট্যাগ </strong>
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