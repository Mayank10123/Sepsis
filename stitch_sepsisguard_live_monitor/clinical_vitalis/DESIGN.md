```markdown
# Design System Specification: The Clinical Sentinel

## 1. Overview & Creative North Star: "The Ethereal Guardian"
This design system moves beyond the cold, sterile grid of traditional medical software to embrace **The Ethereal Guardian**. Our mission is to balance life-critical precision with a calming, human-centric interface. 

In clinical environments, cognitive load is the enemy. This system breaks the "template" look through **Intentional Asymmetry** and **Tonal Depth**. We replace rigid, claustrophobic borders with breathing room and soft layering. The result is an interface that feels like a high-end editorial publication—authoritative enough for a surgeon, yet gentle enough for a worried family member.

---

## 2. Color & Surface Philosophy
We utilize a sophisticated palette that shifts based on the user persona, ensuring that clinical data feels urgent but controlled, and patient data feels supportive.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. Boundaries must be defined solely through background color shifts or subtle tonal transitions.
- **Surface-to-Surface:** Place a `surface_container_lowest` card on a `surface_container_low` background to create a "lift" without a line.
- **The Depth Rule:** Use `surface_container_highest` only for the most critical interactive elements or sidebar navigation.

### The "Glass & Gradient" Rule
To elevate the UI from a "utility" to a "premium experience," use Glassmorphism for floating elements (e.g., vital sign overlays).
- **Backdrop Blur:** Use `surface` colors at 70% opacity with a 20px - 40px backdrop blur.
- **Signature Gradients:** Use subtle linear gradients for Primary CTAs (e.g., `primary` to `primary_container`) to provide a "glow" that feels alive, rather than a static block of color.

### Core Tokens
| Token | Hex | Role |
| :--- | :--- | :--- |
| `primary` | #003f87 | Clinical authority (Doctor view) |
| `secondary` | #006a6a | Calming teal (Family/Patient view) |
| `tertiary` | #004d10 | Stable status / Sage accents |
| `error` | #ba1a1a | Critical Sepsis alerts |
| `surface` | #f8fafb | The base "canvas" |

---

## 3. Typography: Editorial Authority
The typography system uses a pairing of **Manrope** for high-impact displays and **Inter** for data-heavy utility.

- **Display & Headline (Manrope):** Used for patient names, primary vitals, and status headers. The wider aperture and geometric construction feel modern and trustworthy.
- **Title, Body, & Label (Inter):** Used for clinical notes, tabular data, and input labels. Inter’s high x-height ensures readability in high-stress, low-light environments.

**Hierarchy as Identity:**
- **Critical Data:** Use `headline-lg` in `primary` or `error` for the "Sofa Score" or "Heart Rate."
- **Metadata:** Use `label-md` with `on_surface_variant` for timestamps and secondary units (e.g., bpm).

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to imply "cheap" height; we use **Tonal Layering** to imply physical presence.

- **The Layering Principle:** Stack your containers. An inner dashboard widget should be `surface_container_lowest` (pure white) nested inside a `surface_container` (light grey) layout. This creates a natural "floating" effect.
- **Ambient Shadows:** For floating modals only. Use the `on_surface` color at 4% opacity with a 32px blur and 16px Y-offset. It should feel like a soft glow, not a dark drop shadow.
- **The Ghost Border Fallback:** If a border is required for accessibility, use the `outline_variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components & Primitive Styling

### Data-Dense Clinical Cards
Forbid divider lines. Use `surface_container_low` for the card background and `surface_container_lowest` for the individual data cells within the card to create a "recessed" or "inset" feel.

### Status Chips
Avoid heavy solid colors.
- **Stable:** `tertiary_fixed` background with `on_tertiary_fixed` text.
- **Warning:** `secondary_fixed` background with `on_secondary_fixed` text.
- **Critical:** `error_container` background with `on_error_container` text.
- **Shape:** Use the `full` roundedness scale (9999px) for chips to contrast against the `md` (0.75rem) corners of cards.

### Interaction Elements (Buttons/Inputs)
- **Primary Action:** Use a soft gradient from `primary` to `primary_container`. Corner radius: `md` (0.75rem).
- **Input Fields:** No bottom line or full border. Use `surface_container_high` as a solid background fill with a `sm` (0.25rem) corner radius. On focus, transition to an `outline` of 1px at 40% opacity.

### The "Vital Monitor" Chart
Charts must be frameless. Use `secondary` for the trend line and a subtle fill gradient underneath using `secondary_container` at 20% opacity.

---

## 6. Do’s and Don’ts

### Do:
- **Do** use whitespace as a functional tool to separate patient vitals from history.
- **Do** use `display-lg` typography for the most critical metric (e.g., "98 bpm") to ensure it is readable from 10 feet away in a hospital room.
- **Do** use `surface_bright` to highlight active patient rows in a clinical list.

### Don’t:
- **Don't** use 100% black text. Always use `on_surface` (#191c1d) to reduce eye strain during long shifts.
- **Don't** use "Alert Red" for anything other than a critical sepsis life-threat. Overuse leads to alarm fatigue.
- **Don't** use sharp 90-degree corners. Everything must feel approachable; adhere to the `0.75rem` (md) and `1rem` (lg) roundedness scale.

---

## 7. Signature Layout: The "Asymmetric Pulse"
Instead of a centered, symmetrical dashboard, align critical alerts to the top-left (the first place the eye lands) and allow the "History" and "Family Logs" to sit in an offset, wider column to the right. Use varying container heights to create a "staircase" effect that guides the clinician's eye through the patient's story.