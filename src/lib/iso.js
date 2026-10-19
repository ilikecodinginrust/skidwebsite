/* ==========================================================================
   iso — a tiny isometric wireframe builder used by the hero environment and
   the archive plates.

   Everything is projected with the classic 2:1 isometric ratio. Only faces
   that actually point at the camera are emitted, so a block structure reads
   as its surface rather than a pile of overlapping squares.
   ========================================================================== */

const RATIO = 0.866 /* cos(30deg) */

const proj = (x, y, z) => [(x - y) * RATIO, (x + y) * 0.5 - z]

const num = (v) => v.toFixed(3)

const poly = (points) =>
  'M' + points.map(([x, y]) => `${num(x)} ${num(y)}`).join('L') + 'Z'

const seg = (a, b) => `M${num(a[0])} ${num(a[1])}L${num(b[0])} ${num(b[1])}`

const key = (x, y, z) => `${x},${y},${z}`

/* A deliberately incomplete block structure: a 3x2 slab with two blocks left
   standing on the second layer. Familiar silhouette, not a logo. */
export const DEFAULT_CELLS = [
  [0, 0, 0],
  [1, 0, 0],
  [2, 0, 0],
  [0, 1, 0],
  [1, 1, 0],
  [2, 1, 0],
  [1, 1, 1],
  [0, 0, 1],
]

/** Outer surface faces for a set of unit cubes. */
export function buildFaces(cells) {
  const occupied = new Set(cells.map(([x, y, z]) => key(x, y, z)))
  const faces = []

  for (const [x, y, z] of cells) {
    if (!occupied.has(key(x, y, z + 1))) {
      faces.push({
        axis: 'top',
        d: poly([
          proj(x, y, z + 1),
          proj(x + 1, y, z + 1),
          proj(x + 1, y + 1, z + 1),
          proj(x, y + 1, z + 1),
        ]),
      })
    }
    if (!occupied.has(key(x + 1, y, z))) {
      faces.push({
        axis: 'x',
        d: poly([
          proj(x + 1, y, z),
          proj(x + 1, y + 1, z),
          proj(x + 1, y + 1, z + 1),
          proj(x + 1, y, z + 1),
        ]),
      })
    }
    if (!occupied.has(key(x, y + 1, z))) {
      faces.push({
        axis: 'y',
        d: poly([
          proj(x, y + 1, z),
          proj(x + 1, y + 1, z),
          proj(x + 1, y + 1, z + 1),
          proj(x, y + 1, z + 1),
        ]),
      })
    }
  }

  return faces
}

/**
 * The hero's environment: an isometric lattice plane with a block structure
 * resting on one cell of it, plus an axis gizmo for good measure.
 *
 * @param {object}  o
 * @param {number}  o.size    lattice cells per side
 * @param {number[]} o.origin [x, y] cell the structure sits on
 * @param {number[][]} o.cells block coordinates, origin-relative
 */
export function buildScene({
  size = 14,
  origin = [6, 5],
  cells = DEFAULT_CELLS,
  height = 3,
} = {}) {
  const lifted = cells.map(([x, y, z]) => [x + origin[0], y + origin[1], z])
  const faces = buildFaces(lifted)

  /* lattice */
  let grid = ''
  for (let i = 0; i <= size; i++) {
    grid += seg(proj(i, 0, 0), proj(i, size, 0))
    grid += seg(proj(0, i, 0), proj(size, i, 0))
  }

  /* the 3x2 cell the structure occupies, marked out of the lattice */
  const foot = poly([
    proj(origin[0], origin[1], 0),
    proj(origin[0] + 3, origin[1], 0),
    proj(origin[0] + 3, origin[1] + 2, 0),
    proj(origin[0], origin[1] + 2, 0),
  ])

  /* axis gizmo at the near corner */
  const axes = [
    seg(proj(0, 0, 0), proj(size + 1.8, 0, 0)),
    seg(proj(0, 0, 0), proj(0, size + 1.8, 0)),
    seg(proj(0, 0, 0), proj(0, 0, height + 1.2)),
  ]

  /* a beacon marking the highest block in the structure */
  const top = lifted.reduce((a, b) => (b[2] > a[2] ? b : a), lifted[0])
  const beacon = {
    stem: seg(proj(top[0] + 0.5, top[1] + 0.5, height), proj(top[0] + 0.5, top[1] + 0.5, height + 1.5)),
    head: proj(top[0] + 0.5, top[1] + 0.5, height + 1.5),
  }

  const corners = [
    proj(0, 0, height + 1.4),
    proj(size, 0, 0),
    proj(0, size, 0),
    proj(size, size, 0),
    proj(size + 2.2, 0, 0),
    proj(0, size + 2.2, 0),
    proj(-0.8, -0.8, 0),
  ]
  const xs = corners.map((p) => p[0])
  const ys = corners.map((p) => p[1])
  const pad = 0.5
  const minX = Math.min(...xs) - pad
  const minY = Math.min(...ys) - pad
  const w = Math.max(...xs) + pad - minX
  const h = Math.max(...ys) + pad - minY

  return {
    grid,
    foot,
    faces,
    axes,
    beacon,
    viewBox: `${num(minX)} ${num(minY)} ${num(w)} ${num(h)}`,
  }
}
