# 🚀 NOUVELLES FONCTIONNALITÉS E-COMMERCE - GUIDE D'INSTALLATION

## 📋 Résumé des améliorations

### ✅ Implémenté (Points 2-15)

| Priorité | Feature | Statut |
|----------|---------|--------|
| 🔴 P0 | Sitemap & robots.txt | ✅ Créés |
| 🔴 P0 | Gestion des stocks | ✅ Tables + API |
| 🔴 P0 | Emails transactionnels | ✅ Resend intégré |
| 🟠 P1 | Statuts commandes | ✅ Colonnes ajoutées |
| 🟠 P1 | Tracking livraison | ✅ Champs ajoutés |
| 🟠 P1 | Codes promo | ✅ Table + API |
| 🟡 P2 | Avis clients | ✅ Table + API + modération |
| 🟡 P2 | Logs emails | ✅ Historique complet |
| 🟢 P3 | Fonctions SQL | ✅ Reserve/release/decrement stock |

---

## 🛠️ INSTALLATION (Étape par étape)

### **Étape 1: Exécuter le script SQL Supabase**

1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner ton projet
3. Menu **SQL Editor** → **New query**
4. Copier le contenu de `supabase/inventory_and_features.sql`
5. Cliquer sur **Run** (🟢)

**Ce que ça crée:**
- ✅ Table `inventory` (stocks produits)
- ✅ Table `coupons` (codes promo)
- ✅ Table `reviews` (avis clients)
- ✅ Table `email_logs` (historique emails)
- ✅ Colonnes supplémentaires dans `orders` (status, tracking, etc.)
- ✅ Fonctions SQL pour gérer les stocks
- ✅ RLS policies appropriées

---

### **Étape 2: Configurer Resend (Emails)**

#### **2.1 Créer un compte Resend**
1. Aller sur [https://resend.com](https://resend.com)
2. S'inscrire (gratuit jusqu'à 100 emails/jour)
3. Vérifier ton domaine `atelier-lbf.fr` :
   - Ajouter les DNS records (SPF, DKIM, DMARC)
   - Attendre validation (~5 minutes)

#### **2.2 Obtenir l'API Key**
1. Menu **API Keys**
2. Cliquer **Create API Key**
3. Copier la clé (format: `re_xxxxx`)

#### **2.3 Ajouter aux variables d'environnement**

**Local (.env.local):**
```bash
RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL=noreply@atelier-lbf.fr
ADMIN_EMAIL=atelier-lbf@outlook.com
```

**Production (Vercel):**
1. Dashboard Vercel → **Settings** → **Environment Variables**
2. Ajouter les 3 variables ci-dessus
3. Redéployer: `git push origin main`

---

### **Étape 3: Tester les nouvelles fonctionnalités**

#### **Test 1: Sitemap**
```bash
curl https://www.atelier-lbf.fr/sitemap.xml
# Doit retourner du XML avec tous les produits

curl https://www.atelier-lbf.fr/robots.txt
# Doit contenir: Disallow: /admin/
```

#### **Test 2: Stock API**
```bash
# Vérifier stock d'un produit
curl "https://www.atelier-lbf.fr/api/inventory?slug=brasero-signature-80"

# Réponse attendue:
{
  "available": true,
  "quantity": 10,
  "isLowStock": false,
  "message": "En stock"
}
```

#### **Test 3: Code promo**
```bash
curl -X POST https://www.atelier-lbf.fr/api/coupons/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"WELCOME10","cartTotal":500}'

# Créer d'abord un coupon dans Supabase:
INSERT INTO coupons (code, discount_type, discount_value, is_active)
VALUES ('WELCOME10', 'percentage', 10, true);
```

#### **Test 4: Email de commande**
1. Passer une commande test sur le site
2. Vérifier:
   - ✅ Email reçu par le client
   - ✅ Email reçu par l'admin
   - ✅ Log dans table `email_logs`

#### **Test 5: Avis client**
```bash
# Récupérer avis d'un produit
curl "https://www.atelier-lbf.fr/api/reviews?slug=brasero-signature-80"

# Soumettre un avis (nécessite auth)
curl -X POST https://www.atelier-lbf.fr/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "product_id":"uuid-du-produit",
    "rating":5,
    "title":"Excellent brasero",
    "comment":"Très bonne qualité"
  }'
```

---

## 📊 UTILISATION DES NOUVELLES FONCTIONNALITÉS

### **1. Gestion des stocks (Admin)**

**Initialisation automatique:**
- Les stocks sont initialisés automatiquement par le script SQL
- Braseros: 10 unités (seuil bas: 3)
- Accessoires: 50 unités (seuil bas: 10)

**Ajuster les stocks manuellement:**
```sql
-- Dans Supabase SQL Editor
UPDATE inventory 
SET quantity = 20 
WHERE product_id = (SELECT id FROM products WHERE slug = 'brasero-signature-80');
```

**Monitoring stock bas:**
```sql
-- Produits en stock bas
SELECT p.name, i.quantity, i.low_stock_threshold
FROM inventory i
JOIN products p ON p.id = i.product_id
WHERE i.quantity <= i.low_stock_threshold;
```

---

### **2. Emails transactionnels**

**Emails automatiques envoyés:**

| Événement | Destinataire | Template |
|-----------|--------------|----------|
| Commande confirmée | Client | `order_confirmation` |
| Commande expédiée | Client | `order_shipped` |
| Nouvelle commande | Admin | `admin_order_notification` |

**Personnaliser les templates:**
Modifier les fonctions dans `lib/email.ts`:
- `generateOrderConfirmationHTML()`
- `generateOrderShippedHTML()`
- `generateAdminOrderNotificationHTML()`

---

### **3. Codes promo**

**Créer un code promo:**
```sql
INSERT INTO coupons (
  code, 
  discount_type, 
  discount_value, 
  min_purchase_amount,
  max_uses,
  expires_at,
  is_active
) VALUES (
  'NOEL2026',          -- Code
  'percentage',        -- 'percentage' ou 'fixed'
  15,                  -- 15% de réduction
  100,                 -- Minimum 100€ d'achat
  100,                 -- Max 100 utilisations
  '2026-12-31',        -- Expire fin 2026
  true                 -- Actif
);
```

**Types de réductions:**
- `percentage`: Pourcentage (ex: 10 = 10%)
- `fixed`: Montant fixe en euros (ex: 20 = 20€)

---

### **4. Avis clients**

**Workflow:**
1. Client achète un produit
2. Client laisse un avis (POST `/api/reviews`)
3. **Admin modère** l'avis (Supabase dashboard)
4. Avis approuvé → Visible publiquement

**Modération admin:**
```sql
-- Approuver un avis
UPDATE reviews 
SET is_approved = true, moderator_notes = 'Avis vérifié' 
WHERE id = 'uuid-avis';

-- Rejeter un avis
UPDATE reviews 
SET is_approved = false, moderator_notes = 'Contenu inapproprié' 
WHERE id = 'uuid-avis';

-- Voir avis en attente
SELECT * FROM reviews WHERE is_approved = false ORDER BY created_at DESC;
```

---

### **5. Suivi des commandes**

**Mettre à jour le statut:**
```sql
-- Marquer comme "en préparation"
UPDATE orders 
SET status = 'processing' 
WHERE id = 'uuid-commande';

-- Marquer comme "expédiée" + tracking
UPDATE orders 
SET 
  status = 'shipped',
  tracking_number = 'FR1234567890',
  carrier = 'Colissimo',
  shipped_at = now(),
  shipping_email_sent = true
WHERE id = 'uuid-commande';

-- Marquer comme "livrée"
UPDATE orders 
SET 
  status = 'delivered',
  delivered_at = now()
WHERE id = 'uuid-commande';
```

**Statuts disponibles:**
- `pending` - En attente de confirmation
- `processing` - En préparation
- `shipped` - Expédiée
- `delivered` - Livrée
- `cancelled` - Annulée
- `refunded` - Remboursée

---

## 🔧 INTÉGRATION FRONTEND (TODO)

### **À ajouter dans le code:**

#### **1. Afficher stock sur fiche produit**
```tsx
// Dans components/ProductPurchaseSection.tsx
const [stockInfo, setStockInfo] = useState(null);

useEffect(() => {
  fetch(`/api/inventory?slug=${product.slug}`)
    .then(res => res.json())
    .then(data => setStockInfo(data));
}, [product.slug]);

// Afficher:
{stockInfo && (
  <div className={stockInfo.isLowStock ? 'text-orange-600' : 'text-green-600'}>
    {stockInfo.message}
  </div>
)}
```

#### **2. Input code promo au checkout**
```tsx
// Dans app/(site)/commande/page.tsx
const [couponCode, setCouponCode] = useState('');
const [discount, setDiscount] = useState(0);

const validateCoupon = async () => {
  const res = await fetch('/api/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code: couponCode, cartTotal: totalPrice })
  });
  const data = await res.json();
  if (data.valid) {
    setDiscount(data.discount);
    toast.success(`Code appliqué: -${data.discount}€`);
  }
};
```

#### **3. Formulaire d'avis client**
```tsx
// Créer components/ReviewForm.tsx
<form onSubmit={handleSubmitReview}>
  <select name="rating" required>
    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} étoiles</option>)}
  </select>
  <input name="title" placeholder="Titre" />
  <textarea name="comment" placeholder="Votre avis" />
  <button type="submit">Soumettre</button>
</form>
```

#### **4. Historique commandes client**
```tsx
// Créer app/mon-compte/commandes/page.tsx
const { data: orders } = await supabase
  .from('orders')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });

// Afficher liste avec statuts colorés
```

---

## 📈 MONITORING & ANALYTICS

### **Logs emails envoyés:**
```sql
-- Voir tous les emails des 7 derniers jours
SELECT 
  email_type,
  recipient_email,
  status,
  sent_at
FROM email_logs
WHERE sent_at > now() - interval '7 days'
ORDER BY sent_at DESC;

-- Taux de réussite emails
SELECT 
  email_type,
  COUNT(*) as total,
  SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as success,
  ROUND(SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 2) as success_rate
FROM email_logs
GROUP BY email_type;
```

### **Produits populaires:**
```sql
-- Top produits vendus
SELECT 
  items->>'product_name' as product,
  SUM((items->>'quantity')::int) as total_sold
FROM orders, jsonb_array_elements(items) as items
WHERE status IN ('processing', 'shipped', 'delivered')
GROUP BY product
ORDER BY total_sold DESC
LIMIT 10;
```

### **Utilisation codes promo:**
```sql
SELECT 
  code,
  current_uses,
  max_uses,
  ROUND(current_uses::numeric / NULLIF(max_uses, 0) * 100, 2) as usage_rate
FROM coupons
WHERE is_active = true
ORDER BY current_uses DESC;
```

---

## 🚨 DÉPANNAGE

### **Problème: Emails ne partent pas**

1. Vérifier API key Resend:
```bash
echo $RESEND_API_KEY
# Doit afficher: re_xxxxx
```

2. Vérifier logs Vercel:
```bash
vercel logs --follow
# Chercher: [Email] ou resend
```

3. Vérifier domaine vérifié dans Resend:
- Dashboard Resend → Domains
- Status doit être "Verified" (vert)

### **Problème: Stock ne se décrémente pas**

1. Vérifier fonction SQL existe:
```sql
SELECT proname FROM pg_proc WHERE proname = 'decrement_stock';
```

2. Tester manuellement:
```sql
SELECT decrement_stock(
  (SELECT id FROM products WHERE slug = 'brasero-signature-80'),
  1
);
```

### **Problème: Code promo ne fonctionne pas**

1. Vérifier le code est actif:
```sql
SELECT * FROM coupons WHERE code = 'VOTRECODE' AND is_active = true;
```

2. Vérifier expiration:
```sql
SELECT code, expires_at, expires_at > now() as is_valid
FROM coupons WHERE code = 'VOTRECODE';
```

---

## 📝 CHECKLIST DÉPLOIEMENT

- [ ] Script SQL exécuté dans Supabase
- [ ] Compte Resend créé et domaine vérifié
- [ ] Variables environnement ajoutées (Vercel)
- [ ] Test commande → email reçu
- [ ] Test code promo fonctionne
- [ ] Stock initialisé pour tous les produits
- [ ] Sitemap accessible (brasero-atelier.fr/sitemap.xml)
- [ ] Robots.txt accessible
- [ ] Monitoring emails configuré

---

## 🎯 PROCHAINES ÉTAPES (Optionnel)

1. **Interface admin pour gérer stocks** (dashboard)
2. **Interface admin pour codes promo** (CRUD)
3. **Interface admin pour modération avis**
4. **Email commande expédiée** (automatique avec tracking)
5. **Factures PDF** (avec stripe-invoice ou PDFKit)
6. **Tests automatisés** (Playwright)
7. **Monitoring Sentry** pour erreurs prod

---

**Date:** 2026-01-03  
**Version:** 1.0  
**Auteur:** GitHub Copilot
