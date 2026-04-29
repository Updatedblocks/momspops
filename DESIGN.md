# Moms&Pops Design System
# Warm, editorial. "Preserve the voices you love."

## Colors (Tailwind v4 semantic tokens)
- bg-base: #FDFBF7 (Canvas / Alabaster)
- bg-surface: #FFFFFF (Pure white for cards)
- bg-header: #FAF9F6 (Slightly warmer than surface)
- text-primary: #2C2C2C (Charcoal)
- text-secondary: #78716C (Stone-500, warm gray)
- border-subtle: #E7E5E4 (Stone-200, warm border)
- rose: #C49A9A (Faded Rose, accent)
- sage: #DCE1D8 (Dusty Sage, accent)
- sand: #D4C4A8 (Warm Sand, accent)
- muted: #E8DCC4 (Terracotta, accent)
- error: #BA1A1A (Red)

## Dark Mode
- bg-base: #1A1A1A
- bg-surface: #262626
- text-primary: #F9FAFB
- text-secondary: #D6D3D1
- border-subtle: #404040

## Typography
- Headings: font-serif (Newsreader, Georgia)
- Body: font-sans (Inter, system-ui)
- All text uses semantic classes: text-primary, text-secondary

## Buttons
- Primary: bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-full py-3.5 font-bold
- Secondary: bg-surface text-primary border border-subtle rounded-2xl
- Accent: bg-rose text-white rounded-2xl
- All buttons: btn-press (scale(0.97) on active, shadow on hover)

## Cards
- bg-surface rounded-3xl border border-subtle/60 shadow-sm
- Cards sit on bg-base canvas

## Animations
- fade-in-up, slide-down, scale-up, fade-in
- Stagger delays: stagger-1 through stagger-5
- Duration: 0.4-0.56s, cubic-bezier(0.22, 1, 0.36, 1)

## Spacing
- Pages: max-w-2xl mx-auto px-6 py-5
- Sections: gap-4 mb-2

## Font Sizes
- Dynamic rem scaling: document.documentElement.style.fontSize based on user textSize setting
- Default base: 16px
- Headings: font-serif text-2xl font-bold tracking-tight
