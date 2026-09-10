// Barrel de exports — Biblioteca de Componentes TF Hub
// Importe SEMPRE daqui para manter consistência

// Primitives
export { default as Button }         from './Button/Button';
export { Input, Textarea, Select }   from './Input/Input';
export { default as Badge }          from './Badge/Badge';
export { default as Modal }          from './Modal/Modal';
export { default as ConfirmDialog }  from './ConfirmDialog/ConfirmDialog';
export { Skeleton, Spinner }         from './Skeleton/Skeleton';
export { ToastContainer, useToast }  from './Toast/Toast';

// Composites
export { default as Tabs }      from './Tabs/Tabs';
export { default as Accordion } from './Accordion/Accordion';

// Commercial Cards
export { default as ProductCard }                                from './ProductCard/ProductCard';
export { ServiceCard, PortfolioCard, ContentCard,
         TestimonialCard, StatCard }                            from './Cards/Cards';

// PWA Installation
export { default as PwaInstallPrompt }                           from './PwaInstallPrompt/PwaInstallPrompt';
