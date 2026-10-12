# Selling Options — UX audit

Heuristic review of the supplied screen (Nielsen heuristics + form design practice). No user research was conducted; every observation comes from the design itself.

## Issues and solutions

**1. Double negatives. "Disable product popup / Disable add new product in popup view" and "Disable welcome wizard / Disable welcome wizard for newly registered vendors."**
Two negations plus an unchecked box means the reader has to invert twice to learn the popup is actually on. Violates "match between system and the real world."
→ Restated positively as "Add product in a popup" and "Welcome wizard for new vendors". Both were unchecked (not disabled), so both toggles ship **on**: identical state, readable label.

**2. Every label is said twice, in two different voices.**
"New vendor product upload" on the left, "Allow newly registered vendors to add products" on the right. The eye reads the row twice to learn one fact.
→ One short label plus one helper line per row. The original checkbox sentence becomes the helper, so no meaning is lost.

**3. Admin commission is a dropdown of percentages.**
A rate is a continuous number. A select implies a fixed menu and hides whether 12.5% is reachable; it also gives no clue the value depends on Commission type.
→ Editable numeric field with a `%` affix, stepper-free, min/max guarded. Changing Commission type to Flat swaps the affix to `$` and rewrites the helper, so the pairing is visible. The helper restates the result in plain words: "You keep 10% of each order total."

**4. Eight unrelated settings in one flat list.**
Onboarding rules, money, and catalog rules sit at the same level with nothing signalling where one topic ends. Scanning cost is linear.
→ Three labelled groups: **New vendor onboarding** (2), **Commission** (2), **Products and orders** (4). Each group is its own card, so the boundary is structural, not just typographic.

**5. One tall bordered card with ~250px of empty space.**
The border promises content that is not there, and the bottom third of the page reads as broken.
→ Cards are sized to their rows. The page ends where the content ends.

**6. Nothing to save, nothing to undo.**
No primary action exists on the screen, so there is no answer to "did that take?" and no way back from a mistyped rate. Violates "user control and freedom" plus "visibility of system status."
→ A fixed action bar aligned to the content column: live status on the left ("All changes saved" / "2 unsaved changes"), Discard and Save changes on the right, both disabled until something is dirty.

**7. Controls do not share an edge.**
Checkboxes start at one x, selects at another, and helper text hangs below the control in the right column. There is no single line for the eye to follow down the page.
→ Every control is right-aligned to one edge; helpers live under the label on the left. Selects and numeric fields share a 180px width.

**8. Checkboxes for settings that apply immediately.**
A checkbox reads as "part of a set I am submitting"; these are independent on/off states.
→ Switches, carrying the original green as the on state.

**9. Low-contrast text on unchecked rows.**
The two unchecked labels are rendered grey, which reads as disabled rather than off.
→ All labels share one text colour; state is carried by the switch alone.

**10. Wordy helpers.**
"What option do you prefer for vendor to select product category?" is a question the system should not be asking.
→ "How many categories a vendor can put a product in." One line, no question mark. Same treatment across all helpers.

**11. No page context.**
The heading names the screen but not what it governs.
→ One-line deck under the title.

## Preserved unchanged

All eight settings and their shipped values; the dark main sidebar and its three groups; the settings sub-navigation and its ten items; the header, search, notifications and shop chip; the light theme; fixed 1440x1024.
