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
        className="overflow-hidden border-b border-gray-200 last:border-b-0"
      >
        <Accordion.Header>
          <Accordion.Trigger className="flex w-full items-center justify-between py-5 text-left text-base font-semibold text-gray-900">
            {item.question}
            <span className="ml-4 text-xs uppercase tracking-wide text-gray-500">+</span>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="pb-5 text-sm text-gray-600 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          {item.answer}
        </Accordion.Content>
      </Accordion.Item>
    ))}
  </Accordion.Root>
);
