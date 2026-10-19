/* ==========================================================================
   odometer — the fixed value behind the SKIDDED FROM counter.

   This is set dressing. Nothing here counts, measures, fetches or tracks
   anything: the display is driven entirely by a local timer and the number is
   fixed fiction.
   ========================================================================== */

/* Six wheels, six independent travel distances.
   Spins must be whole rotations: a wheel only lands on the intended glyph when
   its total travel is an exact multiple of ten cells. Every wheel lands on 9,
   so the finished reading is 999,999 — the maximum the instrument can show. */
const SPINS = [1, 2, 2, 3, 4, 5]
const DIGITS = [9, 9, 9, 9, 9, 9]

/* 10 glyphs per loop, 6 loops: enough travel for the longest wheel (59 cells) */
export const CELLS = Array.from({ length: 60 }, (_, i) => i % 10)

/* `--off`, written per wheel each frame, is the cell index the wheel should be
   scrolled to. CSS reads it as a translate. */
export const WHEELS = SPINS.map((spin, i) => ({
  spin,
  digit: DIGITS[i],
  /* right-most wheels start first, so the number reads as rolling up */
  delay: (SPINS.length - 1 - i) * 0.045,
}))

/* the resting offset for each wheel, i.e. the landed reading */
export const REST_OFFSETS = WHEELS.map(({ spin, digit }) => spin * 10 + digit)

/* how long the full run to the maximum takes, in milliseconds */
export const COUNT_MS = 2500

export const ODO_TEXT = '999,999'

/* the fictional figure the rest of the page quotes */
export const ARCHIVE_SIZE = '999,999'
