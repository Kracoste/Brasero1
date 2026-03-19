import { jsPDF } from 'jspdf';

const getFaceLabel = (num: number) => `Vue ${num}`;

const FONT_LABELS: Record<string, string> = {
  serif: 'Classique (Georgia)',
  sans: 'Moderne (Arial)',
  script: 'Cursive',
  mono: 'Machine (Courier)',
  display: 'Décoratif (Impact)',
};

type FaceData = {
  type: 'image' | 'text';
  imageUrl?: string;
  fileName?: string;
  text?: string;
  font?: string;
};

type CustomizationPDFData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  productSlug: string;
  faces: Record<string, FaceData>;
  /** URL de l'image schéma du socle (configurée dans l'admin) */
  schemaImage?: string;
};

/**
 * Charge une image depuis une URL et la convertit en base64 pour jsPDF
 */
async function fetchImageAsBase64(url: string): Promise<{ data: string; format: 'JPEG' | 'PNG' } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = res.headers.get('content-type') || '';
    const format = contentType.includes('png') ? 'PNG' : 'JPEG';
    return { data: `data:${contentType};base64,${base64}`, format };
  } catch {
    return null;
  }
}

/**
 * Génère un PDF récapitulatif de la personnalisation
 * Retourne le PDF sous forme de Buffer
 */
export async function generateCustomizationPDF(data: CustomizationPDFData): Promise<Buffer> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // En-tête
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Atelier LBF', margin, y);
  y += 8;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Fiche de personnalisation — Découpe laser', margin, y);
  y += 10;

  // Infos commande
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Commande : #${data.orderNumber}`, margin, y);
  y += 5;
  doc.text(`Client : ${data.customerName} (${data.customerEmail})`, margin, y);
  y += 5;
  doc.text(`Produit : ${data.productName}`, margin, y);
  y += 5;
  doc.text(`Date : ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, margin, y);
  y += 10;

  // Ligne séparatrice
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Schéma des faces
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Schéma des vues', margin, y);
  y += 8;

  if (data.schemaImage) {
    // Utiliser l'image schéma du produit
    const schemaImg = await fetchImageAsBase64(data.schemaImage);
    if (schemaImg) {
      const imgWidth = 120;
      const imgHeight = 90;
      const imgX = (pageWidth - imgWidth) / 2;
      try {
        doc.addImage(schemaImg.data, schemaImg.format, imgX, y, imgWidth, imgHeight);
        y += imgHeight + 8;
      } catch {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('[Image schéma non chargée]', margin, y);
        y += 8;
      }
    }
  } else {
    // Pas d'image schéma — texte simple
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const faceCount = Object.keys(data.faces).length;
    doc.text(`Ce produit comporte ${faceCount} vue(s) personnalisable(s).`, margin, y);
    doc.setTextColor(0, 0, 0);
    y += 8;
  }

  // Ligne séparatrice
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Détail des faces
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Détail des personnalisations', margin, y);
  y += 8;

  for (const [faceNum, face] of Object.entries(data.faces)) {
    const num = Number(faceNum);
    const label = getFaceLabel(num);

    // Vérifier s'il faut une nouvelle page
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(139, 69, 19);
    doc.text(label, margin, y);
    doc.setTextColor(0, 0, 0);
    y += 6;

    if (face.type === 'text') {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Type : Texte`, margin + 4, y);
      y += 5;
      doc.text(`Police : ${FONT_LABELS[face.font || 'serif'] || face.font}`, margin + 4, y);
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.text(`Texte : "${face.text}"`, margin + 4, y);
      doc.setFont('helvetica', 'normal');
      y += 10;
    } else if (face.type === 'image') {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Type : Image uploadée`, margin + 4, y);
      y += 5;
      doc.text(`Fichier : ${face.fileName || 'inconnu'}`, margin + 4, y);
      y += 5;

      // Tenter de charger l'image
      if (face.imageUrl) {
        const img = await fetchImageAsBase64(face.imageUrl);
        if (img) {
          const imgWidth = 60;
          const imgHeight = 45;
          // Vérifier s'il y a assez de place
          if (y + imgHeight > 270) {
            doc.addPage();
            y = 20;
          }
          try {
            doc.addImage(img.data, img.format, margin + 4, y, imgWidth, imgHeight);
            y += imgHeight + 5;
          } catch {
            doc.text(`[Image non chargée — voir URL ci-dessous]`, margin + 4, y);
            y += 5;
          }
        } else {
          doc.text(`[Image non chargée — voir URL ci-dessous]`, margin + 4, y);
          y += 5;
        }
        // Toujours afficher l'URL en petit pour référence
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        const urlLines = doc.splitTextToSize(`URL : ${face.imageUrl}`, pageWidth - margin * 2 - 8);
        doc.text(urlLines, margin + 4, y);
        y += urlLines.length * 3 + 3;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
      }
      y += 5;
    }
  }

  // Pied de page
  y += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Document généré automatiquement — Atelier LBF — www.atelier-lbf.fr', margin, y);

  // Retourner le buffer
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}

/**
 * Convertit une image (URL) en PDF pleine page A4
 * L'image est centrée et mise à l'échelle pour remplir la page au maximum
 */
export async function convertImageToPDF(imageUrl: string): Promise<Buffer | null> {
  const img = await fetchImageAsBase64(imageUrl);
  if (!img) return null;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();   // 210
  const pageHeight = doc.internal.pageSize.getHeight();  // 297
  const margin = 10;
  const maxW = pageWidth - margin * 2;
  const maxH = pageHeight - margin * 2;

  // Utiliser la taille maximale en gardant le ratio
  // On part du max et on ajuste
  let imgW = maxW;
  let imgH = maxH;

  // On ne connaît pas les dimensions exactes de l'image,
  // donc on la place en pleine page avec object-fit contain
  try {
    doc.addImage(img.data, img.format, margin, margin, imgW, imgH);
  } catch {
    return null;
  }

  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
