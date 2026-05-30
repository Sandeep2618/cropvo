# Images

Place all image files here (jpg, png, webp).

Naming convention: `descriptive-name.ext` (kebab-case, lowercase)

Examples:
- `hero-doctor.png`
- `doctor-aarav-sharma.jpg`
- `logo.png`

Usage in code:
```tsx
import Image from 'next/image';
<Image src="/assets/images/hero-doctor.png" alt="Doctor" width={600} height={420} />
```

Always use Next.js `<Image />` — never bare `<img>` tags.
