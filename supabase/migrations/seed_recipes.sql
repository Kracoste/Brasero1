-- Seed 12 vraies recettes testées pour brasero plancha
-- Images à ajouter depuis l'admin (bucket 'recipes')

INSERT INTO recipes (slug, title, meta_title, meta_description, category, excerpt, description, ingredients, instructions, tips, prep_time_minutes, cook_time_minutes, servings, difficulty, related_product_slug, tags, keywords, is_published, published_at)
VALUES

-- 1. Côte de bœuf à la plancha
('cote-de-boeuf-plancha-brasero',
 'Côte de bœuf à la plancha : la méthode 2 zones',
 'Côte de bœuf à la plancha brasero : cuisson parfaite 2 zones | Atelier LBF',
 'Maîtrisez la cuisson de la côte de bœuf à la plancha avec la technique 2 zones : saisie puis cuisson douce. Temps, température, repos : tous les secrets.',
 'viandes',
 'La méthode des 2 zones : saisir côté feu vif, finir côté doux. Une viande saignante, une croûte caramélisée, zéro stress.',
 E'Une côte de bœuf bien cuite à la plancha, c''est avant tout une question de zones thermiques. Sur un brasero plancha, vous disposez naturellement d''un gradient de chaleur : très chaud au centre (au-dessus du foyer), plus doux sur les bords.\n\nLa règle : on saisit la viande sur la zone la plus chaude pour développer la croûte de Maillard (cette couleur brune et les arômes grillés), puis on la déplace sur la zone douce pour finir la cuisson à cœur sans brûler l''extérieur.\n\nUne côte de 1,2 kg pour 2-3 personnes, bien épaisse (au moins 4 cm), c''est le format idéal. En dessous, la viande cuit trop vite et devient sèche.',
 '[
   {"quantity": "1", "unit": "pièce", "name": "côte de bœuf de 1,2 kg (4 cm d''épaisseur)"},
   {"quantity": "2", "unit": "c. à soupe", "name": "huile d''olive"},
   {"quantity": "4", "unit": "", "name": "gousses d''ail écrasées"},
   {"quantity": "3", "unit": "branches", "name": "de thym frais"},
   {"quantity": "2", "unit": "branches", "name": "de romarin"},
   {"quantity": "50", "unit": "g", "name": "de beurre demi-sel"},
   {"quantity": "", "unit": "", "name": "fleur de sel et poivre du moulin"}
 ]'::jsonb,
 '[
   {"step": 1, "text": "Sortez la côte de bœuf du réfrigérateur 1 heure avant la cuisson. Épongez-la, huilez-la légèrement, poivrez généreusement (pas de sel avant cuisson)."},
   {"step": 2, "text": "Allumez votre brasero 20 à 30 minutes avant : la plancha doit être à 250-280°C sur la zone chaude. Pour tester, une goutte d''eau doit s''évaporer en 1 seconde."},
   {"step": 3, "text": "Saisissez la côte 3 minutes de chaque côté sur la zone très chaude, sans la bouger, pour former la croûte dorée."},
   {"step": 4, "text": "Déplacez-la sur la zone douce (~180°C). Ajoutez le beurre, l''ail et les herbes. Arrosez la viande toutes les 30 secondes avec le beurre parfumé pendant 6 à 8 minutes."},
   {"step": 5, "text": "Contrôlez la cuisson au thermomètre : 52°C à cœur pour saignant, 56°C pour à point. Sortez la viande et enveloppez-la dans de l''aluminium."},
   {"step": 6, "text": "Laissez reposer 10 minutes avant de trancher. Salez à la fleur de sel au moment de servir."}
 ]'::jsonb,
 E'Le repos est aussi important que la cuisson : les fibres se détendent et les jus se répartissent. Trancher une côte directement après cuisson, c''est perdre la moitié du jus sur la planche.\n\nGardez l''ail et les herbes utilisés pour la cuisson : ils accompagnent parfaitement la viande une fois tranchée.',
 30, 15, 3, 'moyen', 'brasero-obelix-80',
 ARRAY['boeuf', 'viande rouge', 'plancha', 'côte de boeuf'],
 ARRAY['côte de boeuf plancha', 'cuisson côte boeuf brasero', 'recette plancha boeuf', 'côte de boeuf 2 zones'],
 true, NOW()),

-- 2. Magret de canard à la plancha
('magret-canard-plancha-brasero',
 'Magret de canard à la plancha : peau croustillante, chair rosée',
 'Magret de canard à la plancha brasero | Peau croustillante | Atelier LBF',
 'La recette du magret de canard parfait à la plancha brasero : peau incisée, cuisson côté gras d''abord, finition au miel. Pas à pas détaillé.',
 'viandes',
 'Le magret à la plancha, c''est la technique de grand-mère revisitée : on commence côté gras à froid, on laisse la graisse fondre, on finit à feu vif.',
 E'Le magret de canard est l''une des viandes les plus faciles à cuisiner au brasero — à condition de respecter une règle d''or : partir à froid côté gras.\n\nSi vous mettez un magret sur une plancha brûlante, le gras ne fond pas, il brûle et durcit. En le posant sur plancha froide et en montant progressivement en température, vous obtenez une peau fine et croustillante, et un gras fondant.',
 '[
   {"quantity": "2", "unit": "pièces", "name": "magrets de canard (350-400 g chacun)"},
   {"quantity": "1", "unit": "c. à soupe", "name": "miel liquide"},
   {"quantity": "2", "unit": "c. à soupe", "name": "vinaigre balsamique"},
   {"quantity": "1", "unit": "pincée", "name": "cinq-baies"},
   {"quantity": "", "unit": "", "name": "fleur de sel, poivre"}
 ]'::jsonb,
 '[
   {"step": 1, "text": "Incisez la peau des magrets en croisillons (sans entailler la chair), salez, poivrez côté chair uniquement."},
   {"step": 2, "text": "Posez les magrets côté peau sur la plancha FROIDE. Allumez le feu doucement et laissez la graisse fondre pendant 8 à 10 minutes : la peau devient dorée et croustillante."},
   {"step": 3, "text": "Récupérez l''excès de graisse avec une cuillère (gardez-la pour faire sauter des pommes de terre !)."},
   {"step": 4, "text": "Retournez les magrets côté chair sur zone chaude. Saisissez 3 à 4 minutes selon l''épaisseur pour une cuisson rosée."},
   {"step": 5, "text": "Déglacez la plancha avec le vinaigre balsamique et le miel, nappez les magrets 30 secondes de chaque côté."},
   {"step": 6, "text": "Laissez reposer 5 minutes sous une feuille d''aluminium. Tranchez en biais et servez avec la sauce récupérée sur la plancha."}
 ]'::jsonb,
 E'Saupoudrez une pincée de cinq-baies au moment de servir : ça réveille le sucré du miel.\n\nPour un accompagnement parfait : pommes de terre sarladaises dans la graisse de canard récupérée à l''étape 3.',
 15, 20, 4, 'facile', 'brasero-coffy-80',
 ARRAY['canard', 'magret', 'plancha', 'miel'],
 ARRAY['magret canard plancha', 'recette magret brasero', 'magret canard miel plancha', 'cuisson magret plancha'],
 true, NOW()),

-- 3. Brochettes d'agneau marinées
('brochettes-agneau-thym-citron-brasero',
 'Brochettes d''agneau marinées thym-citron au brasero',
 'Brochettes d''agneau au brasero : marinade thym citron | Atelier LBF',
 'Recette méditerranéenne testée au brasero : épaule d''agneau marinée 4h, brochettes grillées à la flamme. Marinade, temps de cuisson, astuces.',
 'viandes',
 'Épaule d''agneau taillée en cubes, marinée thym-citron-ail, grillée directement sur la flamme : 10 minutes et c''est prêt.',
 E'L''épaule d''agneau est plus savoureuse que le gigot pour des brochettes — elle contient juste ce qu''il faut de gras pour rester moelleuse à la cuisson haute température.\n\nLa marinade joue sur trois registres : le thym pour l''herbe méditerranéenne, le citron pour l''acidité qui attendrit la viande, l''ail pour la rondeur.\n\n4 heures minimum de marinade, mais pas plus de 24h : l''acide du citron finirait par "cuire" la viande.',
 '[
   {"quantity": "800", "unit": "g", "name": "d''épaule d''agneau désossée"},
   {"quantity": "1", "unit": "", "name": "citron jaune (jus + zeste)"},
   {"quantity": "4", "unit": "c. à soupe", "name": "d''huile d''olive"},
   {"quantity": "4", "unit": "branches", "name": "de thym frais"},
   {"quantity": "3", "unit": "", "name": "gousses d''ail écrasées"},
   {"quantity": "1", "unit": "c. à café", "name": "de cumin moulu"},
   {"quantity": "2", "unit": "", "name": "oignons rouges en quartiers"},
   {"quantity": "1", "unit": "", "name": "poivron rouge en cubes"},
   {"quantity": "", "unit": "", "name": "sel, poivre"}
 ]'::jsonb,
 '[
   {"step": 1, "text": "Taillez l''agneau en cubes de 3 cm. Dans un saladier, mélangez l''huile d''olive, le jus et le zeste de citron, l''ail, le thym effeuillé et le cumin."},
   {"step": 2, "text": "Ajoutez l''agneau, mélangez bien, couvrez et laissez mariner au frais 4 à 6 heures (idéalement une nuit)."},
   {"step": 3, "text": "30 minutes avant la cuisson, sortez la viande. Enfilez les cubes sur les brochettes en alternant avec oignon rouge et poivron."},
   {"step": 4, "text": "Chauffez votre brasero avec grille de cuisson positionnée à 10 cm des braises. Posez les brochettes, salez et poivrez."},
   {"step": 5, "text": "Cuisez 3 minutes par face (12 min au total pour une cuisson rosée), en arrosant avec le reste de marinade."},
   {"step": 6, "text": "Laissez reposer 3 minutes avant de servir avec un tzatziki ou une semoule aux herbes."}
 ]'::jsonb,
 E'Utilisez des brochettes en acier plutôt qu''en bambou : elles conduisent la chaleur et cuisent la viande de l''intérieur aussi.\n\nSi vous aimez plus relevé, ajoutez 1/2 c. à café de piment doux (Espelette ou paprika fumé) à la marinade.',
 20, 15, 4, 'facile', 'brasero-obelix-80',
 ARRAY['agneau', 'brochettes', 'marinade', 'mediterraneen'],
 ARRAY['brochettes agneau brasero', 'marinade agneau plancha', 'recette brochettes feu de bois', 'agneau brasero'],
 true, NOW()),

-- 4. Poulet crapaudine
('poulet-crapaudine-feu-bois-brasero',
 'Poulet en crapaudine au feu de bois',
 'Poulet crapaudine brasero : cuisson uniforme au feu de bois | Atelier LBF',
 'Le poulet crapaudine au brasero : découpe à plat pour cuisson uniforme, marinade à l''huile et paprika fumé. 1h de cuisson, chair juteuse.',
 'viandes',
 'Poulet entier ouvert en crapaudine, posé à plat sur la grille, cuit lentement au-dessus des braises : la méthode la plus simple pour un poulet parfait.',
 E'La technique de la crapaudine consiste à ouvrir le poulet le long de la colonne et à l''aplatir pour qu''il cuise sur toute sa surface en même temps. Résultat : cuisson uniforme, peau croustillante partout, chair moelleuse.\n\nCette méthode divise le temps de cuisson par deux par rapport à un poulet entier en rôti — et c''est infiniment meilleur qu''un poulet tourné à la rôtissoire, qui se dessèche souvent.',
 '[
   {"quantity": "1", "unit": "", "name": "poulet fermier de 1,5 kg"},
   {"quantity": "3", "unit": "c. à soupe", "name": "d''huile d''olive"},
   {"quantity": "2", "unit": "c. à café", "name": "de paprika fumé"},
   {"quantity": "1", "unit": "c. à café", "name": "d''ail en poudre"},
   {"quantity": "1", "unit": "c. à café", "name": "d''origan sec"},
   {"quantity": "1", "unit": "", "name": "citron (jus)"},
   {"quantity": "", "unit": "", "name": "sel, poivre"}
 ]'::jsonb,
 '[
   {"step": 1, "text": "Avec des ciseaux à volaille, coupez le long de la colonne vertébrale du poulet (des deux côtés) pour la retirer. Retournez le poulet et appuyez fermement sur le sternum pour l''aplatir."},
   {"step": 2, "text": "Mélangez huile, paprika fumé, ail, origan, jus de citron, sel et poivre. Badigeonnez le poulet généreusement, dessus et dessous. Laissez mariner 30 minutes (ou jusqu''à une nuit au frais)."},
   {"step": 3, "text": "Préparez un feu moyen dans le brasero. Positionnez la grille à 15 cm des braises. La cuisson doit être douce — pas de flamme qui lèche la peau."},
   {"step": 4, "text": "Posez le poulet peau vers le haut. Cuisez 30 minutes sans le bouger."},
   {"step": 5, "text": "Retournez-le peau vers le bas pour 25 à 30 minutes supplémentaires. La peau doit être bien dorée, presque croustillante."},
   {"step": 6, "text": "Vérifiez la cuisson : le jus qui sort de la cuisse doit être transparent (ou 74°C au thermomètre). Laissez reposer 10 minutes avant de découper."}
 ]'::jsonb,
 E'Ne percez pas le poulet pendant la cuisson — vous perdriez tous les jus.\n\nSi vous voulez aller plus loin : glissez des herbes (thym, romarin) et des gousses d''ail écrasées sous la peau avant cuisson. Le beurre aromatisé fond lentement et parfume la chair.',
 15, 60, 4, 'moyen', 'brasero-fermier-80',
 ARRAY['poulet', 'crapaudine', 'feu de bois', 'volaille'],
 ARRAY['poulet crapaudine brasero', 'poulet feu de bois', 'poulet entier brasero', 'recette poulet plancha'],
 true, NOW()),

-- 5. Bar entier au sel
('bar-entier-grille-sel-brasero',
 'Bar entier grillé au gros sel',
 'Bar grillé au gros sel au brasero | Poisson entier feu de bois | Atelier LBF',
 'Bar entier grillé au brasero, farci aux herbes et citron, saisi sur grille côté peau. Peau croustillante, chair nacrée. Recette précise.',
 'poissons',
 'Un bar entier, grillé sur la flamme avec juste herbes et citron dans le ventre : la cuisson la plus honnête qui soit.',
 E'Le bar (ou loup, selon les régions) est le poisson idéal pour la cuisson au feu de bois : chair ferme, peau résistante, goût marqué. Entier, il cuit uniformément et garde toute son humidité — ce qui est impossible avec un filet.\n\nPas de marinade : du sel, du citron, quelques herbes. Le poisson frais n''a besoin de rien de plus.',
 '[
   {"quantity": "2", "unit": "", "name": "bars entiers de 500-600 g (vidés, écaillés)"},
   {"quantity": "1", "unit": "", "name": "citron en rondelles"},
   {"quantity": "4", "unit": "branches", "name": "de fenouil (ou aneth)"},
   {"quantity": "4", "unit": "branches", "name": "de thym"},
   {"quantity": "3", "unit": "c. à soupe", "name": "d''huile d''olive"},
   {"quantity": "", "unit": "", "name": "gros sel, poivre"}
 ]'::jsonb,
 '[
   {"step": 1, "text": "Incisez les flancs des bars (3 entailles peu profondes de chaque côté) pour une cuisson uniforme. Salez l''intérieur au gros sel, glissez rondelles de citron et herbes dans le ventre."},
   {"step": 2, "text": "Huilez la peau au pinceau et saupoudrez de gros sel (la peau sera croustillante)."},
   {"step": 3, "text": "Posez la grille à 15 cm des braises vives. Huilez bien les barreaux avec un pinceau ou un chiffon pour éviter que la peau n''accroche."},
   {"step": 4, "text": "Déposez les poissons sur la grille, ne les touchez pas pendant 6 minutes — la peau doit se décoller naturellement."},
   {"step": 5, "text": "Retournez-les délicatement avec deux spatules. Cuisez encore 5 à 6 minutes côté peau blanche."},
   {"step": 6, "text": "Vérifiez la cuisson : la chair doit se détacher facilement de l''arête centrale. Servez immédiatement avec un filet d''huile d''olive et des quartiers de citron."}
 ]'::jsonb,
 E'Le test de la peau qui se décolle : si vous essayez de retourner le poisson et qu''il résiste, c''est qu''il n''est pas prêt. Attendez 30 secondes de plus.\n\nAccompagnement parfait : pommes de terre rattes (voir notre recette) ou simplement du pain grillé frotté à l''ail.',
 10, 15, 4, 'moyen', 'plancha-inox-10mm',
 ARRAY['poisson', 'bar', 'loup', 'grille', 'feu de bois'],
 ARRAY['bar grille brasero', 'poisson entier plancha', 'bar feu de bois', 'loup grille brasero'],
 true, NOW()),

-- 6. Saint-Jacques beurre d'herbes
('saint-jacques-plancha-beurre-herbes',
 'Noix de Saint-Jacques à la plancha, beurre d''herbes',
 'Saint-Jacques à la plancha brasero | Saisie parfaite 2 min | Atelier LBF',
 'La cuisson des Saint-Jacques à la plancha : 90 secondes de chaque côté à plancha très chaude, beurre d''herbes maison. Recette pro simple.',
 'poissons',
 'Saint-Jacques juste saisies, cœur nacré : 2 minutes montre en main. Le secret, c''est la température de la plancha — très chaude, très sèche.',
 E'La Saint-Jacques est redoutablement simple à réussir à condition de respecter deux règles : une plancha très chaude (sinon la chair rend de l''eau et bout au lieu de saisir), et une cuisson courte (90 secondes par face maximum).\n\nJ''insiste sur la plancha SÈCHE : pas d''huile, pas de beurre au moment de poser les noix. On assaisonne juste avec une noisette de beurre d''herbes APRÈS retournement.',
 '[
   {"quantity": "12", "unit": "", "name": "noix de Saint-Jacques fraîches (sans corail si vous préférez)"},
   {"quantity": "60", "unit": "g", "name": "de beurre demi-sel"},
   {"quantity": "1", "unit": "", "name": "échalote finement ciselée"},
   {"quantity": "2", "unit": "c. à soupe", "name": "de persil plat ciselé"},
   {"quantity": "1", "unit": "c. à soupe", "name": "de ciboulette ciselée"},
   {"quantity": "1", "unit": "", "name": "citron (zeste)"},
   {"quantity": "", "unit": "", "name": "fleur de sel, poivre blanc"}
 ]'::jsonb,
 '[
   {"step": 1, "text": "Préparez le beurre d''herbes : mélangez beurre pommade, échalote, persil, ciboulette, zeste de citron. Réservez à température ambiante."},
   {"step": 2, "text": "Épongez très bien les Saint-Jacques avec du papier absorbant : l''humidité empêche la saisie. Pas de sel avant cuisson, il ferait ressortir l''eau."},
   {"step": 3, "text": "Chauffez la plancha à vide à forte puissance. Elle doit être à 250-280°C (une goutte d''eau s''évapore instantanément)."},
   {"step": 4, "text": "Posez les Saint-Jacques sur la plancha SÈCHE, bien espacées. Ne les touchez pas pendant 90 secondes."},
   {"step": 5, "text": "Retournez-les, déposez une petite cuillère de beurre d''herbes sur chaque noix. Cuisez 90 secondes de plus."},
   {"step": 6, "text": "Sortez-les immédiatement, assaisonnez à la fleur de sel et poivre blanc. Servez aussitôt."}
 ]'::jsonb,
 E'Si vos noix sont très grosses (plus de 40 g), prolongez à 2 minutes par face.\n\nTrès important : ne jamais recongeler des Saint-Jacques décongelées pour cette recette — elles rendront trop d''eau. Préférez de la fraîche ou de la surgelée bien épongée.\n\nAstuce chef : réserver les corails, les faire sauter 1 minute avec le reste du beurre pour une sauce à part.',
 10, 5, 4, 'moyen', 'plancha-inox-10mm',
 ARRAY['saint-jacques', 'fruits de mer', 'plancha', 'beurre herbes'],
 ARRAY['saint-jacques plancha', 'cuisson saint-jacques brasero', 'noix saint-jacques recette', 'saint-jacques beurre herbes'],
 true, NOW()),

-- 7. Gambas ail piment
('gambas-ail-piment-espelette-plancha',
 'Gambas à l''ail et piment d''Espelette',
 'Gambas plancha ail piment d''Espelette | Recette rapide | Atelier LBF',
 'Gambas grillées à la plancha, marinade ail et piment d''Espelette, 6 minutes top chrono. Recette apéritive ou plat principal.',
 'poissons',
 'Crues, marinées, grillées : 6 minutes en tout pour des gambas parfaites avec une touche basque.',
 E'Les gambas à la plancha sont un grand classique des étés languedociens, et il y a deux façons de les faire : décortiquées (plus rapide à manger) ou entières (plus savoureuses grâce aux têtes).\n\nJe privilégie les gambas entières : la tête contient tout le jus, qu''on récupère en la pressant à la fin. C''est là que le goût est.',
 '[
   {"quantity": "16", "unit": "", "name": "gambas entières (calibre 20/30)"},
   {"quantity": "4", "unit": "gousses", "name": "d''ail finement hachées"},
   {"quantity": "4", "unit": "c. à soupe", "name": "d''huile d''olive"},
   {"quantity": "1", "unit": "c. à café", "name": "de piment d''Espelette"},
   {"quantity": "1", "unit": "", "name": "citron (jus + zeste)"},
   {"quantity": "1", "unit": "bouquet", "name": "de persil plat"},
   {"quantity": "", "unit": "", "name": "fleur de sel"}
 ]'::jsonb,
 '[
   {"step": 1, "text": "Décortiquez partiellement les gambas : retirez la carapace du corps en gardant la tête et la queue. Retirez le boyau noir avec la pointe d''un couteau."},
   {"step": 2, "text": "Mélangez huile, ail haché, piment d''Espelette, zeste de citron. Badigeonnez les gambas, laissez mariner 15 minutes à température ambiante."},
   {"step": 3, "text": "Chauffez la plancha à très forte puissance (250°C). Posez les gambas côté dos sur la plancha."},
   {"step": 4, "text": "Cuisez 2 minutes sans bouger. Les carapaces rougissent."},
   {"step": 5, "text": "Retournez, ajoutez le jus de citron et la moitié du persil haché. Cuisez 2 à 3 minutes supplémentaires."},
   {"step": 6, "text": "Débarrassez dans un plat chaud, parsemez du reste de persil et d''un peu de fleur de sel. Servez immédiatement avec du pain pour saucer."}
 ]'::jsonb,
 E'Ne retirez jamais les têtes avant cuisson : c''est là qu''est le goût. Au service, pressez chaque tête au-dessus du pain pour récupérer le corail.\n\nVariation : remplacez le piment d''Espelette par du paprika fumé pour une version plus rustique.',
 15, 6, 4, 'facile', 'plancha-inox-10mm',
 ARRAY['gambas', 'crevettes', 'piment espelette', 'apéro'],
 ARRAY['gambas plancha', 'gambas ail piment', 'crevettes brasero', 'recette gambas feu de bois'],
 true, NOW()),

-- 8. Aubergines parmigiana
('aubergines-grillees-parmigiana-plancha',
 'Aubergines grillées façon parmigiana express',
 'Aubergines plancha parmigiana | Recette italienne rapide | Atelier LBF',
 'Aubergines grillées à la plancha, garnies tomate-mozzarella-basilic : une parmigiana express en 20 minutes, cuite au feu de bois.',
 'legumes',
 'La parmigiana classique prend 2 heures au four. Cette version plancha, 20 minutes : on grille, on monte, on fond.',
 E'La parmigiana traditionnelle est un monument de la cuisine italienne qui demande beaucoup de temps — aubergines panées, cuisson longue au four. Cette version plancha garde l''essentiel (la caramélisation des aubergines, le fondant de la mozzarella) en divisant le temps par six.\n\nSecret pour des aubergines non détrempées : les dégorger au sel pendant 30 minutes AVANT cuisson. Ce quart d''heure fait toute la différence.',
 '[
   {"quantity": "2", "unit": "grosses", "name": "aubergines"},
   {"quantity": "250", "unit": "g", "name": "de mozzarella di bufala"},
   {"quantity": "400", "unit": "g", "name": "de tomates cerises"},
   {"quantity": "50", "unit": "g", "name": "de parmesan râpé"},
   {"quantity": "1", "unit": "bouquet", "name": "de basilic frais"},
   {"quantity": "4", "unit": "c. à soupe", "name": "d''huile d''olive"},
   {"quantity": "2", "unit": "", "name": "gousses d''ail"},
   {"quantity": "", "unit": "", "name": "sel, poivre"}
 ]'::jsonb,
 '[
   {"step": 1, "text": "Tranchez les aubergines en rondelles de 1 cm. Salez-les généreusement et laissez dégorger 30 minutes dans une passoire. Rincez, épongez."},
   {"step": 2, "text": "Coupez les tomates cerises en deux. Tranchez la mozzarella en rondelles, épongez-la bien."},
   {"step": 3, "text": "Badigeonnez les rondelles d''aubergine d''huile d''olive. Cuisez-les sur plancha chaude 3 minutes par face, jusqu''à coloration dorée."},
   {"step": 4, "text": "Parallèlement, sur un coin de la plancha à feu doux, faites éclater les tomates cerises avec l''ail écrasé 4-5 minutes."},
   {"step": 5, "text": "Déposez les aubergines dans un plat allant au feu. Couvrez de tomates concassées, puis de rondelles de mozzarella. Saupoudrez de parmesan."},
   {"step": 6, "text": "Posez le plat sur la zone douce de la plancha, couvrez d''un couvercle ou de papier alu. Laissez fondre 5 minutes jusqu''à ce que la mozzarella coule. Parsemez de basilic ciselé et servez."}
 ]'::jsonb,
 E'Si vous voulez une version plus consistante, ajoutez une couche de jambon cru entre aubergine et tomate.\n\nPour un plat complet, servez avec du pain de campagne grillé à la plancha, frotté à l''ail.',
 35, 15, 4, 'facile', 'plancha-inox-10mm',
 ARRAY['legumes', 'aubergines', 'italien', 'vegetarien'],
 ARRAY['aubergines plancha', 'parmigiana brasero', 'aubergines grillees', 'legumes plancha recette'],
 true, NOW()),

-- 9. Épis de maïs beurre noisette
('epis-mais-beurre-noisette-paprika',
 'Épis de maïs au beurre noisette et paprika fumé',
 'Épis de maïs grillés au brasero | Beurre paprika fumé | Atelier LBF',
 'Épis de maïs grillés entiers sur la braise, enrobés de beurre noisette et paprika fumé. Recette américaine adaptée au brasero.',
 'legumes',
 'Le maïs grillé entier sur la braise, puis roulé dans un beurre noisette parfumé au paprika fumé : street food américaine, exécution française.',
 E'C''est l''équivalent américain de nos pommes de terre sous la cendre : le maïs cuit en robe verte, avec ses spathes (les feuilles qui l''entourent), directement sur les braises. Les grains sortent juteux, légèrement fumés, et la double cuisson les caramélise.\n\nÀ servir en entrée ou en accompagnement de viande grillée.',
 '[
   {"quantity": "4", "unit": "", "name": "épis de maïs frais avec leurs spathes"},
   {"quantity": "80", "unit": "g", "name": "de beurre demi-sel"},
   {"quantity": "1", "unit": "c. à café", "name": "de paprika fumé"},
   {"quantity": "1", "unit": "pincée", "name": "de piment d''Espelette"},
   {"quantity": "1", "unit": "", "name": "citron vert (zeste)"},
   {"quantity": "2", "unit": "c. à soupe", "name": "de coriandre fraîche ciselée"}
 ]'::jsonb,
 '[
   {"step": 1, "text": "Faites tremper les épis entiers (avec spathes) dans l''eau froide pendant 15 minutes — les feuilles ne brûleront pas sur le feu."},
   {"step": 2, "text": "Pendant ce temps, faites chauffer le beurre dans une petite casserole à feu moyen jusqu''à ce qu''il devienne noisette (mousse blonde, odeur de noisette). Retirez du feu, ajoutez paprika, piment, zeste de citron vert."},
   {"step": 3, "text": "Égouttez les épis. Posez-les directement sur une zone de braises chaudes, pas au centre du feu."},
   {"step": 4, "text": "Cuisez 15 à 20 minutes en tournant toutes les 5 minutes. Les spathes noircissent, c''est normal."},
   {"step": 5, "text": "Sortez les épis, retirez les spathes brûlées avec un torchon (attention, c''est chaud). Les grains doivent être tendres."},
   {"step": 6, "text": "Posez brièvement les épis nus sur la plancha ou grille chaude pour les marquer (1 min). Badigeonnez généreusement de beurre noisette paprika, parsemez de coriandre. Servez."}
 ]'::jsonb,
 E'Variation mexicaine (elote) : remplacez la coriandre par de la feta émiettée et un trait de mayo au citron vert. Inattendu et excellent.\n\nPour gagner du temps : vous pouvez faire le beurre noisette 2 jours avant et le réchauffer doucement.',
 25, 20, 4, 'facile', 'brasero-coffy-80',
 ARRAY['mais', 'legumes', 'paprika', 'street food'],
 ARRAY['mais grille brasero', 'epis mais feu de bois', 'mais plancha recette', 'mais braise'],
 true, NOW()),

-- 10. Pommes de terre rattes
('pommes-terre-rattes-gros-sel-romarin',
 'Pommes de terre rattes au gros sel et romarin',
 'Pommes de terre rattes brasero | Gros sel romarin | Atelier LBF',
 'Pommes de terre rattes cuites en papillote sur la braise, ouvertes et finies à la plancha avec gros sel et romarin. Ultra-moelleuses.',
 'legumes',
 'Cuisson en papillote dans la braise pour le fondant, puis finition plancha pour la peau croustillante. L''accompagnement parfait.',
 E'Les rattes sont les pommes de terre idéales pour le brasero : leur chair ferme ne s''écrase pas, leur peau fine caramélise bien. Cette double cuisson papillote + plancha donne la texture parfaite : intérieur fondant, extérieur doré et croustillant.\n\nUn accompagnement qui se marie avec tout : côte de bœuf, bar grillé, brochettes d''agneau.',
 '[
   {"quantity": "800", "unit": "g", "name": "de pommes de terre rattes (petits calibres)"},
   {"quantity": "4", "unit": "branches", "name": "de romarin frais"},
   {"quantity": "6", "unit": "gousses", "name": "d''ail non pelées"},
   {"quantity": "4", "unit": "c. à soupe", "name": "d''huile d''olive"},
   {"quantity": "2", "unit": "c. à soupe", "name": "de gros sel"},
   {"quantity": "30", "unit": "g", "name": "de beurre"},
   {"quantity": "", "unit": "", "name": "poivre du moulin"}
 ]'::jsonb,
 '[
   {"step": 1, "text": "Lavez bien les rattes sans les éplucher. Épongez-les. Froissez les branches de romarin pour libérer les arômes."},
   {"step": 2, "text": "Préparez 2 grandes feuilles de papier aluminium. Répartissez les pommes de terre, ajoutez ail, romarin, 2 c. à soupe d''huile, gros sel. Refermez hermétiquement les papillotes."},
   {"step": 3, "text": "Posez les papillotes directement sur une zone de braises tièdes (pas trop vives). Cuisez 30 minutes en les retournant à mi-parcours."},
   {"step": 4, "text": "Vérifiez la cuisson en piquant avec une pointe de couteau : elle doit glisser sans résistance. Sinon, prolongez 5 à 10 minutes."},
   {"step": 5, "text": "Ouvrez les papillotes, écrasez légèrement les rattes avec le fond d''un verre (elles s''ouvrent sans s''écraser)."},
   {"step": 6, "text": "Chauffez la plancha à feu vif avec le reste d''huile et le beurre. Faites colorer les pommes de terre écrasées 2 minutes de chaque côté. Poivrez, servez immédiatement."}
 ]'::jsonb,
 E'Les gousses d''ail confites dans la papillote sont un cadeau : pressez-les sur une tranche de pain grillé, c''est divin.\n\nVariation : ajoutez des oignons nouveaux coupés en deux dans la papillote pour un accompagnement plus parfumé.',
 10, 40, 4, 'facile', 'brasero-fermier-80',
 ARRAY['pommes de terre', 'rattes', 'romarin', 'accompagnement'],
 ARRAY['pommes de terre brasero', 'rattes feu de bois', 'patate plancha', 'pommes terre papillote braise'],
 true, NOW()),

-- 11. Pêches rôties miel thym
('peches-roties-miel-thym-plancha',
 'Pêches rôties au miel et thym',
 'Pêches rôties plancha | Dessert été miel thym | Atelier LBF',
 'Pêches jaunes rôties à la plancha, miel chaud et thym frais, servies avec fromage blanc. Dessert rapide et fin, cuisson 5 minutes.',
 'desserts',
 'Pêches coupées en deux, caramélisées à la plancha côté chair, napées de miel chaud au thym. Un dessert en 10 minutes.',
 E'C''est l''un de ces desserts qui paraissent minimalistes mais qui impressionnent toujours : des pêches mûres coupées en deux, caramélisées sur plancha chaude jusqu''à ce que le sucre naturel se transforme en caramel doré.\n\nLe miel et le thym viennent amplifier le côté méditerranéen du fruit. Choisissez des pêches jaunes bien mûres (pas dures) mais fermes — elles doivent tenir à la cuisson.',
 '[
   {"quantity": "6", "unit": "", "name": "pêches jaunes mûres mais fermes"},
   {"quantity": "4", "unit": "c. à soupe", "name": "de miel de thym (ou toutes fleurs)"},
   {"quantity": "4", "unit": "branches", "name": "de thym frais"},
   {"quantity": "30", "unit": "g", "name": "de beurre demi-sel"},
   {"quantity": "1", "unit": "", "name": "citron (jus)"},
   {"quantity": "4", "unit": "c. à soupe", "name": "de fromage blanc ou mascarpone"}
 ]'::jsonb,
 '[
   {"step": 1, "text": "Coupez les pêches en deux, retirez les noyaux. Citronnez les faces coupées pour éviter l''oxydation."},
   {"step": 2, "text": "Chauffez la plancha à feu moyen-vif. Faites fondre le beurre, ajoutez les branches de thym pour parfumer."},
   {"step": 3, "text": "Posez les pêches côté chair sur la plancha beurrée. Laissez caraméliser 3-4 minutes sans bouger — la chair doit dorer."},
   {"step": 4, "text": "Retournez côté peau, arrosez de miel (qui coule sur la plancha et caramélise aussi). Cuisez 2 minutes de plus."},
   {"step": 5, "text": "Disposez les pêches dans des assiettes, récupérez les sucs caramélisés de la plancha (miel + jus de pêche) et nappez."},
   {"step": 6, "text": "Servez chaud avec une cuillère de fromage blanc froid ou mascarpone. Décorez avec les brins de thym."}
 ]'::jsonb,
 E'Variation hivernale : remplacez les pêches par des poires Williams et le thym par de la cannelle.\n\nAstuce sommelière : ce dessert appelle un moelleux léger (Jurançon, Monbazillac) ou un thé Earl Grey glacé si pas d''alcool.',
 10, 8, 4, 'facile', 'plancha-inox-10mm',
 ARRAY['dessert', 'peches', 'miel', 'thym', 'fruits'],
 ARRAY['peches plancha', 'peches roties miel', 'dessert brasero', 'fruit grille feu de bois'],
 true, NOW()),

-- 12. Ananas flambé rhum
('ananas-flambe-rhum-plancha',
 'Ananas flambé au rhum sur plancha',
 'Ananas flambé rhum à la plancha | Dessert spectaculaire | Atelier LBF',
 'Ananas Victoria tranché à la plancha, caramélisé au sucre brun et flambé au rhum brun. Dessert exotique à flamber devant les invités.',
 'desserts',
 'Tranches d''ananas caramélisées sur plancha chaude, flambées au rhum ambré devant les invités : le dessert-spectacle par excellence.',
 E'Rien de plus spectaculaire qu''un flambage à table — les flammes bleues qui dansent sur les tranches d''ananas, l''odeur de rhum et de caramel qui se répand. C''est le dessert-spectacle parfait pour un repas d''été en extérieur.\n\nChoisissez un ananas Victoria (petit, très sucré) plutôt qu''un ananas classique : la chair est moins fibreuse et le goût plus concentré.',
 '[
   {"quantity": "1", "unit": "", "name": "ananas Victoria bien mûr"},
   {"quantity": "50", "unit": "g", "name": "de beurre demi-sel"},
   {"quantity": "4", "unit": "c. à soupe", "name": "de sucre roux (cassonade)"},
   {"quantity": "1", "unit": "", "name": "gousse de vanille"},
   {"quantity": "8", "unit": "cl", "name": "de rhum brun (type agricole)"},
   {"quantity": "1", "unit": "pincée", "name": "de cannelle"},
   {"quantity": "", "unit": "", "name": "glace vanille pour servir"}
 ]'::jsonb,
 '[
   {"step": 1, "text": "Épluchez l''ananas, retirez les yeux et tranchez-le en rondelles de 1,5 cm d''épaisseur. Retirez le cœur central avec un emporte-pièce ou un verre."},
   {"step": 2, "text": "Chauffez la plancha à feu moyen. Faites fondre le beurre, ajoutez la gousse de vanille fendue et la cannelle."},
   {"step": 3, "text": "Posez les tranches d''ananas sur la plancha beurrée. Saupoudrez la moitié du sucre roux. Cuisez 3 minutes jusqu''à caramélisation."},
   {"step": 4, "text": "Retournez, saupoudrez le reste du sucre. Cuisez 2 à 3 minutes de plus — le sucre doit former une croûte ambrée."},
   {"step": 5, "text": "Versez le rhum dans un petit ramequin à côté de la plancha. Éloignez-vous, approchez une flamme (briquet long) : le rhum s''enflamme."},
   {"step": 6, "text": "Versez le rhum enflammé sur les tranches d''ananas (attention, grande flamme 10-15 secondes). Laissez les flammes s''éteindre. Servez avec une boule de glace vanille."}
 ]'::jsonb,
 E'Sécurité flambage : éloignez le plat de la plancha avant de flamber, tenez cheveux longs et manches loin des flammes. Ne jamais flamber sous une hotte en marche.\n\nVersion sans alcool : remplacez le rhum par du jus d''orange réduit avec une goutte d''extrait de vanille — pas de flambage mais la sauce reste délicieuse.',
 15, 10, 4, 'moyen', 'plancha-inox-10mm',
 ARRAY['dessert', 'ananas', 'flambe', 'rhum', 'exotique'],
 ARRAY['ananas flambe plancha', 'ananas rhum brasero', 'dessert flambe', 'ananas grille plancha'],
 true, NOW());
