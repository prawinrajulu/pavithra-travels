Redesign the Back button of the Pavithra Travels website as a fixed, cinematic, premium navigation element.

OBJECTIVE:
Create a visually attractive, luxury-style Back button that remains fixed on the screen even when the user scrolls.

------------------------------------------------------

1. POSITIONING

- Make the Back button fixed (position: fixed).
- Place it on the top-left side of the screen.
- It must remain visible even when scrolling.
- Maintain safe spacing from header (avoid overlap).
- Ensure it does not block important content.

Desktop position:
Top: 90px
Left: 40px

Mobile position:
Top: 80px
Left: 20px

------------------------------------------------------

2. CINEMATIC DESIGN STYLE

Design should feel premium and tourism-focused:

- Rounded pill shape
- Soft orange gradient background
- Glassmorphism effect (slight blur)
- Semi-transparent background layer
- Soft outer glow effect
- Elegant shadow depth
- Smooth border radius

Text style:
⬅ Back
or
⬅ Back to Destination

------------------------------------------------------

3. ANIMATION EFFECTS

On page load:
- Fade in from left (0.4s ease-out)
- Slight slide animation

On hover:
- Arrow icon moves slightly left (3px)
- Background gradient shifts smoothly
- Soft orange glow appears
- Slight scale-up effect (1.03)

On click:
- Micro ripple animation
- Smooth transition to previous page

------------------------------------------------------

4. SCROLL INTERACTION

Optional premium effect:
- Add subtle floating shadow while scrolling
- Slight parallax movement (very minimal)
- Background blur intensifies when sticky

------------------------------------------------------

5. NAVIGATION LOGIC

- Use browser history navigation (navigate(-1))
- Preserve previous scroll position
- Add fallback route if no history exists

------------------------------------------------------

6. RESPONSIVENESS

- Larger tap area on mobile
- Reduced animation intensity for performance
- Maintain consistent position across pages

------------------------------------------------------

7. VISUAL FEEL

The Back button must feel:

- Cinematic
- Elegant
- Luxury travel portal style
- Modern and smooth
- Not cheap or basic

Avoid:
- Flat default button style
- Hard borders
- Overly flashy animations

------------------------------------------------------

GOAL:

Create a fixed, floating cinematic Back button that enhances navigation and gives a premium tourism website experience.