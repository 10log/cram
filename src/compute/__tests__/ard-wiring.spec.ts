/**
 * Wiring checklist for the ARD solver (plan Phase 8).
 *
 * Adding a solver kind to CRAM means touching a dozen unrelated files, and
 * missing one of them fails silently and specifically: the solver runs but has
 * no icon, or appears in the Add menu but not in the properties panel, or —
 * the worst one — saves fine and comes back as nothing on restore. None of
 * that shows up in a test of the solver itself.
 *
 * These assert on source text rather than importing the modules, following
 * `raytracer/__tests__/temperature-air-absorption.spec.ts`. Importing them
 * would drag in MUI, the renderer and a React tree for what is a question
 * about whether a map has an entry, and several of the maps are module-local
 * consts that are not exported at all.
 */

import fs from 'fs';
import path from 'path';

const root = path.resolve(__dirname, '../..');
const read = (relative: string) => fs.readFileSync(path.resolve(root, relative), 'utf8');

describe('ARD solver wiring', () => {
  it('is constructible through the solver registry', () => {
    const source = read('compute/solver-registry.ts');
    expect(source).toMatch(/registerSolverFactory\("ard"/);
    expect(source).toMatch(/await import\("\.\/ard"\)/);
  });

  it('survives a save and restore round trip', () => {
    // The quiet one. Without the restore case a project saves its ARD solver
    // and opens without it, and nothing anywhere reports a problem.
    const source = read('compute/events.ts');
    expect(source).toMatch(/ARDSaveObject/);
    expect(source).toMatch(/case "ard":/);
    expect(source).toMatch(/emit\("ADD_ARD", restored as ARD\)/);
    // Both halves: `restoreSolver` builds it and the switch re-adds it.
    expect(source.match(/case "ard":/g)?.length).toBe(2);
  });

  it('can be added from the menu, the library API and the message bus', () => {
    expect(read('components/NavBarComponent.tsx')).toMatch(/event="ADD_ARD"/);
    expect(read('lib/types.ts')).toMatch(/'ard'/);
    expect(read('lib/registerHandlers.ts')).toMatch(/SHOULD_ADD_ARD/);
    // `Record<SolverType, string>` is exhaustive, so these two are enforced by
    // the compiler as well — but only if the entry exists at all.
    expect(read('lib/CRAMEditor.tsx')).toMatch(/'ard': 'SHOULD_ADD_ARD'/);
    expect(read('lib/CRAMCanvas.tsx')).toMatch(/'ard': 'ADD_ARD'/);
  });

  it('has a parameter tab everywhere a solver tab is looked up', () => {
    for (const file of [
      'components/workbench/panels/SolversPanel.tsx',
      'components/parameter-config/ParameterConfig.tsx',
      'components/properties-panel/PropertiesPanel.tsx',
      'components/solver-cards/SolverCard.tsx',
    ]) {
      const source = read(file);
      expect(source, `${file} imports ARDTab`).toMatch(/import ARDTab from/);
      expect(source, `${file} maps the 'ard' kind`).toMatch(/["']ard["']\s*[,:]\s*ARDTab/);
    }
  });

  it('has a description and an icon of its own', () => {
    expect(read('components/workbench/panels/SolversPanel.tsx')).toMatch(
      /'ard':\s*'Wave-based adaptive rectangular decomposition'/,
    );
    expect(read('components/properties-panel/PropertiesPanel.tsx')).toMatch(
      /"ard":\s*"Wave-based adaptive rectangular decomposition"/,
    );
    const header = read('components/solver-cards/SolverCardHeader.tsx');
    expect(header).toMatch(/"ard":\s*WavesIcon/);
    // Not a borrowed icon: every kind in the map has its own.
    const icons = [...header.matchAll(/^\s+"[a-z-]+":\s*(\w+Icon),$/gm)].map((m) => m[1]);
    expect(new Set(icons).size).toBe(icons.length);
  });

  it('can be run from the solver card', () => {
    const source = read('components/solver-cards/SolverCard.tsx');
    expect(source).toMatch(/supportsCalculate = \[[^\]]*"ard"/);
    expect(source).toMatch(/emit\("CALCULATE_ARD", uuid\)/);
    // And the run button is enabled by the same source/receiver rule the other
    // pair-based solvers use, rather than always.
    expect(source).toMatch(/case "ard":\s*\n\s*return \(s\.sourceIDs/);
  });

  it('accepts ARD in the shared property-input helpers', () => {
    const source = read('components/parameter-config/SolverComponents.tsx');
    expect(source).toMatch(/SetPropertyPayload<ARD>/);
    // Every generic constraint, not just the first — the tab uses all three
    // factories and a missed one is a type error only at the call site.
    const constraints = source.match(/BeamTraceSolver\|ARD/g) ?? [];
    expect(constraints.length).toBe(4);
    expect(read('components/parameter-config/SourceReceiverMatrix.tsx')).toMatch(
      /"ARD_SET_PROPERTY"/,
    );
  });

  it('is deliberately left out of auto-calculate', () => {
    // A 300 ms-debounced auto-run of a multi-second wave solve would make the
    // editor unusable, and the solver refuses overlapping runs anyway — so
    // every trigger after the first would only log an error. The plan says to
    // leave it out; this says so where someone would otherwise "fix" it.
    const source = read('compute/auto-calculate.ts');
    expect(source).toMatch(/CALCULATABLE_SOLVER_KINDS = \[[^\]]*\]/);
    expect(source).not.toMatch(/CALCULATABLE_SOLVER_KINDS = \[[^\]]*"ard"/);
    expect(source).toMatch(/deliberately absent/);
  });
});
