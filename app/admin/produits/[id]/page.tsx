'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Upload, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';

type ProductImage = {
  id: string;
  file?: File;
  preview: string;
  src?: string;
  isCardImage: boolean;
};

const DIAMETER_OPTIONS = [50, 80, 100];
const FORMAT_OPTIONS = [
  { label: 'Rond', value: 'rond' },
  { label: 'Hexagonal', value: 'hexagonal' },
  { label: 'Carré', value: 'carre' },
];

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const specsRef = useRef<Record<string, any>>({});

  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [availableProducts, setAvailableProducts] = useState<{id: string, name: string, slug: string, images: any[], category: string}[]>([]);
  const [formData, setFormData] = useState({
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
    painting: '',
    numberOfGuests: '',
    fuelType: [] as string[],
    compatibleAccessories: [] as string[],
  });
  const [images, setImages] = useState<ProductImage[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [accessoryDropdownOpen, setAccessoryDropdownOpen] = useState(false);

  // Charger le produit existant via API route (bypass RLS)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Ajouter un timestamp pour éviter le cache
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
          ? (() => {
              try {
                return JSON.parse(product.specs);
              } catch {
                return {};
              }
            })()
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
        bowlThickness: (product.bowlThickness || product.bowl_thickness)?.toString() || '',
        baseThickness: (product.baseThickness || product.base_thickness)?.toString() || '',
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
        compatibleAccessories: parsedSpecs?.compatibleAccessories || [],
      });

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

      setLoadingProduct(false);
      } catch (error: any) {
        console.error('Erreur chargement produit:', error);
        setSubmitError(`Erreur: ${error?.message || 'Erreur inconnue'}`);
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
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

  const handleAccessoryChange = (accessorySlug: string) => {
    setFormData((prev) => ({
      ...prev,
      compatibleAccessories: prev.compatibleAccessories.includes(accessorySlug)
        ? prev.compatibleAccessories.filter((a) => a !== accessorySlug)
        : [...prev.compatibleAccessories, accessorySlug],
    }));
  };

  // Charger tous les produits disponibles (pour les produits compatibles) via API admin
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/admin/products');
        if (response.ok) {
          const data = await response.json();
          setAvailableProducts(data);
        }
      } catch (error) {
        console.error('Erreur chargement produits disponibles:', error);
      }
    };
    loadProducts();
  }, []);

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
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isCardImage: img.id === id,
      }))
    );
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const uploadedImages: Array<{ src: string; alt: string; isCard: boolean }> = [];

      for (const image of images) {
        if (image.file) {
          // Nouvelle image à uploader via API admin
          const sanitizedFileName = image.file.name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9._-]/g, '_');
          const fileName = `${formData.slug}-${Date.now()}-${sanitizedFileName}`;
          
          const uploadFormData = new FormData();
          uploadFormData.append('file', image.file);
          uploadFormData.append('fileName', fileName);
          uploadFormData.append('bucket', 'products');

          const uploadResponse = await fetch('/api/admin/storage/upload', {
            method: 'POST',
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            setSubmitError(`Erreur upload image: ${errorData.error}`);
            throw new Error(errorData.error);
          }

          const { publicUrl } = await uploadResponse.json();

          uploadedImages.push({
            src: publicUrl,
            alt: formData.name,
            isCard: image.isCardImage,
          });
        } else if (image.src) {
          // Image existante
          uploadedImages.push({
            src: image.src,
            alt: formData.name,
            isCard: image.isCardImage,
          });
        }
      }

      let discountPercent = 0;
      if (formData.hasPromotion && formData.comparePrice && formData.price) {
        discountPercent = Math.round(
          ((parseFloat(formData.comparePrice) - parseFloat(formData.price)) /
            parseFloat(formData.comparePrice)) *
            100
        );
      }

      const nextSpecs = { ...(specsRef.current || {}) };
      if (formData.format) {
        nextSpecs.format = formData.format;
      } else {
        delete nextSpecs.format;
      }
      if (formData.painting) {
        nextSpecs.painting = formData.painting;
      } else {
        delete nextSpecs.painting;
      }
      if (formData.numberOfGuests) {
        nextSpecs.numberOfGuests = formData.numberOfGuests;
      } else {
        delete nextSpecs.numberOfGuests;
      }
      if (formData.fuelType.length > 0) {
        nextSpecs.fuelType = formData.fuelType;
      } else {
        delete nextSpecs.fuelType;
      }
      if (formData.compatibleAccessories.length > 0) {
        nextSpecs.compatibleAccessories = formData.compatibleAccessories;
      } else {
        delete nextSpecs.compatibleAccessories;
      }
      specsRef.current = nextSpecs;

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
        specs: Object.keys(nextSpecs).length ? nextSpecs : null,
        inStock: formData.inStock,
        on_demand: formData.onDemand,
        is_featured: formData.isFeatured,
        featured_order: parseInt(formData.featuredOrder),
        images: uploadedImages,
        cardImage: uploadedImages.find((img) => img.isCard)?.src || uploadedImages[0]?.src,
      };

      // Utiliser l'API route pour bypass RLS
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSubmitError(`Erreur base de données: ${errorData.error}`);
        throw new Error(errorData.error);
      }

      router.push('/admin/produits');
    } catch (error: any) {
      console.error('Error updating product:', error);
      if (!submitError) {
        setSubmitError(`Erreur: ${error?.message || 'Erreur inconnue'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <Link
          href="/admin/produits"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft size={20} />
          Retour aux produits
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Modifier le produit</h1>
        <p className="text-slate-600 mt-1">Modifiez les informations du produit</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            <p className="font-semibold">Erreur :</p>
            <p className="mt-1">{submitError}</p>
          </div>
        )}

        {/* Informations générales */}
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
            L'image avec l'étoile sera affichée sur la carte produit.
          </p>

          {errors.images && (
            <p className="text-red-500 text-sm mb-4">{errors.images}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map((image) => (
              <div
                key={image.id}
                className={`relative aspect-square rounded-lg border-2 overflow-hidden group ${
                  image.isCardImage ? 'border-green-500' : 'border-slate-200'
                }`}
              >
                <img
                  src={image.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
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
        </div>

        {/* Prix */}
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
                <span className="text-sm font-medium text-slate-700">Produit vedette (page d'accueil)</span>
              </label>
            </div>

            {formData.isFeatured && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ordre d'affichage (1 à 4)
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
                />
                {errors.comparePrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.comparePrice}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dimensions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Dimensions et caractéristiques</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Champs spécifiques aux braséros */}
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
                      <option key={size} value={size}>
                        Ø {size} cm
                      </option>
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
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Longueur (cm)
              </label>
              <input
                type="number"
                name="length"
                value={formData.length}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Largeur (cm)
              </label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hauteur (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Champs spécifiques aux braséros */}
            {formData.category !== 'accessoire' && formData.category !== 'range-buches' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Épaisseur du bol (mm)
                  </label>
                  <input
                    type="number"
                    name="bowlThickness"
                    value={formData.bowlThickness}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Épaisseur du socle (mm)
                  </label>
                  <input
                    type="number"
                    name="baseThickness"
                    value={formData.baseThickness}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Poids
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="25 kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Peinture
                  </label>
                  <input
                    type="text"
                    name="painting"
                    value={formData.painting}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Noir mat, Thermolaqué, etc."
                  />
                </div>
              </>
            )}

            <div className="flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                />
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
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre de convives
                </label>
                <input
                  type="text"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="6 à 8 personnes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Type de combustibles
                </label>
                <div className="space-y-2">
                  {['Bois', 'Charbon', 'Pellets'].map((fuel) => (
                    <label key={fuel} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.fuelType.includes(fuel)}
                        onChange={() => handleFuelTypeChange(fuel)}
                        className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-slate-700">{fuel}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Produits compatibles */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Produits compatibles
              </label>
              
              {/* Afficher les produits sélectionnés */}
              {formData.compatibleAccessories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.compatibleAccessories.map((slug) => {
                    const product = availableProducts.find(a => a.slug === slug);
                    // Afficher même si le produit n'est pas encore chargé
                    const imageUrl = product?.images?.[0]?.src || '/logo/placeholder.png';
                    const displayName = product?.name || slug;
                    return (
                      <div key={slug} className="flex items-center gap-2 bg-green-50 border border-green-300 rounded-lg px-3 py-2">
                        <img src={imageUrl} alt={displayName} className="w-8 h-8 object-contain rounded" />
                        <span className="text-sm font-medium text-green-800">{displayName}</span>
                        <button
                          type="button"
                          onClick={() => handleAccessoryChange(slug)}
                          className="text-green-600 hover:text-red-600 ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Menu déroulant */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccessoryDropdownOpen(!accessoryDropdownOpen)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-left flex items-center justify-between hover:border-slate-300 transition"
                >
                  <span className="text-slate-600">
                    {formData.compatibleAccessories.length === 0 
                      ? 'Sélectionner des accessoires...' 
                      : `${formData.compatibleAccessories.length} accessoire(s) sélectionné(s)`}
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
                      availableProducts.filter(p => p.category === 'accessoire').map((product) => {
                        const imageUrl = product.images?.[0]?.src || '/logo/placeholder.png';
                        const isSelected = formData.compatibleAccessories.includes(product.slug);
                        return (
                          <button
                            key={product.slug}
                            type="button"
                            onClick={() => handleAccessoryChange(product.slug)}
                            className={`w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition border-b border-slate-100 last:border-b-0 ${
                              isSelected ? 'bg-green-50' : ''
                            }`}
                          >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              isSelected ? 'bg-green-500 border-green-500' : 'border-slate-300'
                            }`}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-white p-1"
                            />
                            <span className={`text-sm font-medium ${isSelected ? 'text-green-700' : 'text-slate-700'}`}>
                              {product.name}
                            </span>
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

        {/* Informations spécifiques aux accessoires */}
        {(formData.category === 'accessoire' || formData.category === 'range-buches') && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Produits compatibles</h2>
            <p className="text-sm text-slate-600 mb-4">
              Sélectionnez les braséros ou autres accessoires compatibles avec cet accessoire.
            </p>

            {/* Afficher les produits sélectionnés */}
            {formData.compatibleAccessories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.compatibleAccessories.map((slug) => {
                  const product = availableProducts.find(a => a.slug === slug);
                  // Afficher même si le produit n'est pas encore chargé
                  const imageUrl = product?.images?.[0]?.src || '/logo/placeholder.png';
                  const displayName = product?.name || slug;
                  const displayCategory = product?.category || 'produit';
                  return (
                    <div key={slug} className="flex items-center gap-2 bg-green-50 border border-green-300 rounded-lg px-3 py-2">
                      <img src={imageUrl} alt={displayName} className="w-8 h-8 object-contain rounded" />
                      <span className="text-xs text-slate-500 uppercase">{displayCategory}</span>
                      <span className="text-sm font-medium text-green-800">{displayName}</span>
                      <button
                        type="button"
                        onClick={() => handleAccessoryChange(slug)}
                        className="text-green-600 hover:text-red-600 ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Menu déroulant */}
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
                  {availableProducts.filter(p => p.slug !== formData.slug).length === 0 ? (
                    <p className="p-4 text-sm text-slate-500">Aucun produit disponible</p>
                  ) : (
                    availableProducts.filter(p => p.slug !== formData.slug).map((product) => {
                      const imageUrl = product.images?.[0]?.src || '/logo/placeholder.png';
                      const isSelected = formData.compatibleAccessories.includes(product.slug);
                      return (
                        <button
                          key={product.slug}
                          type="button"
                          onClick={() => handleAccessoryChange(product.slug)}
                          className={`w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition border-b border-slate-100 last:border-b-0 ${
                            isSelected ? 'bg-green-50' : ''
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-green-500 border-green-500' : 'border-slate-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-white p-1"
                          />
                          <div className="flex flex-col items-start">
                            <span className="text-xs text-slate-400 uppercase">{product.category}</span>
                            <span className={`text-sm font-medium ${isSelected ? 'text-green-700' : 'text-slate-700'}`}>
                              {product.name}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/produits"
            className="px-6 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition"
          >
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
                Enregistrement...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
