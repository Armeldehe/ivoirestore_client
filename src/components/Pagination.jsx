import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-ghost p-2 disabled:opacity-30"
      >
        <HiChevronLeft className="w-5 h-5" />
      </button>

      {pages[0] > 1 && (
        <>
          <PageBtn n={1} active={currentPage === 1} onClick={() => onPageChange(1)} />
          {pages[0] > 2 && <span className="text-slate-600 px-1">…</span>}
        </>
      )}

      {pages.map((n) => (
        <PageBtn key={n} n={n} active={n === currentPage} onClick={() => onPageChange(n)} />
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="text-slate-600 px-1">…</span>}
          <PageBtn n={totalPages} active={currentPage === totalPages} onClick={() => onPageChange(totalPages)} />
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-ghost p-2 disabled:opacity-30"
      >
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function PageBtn({ n, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {n}
    </button>
  );
}
