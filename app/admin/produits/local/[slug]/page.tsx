'use client';

import { useState, useEffect, use } from 'react';
import { ArrowLeft, FileCode, ExternalLink, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { products } from '@/content/products';

export default function LocalProductView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = products.find(p => p.slug === slug);

  if (!product) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-slate-900">Produit non trouvé</h1>
          <p className="text-slate-600 mt-2">Le produit "{slug}" n'existe pas dans les produits locaux.</p>
          <Link href="/admin/produits" className="mt-4 inline-flex items-center gap-2 text-slate-900 hover:underline">
            <ArrowLeft size={16} />
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/admin/produits"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft size={20} />
        Retour aux produits
      </Link>

      {/* Avertissement */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-amber-800">Produit local (lecture seule)</h3>
            <p className="text-amber-700 text-sm mt-1">
              Ce produit est défini dans le fichier <code className="bg-amber-100 px-1 rounded">content/products.ts</code>. 
              Pour le modifier, vous devez éditer directement ce fichier dans le code source.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <FileCode className="text-amber-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
              <p className="text-slate-500">Slug: {product.slug}</p>
            </div>
          </div>
          <Link
            href={`/produits/${product.slug}`}
            target="_blank"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          >
            <ExternalLink size={16} />
            Voir sur le site
          </Link>
        </div>

        <div className="p-6 space-y-6">
          {/* Image */}
          {product.images && product.images[0] && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Image principale</h3>
              <div className="w-48 h-48 bg-slate-100 rounded-lg overflow-hidden">
                <img
                  src={product.images[0].src}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Informations principales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-xs font-semibold text-slate-500 uppercase">Prix</p>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(product.price)}</p>
              {product.comparePrice && (
                <p className="text-sm text-slate-500 line-through">{formatCurrency(product.comparePrice)}</p>
              )}
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-xs font-semibold text-slate-500 uppercase">Catégorie</p>
              <p className="text-xl font-bold text-slate-900 capitalize">{product.category}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-xs font-semibold text-slate-500 uppercase">Disponibilité</p>
              <p className="text-lg font-semibold text-slate-900">{product.availability || 'Non défini'}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-xs font-semibold text-slate-500 uppercase">Badge</p>
              <p className="text-lg font-semibold text-slate-900">{product.badge || 'Aucun'}</p>
            </div>
          </div>

          {/* Description courte */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Description courte</h3>
            <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">{product.shortDescription}</p>
          </div>

          {/* Description longue */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Description complète</h3>
            <p className="text-slate-700 bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* Spécifications */}
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Spécifications techniques</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Matériau</p>
                  <p className="font-semibold text-slate-900">{product.material || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Diamètre</p>
                  <p className="font-semibold text-slate-900">{product.diameter ? `${product.diameter} cm` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Hauteur</p>
                  <p className="font-semibold text-slate-900">{product.height ? `${product.height} cm` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Poids</p>
                  <p className="font-semibold text-slate-900">{product.weight ? `${product.weight} kg` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Épaisseur</p>
                  <p className="font-semibold text-slate-900">{product.thickness ? `${product.thickness} mm` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Garantie</p>
                  <p className="font-semibold text-slate-900">{product.warranty || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Fabriqué en</p>
                  <p className="font-semibold text-slate-900">{product.madeIn || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Score popularité</p>
                  <p className="font-semibold text-slate-900">{product.popularScore || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Specs */}
          {product.customSpecs && product.customSpecs.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Spécifications personnalisées</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <table className="w-full">
                  <tbody>
                    {product.customSpecs.map((spec, index) => (
                      <tr key={index} className="border-b border-slate-200 last:border-0">
                        <td className="py-2 text-slate-600">{spec.label}</td>
                        <td className="py-2 font-semibold text-slate-900 text-right">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Highlights */}
          {product.highlights && product.highlights.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Points forts</h3>
              <div className="flex flex-wrap gap-2">
                {product.highlights.map((highlight, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {product.faq && product.faq.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">FAQ</h3>
              <div className="space-y-3">
                {product.faq.map((item, index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-lg">
                    <p className="font-semibold text-slate-900">{item.question}</p>
                    <p className="text-slate-600 mt-1">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
