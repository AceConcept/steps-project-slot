export const STEP_COUNT = 6

export const STEPS = [
  {
    body: 'What is SVG? How to optimize the SVG file for export. Export settings explained in detail. How to export SVG from Affinity Designer. Scalable vector graphics keep edges crisp at any size.',
  },
  {
    body: 'SVG is XML-based: paths, shapes, and text stay editable. Prefer shapes and paths over embedded raster images. Name layers clearly before export so structure survives in the file.',
  },
  {
    body: 'Flatten unnecessary effects, merge redundant paths, and remove hidden layers. Set a sensible viewBox and document size. Strip metadata and editor-specific junk when the spec allows.',
  },
  {
    body: 'Use “SVG for web” or equivalent presets where available. Prefer decimal precision that balances file size and smooth curves. Enable minification and responsive sizing in the export dialog.',
  },
  {
    body: 'In Affinity Designer, use Export Persona or File → Export. Pick SVG, set resampling and DPI only when rasterized areas exist. Preview in a browser and validate with an SVG linter.',
  },
  {
    body: 'You now have a repeatable workflow: design → simplify → export → verify. Reuse these settings across projects and keep a checklist so nothing slips through on tight deadlines.',
  },
] as const
