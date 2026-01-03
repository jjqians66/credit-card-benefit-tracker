# Credit Card Images

Place card images in this directory.

## Naming Convention

Name your images to match the card `id` from `cards.json`:
- `amex-plat.png` (or `.jpg`, `.webp`, etc.)
- `amex-gold.png`
- `chase-csr.png`
- `capone-vx.png`
- `ritz-carlton.png`

## Image Specifications

**Recommended dimensions:** 
- Width: 240-320px
- Height: 150-200px
- Aspect ratio: ~1.6:1 (standard credit card ratio)

**Formats supported:** PNG, JPG, WebP

## Example

If you have an image file named `amex-plat.png`, update `cards.json`:

```json
{
  "id": "amex-plat",
  "name": "Platinum Card®",
  "image": "/images/cards/amex-plat.png",
  ...
}
```

The app will automatically display the image. If the image fails to load, it will fallback to the colored rectangle.

