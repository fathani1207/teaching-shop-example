import { useProducts } from "./contexts/ProductsContext";
import CategorySection from './components/CategorySection';

const CATEGORIES = ['bavoirs', 'doudous', 'couvertures'];

export default function Products() {
  const { products } = useProducts();

  return (
    <>
      {CATEGORIES.map((category) => (
        <CategorySection
          key={category}
          category={category}
          products={products.filter((p) => p.category === category)}
        />
      ))}
    </>
  )
}