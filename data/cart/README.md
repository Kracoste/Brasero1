## Configuration du Panier et des Favoris

### Tables Supabase

Pour que le panier et les favoris fonctionnent, vous devez créer les tables dans votre base de données Supabase.

#### Étapes de configuration :

1. **Ouvrez votre projet Supabase** : https://supabase.com/dashboard/project/kxztmjqxsskvbqcohtgj

2. **Allez dans l'éditeur SQL** : Dans le menu latéral, cliquez sur "SQL Editor"

3. **Créez une nouvelle requête** : Cliquez sur "+ New Query"

4. **Copiez et collez le contenu du fichier `schema.sql`** dans l'éditeur

5. **Exécutez la requête** : Cliquez sur "Run" ou appuyez sur Ctrl/Cmd + Enter

Cela créera :
- Table `cart` : pour stocker les paniers des utilisateurs
- Table `cart_items` : pour stocker les articles dans chaque panier
- Table `favorites` : pour stocker les produits favoris
- Policies RLS : pour sécuriser l'accès aux données
- Indexes : pour optimiser les performances

### Fonctionnement

#### Panier
- **Utilisateurs connectés** : Le panier est sauvegardé dans Supabase et persistant
- **Utilisateurs non connectés** : Le panier est sauvegardé dans le localStorage du navigateur

#### Favoris
- **Utilisateurs connectés uniquement** : Les favoris sont sauvegardés dans Supabase
- **Utilisateurs non connectés** : Redirigés vers la page de connexion

### Vérification

Après avoir exécuté le script SQL, vérifiez que les tables ont été créées :
1. Allez dans "Table Editor" dans Supabase
2. Vous devriez voir les tables `cart`, `cart_items`, et `favorites`

