import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductCard, Skeleton } from '../../../components/index';
import styles from './SectionShared.module.css';

export default function FeaturedProductsSection({ products }) {
  const featured = products.filter(p => p.status === 'active').slice(0, 3);

  return (
    <section className={styles.section} id="produtos">
      <div className="container">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Produtos em Destaque</p>
            <h2 className={styles.sectionTitle}>Nossas soluções prontas para uso</h2>
            <p className={styles.sectionSubtitle}>
              Sistemas, cursos, livros e mais — adquira com entrega digital imediata.
            </p>
          </div>
          <Link to="/produtos" className={styles.seeAll}>
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className={styles.grid3}>
            {[1, 2, 3].map(i => <Skeleton key={i} variant="card" />)}
          </div>
        ) : (
          <div className={styles.grid3}>
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
