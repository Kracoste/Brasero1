'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { Price } from "@/components/Price";
import { braseros } from "@/content/products";
import type { Product } from "@/lib/schema";
import "@/styles/product-showcase.css";

type LayoutSlot = {
  slug: Product["slug"];
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
  initial: { x: number; y: number; scale?: number; rotate?: number };
  delay: string;
  featured?: boolean;
};

const layout: LayoutSlot[] = [
  {
    slug: "brasero-signature-80",
    colStart: 4,
    colSpan: 6,
    rowStart: 4,
    rowSpan: 6,
    initial: { x: 0, y: 0, scale: 0.82 },
    delay: "0ms",
    featured: true,
  },
  {
    slug: "brasero-atlas-90",
    colStart: 1,
    colSpan: 3,
    rowStart: 1,
    rowSpan: 4,
    initial: { x: -920, y: -80, scale: 0.72, rotate: -6 },
    delay: "80ms",
  },
  {
    slug: "brasero-horizon-60",
    colStart: 4,
    colSpan: 2,
    rowStart: 1,
    rowSpan: 3,
    initial: { x: -760, y: -20, scale: 0.68, rotate: -8 },
    delay: "120ms",
  },
  {
    slug: "brasero-origine-100",
    colStart: 6,
    colSpan: 4,
    rowStart: 1,
    rowSpan: 3,
    initial: { x: 720, y: -60, scale: 0.7, rotate: 6 },
    delay: "160ms",
  },
  {
    slug: "brasero-compact-55",
    colStart: 10,
    colSpan: 3,
    rowStart: 1,
    rowSpan: 4,
    initial: { x: 960, y: -100, scale: 0.72, rotate: 10 },
    delay: "200ms",
  },
  {
    slug: "brasero-canyon-70",
    colStart: 1,
    colSpan: 3,
    rowStart: 5,
    rowSpan: 5,
    initial: { x: -960, y: 0, scale: 0.7, rotate: -4 },
    delay: "240ms",
  },
  {
    slug: "brasero-lumina-65",
    colStart: 10,
    colSpan: 3,
    rowStart: 5,
    rowSpan: 5,
    initial: { x: 990, y: -40, scale: 0.7, rotate: 4 },
    delay: "280ms",
  },
  {
    slug: "brasero-nomade-45",
    colStart: 1,
    colSpan: 2,
    rowStart: 10,
    rowSpan: 3,
    initial: { x: -760, y: 60, scale: 0.64, rotate: -6 },
    delay: "320ms",
  },
  {
    slug: "brasero-dune-75",
    colStart: 3,
    colSpan: 6,
    rowStart: 10,
    rowSpan: 3,
    initial: { x: 0, y: 360, scale: 0.7, rotate: -2 },
    delay: "360ms",
  },
  {
    slug: "brasero-zenith-50",
    colStart: 9,
    colSpan: 4,
    rowStart: 10,
    rowSpan: 3,
    initial: { x: 820, y: 20, scale: 0.66, rotate: 8 },
    delay: "400ms",
  },
];

const px = (value: number) => `${value}px`;

export const ProductShowcase = () => {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalRows = layout.reduce((max, item) => Math.max(max, item.rowStart + item.rowSpan), 0);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        setReady(visible);
      },
      { threshold: 0.1 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const node = containerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      const total = rect.height + viewport;
      const distance = viewport - rect.top;
      const ratio = Math.min(Math.max(distance / total, 0), 1);
      setProgress(ratio);
    };

    let frame: number | null = null;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        handleScroll();
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const cards = layout
    .map((slot) => {
      const product = braseros.find((item) => item.slug === slot.slug);
      if (!product) {
        return null;
      }
      return { ...slot, product };
    })
    .filter((value): value is LayoutSlot & { product: Product } => Boolean(value));

  return (
    <div
      ref={containerRef}
      className="product-showcase"
      data-ready={ready ? "true" : "false"}
    >
      <div className="product-showcase__halo" aria-hidden />
      {cards.map((card) => {
        const image = card.product.images[0];
        const activationPoint = (card.rowStart - 1) / totalRows;
        const isVisible = ready && progress >= activationPoint;
        return (
          <article
            key={card.product.slug}
            className={`product-showcase__card${
              card.featured ? " product-showcase__card--featured" : ""
            }`}
            style={{
              gridColumn: `${card.colStart} / span ${card.colSpan}`,
              gridRow: `${card.rowStart} / span ${card.rowSpan}`,
              "--initial-x": px(card.initial.x),
              "--initial-y": px(card.initial.y),
              "--initial-scale": card.initial.scale ?? 0.85,
              "--initial-rotate": `${card.initial.rotate ?? 0}deg`,
              transitionDelay: card.delay,
            } as CSSProperties}
            data-visible={isVisible ? "true" : "false"}
          >
            <span className="product-showcase__badge">{card.product.badge}</span>
            <div className="product-showcase__media">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="product-showcase__image"
                placeholder="blur"
                blurDataURL={image.blurDataURL}
              />
            </div>
            <div className="product-showcase__content">
              <div className="product-showcase__meta">
                <span className="product-showcase__stock">En stock</span>
                <span className="product-showcase__origin">France Braseros</span>
              </div>
              <h3 className="product-showcase__name">{card.product.name}</h3>
              <Price amount={card.product.price} className="product-showcase__price" />
              <Link
                href={`/produits/${card.product.slug}`}
                className="product-showcase__link"
              >
                Voir les détails
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
};
