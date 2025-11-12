"use client";

import * as Accordion from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";

export type FAQItem = {
  question: string;
  answer: string;
};

type FAQProps = {
  items: FAQItem[];
  className?: string;
};

export const FAQ = ({ items, className }: FAQProps) => (
  <Accordion.Root type="single" collapsible className={cn("space-y-3", className)}>
    {items.map((item, index) => (
      <Accordion.Item
        key={item.question}
        value={`item-${index}`}
        className="overflow-hidden rounded-2xl border border-slate-100 bg-white/70"
      >
        <Accordion.Header>
          <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-5 text-left text-base font-semibold text-clay-900">
            {item.question}
            <span className="ml-4 text-xs uppercase tracking-wide text-slate-400">+</span>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="px-6 pb-5 text-sm text-slate-600 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          {item.answer}
        </Accordion.Content>
      </Accordion.Item>
    ))}
  </Accordion.Root>
);
