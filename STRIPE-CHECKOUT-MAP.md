# Stripe Checkout Map (Studio 26)

Usa este mapa para crear tus **Stripe Payment Links** y conectarlos con la app.

## 1) URL de retorno (obligatoria)

Configura cada Payment Link para volver a la app con este formato:

- Local: `http://localhost:5173/?payment=success&packageId=<PACKAGE_ID>`
- Producción: `https://TU-DOMINIO.com/?payment=success&packageId=<PACKAGE_ID>`

## 2) Paquetes a crear en Stripe

### Intro Offers
- `intro-single` → Intro Offer Single Class → `$19`
- `intro-3pack` → Intro Offer - 3 Class Pack → `$62`

### Monthly Memberships
- `monthly-4` → 4 Classes Monthly → `$99`
- `monthly-8` → 8 Classes Monthly → `$189`
- `monthly-12` → 12 Classes Monthly → `$229`
- `monthly-unlimited` → Monthly Unlimited → `$279`

### Class Packages
- `pack-single` → Single Class → `$35`
- `pack-5` → 5 Class Pack → `$139`
- `pack-10` → 10 Class Pack → `$290`
- `pack-20` → 20 Class Pack → `$499`

## 3) Variables `.env` que debes completar

```env
VITE_CHECKOUT_URL_INTRO_SINGLE=
VITE_CHECKOUT_URL_INTRO_3PACK=
VITE_CHECKOUT_URL_MONTHLY_4=
VITE_CHECKOUT_URL_MONTHLY_8=
VITE_CHECKOUT_URL_MONTHLY_12=
VITE_CHECKOUT_URL_MONTHLY_UNLIMITED=
VITE_CHECKOUT_URL_PACK_SINGLE=
VITE_CHECKOUT_URL_PACK_5=
VITE_CHECKOUT_URL_PACK_10=
VITE_CHECKOUT_URL_PACK_20=
```

## 4) Verificación rápida

1. Abre la app y entra a `Packages`.
2. Clic en `Proceed to Payment`.
3. Debe abrir Stripe.
4. Completa pago de prueba.
5. Stripe redirige a `?payment=success&packageId=...`.
6. La app acredita el paquete automáticamente.
