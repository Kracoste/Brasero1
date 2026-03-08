-- Contenu SEO pour les 3 braseros
-- À exécuter dans Supabase SQL Editor

-- ═══════════════════════════════════════
-- Le Morris
-- ═══════════════════════════════════════
UPDATE products
SET seo_content = '{
  "sections": [
    {
      "title": "Pourquoi choisir le brasero Le Morris ?",
      "blocks": [
        {
          "subtitle": "Un brasero artisanal pensé pour les amoureux du feu",
          "text": "Le Morris est bien plus qu''un simple brasero : c''est un véritable centre de convivialité pour votre jardin ou votre terrasse. Conçu et fabriqué à la main dans notre atelier de Moncoutant (Deux-Sèvres), chaque Morris est une pièce unique, façonnée avec un savoir-faire artisanal français. Son design rond et épuré s''intègre naturellement dans tous les espaces extérieurs, du jardin contemporain à la terrasse rustique."
        },
        {
          "subtitle": "Multifonction : chauffage, barbecue et plancha",
          "text": "Le Morris n''est pas un brasero décoratif. C''est un appareil multifonction qui vous accompagne toute l''année. En soirée, il diffuse une chaleur douce et réconfortante. Le week-end, il se transforme en barbecue ou en plancha pour des grillades entre amis. Grâce à son système de plancha amovible (disponible en acier carbone ou inox), passez du mode chauffage au mode cuisson en quelques secondes."
        }
      ]
    },
    {
      "title": "À qui s''adresse Le Morris ?",
      "blocks": [
        {
          "subtitle": "Pour les particuliers",
          "text": "Le Morris est idéal pour les familles et les amateurs de bons moments en extérieur. Disponible en 3 diamètres (50 cm, 80 cm et 100 cm), il s''adapte à toutes les tailles de jardins et tous les nombres de convives. Le modèle 50 cm est parfait pour un balcon ou une petite terrasse (2 à 4 personnes), tandis que le 100 cm accueille facilement des tablées de 8 à 12 personnes."
        },
        {
          "subtitle": "Pour les professionnels",
          "text": "Restaurateurs, traiteurs, gérants de gîtes ou d''espaces événementiels : Le Morris est aussi un outil professionnel. Sa robustesse, sa facilité d''entretien et sa capacité de cuisson en font un allié fiable pour vos événements en plein air. Nous proposons des tarifs adaptés aux commandes professionnelles — contactez-nous pour un devis personnalisé."
        }
      ]
    },
    {
      "title": "Les atouts du brasero Le Morris",
      "bullets": [
        "Fabrication 100 % française — atelier de Moncoutant (79)",
        "Acier corten ou acier peint thermolaqué au choix",
        "Plancha amovible en acier carbone ou inox (cuisson immédiate)",
        "3 diamètres disponibles : 50 cm, 80 cm et 100 cm",
        "Garantie fabricant 2 ans — SAV réactif basé en France",
        "Livraison soignée par transporteur spécialisé (DHL / DB Schenker)",
        "Entretien minimal — l''acier corten développe sa patine naturellement",
        "Compatible avec tous les accessoires Atelier LBF (couvercle, grille, spatule)"
      ]
    },
    {
      "title": "Le Morris : un brasero plancha à bois artisanal",
      "blocks": [
        {
          "text": "Le Morris incarne la philosophie de l''Atelier LBF : proposer des braseros durables, beaux et fonctionnels, fabriqués localement avec des matériaux de qualité. Chaque pièce est découpée, soudée et contrôlée dans notre atelier des Deux-Sèvres. Le résultat ? Un brasero qui résiste aux intempéries, qui chauffe efficacement et qui vous permet de cuisiner au feu de bois comme un vrai chef. Que vous optiez pour la finition corten (aspect rouillé naturel) ou la finition acier peint (noir mat élégant), Le Morris s''affirme comme une pièce maîtresse de votre espace extérieur."
        }
      ]
    }
  ]
}'::jsonb
WHERE slug = 'le-morris';

-- ═══════════════════════════════════════
-- Le Fermier
-- ═══════════════════════════════════════
UPDATE products
SET seo_content = '{
  "sections": [
    {
      "title": "Pourquoi choisir le brasero Le Fermier ?",
      "blocks": [
        {
          "subtitle": "L''authenticité d''un brasero rustique et robuste",
          "text": "Le Fermier porte bien son nom : c''est un brasero qui allie la solidité du monde rural à l''élégance d''un design contemporain. Fabriqué artisanalement dans notre atelier de Moncoutant (Deux-Sèvres), Le Fermier est conçu pour durer et pour être utilisé intensivement, que ce soit pour réchauffer vos soirées d''hiver ou pour des sessions de cuisson prolongées au cœur de l''été."
        },
        {
          "subtitle": "Un brasero taillé pour la cuisson au feu de bois",
          "text": "Le Fermier excelle en mode cuisson. Sa conception optimise la répartition de la chaleur pour une cuisson homogène sur toute la surface de la plancha. Viandes, poissons, légumes grillés : tout est possible avec Le Fermier. Sa plancha amovible (acier carbone ou inox au choix) se pose et se retire en un instant, vous laissant la liberté de passer du mode barbecue au mode feu de camp à tout moment."
        }
      ]
    },
    {
      "title": "À qui s''adresse Le Fermier ?",
      "blocks": [
        {
          "subtitle": "Pour les particuliers exigeants",
          "text": "Le Fermier séduit les amateurs de cuisson au feu de bois qui recherchent un produit authentique et durable. Avec ses 3 diamètres disponibles (50 cm, 80 cm et 100 cm), il s''adapte à votre espace et à vos besoins. Le 80 cm est le format le plus populaire : assez grand pour cuisiner pour 6 à 8 convives, assez compact pour s''installer sur une terrasse standard."
        },
        {
          "subtitle": "Pour les professionnels de la restauration",
          "text": "Campings, restaurants avec terrasse, food trucks, fermes auberges : Le Fermier est un outil de travail fiable et spectaculaire. Cuisiner au feu de bois devant vos clients crée une expérience unique qui fidélise votre clientèle. Sa robustesse artisanale garantit une utilisation intensive saison après saison."
        }
      ]
    },
    {
      "title": "Les atouts du brasero Le Fermier",
      "bullets": [
        "Fabrication artisanale 100 % française — atelier de Moncoutant (79)",
        "Design rustique et contemporain — s''intègre dans tous les environnements",
        "Acier corten (patine naturelle) ou acier peint thermolaqué (noir mat)",
        "Plancha amovible acier carbone ou inox — passage chauffage/cuisson instantané",
        "3 tailles au choix : Ø 50 cm, 80 cm ou 100 cm",
        "Garantie fabricant 2 ans avec SAV en France",
        "Livraison sécurisée par DHL ou DB Schenker",
        "Compatible avec l''ensemble des accessoires Atelier LBF"
      ]
    },
    {
      "title": "Le Fermier : le brasero qui a du caractère",
      "blocks": [
        {
          "text": "Le Fermier est le brasero de ceux qui n''ont pas peur d''utiliser leur matériel. Robuste, généreux et chaleureux, il est pensé pour les longues soirées autour du feu et les repas conviviaux en plein air. Fabriqué en acier de qualité dans notre atelier des Deux-Sèvres, chaque Fermier est une pièce artisanale contrôlée individuellement. L''acier corten lui donne un cachet unique qui évolue avec le temps — sa patine rouille se stabilise naturellement et protège le métal pour des années de plaisir."
        }
      ]
    }
  ]
}'::jsonb
WHERE slug = 'le-fermier';

-- ═══════════════════════════════════════
-- L'Obélix
-- ═══════════════════════════════════════
UPDATE products
SET seo_content = '{
  "sections": [
    {
      "title": "Pourquoi choisir le brasero L''Obélix ?",
      "blocks": [
        {
          "subtitle": "Le brasero XXL pour les grandes tablées",
          "text": "L''Obélix est le brasero de ceux qui voient grand. Inspiré par la générosité et la convivialité gauloise, il est conçu pour accueillir famille et amis autour d''un feu chaleureux et de grillades mémorables. Fabriqué à la main dans notre atelier de Moncoutant (Deux-Sèvres), L''Obélix impressionne par sa présence et sa capacité à réchauffer les plus grandes terrasses."
        },
        {
          "subtitle": "Puissance et polyvalence",
          "text": "L''Obélix ne se contente pas de faire joli. Sa grande surface de chauffe irradie une chaleur puissante, idéale pour les soirées fraîches de printemps et d''automne. En mode cuisson, sa plancha amovible (acier carbone ou inox) offre une surface généreuse pour préparer des repas complets au feu de bois : entrecôtes, gambas, légumes de saison, et même des crêpes pour le dessert."
        }
      ]
    },
    {
      "title": "À qui s''adresse L''Obélix ?",
      "blocks": [
        {
          "subtitle": "Pour les familles nombreuses et les amateurs de réceptions",
          "text": "Si vous aimez recevoir, L''Obélix est fait pour vous. Disponible en 3 diamètres (50 cm, 80 cm et 100 cm), le modèle 100 cm est la star des garden-parties et des repas de famille en extérieur. Sa grande capacité de cuisson permet de nourrir jusqu''à 12 convives simultanément. Le 50 cm, quant à lui, reste un choix idéal pour les espaces plus intimes."
        },
        {
          "subtitle": "Pour les professionnels de l''événementiel et de la restauration",
          "text": "L''Obélix est le brasero idéal pour les professionnels qui cherchent à créer un effet spectaculaire. Mariages en plein air, soirées privées, restaurants avec terrasse : sa taille imposante et la beauté des flammes captent l''attention de tous les invités. Sa construction artisanale en acier de qualité supérieure garantit une durabilité à toute épreuve, même en usage professionnel intensif."
        }
      ]
    },
    {
      "title": "Les atouts du brasero L''Obélix",
      "bullets": [
        "Fabrication 100 % française — forgé dans notre atelier de Moncoutant (79)",
        "Dimensions généreuses — jusqu''à Ø 100 cm pour les grandes tablées",
        "Acier corten (patine naturelle unique) ou acier peint thermolaqué",
        "Plancha amovible acier carbone ou inox — cuisson professionnelle au feu de bois",
        "Surface de chauffe optimisée — chaleur puissante et homogène",
        "Garantie fabricant 2 ans — qualité contrôlée pièce par pièce",
        "Livraison par transporteur spécialisé DHL / DB Schenker",
        "Compatible avec tous les accessoires de la gamme Atelier LBF"
      ]
    },
    {
      "title": "L''Obélix : le roi des braseros artisanaux",
      "blocks": [
        {
          "text": "L''Obélix est le fleuron de la gamme Atelier LBF. Son nom évoque la force, la générosité et la convivialité — des valeurs que l''on retrouve dans chaque détail de sa fabrication. Découpé, roulé et soudé à la main dans notre atelier des Deux-Sèvres, chaque Obélix est une pièce artisanale qui porte la signature de son créateur. En acier corten, sa patine rouille évolue au fil des saisons pour devenir unique. En acier peint thermolaqué noir mat, il affiche un look moderne et élégant. Dans les deux cas, L''Obélix est un investissement durable qui transforme votre espace extérieur en lieu de vie à part entière."
        }
      ]
    }
  ]
}'::jsonb
WHERE slug = 'lobelix';
