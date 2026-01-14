import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteSettings, type SiteSettings } from "@/lib/site-settings";

const formatCurrency = (value: number) =>
  value.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 0 });

type PageConfig = {
  title: string;
  content: React.ReactNode;
};

const createPages = (settings: SiteSettings): Record<string, PageConfig> => ({
  // ============ SERVICE À LA CLIENTÈLE ============
  "service-clientele": {
    title: "Service à la clientèle",
    content: (
      <div className="space-y-6">
        <p>
          Chez {settings.storeName}, votre satisfaction est notre priorité. Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans votre expérience d&apos;achat.
        </p>
        <h2 className="text-xl font-semibold">Comment nous contacter ?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Par email :</strong> {settings.storeEmail} (réponse sous 24h)</li>
          <li><strong>Par téléphone :</strong> {settings.storePhone} (du lundi au vendredi, 9h-18h)</li>
          <li><strong>Via le formulaire de contact</strong> sur notre site</li>
        </ul>
        <h2 className="text-xl font-semibold">Nos engagements</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Réponse rapide à toutes vos demandes</li>
          <li>Conseils personnalisés pour choisir votre brasero</li>
          <li>Suivi de commande en temps réel</li>
          <li>Service après-vente réactif</li>
        </ul>
      </div>
    ),
  },
  commander: {
    title: "Comment commander",
    content: (
      <div className="space-y-6">
        <p>
          Commander sur {settings.storeName} est simple et sécurisé. Voici les étapes pour passer votre commande :
        </p>
        <h2 className="text-xl font-semibold">Étape 1 : Choisissez vos produits</h2>
        <p>
          Parcourez notre catalogue de braseros et accessoires. Cliquez sur le produit qui vous intéresse pour voir ses détails, puis ajoutez-le au panier.
        </p>
        <h2 className="text-xl font-semibold">Étape 2 : Vérifiez votre panier</h2>
        <p>
          Accédez à votre panier pour vérifier les articles sélectionnés, les quantités et le montant total. Vous pouvez modifier votre sélection à tout moment.
        </p>
        <h2 className="text-xl font-semibold">Étape 3 : Créez un compte ou connectez-vous</h2>
        <p>
          Pour finaliser votre commande, connectez-vous à votre compte ou créez-en un. Cela vous permettra de suivre vos commandes et de sauvegarder vos informations.
        </p>
        <h2 className="text-xl font-semibold">Étape 4 : Finalisez votre commande</h2>
        <p>
          Renseignez votre adresse de livraison, choisissez votre mode de paiement et validez. Vous recevrez une confirmation par email.
        </p>
      </div>
    ),
  },
  paiement: {
    title: "Paiement",
    content: (
      <div className="space-y-6">
        <p>
          Nous proposons plusieurs moyens de paiement sécurisés pour faciliter vos achats.
        </p>
        <h2 className="text-xl font-semibold">Moyens de paiement acceptés</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Carte bancaire :</strong> Visa, Mastercard, CB (paiement sécurisé SSL)</li>
          <li><strong>Virement bancaire :</strong> Pour les commandes importantes</li>
          <li><strong>Paiement en 3x sans frais :</strong> À partir de 500€ d&apos;achat</li>
        </ul>
        <h2 className="text-xl font-semibold">Sécurité des transactions</h2>
        <p>
          Toutes vos transactions sont sécurisées grâce au protocole SSL. Vos données bancaires ne sont jamais stockées sur nos serveurs.
        </p>
        <h2 className="text-xl font-semibold">Facturation</h2>
        <p>
          Une facture est automatiquement générée et envoyée par email après validation de votre commande. Vous pouvez également la télécharger depuis votre espace client.
        </p>
      </div>
    ),
  },
  expedition: {
    title: "Expédition",
    content: (
      <div className="space-y-6">
        <p>
          Nous expédions vos commandes avec le plus grand soin pour garantir une livraison en parfait état.
        </p>
        <h2 className="text-xl font-semibold">Délais de livraison</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>France métropolitaine :</strong> 3 à 7 jours ouvrés</li>
          <li><strong>Belgique, Luxembourg :</strong> 5 à 10 jours ouvrés</li>
          <li><strong>Suisse :</strong> 7 à 14 jours ouvrés</li>
        </ul>
        <h2 className="text-xl font-semibold">Frais de livraison</h2>
        <p>
          Les frais de livraison sont calculés en fonction du poids et de la destination lors du paiement de votre commande.
        </p>
        <h2 className="text-xl font-semibold">Suivi de commande</h2>
        <p>
          Un numéro de suivi vous est envoyé par email dès l&apos;expédition de votre colis. Vous pouvez suivre votre livraison en temps réel.
        </p>
        <h2 className="text-xl font-semibold">Livraison spéciale braseros</h2>
        <p>
          Nos braseros sont des produits lourds et volumineux. Ils sont livrés sur palette par un transporteur spécialisé avec prise de rendez-vous.
        </p>
      </div>
    ),
  },
  retourner: {
    title: "Retours et échanges",
    content: (
      <div className="space-y-6">
        <p>
          Vous avez changé d&apos;avis ? Pas de problème ! Vous disposez de 14 jours pour retourner votre produit.
        </p>
        <h2 className="text-xl font-semibold">Conditions de retour</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Le produit doit être dans son emballage d&apos;origine</li>
          <li>Le produit ne doit pas avoir été utilisé</li>
          <li>Le retour doit être effectué dans les 14 jours suivant la réception</li>
        </ul>
        <h2 className="text-xl font-semibold">Procédure de retour</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Contactez notre service client par email pour obtenir un numéro de retour</li>
          <li>Emballez soigneusement le produit dans son emballage d&apos;origine</li>
          <li>Expédiez le colis à l&apos;adresse indiquée</li>
          <li>Le remboursement sera effectué sous 14 jours après réception</li>
        </ol>
        <h2 className="text-xl font-semibold">Frais de retour</h2>
        <p>
          Les frais de retour sont à la charge du client, sauf en cas de produit défectueux ou d&apos;erreur de notre part.
        </p>
      </div>
    ),
  },
  "confidentialite-politique": {
    title: "Confidentialité & Politique de données",
    content: (
      <div className="space-y-6">
        <p>
          La protection de vos données personnelles est une priorité pour {settings.storeName}. Cette page vous informe sur la manière dont nous collectons et utilisons vos données.
        </p>
        <h2 className="text-xl font-semibold">Données collectées</h2>
        <p>Nous collectons uniquement les données nécessaires au traitement de vos commandes :</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Nom, prénom, adresse email</li>
          <li>Adresse de livraison et de facturation</li>
          <li>Numéro de téléphone</li>
          <li>Historique de commandes</li>
        </ul>
        <h2 className="text-xl font-semibold">Utilisation des données</h2>
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Traiter et expédier vos commandes</li>
          <li>Vous informer sur le suivi de livraison</li>
          <li>Répondre à vos demandes de service client</li>
          <li>Vous envoyer notre newsletter (avec votre consentement)</li>
        </ul>
        <h2 className="text-xl font-semibold">Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de modification et de suppression de vos données. Contactez-nous à {settings.storeEmail} pour exercer ces droits.
        </p>
      </div>
    ),
  },
  contact: {
    title: "Contact",
    content: (
      <div className="space-y-6">
        <p>
          Nous sommes à votre écoute ! N&apos;hésitez pas à nous contacter pour toute question.
        </p>
        <h2 className="text-xl font-semibold">Nos coordonnées</h2>
        <div className="bg-gray-50 p-6 rounded-lg space-y-3">
          <p><strong>{settings.storeName}</strong></p>
          <p>📍 {settings.storeAddress}</p>
          <p>📧 {settings.storeEmail}</p>
          <p>📞 {settings.storePhone}</p>
        </div>
        <h2 className="text-xl font-semibold">Horaires</h2>
        <p>Du lundi au vendredi : 9h00 - 18h00</p>
        <p>Samedi : 10h00 - 16h00 (sur rendez-vous)</p>
        <h2 className="text-xl font-semibold">Formulaire de contact</h2>
        <p>
          Vous pouvez également utiliser notre <Link href="/contact" className="text-orange-600 hover:underline">formulaire de contact</Link> pour nous envoyer un message. Nous vous répondrons sous 24 à 48 heures.
        </p>
      </div>
    ),
  },
  faq: {
    title: "Questions fréquemment posées",
    content: (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Commande et paiement</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="font-medium">Comment puis-je suivre ma commande ?</p>
            <p className="text-gray-600 mt-1">Un email avec un lien de suivi vous est envoyé dès l&apos;expédition. Vous pouvez aussi consulter l&apos;état de votre commande dans votre espace client.</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="font-medium">Puis-je payer en plusieurs fois ?</p>
            <p className="text-gray-600 mt-1">Oui, nous proposons le paiement en 3x sans frais à partir de 500€ d&apos;achat.</p>
          </div>
        </div>
        <h2 className="text-xl font-semibold">Livraison</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="font-medium">Quels sont les délais de livraison ?</p>
            <p className="text-gray-600 mt-1">En France métropolitaine, comptez 3 à 7 jours ouvrés. Pour les braseros volumineux, une livraison sur rendez-vous est organisée.</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="font-medium">Livrez-vous à l&apos;étranger ?</p>
            <p className="text-gray-600 mt-1">Oui, nous livrons en Belgique, Luxembourg , Suisse et en Allemagne. Contactez-nous pour d&apos;autres destinations.</p>
          </div>
        </div>
        <h2 className="text-xl font-semibold">Produits</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="font-medium">Vos braseros sont-ils garantis ?</p>
            <p className="text-gray-600 mt-1">Oui, tous nos braseros bénéficient d&apos;une garantie fabricant de 2 ans minimum.</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="font-medium">Comment entretenir mon brasero ?</p>
            <p className="text-gray-600 mt-1">La patine naturelle protège l&apos;acier corten. Pour l&apos;acier classique, un nettoyage régulier et une protection hivernale sont recommandés.</p>
          </div>
        </div>
      </div>
    ),
  },

  // ============ CATÉGORIES ============
  "braseros-exterieurs": {
    title: "Braseros extérieurs",
    content: (
      <div className="space-y-6">
        <p>
          Découvrez notre collection de braseros extérieurs, conçus pour transformer votre jardin ou terrasse en un véritable espace de convivialité.
        </p>
        <h2 className="text-xl font-semibold">Pourquoi choisir un brasero extérieur ?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Chaleur et ambiance :</strong> Profitez de soirées prolongées même en mi-saison</li>
          <li><strong>Design :</strong> Un élément décoratif qui sublime votre espace extérieur</li>
          <li><strong>Convivialité :</strong> Un point de rassemblement pour vos proches</li>
          <li><strong>Polyvalence :</strong> Certains modèles permettent également de cuisiner</li>
        </ul>
        <h2 className="text-xl font-semibold">Nos gammes</h2>
        <p>
          Nous proposons des braseros en acier corten (aspect rouillé naturel), en acier noir, et en fonte. Chaque matériau offre des caractéristiques uniques en termes de durabilité et d&apos;esthétique.
        </p>
        <div className="mt-6">
          <Link href="/produits" className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition">
            Voir nos braseros
          </Link>
        </div>
      </div>
    ),
  },
  accessoires: {
    title: "Accessoires pour braseros",
    content: (
      <div className="space-y-6">
        <p>
          Complétez votre brasero avec nos accessoires soigneusement sélectionnés pour optimiser votre expérience.
        </p>
        <h2 className="text-xl font-semibold">Nos catégories d&apos;accessoires</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium">🍳 Accessoires de cuisson</h3>
            <p className="text-sm text-gray-600 mt-1">Planchas, grilles, plats à paella...</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium">🔧 Outils</h3>
            <p className="text-sm text-gray-600 mt-1">Pinces, soufflets, tisonniers...</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium">🪵 Rangement bois</h3>
            <p className="text-sm text-gray-600 mt-1">Porte-bûches, paniers à bois...</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium">🛡️ Protection</h3>
            <p className="text-sm text-gray-600 mt-1">Housses, couvercles, tapis de sol...</p>
          </div>
        </div>
        <div className="mt-6">
          <Link href="/accessoires" className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition">
            Voir nos accessoires
          </Link>
        </div>
      </div>
    ),
  },

  // ============ ENTREPRISES ============
  "commande-affaires": {
    title: "Commandes professionnelles",
    content: (
      <div className="space-y-6">
        <p>
          {settings.storeName} accompagne les professionnels dans leurs projets d&apos;aménagement extérieur : hôtels, restaurants, collectivités, architectes paysagistes...
        </p>
        <h2 className="text-xl font-semibold">Nos services pour les professionnels</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Tarifs préférentiels</strong> pour les commandes en volume</li>
          <li><strong>Conseils personnalisés</strong> pour choisir les produits adaptés à votre projet</li>
          <li><strong>Livraison sur chantier</strong> avec prise de rendez-vous</li>
          <li><strong>Facturation adaptée</strong> (acompte, paiement à réception...)</li>
          <li><strong>Devis gratuit</strong> sous 48h</li>
        </ul>
        <h2 className="text-xl font-semibold">Ils nous font confiance</h2>
        <p>
          Nous avons déjà équipé de nombreux établissements : hôtels de charme, restaurants étoilés, campings haut de gamme, mairies...
        </p>
        <h2 className="text-xl font-semibold">Demander un devis</h2>
        <p>
          Contactez-nous à <strong>{settings.storeEmail}</strong> ou au <strong>{settings.storePhone}</strong> pour discuter de votre projet.
        </p>
      </div>
    ),
  },
  "produits-sur-mesure": {
    title: "Produits sur mesure",
    content: (
      <div className="space-y-6">
        <p>
          Vous avez un projet unique ? Notre atelier peut créer des braseros sur mesure adaptés à vos besoins spécifiques.
        </p>
        <h2 className="text-xl font-semibold">Ce que nous proposons</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Dimensions personnalisées :</strong> Adaptez la taille à votre espace</li>
          <li><strong>Gravure et personnalisation :</strong> Logo, motifs, initiales...</li>
          <li><strong>Finitions spéciales :</strong> Choix des matériaux et traitements</li>
          <li><strong>Accessoires intégrés :</strong> Plancha, grille, rangement...</li>
        </ul>
        <h2 className="text-xl font-semibold">Le processus</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Prise de contact et discussion de votre projet</li>
          <li>Étude de faisabilité et proposition de design</li>
          <li>Validation du devis</li>
          <li>Fabrication dans notre atelier (4 à 8 semaines)</li>
          <li>Livraison et installation si nécessaire</li>
        </ol>
        <p className="mt-4">
          Contactez-nous à <strong>atelier-lbf@outlook.com</strong> pour démarrer votre projet.
        </p>
      </div>
    ),
  },

  // ============ À PROPOS ============
  "a-propos-de-nous": {
    title: `À propos de ${settings.storeName}`,
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          {settings.storeName} est né de la passion pour le feu, la convivialité et le savoir-faire artisanal français.
        </p>
        <h2 className="text-xl font-semibold">Notre histoire</h2>
        <p>
          Installés à {settings.atelier.city}, au cœur des Deux-Sèvres (79), nous avons créé {settings.storeName} avec une conviction : le brasero est bien plus qu&apos;un simple objet de chauffage. C&apos;est un point de rassemblement, un créateur de souvenirs, un art de vivre.
        </p>
        <h2 className="text-xl font-semibold">Notre savoir-faire</h2>
        <p>
          Chaque brasero qui sort de notre atelier est le fruit d&apos;un travail minutieux. Nous sélectionnons les meilleurs matériaux et travaillons avec des artisans locaux pour vous proposer des produits durables et esthétiques.
        </p>
        <h2 className="text-xl font-semibold">Nos valeurs</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Qualité :</strong> Des produits conçus pour durer des années</li>
          <li><strong>Proximité :</strong> Fabrication française et service client accessible</li>
          <li><strong>Passion :</strong> L&apos;amour du beau travail et du feu</li>
          <li><strong>Conseil :</strong> Un accompagnement personnalisé pour chaque client</li>
        </ul>
      </div>
    ),
  },
  "donnees-entreprise-contact": {
    title: "Informations légales et contact",
    content: (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Informations sur l&apos;entreprise</h2>
        <div className="bg-gray-50 p-6 rounded-lg space-y-2">
          <p><strong>Raison sociale :</strong> {settings.storeName}</p>
          <p><strong>Forme juridique :</strong> SAS</p>
          <p><strong>Siège social :</strong> {settings.storeAddress}</p>
          <p><strong>SIRET :</strong> XXX XXX XXX XXXXX</p>
          <p><strong>TVA Intracommunautaire :</strong> FR XX XXX XXX XXX</p>
          <p><strong>Capital social :</strong> XX XXX €</p>
        </div>
        <h2 className="text-xl font-semibold">Coordonnées</h2>
        <div className="bg-gray-50 p-6 rounded-lg space-y-2">
          <p><strong>Email général :</strong> {settings.storeEmail}</p>
          <p><strong>Email professionnel :</strong> {settings.storeEmail}</p>
          <p><strong>Téléphone :</strong> {settings.storePhone}</p>
          <p><strong>Adresse :</strong> {settings.storeAddress}</p>
        </div>
        <h2 className="text-xl font-semibold">Hébergement du site</h2>
        <p>
          Ce site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.
        </p>
      </div>
    ),
  },
  "bulletin-information": {
    title: "Bulletin d'information",
    content: (
      <div className="space-y-6">
        <p>
          Restez informé des dernières nouveautés, promotions exclusives et conseils autour du brasero en vous inscrivant à la newsletter de {settings.storeName}.
        </p>
        <h2 className="text-xl font-semibold">Ce que vous recevrez</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>🔥 Nouveaux produits et collections</li>
          <li>💰 Offres exclusives réservées aux abonnés</li>
          <li>📖 Conseils d&apos;entretien et d&apos;utilisation</li>
          <li>🍖 Recettes et idées de cuisson au brasero</li>
          <li>🎉 Événements et actualités de l&apos;atelier</li>
        </ul>
        <h2 className="text-xl font-semibold">S&apos;inscrire</h2>
        <p>
          Pour vous inscrire, entrez votre email dans le champ prévu en bas de page ou contactez-nous directement. Vous pouvez vous désinscrire à tout moment.
        </p>
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-orange-800">
            <strong>🎁 Offre de bienvenue :</strong> -10% sur votre première commande en vous inscrivant à la newsletter !
          </p>
        </div>
      </div>
    ),
  },
  "astuces-conseils": {
    title: "Astuces et conseils",
    content: (
      <div className="space-y-6">
        <p>
          Profitez pleinement de votre brasero grâce à nos conseils d&apos;experts.
        </p>
        <h2 className="text-xl font-semibold">🔥 Allumer son brasero</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Utilisez du petit bois sec et des allume-feux naturels</li>
          <li>Construisez une pyramide avec le petit bois</li>
          <li>Ajoutez progressivement des bûches plus grosses</li>
          <li>Laissez le feu prendre avant d&apos;ajouter trop de bois</li>
        </ol>
        <h2 className="text-xl font-semibold">🧹 Entretenir son brasero</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Acier corten :</strong> Laissez la patine se former naturellement, elle protège le métal</li>
          <li><strong>Acier noir :</strong> Nettoyez régulièrement et appliquez une huile protectrice</li>
          <li><strong>Cendres :</strong> Videz les cendres une fois refroidies après chaque utilisation</li>
          <li><strong>Hivernage :</strong> Protégez votre brasero avec une housse ou rentrez-le</li>
        </ul>
        <h2 className="text-xl font-semibold">🍖 Cuisiner au brasero</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Attendez que les flammes diminuent et que les braises soient bien formées</li>
          <li>Utilisez les accessoires adaptés (plancha, grille, plat)</li>
          <li>Gérez les zones de chaleur en répartissant les braises</li>
          <li>Préchauffez vos accessoires de cuisson</li>
        </ul>
      </div>
    ),
  },
  blog: {
    title: "Blog",
    content: (
      <div className="space-y-6">
        <p>
          Bienvenue sur le blog de {settings.storeName} ! Retrouvez ici nos articles, inspirations et actualités autour de l&apos;univers du feu et de la convivialité extérieure.
        </p>
        <h2 className="text-xl font-semibold">Nos derniers articles</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <p className="text-sm text-gray-500">15 novembre 2025</p>
            <h3 className="font-medium text-lg">Comment choisir son premier brasero ?</h3>
            <p className="text-gray-600 mt-1">Guide complet pour les débutants : critères de choix, matériaux, tailles...</p>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <p className="text-sm text-gray-500">2 novembre 2025</p>
            <h3 className="font-medium text-lg">5 recettes faciles à réaliser au brasero</h3>
            <p className="text-gray-600 mt-1">Des idées simples et gourmandes pour cuisiner autour du feu.</p>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition">
            <p className="text-sm text-gray-500">18 octobre 2025</p>
            <h3 className="font-medium text-lg">L&apos;acier corten : un matériau noble et durable</h3>
            <p className="text-gray-600 mt-1">Tout savoir sur ce matériau qui fait la réputation de nos braseros.</p>
          </div>
        </div>
        <p className="text-gray-600 italic">
          Plus d&apos;articles à venir prochainement...
        </p>
      </div>
    ),
  },

  // ============ AUTRES PAGES EXISTANTES ============
  "black-friday": {
    title: "Black Friday",
    content: (
      <div className="space-y-6">
        <p>Nos offres spéciales Black Friday sur les braséros et accessoires.</p>
        <p className="text-gray-600">Les prochaines offres Black Friday seront disponibles en novembre 2026.</p>
      </div>
    ),
  },
  "braseros-bols-feu": {
    title: "Braseros bols de feu",
    content: (
      <div className="space-y-6">
        <p>Notre sélection de braséros bols pour vos moments extérieurs.</p>
        <Link href="/produits" className="text-orange-600 hover:underline">Voir nos produits →</Link>
      </div>
    ),
  },
  "chauffages-terrasse": {
    title: "Chauffages de terrasse",
    content: (
      <div className="space-y-6">
        <p>Solutions de chauffage pour prolonger vos soirées sur la terrasse.</p>
        <Link href="/produits" className="text-orange-600 hover:underline">Voir nos produits →</Link>
      </div>
    ),
  },
  "tables-brasero": {
    title: "Tables brasero",
    content: (
      <div className="space-y-6">
        <p>Braséros intégrés dans des tables pour partager et cuisiner.</p>
        <Link href="/produits" className="text-orange-600 hover:underline">Voir nos produits →</Link>
      </div>
    ),
  },
  "cheminees-jardin": {
    title: "Cheminées de jardin",
    content: (
      <div className="space-y-6">
        <p>Cheminées extérieures pour créer une ambiance chaleureuse.</p>
        <Link href="/produits" className="text-orange-600 hover:underline">Voir nos produits →</Link>
      </div>
    ),
  },
  "cheminees-electriques": {
    title: "Cheminées électriques",
    content: (
      <div className="space-y-6">
        <p>Cheminées électriques décoratives et pratiques.</p>
        <Link href="/produits" className="text-orange-600 hover:underline">Voir nos produits →</Link>
      </div>
    ),
  },
  barbecues: {
    title: "Barbecues",
    content: (
      <div className="space-y-6">
        <p>Barbecues sélectionnés pour compléter vos braséros.</p>
        <Link href="/produits" className="text-orange-600 hover:underline">Voir nos produits →</Link>
      </div>
    ),
  },
  ofyr: {
    title: "OFYR",
    content: (
      <div className="space-y-6">
        <p>Découvrez la marque OFYR et ses produits phares.</p>
        <Link href="/produits" className="text-orange-600 hover:underline">Voir les produits OFYR →</Link>
      </div>
    ),
  },
  bonfeu: {
    title: "BonFeu",
    content: (
      <div className="space-y-6">
        <p>Tout savoir sur la marque BonFeu.</p>
        <Link href="/produits" className="text-orange-600 hover:underline">Voir les produits BonFeu →</Link>
      </div>
    ),
  },
  dimplex: {
    title: "Dimplex",
    content: (
      <div className="space-y-6">
        <p>Les solutions chauffantes Dimplex pour l&apos;extérieur.</p>
        <Link href="/produits" className="text-orange-600 hover:underline">Voir les produits Dimplex →</Link>
      </div>
    ),
  },
  moodz: {
    title: "MOODZ",
    content: (
      <div className="space-y-6">
        <p>La gamme MOODZ et ses braséros design.</p>
        <Link href="/produits" className="text-orange-600 hover:underline">Voir les produits MOODZ →</Link>
      </div>
    ),
  },
  "toutes-les-marques": {
    title: "Toutes les marques",
    content: (
      <div className="space-y-6">
        <p>Vue d&apos;ensemble des marques proposées sur notre boutique.</p>
        <Link href="/produits" className="text-orange-600 hover:underline">Voir tous les produits →</Link>
      </div>
    ),
  },
  "cheque-cadeau": {
    title: "Chèque-cadeau",
    content: (
      <div className="space-y-6">
        <p>Offrez un braséro ou un accessoire avec nos chèques-cadeaux.</p>
        <p>Contactez-nous pour plus d&apos;informations sur nos cartes cadeaux.</p>
      </div>
    ),
  },
  "heures-douverture": {
    title: "Heures d'ouverture",
    content: (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Nos horaires</h2>
        <div className="bg-gray-50 p-6 rounded-lg space-y-2">
          <p><strong>Lundi - Vendredi :</strong> 9h00 - 18h00</p>
          <p><strong>Samedi :</strong> Sur rendez-vous uniquement</p>
          <p><strong>Dimanche :</strong> Fermé</p>
        </div>
        <p>
          Pour visiter notre atelier, merci de prendre rendez-vous au préalable au {settings.storePhone}.
        </p>
      </div>
    ),
  },
});

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = await getSiteSettings();
  const page = createPages(settings)[slug];

  if (!page) {
    return notFound();
  }

  return (
    <main className="bg-[var(--background)] text-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">{page.title}</h1>
        <div className="prose prose-gray max-w-none">
          {page.content}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Une question ? Contactez-nous à <a href={`mailto:${settings.storeEmail}`} className="text-orange-600 hover:underline">{settings.storeEmail}</a>
          </p>
        </div>
      </div>
    </main>
  );
}
