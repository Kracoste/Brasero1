import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description: "Conditions générales de vente de l'Atelier LBF : fabrication à la commande, paiement, livraison, garantie et droit de rétractation pour nos braseros artisanaux manufacturés en France.",
  alternates: { canonical: "/cgv" },
};

export default function CGVPage() {
  return (
    <Section className="pb-24">
      <Container className="max-w-3xl space-y-8">
        <header className="space-y-2">
          <h1 className="font-display text-4xl font-semibold text-clay-900">
            Conditions Générales de Vente
          </h1>
          <p className="text-sm text-slate-500">
            Dernière mise à jour : 16 avril 2026
          </p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">1. Préambule</h2>
            <p>
              Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent
              l&apos;ensemble des relations commerciales entre l&apos;Atelier LBF et ses clients dans
              le cadre de la vente de braseros artisanaux, planchas, grilles et accessoires
              associés. Toute commande passée sur le site implique l&apos;acceptation sans réserve
              des présentes CGV.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">2. Fabrication à la commande</h2>
            <p>
              Nos braseros, planchas et grilles sont manufacturés artisanalement à la commande
              dans notre atelier situé en France. Chaque pièce est produite après validation et
              encaissement du paiement.
            </p>
            <p>
              Le délai maximum de fabrication et de livraison est de <strong>4 semaines</strong>{" "}
              à compter de la validation de la commande. Ce délai peut être réduit en période
              creuse et peut exceptionnellement être prolongé en cas de forte affluence ou de
              rupture d&apos;approvisionnement matière ; le client en est alors informé par email.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">3. Prix et paiement</h2>
            <p>
              Les prix affichés sur le site sont indiqués en euros, toutes taxes comprises
              (TTC), hors frais de livraison. Le montant des frais de livraison est calculé et
              affiché avant la validation finale de la commande.
            </p>
            <p>
              Le paiement s&apos;effectue directement en ligne via notre prestataire sécurisé
              Stripe. Deux modalités sont proposées :
            </p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Paiement en une fois par carte bancaire ;</li>
              <li>
                Paiement en plusieurs fois via Klarna, sous réserve d&apos;acceptation du dossier
                par l&apos;organisme de financement.
              </li>
            </ul>
            <p>
              Aucune donnée bancaire ne transite ni n&apos;est stockée sur nos serveurs. La
              commande n&apos;est considérée comme ferme qu&apos;après encaissement effectif du
              paiement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">4. Livraison</h2>
            <p>
              Les livraisons sont assurées par transporteur spécialisé (Schenker ou
              équivalent). Le montant des frais de livraison est estimé en fonction du poids
              et du volume de la commande, ainsi que de la zone géographique de destination.
            </p>
            <p>
              Nous livrons en France métropolitaine, ainsi qu&apos;en Belgique, au Luxembourg,
              en Allemagne et en Suisse. La livraison s&apos;effectue en pas-de-porte ou sur
              rendez-vous selon les modalités du transporteur. Le client s&apos;engage à être
              présent à l&apos;adresse indiquée ou à désigner un représentant.
            </p>
            <p>
              À la réception, il appartient au client de vérifier l&apos;état du colis en
              présence du livreur et d&apos;émettre toute réserve écrite précise sur le bordereau
              de livraison en cas de dommage apparent.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">5. Personnalisation</h2>
            <p>
              Certains produits peuvent faire l&apos;objet d&apos;une personnalisation (découpe
              laser, gravure, visuel spécifique). Pour toute commande personnalisée, un
              visuel de validation (BAT) est envoyé au client avant lancement en production.
            </p>
            <p>
              Une fois le visuel validé par le client et la production lancée, la commande
              devient ferme et définitive. Conformément à l&apos;article L.221-28 3° du Code de
              la consommation, <strong>le droit de rétractation ne peut plus s&apos;exercer</strong>{" "}
              sur les biens confectionnés selon les spécifications du consommateur ou
              nettement personnalisés.
            </p>
            <p>
              Aucun remboursement ni aucun retour ne sont possibles sur les braseros et
              accessoires personnalisés, sauf en cas de défaut de fabrication avéré, de choc
              survenu lors du transport ou de non-conformité du produit livré par rapport au
              BAT validé.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">6. Droit de rétractation (produits standards)</h2>
            <p>
              Pour les produits non personnalisés, le client dispose d&apos;un délai de{" "}
              <strong>14 jours</strong> à compter de la réception de la commande pour exercer
              son droit de rétractation, conformément à l&apos;article L.221-18 du Code de la
              consommation.
            </p>
            <p>
              Les frais de retour restent à la charge du client. Le produit doit être
              retourné dans son emballage d&apos;origine, en parfait état, non utilisé et non
              endommagé. Le remboursement est effectué sous 14 jours à compter de la
              réception du produit retourné et de sa vérification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">7. Garantie</h2>
            <p>
              Nos produits bénéficient de la <strong>garantie légale de conformité</strong>{" "}
              (articles L.217-3 et suivants du Code de la consommation) d&apos;une durée de 2 ans
              à compter de la livraison, ainsi que de la garantie contre les vices cachés
              (articles 1641 et suivants du Code civil).
            </p>
            <p>
              Les pièces d&apos;usure (grilles, planchas, consommables) ainsi que les
              dégradations résultant d&apos;un usage non conforme, d&apos;un défaut d&apos;entretien ou
              d&apos;un choc externe ne sont pas couvertes par la garantie.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">8. Défauts de fabrication et réclamations</h2>
            <p>
              En cas de défaut de fabrication, de choc constaté à la réception ou de
              non-conformité, le client est invité à nous contacter dans les plus brefs
              délais à l&apos;adresse <strong>atelier-lbf@outlook.fr</strong>, en joignant des
              photographies détaillées du défaut et une description précise.
            </p>
            <p>
              Après examen, l&apos;Atelier LBF procédera, selon le cas, à la réparation, au
              remplacement ou au remboursement du produit concerné, y compris pour les
              commandes personnalisées lorsque le défaut est avéré.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">9. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des éléments du site (photos, textes, logos, visuels produits) est
              la propriété exclusive de l&apos;Atelier LBF. Toute reproduction totale ou
              partielle, sans autorisation écrite préalable, est strictement interdite.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">10. Données personnelles</h2>
            <p>
              Les données collectées lors de la commande sont traitées conformément à notre
              politique de confidentialité et utilisées uniquement dans le cadre de la
              gestion de votre commande et de la relation commerciale. Le client dispose
              d&apos;un droit d&apos;accès, de rectification et de suppression de ses données.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">11. Droit applicable et litiges</h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige, le client
              est invité à contacter l&apos;Atelier LBF à l&apos;adresse{" "}
              <strong>atelier-lbf@outlook.fr</strong> pour rechercher une solution amiable.
              À défaut d&apos;accord amiable, les juridictions françaises seront seules
              compétentes.
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
