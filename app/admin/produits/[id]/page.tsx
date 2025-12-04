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

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
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
    length: '',
    width: '',
    height: '',
    bowlThickness: '',
    baseThickness: '',
    material: 'corten',
    weight: '',
    inStock: true,
  });
  const [images, setImages] = useState<ProductImage[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Charger le produit existant
  useEffect(() => {
    const fetchProduct = async () => {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error || !product) {
        setSubmitError('Produit non trouvé');
        setLoadingProduct(false);
        return;
      }

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
        length: product.length?.toString() || '',
        width: product.width?.toString() || '',
        height: product.height?.toString() || '',
        bowlThickness: (product.bowlThickness || product.bowl_thickness)?.toString() || '',
        baseThickness: (product.baseThickness || product.base_thickness)?.toString() || '',
        material: product.material || 'corten',
        weight: product.weight?.toString() || '',
        inStock: product.inStock ?? product.in_stock ?? true,
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
    };

    fetchProduct();
  }, [productId, supabase]);

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
          // Nouvelle image à uploader
          const fileName = `${formData.slug}-${Date.now()}-${image.file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(fileName, image.file);

          if (uploadError) {
            setSubmitError(`Erreur upload image: ${uploadError.message}`);
            throw uploadError;
          }

          const { data: urlData } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);

          uploadedImages.push({
            src: urlData.publicUrl,
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

      const productData = {
        name: formData.name,
        slug: formData.slug,
        shortDescription: formData.shortDescription,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        comparePrice: formData.hasPromotion ? parseFloat(formData.comparePrice) : null,
        discountPercent: formData.hasPromotion ? discountPercent : null,
        length: formData.length ? parseInt(formData.length) : null,
        width: formData.width ? parseInt(formData.width) : null,
        height: formData.height ? parseInt(formData.height) : null,
        bowlThickness: formData.bowlThickness ? parseFloat(formData.bowlThickness) : null,
        baseThickness: formData.baseThickness ? parseFloat(formData.baseThickness) : null,
        weight: formData.weight || null,
        material: formData.material,
        inStock: formData.inStock,
        images: uploadedImages,
        cardImage: uploadedImages.find((img) => img.isCard)?.src || uploadedImages[0]?.src,
      };

      const { error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', productId);

      if (updateError) {
        setSubmitError(`Erreur base de données: ${updateError.message}`);
        throw updateError;
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
                <option value="corten">Acier Corten</option>
                <option value="acier">Acier</option>
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

            <div className="flex items-center">
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
            </div>

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
