import AddToCartButton from '../../../features/cart/components/AddToCartButton.jsx'
import BeanCard from '../../../features/beans/components/BeanCard.jsx'
import FavoriteButton from '../../../features/favorites/components/FavoriteButton.jsx'
import { beans } from '../../../features/beans/data/beans.js'

export default function CatalogPage() {
  return (
    <section>
      <h1>Кава в зернах</h1>
      <div className="catalog-grid">
        {beans.map((bean) => (
          <BeanCard key={bean.id} bean={bean}>
            <FavoriteButton productId={bean.id} name={bean.name} />
            <AddToCartButton bean={bean} />
          </BeanCard>
        ))}
      </div>
    </section>
  )
}
