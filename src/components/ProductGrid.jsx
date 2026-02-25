import ProductCard from './ProductCard';

function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 skeleton rounded-full w-1/3" />
        <div className="h-4 skeleton rounded-full w-3/4" />
        <div className="h-3 skeleton rounded-full w-1/2" />
        <div className="h-5 skeleton rounded-full w-1/4 mt-2" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading, cols = 4 }) {
  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[cols] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  if (loading) {
    return (
      <div className={`grid ${colClass} gap-5`}>
        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-slate-400 text-lg">Aucun produit trouvé</p>
        <p className="text-slate-600 text-sm mt-2">Essayez d'autres termes de recherche</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-5`}>
      {products.map((product, i) => (
        <ProductCard key={product._id} product={product} index={i} />
      ))}
    </div>
  );
}
