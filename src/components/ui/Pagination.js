
import Link from 'next/link';

const Pagination = ({ currentPage, totalPages, basePath }) => {
    // Helper to generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pages = getPageNumbers();

    // Always show pagination structure even if single page, per user request
    if (totalPages === 0) return null;

    const prevPage = currentPage > 1 ? currentPage - 1 : 1;
    const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;
    
    // Check if basePath already has query parameters
    const getPageUrl = (pageNum) => {
        return basePath.includes('?') 
            ? `${basePath}&page=${pageNum}` 
            : `${basePath}?page=${pageNum}`;
    };

    return (
        <div className="post-footer">
            <div className="row thm-margin">
                <div className="col-xs-12 col-sm-12 col-md-12 thm-padding">
                    <ul className="pagination">
                        {/* Previous Button */}
                        <li className={currentPage === 1 ? 'disabled' : ''}>
                            {currentPage === 1 ? (
                                <span className="ti ti-angle-left" />
                            ) : (
                                <Link href={getPageUrl(prevPage)} scroll={false}>
                                    <span className="ti ti-angle-left" />
                                </Link>
                            )}
                        </li>

                        {/* Page Numbers */}
                        {pages.map((page) => (
                            <li key={page} className={currentPage === page ? 'active' : ''}>
                                {currentPage === page ? (
                                    <span>{page}</span>
                                ) : (
                                    <Link href={getPageUrl(page)} scroll={false}>
                                        {page}
                                    </Link>
                                )}
                            </li>
                        ))}

                        {/* Next Button */}
                        <li className={currentPage === totalPages ? 'disabled' : ''}>
                            {currentPage === totalPages ? (
                                <span className="ti ti-angle-right" />
                            ) : (
                                <Link href={getPageUrl(nextPage)} scroll={false}>
                                    <span className="ti ti-angle-right" />
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
