export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;

  const safeJson = JSON.stringify(data).replace(/<\/script>/gi, '<\\/script>');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
