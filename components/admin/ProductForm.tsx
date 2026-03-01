'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Star, Trash2, Plus, GripVertical, Ruler, ChevronDown, X } from 'lucide-react';
import Link from 'next/link';

// ────────────────────────────── Types ──────────────────────────────

export type ProductImage = {
  id: string;
  file?: File;
  preview: string;
  src?: string;
  isCardImage: boolean;
};

type PriceGridRow = {
  id: string;
  diameter: number;
  priceBrasero: string;
  priceAcier: string;
  priceInox: string;
};

type ConfigImageEntry = { src: string; alt: string; file?: File; preview?: string };
type ConfigImagesMap = Record<string, ConfigImageEntry[]>;

type DiameterEntry = {
  price: string;
  priceBrasero: string;
  pricePlancha: string;
  weight: string;
  height: string;
  bowlThickness: string;
  baseThickness: string;
};

type SubFiche = {
  images: ConfigImageEntry[];
  description: string;
  price: string;
  priceBrasero: string;
  pricePlancha: string;
  faq: { question: string; answer: string }[];
  characteristics: { label: string; value: string }[];
  weight: string;
  height: string;
  bowlThickness: string;
  baseThickness: string;
  painting: string;
  enabledDiameters: number[];
  diameterData: Record<number, DiameterEntry>;
};

export type ProductFormData = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  price: string;
  comparePrice: string;
  hasPromotion: boolean;
  discountPercent: string;
  diameter: string;
  length: string;
  width: string;
  height: string;
  bowlThickness: string;
  baseThickness: string;
  material: string;
  weight: string;
  inStock: boolean;
  onDemand: boolean;
  isFeatured: boolean;
  featuredOrder: string;
  format: string;
  numberOfGuests: string;
  fuelType: string[];
  painting: string;
  planchaMaterial: '' | 'acier' | 'inox';
  compatibleAccessories: string[];
  imageScale: string;
  detailImageScale: string;
  detailImageOffsetX: string;
};

// ────────────────────────────── Constants ──────────────────────────────

const DIAMETER_OPTIONS = [50, 80, 100];
const PLANCHA_OPTIONS = [
  { label: 'Acier', value: 'acier' as const },
  { label: 'Inox', value: 'inox' as const },
];
const FORMAT_OPTIONS = [
  { label: 'Rond', value: 'rond' },
  { label: 'Hexagonal', value: 'hexagonal' },
  { label: 'Carré', value: 'carre' },
];

const emptyDiameterEntry = (): DiameterEntry => ({
  price: '', priceBrasero: '', pricePlancha: '', weight: '', height: '', bowlThickness: '', baseThickness: '',
});

const emptySubFiche = (): SubFiche => ({
  images: [],
  description: '',
  price: '',
  priceBrasero: '',
  pricePlancha: '',
  faq: [],
  characteristics: [],
  weight: '',
  height: '',
  bowlThickness: '',
  baseThickness: '',
  painting: '',
  enabledDiameters: [],
  diameterData: {},
});

const defaultFormData = (): ProductFormData => ({
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  category: 'brasero',
  price: '',
  comparePrice: '',
  hasPromotion: false,
  discountPercent: '',
  diameter: '',
  length: '',
  width: '',
  height: '',
  bowlThickness: '',
  baseThickness: '',
  material: 'corten',
  weight: '',
  inStock: true,
  onDemand: false,
  isFeatured: false,
  featuredOrder: '999',
  format: '',
  numberOfGuests: '',
  fuelType: [],
  painting: '',
  planchaMaterial: '',
  compatibleAccessories: [],
  imageScale: '100',
  detailImageScale: '100',
  detailImageOffsetX: '0',
});

// ────────────────────────────── Helpers ──────────────────────────────

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

async function uploadImage(file: File, slug: string, prefix = ''): Promise<string> {
  const sanitizedFileName = file.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
  const fileName = `${slug}${prefix}-${Date.now()}-${sanitizedFileName}`;

  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  uploadFormData.append('fileName', fileName);
  uploadFormData.append('bucket', 'products');

  const uploadResponse = await fetch('/api/admin/storage/upload', {
    method: 'POST',
    body: uploadFormData,
  });

  if (!uploadResponse.ok) {
    let errorMessage = `Erreur upload (${uploadResponse.status})`;
    try {
      const errorData = await uploadResponse.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      const text = await uploadResponse.text();
      if (text.toLowerCase().includes('request entity too large') || uploadResponse.status === 413) {
        errorMessage = 'Image trop volumineuse. Réduisez la taille (max ~4 Mo par image).';
      } else {
        errorMessage = text || errorMessage;
      }
    }
    throw new Error(errorMessage);
  }

  const { publicUrl } = await uploadResponse.json();
  return publicUrl;
}

// ────────────────────────────── Props ──────────────────────────────

export type ProductFormProps = {
  mode: 'create' | 'edit';
  /** Product ID, only for edit mode */
  productId?: string;
};

// ────────────────────────────── Component ──────────────────────────────

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const specsRef = useRef<Record<string, any>>({});

  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(mode === 'edit');
  const [availableProducts, setAvailableProducts] = useState<{id: string, name: string, slug: string, images: any[], category: string}[]>([]);
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData());
  const [images, setImages] = useState<ProductImage[]>([]);
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [accessoryDropdownOpen, setAccessoryDropdownOpen] = useState(false);
  const [characteristics, setCharacteristics] = useState<{label: string, value: string}[]>([]);
  const [priceGrid, setPriceGrid] = useState<PriceGridRow[]>([]);
  const availableFinishes = ['corten', 'peint'] as const;

  // --- Images de configuration (par combinaison finition × plancha) ---
  const CONFIG_KEYS = ['corten-inox', 'corten-acier', 'peint-inox', 'peint-acier'] as const;
  const CONFIG_LABELS: Record<string, string> = {
    'corten-inox': 'Corten + Plancha Inox',
    'corten-acier': 'Corten + Plancha Acier',
    'peint-inox': 'Acier Peint + Plancha Inox',
    'peint-acier': 'Acier Peint + Plancha Acier',
  };
  const [configImages, setConfigImages] = useState<ConfigImagesMap>({});
  const configFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [configurations, setConfigurations] = useState<Record<string, SubFiche>>({});
  const [openConfigKey, setOpenConfigKey] = useState<string | null>(null);
  const [variantDropdownOpen, setVariantDropdownOpen] = useState(false);
  const subFicheFileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Générer les clés de configuration
  const availableConfigKeys = useMemo(() => {
    const keys: { key: string; label: string }[] = [];
    if (formData.category === 'brasero') {
      for (const finish of availableFinishes) {
        for (const plancha of ['acier', 'inox'] as const) {
          const key = `${finish}-${plancha}`;
          const finishLabel = finish === 'corten' ? 'Corten' : 'Acier Peint';
          const planchaLabel = plancha === 'inox' ? 'Inox' : 'Acier';
          keys.push({ key, label: `${finishLabel} + Plancha ${planchaLabel}` });
        }
      }
    }
    return keys;
  }, [formData.category]);

  // ────────────────────────────── Load existing product (edit mode) ──────────────────────────────

  useEffect(() => {
    if (mode !== 'edit' || !productId) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products?id=${productId}&_t=${Date.now()}`);
        if (!response.ok) {
          const errorData = await response.json();
          setSubmitError(errorData.error || 'Produit non trouvé');
          setLoadingProduct(false);
          return;
        }
        const product = await response.json();

        if (!product) {
          setSubmitError('Produit non trouvé');
          setLoadingProduct(false);
          return;
        }

        const parsedSpecs =
          typeof product.specs === 'string'
            ? (() => { try { return JSON.parse(product.specs); } catch { return {}; } })()
            : product.specs || {};

        specsRef.current = parsedSpecs || {};

        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          shortDescription: product.shortDescription || product.short_description || '',
          description: product.description || '',
          category: product.category || 'brasero',
          price: product.price?.toString() || '',
          comparePrice: (product.comparePrice || product.compare_price)?.toString() || '',
          hasPromotion: !!(product.comparePrice || product.compare_price),
          discountPercent: (product.discountPercent || product.discount_percent)?.toString() || '',
          diameter: product.diameter?.toString() || '',
          length: product.length?.toString() || '',
          width: product.width?.toString() || '',
          height: product.height?.toString() || '',
          bowlThickness: (product.bowl_thickness ?? product.bowlThickness)?.toString() || '',
          baseThickness: (product.base_thickness ?? product.baseThickness)?.toString() || '',
          material: product.material || 'corten',
          weight: product.weight?.toString() || '',
          inStock: product.inStock ?? product.in_stock ?? true,
          onDemand: product.onDemand ?? product.on_demand ?? false,
          isFeatured: product.isFeatured ?? product.is_featured ?? false,
          featuredOrder: (product.featuredOrder ?? product.featured_order ?? 999).toString(),
          format: parsedSpecs?.format || product.format || '',
          painting: parsedSpecs?.painting || '',
          numberOfGuests: parsedSpecs?.numberOfGuests || '',
          fuelType: parsedSpecs?.fuelType || [],
          planchaMaterial: parsedSpecs?.planchaMaterial || '',
          compatibleAccessories: parsedSpecs?.compatibleAccessories || [],
          imageScale: parsedSpecs?.imageScale?.toString() || '100',
          detailImageScale: parsedSpecs?.detailImageScale?.toString() || '100',
          detailImageOffsetX: parsedSpecs?.detailImageOffsetX?.toString() || '0',
        });

        // Charger les caractéristiques existantes
        if (parsedSpecs?.characteristics && Array.isArray(parsedSpecs.characteristics)) {
          setCharacteristics(parsedSpecs.characteristics);
        }

        // Charger la grille de prix depuis les variantes existantes
        if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
          const gridMap = new Map<number, PriceGridRow>();
          for (const v of product.variants) {
            if (v.diameter) {
              if (!gridMap.has(v.diameter)) {
                gridMap.set(v.diameter, {
                  id: `grid-${v.diameter}-${Date.now()}`,
                  diameter: v.diameter,
                  priceBrasero: v.priceBrasero?.toString() || '',
                  priceAcier: '',
                  priceInox: '',
                });
              }
              const row = gridMap.get(v.diameter)!;
              if (!row.priceBrasero && v.priceBrasero) row.priceBrasero = v.priceBrasero.toString();
              if (v.planchaMaterial === 'acier') row.priceAcier = v.pricePlancha?.toString() || '';
              if (v.planchaMaterial === 'inox') row.priceInox = v.pricePlancha?.toString() || '';
            }
          }
          setPriceGrid(Array.from(gridMap.values()).sort((a, b) => a.diameter - b.diameter));
        }

        // Charger les images existantes
        if (product.images && Array.isArray(product.images)) {
          const cardImg = product.cardImage || product.card_image;
          const existingImages: ProductImage[] = product.images.map((img: any, index: number) => ({
            id: `existing-${index}`,
            preview: img.src,
            src: img.src,
            isCardImage: img.src === cardImg,
          }));
          setImages(existingImages);
        }

        // Charger les images de configuration existantes
        const rawConfigImages = product.config_images || product.configImages;
        if (rawConfigImages && typeof rawConfigImages === 'object') {
          const loaded: Record<string, ConfigImageEntry[]> = {};
          for (const [key, imgs] of Object.entries(rawConfigImages)) {
            if (Array.isArray(imgs)) {
              loaded[key] = (imgs as any[]).map((img: any) => ({
                src: img.src || '',
                alt: img.alt || '',
              }));
            }
          }
          setConfigImages(loaded);
        }

        // Charger les configurations (sous-fiches) existantes
        const rawConfigurations = product.configurations;
        if (rawConfigurations && typeof rawConfigurations === 'object') {
          const loadedConfigs: Record<string, SubFiche> = {};
          for (const [key, cfg] of Object.entries(rawConfigurations)) {
            const c = cfg as any;
            const enabledDiameters: number[] = [];
            const diameterData: Record<number, DiameterEntry> = {};
            if (c.diameters && typeof c.diameters === 'object') {
              for (const [dKey, dVal] of Object.entries(c.diameters)) {
                const d = parseInt(dKey);
                if (!isNaN(d)) {
                  enabledDiameters.push(d);
                  const dv = dVal as any;
                  diameterData[d] = {
                    price: dv.price?.toString() || '',
                    priceBrasero: dv.priceBrasero?.toString() || '',
                    pricePlancha: dv.pricePlancha?.toString() || '',
                    weight: dv.weight?.toString() || '',
                    height: dv.height?.toString() || '',
                    bowlThickness: dv.bowlThickness?.toString() || '',
                    baseThickness: dv.baseThickness?.toString() || '',
                  };
                }
              }
            }
            enabledDiameters.sort((a, b) => a - b);
            loadedConfigs[key] = {
              images: Array.isArray(c.images)
                ? c.images.map((img: any) => ({ src: img.src || '', alt: img.alt || '' }))
                : [],
              description: c.description || '',
              price: c.price?.toString() || '',
              priceBrasero: c.priceBrasero?.toString() || '',
              pricePlancha: c.pricePlancha?.toString() || '',
              faq: Array.isArray(c.faq) ? c.faq.map((f: any) => ({ question: f.question || '', answer: f.answer || '' })) : [],
              characteristics: Array.isArray(c.characteristics) ? c.characteristics.map((ch: any) => ({ label: ch.label || '', value: ch.value || '' })) : [],
              weight: c.weight?.toString() || '',
              height: c.height?.toString() || '',
              bowlThickness: c.bowlThickness?.toString() || '',
              baseThickness: c.baseThickness?.toString() || '',
              painting: c.painting || '',
              enabledDiameters,
              diameterData,
            };
          }
          setConfigurations(loadedConfigs);
        }

        setLoadingProduct(false);
      } catch (error: any) {
        console.error('Erreur chargement produit:', error);
        setSubmitError(`Erreur: ${error?.message || 'Erreur inconnue'}`);
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [mode, productId]);

  // ────────────────────────────── Handlers ──────────────────────────────

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      // Auto-generate slug only when creating
      ...(mode === 'create' ? { slug: generateSlug(name) } : {}),
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFuelTypeChange = (fuel: string) => {
    setFormData((prev) => ({
      ...prev,
      fuelType: prev.fuelType.includes(fuel)
        ? prev.fuelType.filter((f) => f !== fuel)
        : [...prev.fuelType, fuel],
    }));
  };

  const handlePlanchaMaterialChange = (value: '' | 'acier' | 'inox') => {
    setFormData((prev) => ({ ...prev, planchaMaterial: value }));
  };

  const handleAccessoryChange = (accessorySlug: string) => {
    setFormData((prev) => ({
      ...prev,
      compatibleAccessories: prev.compatibleAccessories.includes(accessorySlug)
        ? prev.compatibleAccessories.filter((a) => a !== accessorySlug)
        : [...prev.compatibleAccessories, accessorySlug],
    }));
  };

  const generateDefaultCharacteristics = () => {
    const materialLabels: Record<string, string> = {
      corten: 'Acier Corten', inox: 'Acier Inoxydable', acier: 'Acier', fonte: 'Fonte',
    };
    const formatLabels: Record<string, string> = {
      rond: 'Ronde', hexagonal: 'Hexagonale', carre: 'Carrée',
    };
    const chars: {label: string, value: string}[] = [
      { label: 'Marque', value: 'Atelier LBF' },
      { label: 'Type de combustible', value: formData.fuelType.length > 0 ? formData.fuelType.join(' / ') : 'Bois' },
    ];
    if (formData.diameter) {
      const parts: string[] = [];
      if (formData.length) parts.push(`L${formData.length}`);
      if (formData.width) parts.push(`l${formData.width}`);
      if (formData.height) parts.push(`H${formData.height}`);
      chars.push({ label: 'Dimensions', value: parts.length > 0 ? parts.join('x') + 'cm' : `Ø ${formData.diameter}cm` });
    }
    chars.push({ label: 'Matière', value: materialLabels[formData.material] || formData.material });
    if (formData.format) chars.push({ label: 'Forme de la plancha', value: formatLabels[formData.format] || formData.format });
    if (formData.diameter) chars.push({ label: 'Dimensions Plancha', value: `Ø ${formData.diameter}cm` });
    if (formData.bowlThickness) chars.push({ label: 'Épaisseur Plancha', value: `${formData.bowlThickness}mm` });
    if (formData.planchaMaterial) chars.push({ label: 'Matière de la plaque', value: formData.planchaMaterial === 'inox' ? 'Inox' : 'Acier carbone' });
    if (formData.numberOfGuests) chars.push({ label: 'Nombre de convives', value: formData.numberOfGuests });
    if (formData.weight) chars.push({ label: 'Poids', value: formData.weight });
    chars.push({ label: 'Type', value: 'Braseros' });
    setCharacteristics(chars);
  };

  const addCharacteristic = () => {
    setCharacteristics(prev => [...prev, { label: '', value: '' }]);
  };

  const removeCharacteristic = (index: number) => {
    setCharacteristics(prev => prev.filter((_, i) => i !== index));
  };

  const updateCharacteristic = (index: number, field: 'label' | 'value', val: string) => {
    setCharacteristics(prev => prev.map((c, i) => i === index ? { ...c, [field]: val } : c));
  };

  // Charger tous les produits disponibles
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/admin/products');
        if (response.ok) {
          const data = await response.json();
          if (mode === 'create') {
            // En création, filtrer uniquement braséros et accessoires
            const filtered = data.filter((p: any) => ['brasero', 'accessoire'].includes(p.category));
            setAvailableProducts(filtered);
          } else {
            setAvailableProducts(data);
          }
        }
      } catch (error) {
        console.error('Erreur chargement produits disponibles:', error);
      }
    };
    loadProducts();
  }, [mode]);

  // ────────────────────────────── Image handlers ──────────────────────────────

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: ProductImage[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      isCardImage: images.length === 0,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (prev.find((img) => img.id === id)?.isCardImage && filtered.length > 0) {
        filtered[0].isCardImage = true;
      }
      return filtered;
    });
  };

  const setAsCardImage = (id: string) => {
    setImages((prev) => prev.map((img) => ({ ...img, isCardImage: img.id === id })));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedImageId(id);
    e.dataTransfer.effectAllowed = 'move';
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedImageId(null);
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedImageId || draggedImageId === targetId) return;
    setImages((prev) => {
      const copy = [...prev];
      const fromIndex = copy.findIndex((img) => img.id === draggedImageId);
      const toIndex = copy.findIndex((img) => img.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
    setDraggedImageId(null);
  };

  // ────────────────────────────── Validation ──────────────────────────────

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.slug.trim()) newErrors.slug = 'Le slug est requis';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Le prix est requis';
    if (images.length === 0) newErrors.images = 'Au moins une image est requise';
    if (formData.hasPromotion && !formData.comparePrice) {
      newErrors.comparePrice = 'Le prix avant promo est requis';
    }
    if (formData.category === 'brasero' && !formData.diameter) {
      newErrors.diameter = 'Le diamètre est requis pour filtrer ce braséro';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ────────────────────────────── Submit ──────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;
    setLoading(true);

    try {
      // Upload images
      const uploadedImages: Array<{ src: string; alt: string; isCard: boolean }> = [];

      for (const image of images) {
        if (image.file) {
          const publicUrl = await uploadImage(image.file, formData.slug);
          uploadedImages.push({ src: publicUrl, alt: formData.name, isCard: image.isCardImage });
        } else if (image.src) {
          // Existing image (edit mode)
          uploadedImages.push({ src: image.src, alt: formData.name, isCard: image.isCardImage });
        }
      }

      // Discount
      let discountPercent = 0;
      if (formData.hasPromotion && formData.comparePrice && formData.price) {
        discountPercent = Math.round(
          ((parseFloat(formData.comparePrice) - parseFloat(formData.price)) /
            parseFloat(formData.comparePrice)) * 100
        );
      }

      // Build specs
      let specsPayload: Record<string, any>;
      if (mode === 'edit') {
        // Preserve unknown specs fields from DB
        specsPayload = { ...(specsRef.current || {}) };
        const specFields = ['format', 'painting', 'numberOfGuests', 'fuelType', 'planchaMaterial', 'compatibleAccessories', 'imageScale', 'detailImageScale', 'detailImageOffsetX'] as const;
        // For each field, set or delete
        if (formData.format) specsPayload.format = formData.format; else delete specsPayload.format;
        if (formData.painting) specsPayload.painting = formData.painting; else delete specsPayload.painting;
        if (formData.numberOfGuests) specsPayload.numberOfGuests = formData.numberOfGuests; else delete specsPayload.numberOfGuests;
        if (formData.fuelType.length > 0) specsPayload.fuelType = formData.fuelType; else delete specsPayload.fuelType;
        if (formData.planchaMaterial) specsPayload.planchaMaterial = formData.planchaMaterial; else delete specsPayload.planchaMaterial;
        if (formData.compatibleAccessories.length > 0) specsPayload.compatibleAccessories = formData.compatibleAccessories; else delete specsPayload.compatibleAccessories;
        if (formData.imageScale && formData.imageScale !== '100') specsPayload.imageScale = parseInt(formData.imageScale); else delete specsPayload.imageScale;
        if (formData.detailImageScale && formData.detailImageScale !== '100') specsPayload.detailImageScale = parseInt(formData.detailImageScale); else delete specsPayload.detailImageScale;
        if (formData.detailImageOffsetX && formData.detailImageOffsetX !== '0') specsPayload.detailImageOffsetX = parseInt(formData.detailImageOffsetX); else delete specsPayload.detailImageOffsetX;
        // Characteristics
        const validChars = characteristics.filter(c => c.label.trim() && c.value.trim());
        if (validChars.length > 0) specsPayload.characteristics = validChars; else delete specsPayload.characteristics;
        specsRef.current = specsPayload;
      } else {
        specsPayload = {};
        if (formData.format) specsPayload.format = formData.format;
        if (formData.numberOfGuests) specsPayload.numberOfGuests = formData.numberOfGuests;
        if (formData.fuelType.length > 0) specsPayload.fuelType = formData.fuelType;
        if (formData.painting) specsPayload.painting = formData.painting;
        if (formData.planchaMaterial) specsPayload.planchaMaterial = formData.planchaMaterial;
        if (formData.compatibleAccessories.length > 0) specsPayload.compatibleAccessories = formData.compatibleAccessories;
        if (formData.imageScale && formData.imageScale !== '100') specsPayload.imageScale = parseInt(formData.imageScale);
        if (formData.detailImageScale && formData.detailImageScale !== '100') specsPayload.detailImageScale = parseInt(formData.detailImageScale);
        if (formData.detailImageOffsetX && formData.detailImageOffsetX !== '0') specsPayload.detailImageOffsetX = parseInt(formData.detailImageOffsetX);
        const validChars = characteristics.filter(c => c.label.trim() && c.value.trim());
        if (validChars.length > 0) specsPayload.characteristics = validChars;
      }

      // Build product data
      const productData = {
        name: formData.name,
        slug: formData.slug,
        shortDescription: formData.shortDescription,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        comparePrice: formData.hasPromotion ? parseFloat(formData.comparePrice) : null,
        discountPercent: formData.hasPromotion ? discountPercent : null,
        diameter: formData.diameter ? parseInt(formData.diameter) : null,
        length: formData.length ? parseInt(formData.length) : null,
        width: formData.width ? parseInt(formData.width) : null,
        height: formData.height ? parseInt(formData.height) : null,
        bowlThickness: formData.bowlThickness ? parseFloat(formData.bowlThickness) : null,
        baseThickness: formData.baseThickness ? parseFloat(formData.baseThickness) : null,
        weight: formData.weight || null,
        material: formData.material,
        specs: Object.keys(specsPayload).length ? specsPayload : null,
        inStock: formData.inStock,
        on_demand: formData.onDemand,
        is_featured: formData.isFeatured,
        featured_order: parseInt(formData.featuredOrder),
        images: uploadedImages,
        cardImage: uploadedImages.find((img) => img.isCard)?.src || uploadedImages[0]?.src,
        variants: (() => {
          const result: any[] = [];
          for (const row of priceGrid) {
            const braseroPrice = row.priceBrasero.trim() ? parseFloat(row.priceBrasero) : 0;
            for (const finish of availableFinishes) {
              if (row.priceAcier.trim()) {
                const planchaPrice = parseFloat(row.priceAcier);
                const parts: string[] = [`Ø${row.diameter} cm`];
                parts.push(finish === 'corten' ? 'Corten' : 'Peint');
                parts.push('Plancha acier');
                result.push({ label: parts.join(' — '), diameter: row.diameter, finish, planchaMaterial: 'acier', priceBrasero: braseroPrice, pricePlancha: planchaPrice, price: braseroPrice + planchaPrice });
              }
              if (row.priceInox.trim()) {
                const planchaPrice = parseFloat(row.priceInox);
                const parts: string[] = [`Ø${row.diameter} cm`];
                parts.push(finish === 'corten' ? 'Corten' : 'Peint');
                parts.push('Plancha inox');
                result.push({ label: parts.join(' — '), diameter: row.diameter, finish, planchaMaterial: 'inox', priceBrasero: braseroPrice, pricePlancha: planchaPrice, price: braseroPrice + planchaPrice });
              }
            }
          }
          return result.length > 0 ? result : null;
        })(),
        configImages: await (async () => {
          const result: Record<string, { src: string; alt: string; width: number; height: number; blurDataURL: string }[]> = {};
          for (const [key, entries] of Object.entries(configImages)) {
            if (!entries || entries.length === 0) continue;
            const uploadedEntries: { src: string; alt: string; width: number; height: number; blurDataURL: string }[] = [];
            for (const entry of entries) {
              if ((entry as any).file) {
                const file = (entry as any).file as File;
                const publicUrl = await uploadImage(file, formData.slug, `-config-${key}`);
                uploadedEntries.push({ src: publicUrl, alt: entry.alt || formData.name, width: 800, height: 800, blurDataURL: '' });
              } else if (entry.src) {
                uploadedEntries.push({ src: entry.src, alt: entry.alt || formData.name, width: 800, height: 800, blurDataURL: '' });
              }
            }
            if (uploadedEntries.length > 0) result[key] = uploadedEntries;
          }
          return Object.keys(result).length > 0 ? result : null;
        })(),
        configurations: await (async () => {
          const result: Record<string, any> = {};
          for (const [key, sf] of Object.entries(configurations)) {
            const hasAnyData = sf.description || sf.price || sf.priceBrasero || sf.pricePlancha || sf.images.length > 0 || sf.faq.length > 0 || sf.characteristics.length > 0 || sf.weight || sf.height || sf.bowlThickness || sf.baseThickness || sf.painting || sf.enabledDiameters.length > 0;
            if (!hasAnyData) continue;

            const sfUploadedImages: { src: string; alt: string; width: number; height: number; blurDataURL: string }[] = [];
            for (const img of sf.images) {
              if ((img as any).file) {
                const file = (img as any).file as File;
                const publicUrl = await uploadImage(file, formData.slug, `-sf-${key}`);
                sfUploadedImages.push({ src: publicUrl, alt: img.alt || formData.name, width: 800, height: 800, blurDataURL: '' });
              } else if (img.src) {
                sfUploadedImages.push({ src: img.src, alt: img.alt || formData.name, width: 800, height: 800, blurDataURL: '' });
              }
            }

            const diametersData: Record<string, any> = {};
            for (const d of sf.enabledDiameters) {
              const dd = sf.diameterData[d];
              if (dd) {
                const entry: Record<string, any> = {};
                if (dd.price) entry.price = parseFloat(dd.price);
                if (dd.priceBrasero) entry.priceBrasero = parseFloat(dd.priceBrasero);
                if (dd.pricePlancha) entry.pricePlancha = parseFloat(dd.pricePlancha);
                if (dd.weight) entry.weight = dd.weight;
                if (dd.height) entry.height = parseFloat(dd.height);
                if (dd.bowlThickness) entry.bowlThickness = parseFloat(dd.bowlThickness);
                if (dd.baseThickness) entry.baseThickness = parseFloat(dd.baseThickness);
                if (Object.keys(entry).length > 0) diametersData[String(d)] = entry;
              }
            }

            result[key] = {
              ...(sfUploadedImages.length > 0 && { images: sfUploadedImages }),
              ...(sf.description && { description: sf.description }),
              ...(sf.price && { price: parseFloat(sf.price) }),
              ...(sf.priceBrasero && { priceBrasero: parseFloat(sf.priceBrasero) }),
              ...(sf.pricePlancha && { pricePlancha: parseFloat(sf.pricePlancha) }),
              ...(sf.faq.length > 0 && { faq: sf.faq.filter(f => f.question && f.answer) }),
              ...(sf.characteristics.length > 0 && { characteristics: sf.characteristics.filter(c => c.label && c.value) }),
              ...(sf.weight && { weight: sf.weight }),
              ...(sf.height && { height: sf.height }),
              ...(sf.bowlThickness && { bowlThickness: sf.bowlThickness }),
              ...(sf.baseThickness && { baseThickness: sf.baseThickness }),
              ...(sf.painting && { painting: sf.painting }),
              ...(Object.keys(diametersData).length > 0 && { diameters: diametersData }),
            };
          }
          return Object.keys(result).length > 0 ? result : null;
        })(),
      };

      // API call
      const url = mode === 'edit' ? `/api/admin/products?id=${productId}` : '/api/admin/products';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        let errorMessage = `Erreur serveur (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          const text = await response.text();
          if (text.toLowerCase().includes('request entity too large') || response.status === 413) {
            errorMessage = 'Données trop volumineuses. Réduisez la taille des images.';
          } else {
            errorMessage = text || errorMessage;
          }
        }
        setSubmitError(`Erreur base de données: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      router.push('/admin/produits');
    } catch (error: any) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} product:`, error);
      if (!submitError) {
        setSubmitError(`Erreur: ${error?.message || 'Erreur inconnue'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────── Render ──────────────────────────────

  if (loadingProduct) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  const isCreate = mode === 'create';

  return (
    <div className={`p-4 sm:p-6 lg:p-8 ${formData.category === 'brasero' && availableConfigKeys.length > 0 ? 'max-w-[1400px]' : 'max-w-4xl'}`}>
      <div className="mb-6 sm:mb-8">
        <Link
          href="/admin/produits"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour aux produits
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {isCreate ? 'Ajouter un produit' : 'Modifier le produit'}
        </h1>
        <p className="text-slate-600 mt-1">
          {isCreate ? 'Remplissez les informations du nouveau produit' : 'Modifiez les informations du produit'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={`${formData.category === 'brasero' && availableConfigKeys.length > 0 ? 'grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 items-start' : 'space-y-8'}`}>
        {/* ═══ Colonne gauche : formulaire principal ═══ */}
        <div className="space-y-8">
        {/* Affichage de l'erreur */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            <p className="font-semibold">Erreur :</p>
            <p className="mt-1">{submitError}</p>
          </div>
        )}

        {/* Informations de base */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Informations générales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nom du produit *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                  errors.name ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder={isCreate ? 'Atelier LBF en Acier Ø60' : undefined}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Slug (URL) *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                  errors.slug ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder={isCreate ? 'brasero-atelier-lbf-60' : undefined}
              />
              {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description courte
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder={isCreate ? 'La pièce maîtresse pour les grandes tablées en extérieur.' : undefined}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description complète
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder={isCreate ? 'Description détaillée du produit...' : undefined}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Catégorie *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="brasero">Braséro</option>
                <option value="accessoire">Accessoire</option>
                <option value="range-buches">Range bûches</option>
                <option value="fendeur">Fendeur à bûches</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Matière *
              </label>
              <select
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {(formData.category === 'accessoire' || formData.category === 'range-buches') ? (
                  <>
                    <option value="acier">Acier</option>
                    <option value="inox">Acier inoxydable</option>
                    <option value="bois">Bois</option>
                  </>
                ) : (
                  <>
                    <option value="corten">Braséro Corten</option>
                    <option value="acier">Braséro Acier</option>
                    <option value="inox">Braséro Inox</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Images du produit</h2>
          <p className="text-sm text-slate-600 mb-4">
            {isCreate ? "Ajoutez plusieurs images. Glissez-déposez pour changer l'ordre." : "Glissez-déposez les images pour changer l'ordre."} L&apos;image avec l&apos;étoile ⭐ sera affichée sur la carte produit.
          </p>

          {errors.images && (
            <p className="text-red-500 text-sm mb-4">{errors.images}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={(e) => handleDragStart(e, image.id)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, image.id)}
                className={`relative aspect-square rounded-lg border-2 overflow-hidden group cursor-grab active:cursor-grabbing transition-all ${
                  image.isCardImage ? 'border-green-500' : 'border-slate-200'
                } ${draggedImageId && draggedImageId !== image.id ? 'border-dashed border-blue-400' : ''}`}
              >
                <img
                  src={image.preview}
                  alt="Preview"
                  className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAsCardImage(image.id)}
                    className={`p-2 rounded-full ${
                      image.isCardImage ? 'bg-green-500 text-white' : 'bg-white text-slate-900'
                    }`}
                    title="Définir comme image de carte"
                  >
                    <Star size={16} fill={image.isCardImage ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="p-2 rounded-full bg-red-500 text-white"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {image.isCardImage && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Carte
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-slate-400 hover:text-slate-600 transition"
            >
              <Upload size={24} />
              <span className="text-sm">Ajouter</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Réglage du zoom de l'image */}
          <div className="mt-6 pt-6 border-t border-slate-200 space-y-6">
            <h3 className="text-md font-semibold text-slate-800">Réglages d&apos;affichage des images</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                🃏 Zoom sur la carte produit ({formData.imageScale}%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="imageScale"
                  min="80"
                  max="180"
                  step="5"
                  value={formData.imageScale}
                  onChange={handleInputChange}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-slate-600 w-16 text-right">{formData.imageScale}%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Zoom de l&apos;image sur les cartes du catalogue. 100% = taille normale.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                🔍 Zoom sur la page détail ({formData.detailImageScale}%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="detailImageScale"
                  min="80"
                  max="180"
                  step="5"
                  value={formData.detailImageScale}
                  onChange={handleInputChange}
                  className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-slate-600 w-16 text-right">{formData.detailImageScale}%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Zoom de l&apos;image sur la page de détail du produit.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ↔️ Position horizontale ({formData.detailImageOffsetX > '0' ? '+' : ''}{formData.detailImageOffsetX}%)
              </label>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500">Gauche</span>
                <input
                  type="range"
                  name="detailImageOffsetX"
                  min="-50"
                  max="50"
                  step="5"
                  value={formData.detailImageOffsetX}
                  onChange={handleInputChange}
                  className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-slate-500">Droite</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Décale l&apos;image à gauche ou à droite sur la page de détail. 0 = centré.
              </p>
            </div>
          </div>
        </div>

        {/* Prix et promotion */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Prix et promotion</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Prix de vente (€) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                  errors.price ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder={isCreate ? '890' : undefined}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="hasPromotion"
                  checked={formData.hasPromotion}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-slate-700">Ce produit est en promotion</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="onDemand"
                  checked={formData.onDemand}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Ce produit est sur demande</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-slate-700">Produit vedette (page d&apos;accueil)</span>
              </label>
            </div>

            {formData.isFeatured && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ordre d&apos;affichage (1 à 4)
                </label>
                <input
                  type="number"
                  name="featuredOrder"
                  value={formData.featuredOrder}
                  onChange={handleInputChange}
                  min="1"
                  max="4"
                  step="1"
                  placeholder="1 = premier, 2 = deuxième, etc."
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <p className="text-xs text-slate-500 mt-1">Choisir entre 1 (premier) et 4 (quatrième)</p>
              </div>
            )}

            {formData.hasPromotion && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Prix avant promotion (€) *
                  </label>
                  <input
                    type="number"
                    name="comparePrice"
                    value={formData.comparePrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                      errors.comparePrice ? 'border-red-500' : 'border-slate-200'
                    }`}
                    placeholder={isCreate ? '990' : undefined}
                  />
                  {errors.comparePrice && (
                    <p className="text-red-500 text-sm mt-1">{errors.comparePrice}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Réduction calculée
                  </label>
                  <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 font-semibold">
                    {formData.comparePrice && formData.price
                      ? `-${Math.round(
                          ((parseFloat(formData.comparePrice) - parseFloat(formData.price)) /
                            parseFloat(formData.comparePrice)) *
                            100
                        )}%`
                      : '0%'}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Grille de prix par diamètre */}
        {(formData.category === 'brasero' || formData.category === 'fendeur') && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">Grille de prix</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  const usedDiams = new Set(priceGrid.map(r => r.diameter));
                  const next = DIAMETER_OPTIONS.find(d => !usedDiams.has(d));
                  if (!next) return;
                  setPriceGrid(prev => [...prev, {
                    id: `grid-${next}-${Date.now()}`,
                    diameter: next,
                    priceBrasero: '',
                    priceAcier: '',
                    priceInox: '',
                  }]);
                }}
                disabled={priceGrid.length >= DIAMETER_OPTIONS.length}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                Ajouter un diamètre
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Le prix total = prix du brasero + prix de la plancha choisie.
            </p>

            {priceGrid.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Ruler className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune grille — le prix du produit sera utilisé tel quel.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {priceGrid.map((row) => {
                  const updateRow = (field: string, value: any) => {
                    setPriceGrid(prev => prev.map(r => r.id === row.id ? { ...r, [field]: value } : r));
                  };
                  const brasero = parseFloat(row.priceBrasero) || 0;
                  const acier = parseFloat(row.priceAcier) || 0;
                  const inox = parseFloat(row.priceInox) || 0;
                  return (
                    <div key={row.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <select
                          value={row.diameter}
                          onChange={(e) => updateRow('diameter', parseInt(e.target.value))}
                          className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                        >
                          {DIAMETER_OPTIONS.map(d => (
                            <option key={d} value={d}>Ø{d} cm</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setPriceGrid(prev => prev.filter(r => r.id !== row.id))}
                          className="text-red-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Brasero (€)</label>
                          <input type="number" value={row.priceBrasero} onChange={(e) => updateRow('priceBrasero', e.target.value)} placeholder="1200" min="0" step="0.01" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Plancha acier (€)</label>
                          <input type="number" value={row.priceAcier} onChange={(e) => updateRow('priceAcier', e.target.value)} placeholder="200" min="0" step="0.01" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Plancha inox (€)</label>
                          <input type="number" value={row.priceInox} onChange={(e) => updateRow('priceInox', e.target.value)} placeholder="350" min="0" step="0.01" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900" />
                        </div>
                      </div>
                      {brasero > 0 && (acier > 0 || inox > 0) && (
                        <div className="mt-2 text-xs text-slate-400">
                          {acier > 0 && <span>Total acier : {(brasero + acier).toFixed(0)} €</span>}
                          {acier > 0 && inox > 0 && <span className="mx-2">·</span>}
                          {inox > 0 && <span>Total inox : {(brasero + inox).toFixed(0)} €</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Dimensions et caractéristiques */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Dimensions et caractéristiques</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formData.category !== 'accessoire' && formData.category !== 'range-buches' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Diamètre (cm) {formData.category === 'brasero' && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    name="diameter"
                    value={formData.diameter}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                      errors.diameter ? 'border-red-500' : 'border-slate-200'
                    }`}
                  >
                    <option value="">Sélectionnez un diamètre</option>
                    {DIAMETER_OPTIONS.map((size) => (
                      <option key={size} value={size}>Ø {size} cm</option>
                    ))}
                  </select>
                  {errors.diameter && <p className="text-red-500 text-sm mt-1">{errors.diameter}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Forme du braséro
                  </label>
                  <select
                    name="format"
                    value={formData.format}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  >
                    <option value="">Sélectionnez une forme</option>
                    {FORMAT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Longueur (cm)</label>
              <input type="number" name="length" value={formData.length} onChange={handleInputChange} min="0" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder={isCreate ? '60' : undefined} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Largeur (cm)</label>
              <input type="number" name="width" value={formData.width} onChange={handleInputChange} min="0" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder={isCreate ? '60' : undefined} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hauteur (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleInputChange} min="0" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder={isCreate ? '30' : undefined} />
            </div>

            {formData.category !== 'accessoire' && formData.category !== 'range-buches' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Épaisseur du bol (mm)</label>
                  <input type="number" name="bowlThickness" value={formData.bowlThickness} onChange={handleInputChange} min="0" step="0.1" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder={isCreate ? '3' : undefined} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Épaisseur du socle (mm)</label>
                  <input type="number" name="baseThickness" value={formData.baseThickness} onChange={handleInputChange} min="0" step="0.1" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder={isCreate ? '5' : undefined} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Poids</label>
                  <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="25 kg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Peinture</label>
                  <input type="text" name="painting" value={formData.painting} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Noir mat, Thermolaqué, etc." />
                </div>
              </>
            )}

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleInputChange} className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500" />
                <span className="text-sm font-medium text-slate-700">En stock</span>
              </label>
            </div>
          </div>
        </div>

        {/* Informations spécifiques aux braséros */}
        {formData.category === 'brasero' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Informations spécifiques au braséro</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de convives</label>
                <input type="text" name="numberOfGuests" value={formData.numberOfGuests} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="6 à 8 personnes" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Type de combustibles</label>
                <div className="space-y-2">
                  {['Bois', 'Charbon', 'Pellets'].map((fuel) => (
                    <label key={fuel} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={formData.fuelType.includes(fuel)} onChange={() => handleFuelTypeChange(fuel)} className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500" />
                      <span className="text-sm text-slate-700">{fuel}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Matière de la plancha */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">Matière de la plancha</label>
              <p className="text-xs text-slate-500 mb-2">Choisissez la matière de la plancha compatible avec ce braséro. La FAQ s&apos;adaptera automatiquement.</p>
              <div className="flex gap-3">
                {[
                  { value: '' as '' | 'acier' | 'inox', label: 'Non défini' },
                  { value: 'acier' as '' | 'acier' | 'inox', label: 'Plancha Acier' },
                  { value: 'inox' as '' | 'acier' | 'inox', label: 'Plancha Inox' },
                ].map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => handlePlanchaMaterialChange(option.value)}
                    className={`px-4 py-2 rounded-lg border cursor-pointer transition text-sm font-medium ${
                      formData.planchaMaterial === option.value
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Produits compatibles (brasero) */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                {isCreate ? 'Accessoires compatibles' : 'Produits compatibles'}
              </label>
              
              {formData.compatibleAccessories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.compatibleAccessories.map((slug) => {
                    const product = availableProducts.find(a => a.slug === slug);
                    const imageUrl = product?.images?.[0]?.src || '/logo/placeholder.png';
                    const displayName = product?.name || slug;
                    return (
                      <div key={slug} className="flex items-center gap-2 bg-green-50 border border-green-300 rounded-lg px-3 py-2">
                        <img src={imageUrl} alt={displayName} className="w-8 h-8 object-contain rounded" />
                        <span className="text-sm font-medium text-green-800">{displayName}</span>
                        <button type="button" onClick={() => handleAccessoryChange(slug)} className="text-green-600 hover:text-red-600 ml-1">✕</button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccessoryDropdownOpen(!accessoryDropdownOpen)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-left flex items-center justify-between hover:border-slate-300 transition"
                >
                  <span className="text-slate-600">
                    {formData.compatibleAccessories.length === 0 
                      ? 'Sélectionner des accessoires...' 
                      : `${formData.compatibleAccessories.length} ${isCreate ? 'produit(s)' : 'accessoire(s)'} sélectionné(s)`}
                  </span>
                  <svg className={`w-5 h-5 text-slate-400 transition-transform ${accessoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {accessoryDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    {availableProducts.filter(p => p.category === 'accessoire').length === 0 ? (
                      <p className="p-4 text-sm text-slate-500">Aucun accessoire disponible</p>
                    ) : (
                      availableProducts
                        .filter(p => p.category === 'accessoire')
                        .map((product) => {
                          const imageUrl = product.images?.[0]?.src || '/logo/placeholder.png';
                          const isSelected = formData.compatibleAccessories.includes(product.slug);
                          return (
                            <button
                              key={product.slug}
                              type="button"
                              onClick={() => handleAccessoryChange(product.slug)}
                              className={`w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition border-b border-slate-100 last:border-b-0 ${isSelected ? 'bg-green-50' : ''}`}
                            >
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <img src={imageUrl} alt={product.name} className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-white p-1" />
                              <span className={`text-sm font-medium ${isSelected ? 'text-green-700' : 'text-slate-700'}`}>{product.name}</span>
                            </button>
                          );
                        })
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Produits compatibles pour accessoires / range-buches */}
        {(formData.category === 'accessoire' || formData.category === 'range-buches') && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Produits compatibles</h2>
            {!isCreate && (
              <p className="text-sm text-slate-600 mb-4">
                Sélectionnez les braséros ou autres accessoires compatibles avec cet accessoire.
              </p>
            )}

            {formData.compatibleAccessories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.compatibleAccessories.map((slug) => {
                  const product = availableProducts.find(a => a.slug === slug);
                  const imageUrl = product?.images?.[0]?.src || '/logo/placeholder.png';
                  const displayName = product?.name || slug;
                  const displayCategory = product?.category || 'produit';
                  return (
                    <div key={slug} className="flex items-center gap-2 bg-green-50 border border-green-300 rounded-lg px-3 py-2">
                      <img src={imageUrl} alt={displayName} className="w-8 h-8 object-contain rounded" />
                      <span className={`text-xs uppercase ${isCreate ? 'text-green-600 font-semibold' : 'text-slate-500'}`}>{displayCategory}</span>
                      <span className="text-sm font-medium text-green-800">{displayName}</span>
                      <button type="button" onClick={() => handleAccessoryChange(slug)} className="text-green-600 hover:text-red-600 ml-1">✕</button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setAccessoryDropdownOpen(!accessoryDropdownOpen)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-left flex items-center justify-between hover:border-slate-300 transition"
              >
                <span className="text-slate-600">
                  {formData.compatibleAccessories.length === 0 
                    ? 'Sélectionner des produits compatibles...' 
                    : `${formData.compatibleAccessories.length} produit(s) sélectionné(s)`}
                </span>
                <svg className={`w-5 h-5 text-slate-400 transition-transform ${accessoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {accessoryDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  {isCreate ? (
                    // Mode création: affichage groupé par catégorie
                    availableProducts.length === 0 ? (
                      <p className="p-4 text-sm text-slate-500">Aucun produit disponible</p>
                    ) : (
                      <>
                        <div className="px-4 py-2 bg-slate-100 text-xs font-semibold text-slate-600 uppercase">Braséros</div>
                        {availableProducts.filter(p => p.category === 'brasero').map((product) => {
                          const imageUrl = product.images?.[0]?.src || '/logo/placeholder.png';
                          const isSelected = formData.compatibleAccessories.includes(product.slug);
                          return (
                            <button key={product.slug} type="button" onClick={() => handleAccessoryChange(product.slug)} className={`w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition border-b border-slate-100 ${isSelected ? 'bg-green-50' : ''}`}>
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                                {isSelected && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                              </div>
                              <img src={imageUrl} alt={product.name} className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-white p-1" />
                              <span className={`text-sm font-medium ${isSelected ? 'text-green-700' : 'text-slate-700'}`}>{product.name}</span>
                            </button>
                          );
                        })}
                        <div className="px-4 py-2 bg-slate-100 text-xs font-semibold text-slate-600 uppercase">Accessoires</div>
                        {availableProducts.filter(p => p.category === 'accessoire').map((product) => {
                          const imageUrl = product.images?.[0]?.src || '/logo/placeholder.png';
                          const isSelected = formData.compatibleAccessories.includes(product.slug);
                          return (
                            <button key={product.slug} type="button" onClick={() => handleAccessoryChange(product.slug)} className={`w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition border-b border-slate-100 last:border-b-0 ${isSelected ? 'bg-green-50' : ''}`}>
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                                {isSelected && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                              </div>
                              <img src={imageUrl} alt={product.name} className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-white p-1" />
                              <span className={`text-sm font-medium ${isSelected ? 'text-green-700' : 'text-slate-700'}`}>{product.name}</span>
                            </button>
                          );
                        })}
                      </>
                    )
                  ) : (
                    // Mode édition: liste plate excluant le produit actuel
                    availableProducts.filter(p => p.slug !== formData.slug).length === 0 ? (
                      <p className="p-4 text-sm text-slate-500">Aucun produit disponible</p>
                    ) : (
                      availableProducts.filter(p => p.slug !== formData.slug).map((product) => {
                        const imageUrl = product.images?.[0]?.src || '/logo/placeholder.png';
                        const isSelected = formData.compatibleAccessories.includes(product.slug);
                        return (
                          <button key={product.slug} type="button" onClick={() => handleAccessoryChange(product.slug)} className={`w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition border-b border-slate-100 last:border-b-0 ${isSelected ? 'bg-green-50' : ''}`}>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                              {isSelected && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <img src={imageUrl} alt={product.name} className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-white p-1" />
                            <div className="flex flex-col items-start">
                              <span className="text-xs text-slate-400 uppercase">{product.category}</span>
                              <span className={`text-sm font-medium ${isSelected ? 'text-green-700' : 'text-slate-700'}`}>{product.name}</span>
                            </div>
                          </button>
                        );
                      })
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tableau des caractéristiques */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Tableau des caractéristiques</h2>
              <p className="text-xs text-slate-500 mt-1">Ce tableau sera affiché sur la fiche produit, juste au-dessus de la FAQ.</p>
            </div>
            <div className="flex gap-2">
              {formData.category === 'brasero' && (
                <button type="button" onClick={generateDefaultCharacteristics} className="px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition">
                  Pré-remplir (brasero)
                </button>
              )}
              <button type="button" onClick={addCharacteristic} className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>
          </div>

          {characteristics.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
              <GripVertical className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Aucune caractéristique définie</p>
              <p className="text-xs text-slate-400 mt-1">
                {formData.category === 'brasero' 
                  ? 'Cliquez sur "Pré-remplir" pour générer automatiquement ou ajoutez manuellement.'
                  : 'Cliquez sur "Ajouter" pour définir les caractéristiques.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_1.2fr_40px] gap-3 px-2 pb-1">
                <span className="text-xs font-semibold text-slate-500 uppercase">Label</span>
                <span className="text-xs font-semibold text-slate-500 uppercase">Valeur</span>
                <span></span>
              </div>
              {characteristics.map((char, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-[1fr_1.2fr_40px] gap-3 items-center px-2 py-2 rounded-lg ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                >
                  <input type="text" value={char.label} onChange={(e) => updateCharacteristic(index, 'label', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium" placeholder="Ex: Matière" />
                  <input type="text" value={char.value} onChange={(e) => updateCharacteristic(index, 'value', e.target.value)} className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Ex: Acier Corten" />
                  <button type="button" onClick={() => removeCharacteristic(index)} className="p-1.5 text-slate-400 hover:text-red-500 transition rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/produits" className="px-6 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition">
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {isCreate ? 'Création...' : 'Enregistrement...'}
              </>
            ) : (
              isCreate ? 'Créer le produit' : 'Enregistrer les modifications'
            )}
          </button>
        </div>
        </div>{/* fin colonne gauche */}

        {/* ═══ Colonne droite : Panneau sous-fiches variantes ═══ */}
        {formData.category === 'brasero' && availableConfigKeys.length > 0 && (
          <div className="xl:sticky xl:top-6 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      📋 Sous-fiches variantes
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">{availableConfigKeys.length} configuration{availableConfigKeys.length > 1 ? 's' : ''} disponible{availableConfigKeys.length > 1 ? 's' : ''}</p>
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setVariantDropdownOpen(!variantDropdownOpen)}
                      className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
                      title="Ouvrir une variante"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    {variantDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1">
                        <div className="px-3 py-2 border-b border-slate-100">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sélectionner une variante</span>
                        </div>
                        {availableConfigKeys.map(({ key, label }) => {
                          const sf = configurations[key];
                          const hasData = sf && (sf.description || sf.enabledDiameters.length > 0 || sf.images.length > 0 || sf.faq.length > 0 || sf.characteristics.length > 0);
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => { setOpenConfigKey(key); setVariantDropdownOpen(false); }}
                              className={`w-full text-left px-3 py-2.5 text-sm hover:bg-slate-50 transition flex items-center justify-between gap-2 ${openConfigKey === key ? 'bg-slate-50 font-semibold' : ''}`}
                            >
                              <span className="text-slate-700">{label}</span>
                              {hasData && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-700">✓</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {availableConfigKeys.map(({ key, label }) => {
                    const sf = configurations[key];
                    const hasData = sf && (sf.description || sf.enabledDiameters.length > 0 || sf.images.length > 0 || sf.faq.length > 0 || sf.characteristics.length > 0);
                    const isActive = openConfigKey === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setOpenConfigKey(isActive ? null : key)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition border ${
                          isActive
                            ? 'bg-slate-900 text-white border-slate-900'
                            : hasData
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {label.replace(' + Plancha ', ' · ').replace(' — ', ' ')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {openConfigKey && (() => {
                const activeLabel = availableConfigKeys.find(k => k.key === openConfigKey)?.label || openConfigKey;
                const sf = configurations[openConfigKey] || emptySubFiche();
                const updateSubFiche = (field: keyof SubFiche, value: any) => {
                  setConfigurations(prev => ({
                    ...prev,
                    [openConfigKey]: { ...(prev[openConfigKey] || emptySubFiche()), [field]: value },
                  }));
                };

                return (
                  <div className="p-4 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800">{activeLabel}</h3>
                      <button type="button" onClick={() => setOpenConfigKey(null)} className="p-1 text-slate-400 hover:text-slate-600 transition">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Images */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Images du produit</label>
                      {sf.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {sf.images.map((img, idx) => (
                            <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 group">
                              <img src={(img as any).preview || img.src} alt={img.alt} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => updateSubFiche('images', sf.images.filter((_, i) => i !== idx))} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                <Trash2 className="w-3.5 h-3.5 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <button type="button" onClick={() => subFicheFileInputRefs.current[openConfigKey]?.click()} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-xs text-slate-500 hover:border-slate-400 hover:text-slate-600 transition flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />Ajouter des images
                      </button>
                      <input
                        ref={(el) => { subFicheFileInputRefs.current[openConfigKey] = el; }}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (!files) return;
                          const newEntries: ConfigImageEntry[] = Array.from(files).map((file) => ({
                            src: '',
                            alt: `${formData.name} - ${activeLabel}`,
                            file,
                            preview: URL.createObjectURL(file),
                          }));
                          updateSubFiche('images', [...sf.images, ...newEntries]);
                          e.target.value = '';
                        }}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                      <textarea value={sf.description} onChange={(e) => updateSubFiche('description', e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Description spécifique à cette variante…" />
                    </div>

                    {/* Diamètres */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Diamètres disponibles</label>
                      <div className="flex gap-2 mb-3">
                        {DIAMETER_OPTIONS.map((d) => {
                          const isEnabled = sf.enabledDiameters.includes(d);
                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                const newDiameters = isEnabled
                                  ? sf.enabledDiameters.filter(x => x !== d)
                                  : [...sf.enabledDiameters, d].sort((a, b) => a - b);
                                updateSubFiche('enabledDiameters', newDiameters);
                                if (!isEnabled && !sf.diameterData[d]) {
                                  updateSubFiche('diameterData', { ...sf.diameterData, [d]: emptyDiameterEntry() });
                                }
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                                isEnabled ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
                              }`}
                            >
                              Ø{d} cm
                            </button>
                          );
                        })}
                      </div>

                      {sf.enabledDiameters.length > 0 && (
                        <div className="space-y-3">
                          {sf.enabledDiameters.map((d) => {
                            const dd = sf.diameterData[d] || emptyDiameterEntry();
                            const updateDiam = (field: keyof DiameterEntry, value: string) => {
                              setConfigurations(prev => {
                                const current = prev[openConfigKey] || emptySubFiche();
                                return {
                                  ...prev,
                                  [openConfigKey]: {
                                    ...current,
                                    diameterData: {
                                      ...current.diameterData,
                                      [d]: { ...(current.diameterData[d] || emptyDiameterEntry()), [field]: value },
                                    },
                                  },
                                };
                              });
                            };
                            return (
                              <div key={d} className="bg-slate-50 rounded-xl p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-700">⌀ {d} cm</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1.5">
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Prix total €</label>
                                    <input type="number" step="0.01" value={dd.price} onChange={(e) => updateDiam('price', e.target.value)} className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="1290" />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Brasero €</label>
                                    <input type="number" step="0.01" value={dd.priceBrasero} onChange={(e) => updateDiam('priceBrasero', e.target.value)} className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="890" />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Plancha €</label>
                                    <input type="number" step="0.01" value={dd.pricePlancha} onChange={(e) => updateDiam('pricePlancha', e.target.value)} className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="400" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Poids</label>
                                    <input type="text" value={dd.weight} onChange={(e) => updateDiam('weight', e.target.value)} className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="45 kg" />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Hauteur cm</label>
                                    <input type="text" value={dd.height} onChange={(e) => updateDiam('height', e.target.value)} className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="50" />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Ép. cuve mm</label>
                                    <input type="text" value={dd.bowlThickness} onChange={(e) => updateDiam('bowlThickness', e.target.value)} className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="3" />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">Ép. socle mm</label>
                                    <input type="text" value={dd.baseThickness} onChange={(e) => updateDiam('baseThickness', e.target.value)} className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="3" />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {sf.enabledDiameters.length === 0 && (
                        <p className="text-[11px] text-slate-400 italic">Cochez un ou plusieurs diamètres pour définir les prix et dimensions.</p>
                      )}
                    </div>

                    {/* Informations spécifiques */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Informations spécifiques</label>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-0.5">Peinture / Finition</label>
                        <input type="text" value={sf.painting} onChange={(e) => updateSubFiche('painting', e.target.value)} className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Peinture haute température noire mate" />
                      </div>
                    </div>

                    {/* FAQ */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">FAQ</label>
                        <button type="button" onClick={() => updateSubFiche('faq', [...sf.faq, { question: '', answer: '' }])} className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Ajouter
                        </button>
                      </div>
                      {sf.faq.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">FAQ par défaut du produit utilisée.</p>
                      ) : (
                        <div className="space-y-2">
                          {sf.faq.map((faqItem, fIdx) => (
                            <div key={fIdx} className="bg-slate-50 rounded-lg p-2.5 space-y-1.5">
                              <div className="flex items-start gap-1.5">
                                <input type="text" value={faqItem.question} onChange={(e) => { const u = [...sf.faq]; u[fIdx] = { ...u[fIdx], question: e.target.value }; updateSubFiche('faq', u); }} className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium" placeholder="Question" />
                                <button type="button" onClick={() => updateSubFiche('faq', sf.faq.filter((_, i) => i !== fIdx))} className="p-1 text-slate-400 hover:text-red-500 transition"><Trash2 className="w-3 h-3" /></button>
                              </div>
                              <textarea value={faqItem.answer} onChange={(e) => { const u = [...sf.faq]; u[fIdx] = { ...u[fIdx], answer: e.target.value }; updateSubFiche('faq', u); }} rows={2} className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Réponse" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Caractéristiques */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Caractéristiques</label>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => {
                            const materialLabels: Record<string, string> = { corten: 'Acier Corten', acier: 'Acier', inox: 'Inox' };
                            const formatLabels: Record<string, string> = { rond: 'Ronde', hexagonal: 'Hexagonale', carre: 'Carrée' };
                            const chars: {label: string, value: string}[] = [
                              { label: 'Marque', value: 'Atelier LBF' },
                              { label: 'Type de combustible', value: formData.fuelType.length > 0 ? formData.fuelType.join(' / ') : 'Bois' },
                            ];
                            if (formData.diameter) {
                              const parts: string[] = [];
                              if (formData.length) parts.push(`L${formData.length}`);
                              if (formData.width) parts.push(`l${formData.width}`);
                              if (formData.height) parts.push(`H${formData.height}`);
                              chars.push({ label: 'Dimensions', value: parts.length > 0 ? parts.join('x') + 'cm' : `Ø ${formData.diameter}cm` });
                            }
                            chars.push({ label: 'Matière', value: materialLabels[formData.material] || formData.material });
                            if (formData.format) chars.push({ label: 'Forme de la plancha', value: formatLabels[formData.format] || formData.format });
                            if (formData.diameter) chars.push({ label: 'Dimensions Plancha', value: `Ø ${formData.diameter}cm` });
                            if (formData.bowlThickness) chars.push({ label: 'Épaisseur Plancha', value: `${formData.bowlThickness}mm` });
                            if (formData.planchaMaterial) chars.push({ label: 'Matière de la plaque', value: formData.planchaMaterial === 'inox' ? 'Inox' : 'Acier carbone' });
                            if (formData.numberOfGuests) chars.push({ label: 'Nombre de convives', value: formData.numberOfGuests });
                            if (formData.weight) chars.push({ label: 'Poids', value: formData.weight });
                            chars.push({ label: 'Type', value: 'Braseros' });
                            updateSubFiche('characteristics', chars);
                          }} className="px-2 py-0.5 text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-md hover:bg-amber-100 transition">
                            Pré-remplir
                          </button>
                          <button type="button" onClick={() => updateSubFiche('characteristics', [...sf.characteristics, { label: '', value: '' }])} className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Ajouter
                          </button>
                        </div>
                      </div>
                      {sf.characteristics.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">Cliquez sur &quot;Pré-remplir&quot; pour générer automatiquement.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {sf.characteristics.map((ch, cIdx) => (
                            <div key={cIdx} className="grid grid-cols-[1fr_1fr_28px] gap-1.5 items-center">
                              <input type="text" value={ch.label} onChange={(e) => { const u = [...sf.characteristics]; u[cIdx] = { ...u[cIdx], label: e.target.value }; updateSubFiche('characteristics', u); }} className="px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium" placeholder="Label" />
                              <input type="text" value={ch.value} onChange={(e) => { const u = [...sf.characteristics]; u[cIdx] = { ...u[cIdx], value: e.target.value }; updateSubFiche('characteristics', u); }} className="px-2 py-1 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Valeur" />
                              <button type="button" onClick={() => updateSubFiche('characteristics', sf.characteristics.filter((_, i) => i !== cIdx))} className="p-1 text-slate-400 hover:text-red-500 transition"><Trash2 className="w-3 h-3" /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Réinitialiser */}
                    <div className="pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => { setConfigurations(prev => { const next = { ...prev }; delete next[openConfigKey]; return next; }); }}
                        className="text-[11px] text-red-500 hover:text-red-700 transition"
                      >
                        Réinitialiser cette sous-fiche
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
