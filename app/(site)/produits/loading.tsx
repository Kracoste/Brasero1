import { Container } from '@/components/Container';
import { Section } from '@/components/Section';

export default function Loading() {
  return (
    <Section className="py-8 sm:py-12">
      <Container className="space-y-6 sm:space-y-10 w-full max-w-[1600px] px-3 sm:px-4 lg:px-0">
        <div className="space-y-3">
          <div className="h-8 w-2/3 animate-pulse bg-slate-200 rounded" />
          <div className="h-4 w-full max-w-2xl animate-pulse bg-slate-100 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-square w-full animate-pulse bg-slate-200 rounded" />
              <div className="h-4 w-3/4 animate-pulse bg-slate-200 rounded" />
              <div className="h-4 w-1/2 animate-pulse bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
