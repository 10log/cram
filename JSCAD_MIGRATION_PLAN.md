# Migration Plan: @jscad/csg to @jscad/modeling

## Overview

The current codebase uses `@jscad/csg` (v0.7.0), which has circular CommonJS dependencies that break when bundled with Vite/Rollup. The solution is to migrate to `@jscad/modeling` (v2.x), which uses proper ES modules.

## Current State

- **File**: `src/compute/csg/csg.ts` (11,776 lines)
- **Problem**: Circular dependencies in @jscad/csg break during Rollup transformation
- **Bundle**: `jscad-bundle.js` created via esbuild to work around circular deps
- **Error**: "Cannot access 'X' before initialization" (TDZ error) in production

## Modules Being Used

From `src/compute/csg/index.ts`, the following modules are exported and used:

| Module | Description | Usage Level |
|--------|-------------|-------------|
| `geometry` | geom2, geom3, path2, poly3, mat4 | Heavy |
| `math` | vec2, vec3, plane, line2, line3 | Heavy |
| `booleans` | union, subtract, intersect | Medium |
| `transforms` | translate, rotate, scale, mirror, center | Medium |
| `primitives` | cube, sphere, cylinder, etc. | Medium |
| `measurements` | measureArea, measureVolume, etc. | Light |
| `extrusions` | extrudeLinear, extrudeRotate | Light |
| `expansions` | expand, offset | Light |
| `hulls` | hull, hullChain | Light |
| `text` | vectorText | Light |
| `connectors` | Connector class | Light |
| `color` | CSS colors, color utilities | Light |
| `utils` | Utility functions | Light |
| `bsp` | Tree, PolygonTreeNode, Node (BSP tree) | Custom |
| `split` | splitPolygonByPlane, splitLineByPlane | Custom |

## API Changes (V1 → V2)

### Function Renames
| V1 (@jscad/csg) | V2 (@jscad/modeling) |
|-----------------|----------------------|
| `difference()` | `subtract()` |
| `cube()` | `cuboid()` |
| `resolution` param | `segments` param |
| `h` param | `height` param |
| `r` param | `radius` param |

### Structural Changes
1. **Functional API**: V2 uses functional composition instead of method chaining
   - V1: `object.translate([x, y, z])`
   - V2: `translate([x, y, z], object)`

2. **Explicit Imports**: Functions must be explicitly imported
   ```javascript
   // V2
   const { primitives, booleans, transforms } = require('@jscad/modeling')
   const { cuboid, sphere } = primitives
   const { subtract } = booleans
   ```

3. **Centering**: V2 centers primitives by default (V1 did not)

4. **Radians**: V2 uses radians for rotations (V1 used degrees)

## Migration Strategy

### Phase 1: Setup & Parallel Structure
1. Install `@jscad/modeling` package
2. Create new `src/compute/modeling/` directory
3. Create adapter layer that maps V1 API to V2

### Phase 2: Create Compatibility Layer
Create `src/compute/modeling/compat.ts` with:
- Wrapper functions that accept V1-style parameters
- Degree-to-radian conversion for rotations
- Parameter name mappings (h→height, r→radius, etc.)

### Phase 3: Migrate Core Modules
Order of migration (least to most dependencies):
1. `math` - vec2, vec3, mat4, plane, line
2. `geometry` - geom2, geom3, path2, poly3
3. `primitives` - Basic shapes
4. `transforms` - translate, rotate, scale
5. `booleans` - union, subtract, intersect
6. `measurements` - Area, volume calculations
7. `extrusions` - Linear and rotational extrusion
8. `expansions` - Expand, offset
9. `hulls` - Convex hull operations

### Phase 4: Handle Custom Modules
The `bsp` and `split` modules are custom implementations for ray tracing:
- `Tree`, `PolygonTreeNode`, `Node` - BSP tree for spatial partitioning
- `splitPolygonByPlane`, `splitLineByPlane` - Plane intersection

These need to be adapted to work with V2 geometry types.

### Phase 5: Update Consumers
Files that import from csg:
- `src/objects/surface.ts`
- `src/compute/raytracer/bsp.ts`
- `src/compute/raytracer/trees/node.ts`
- `src/compute/raytracer/trees/polygon-tree-node.ts`
- `src/compute/raytracer/split-polygon.ts`

### Phase 6: Testing & Validation
1. Create unit tests for migrated functions
2. Visual regression tests for 3D output
3. Performance benchmarks

### Phase 7: Cleanup
1. Remove old `csg.ts` and `jscad-bundle.js`
2. Remove `@jscad/csg` from dependencies
3. Update imports throughout codebase

## Compatibility Layer Example

```typescript
// src/compute/modeling/compat.ts
import { primitives, transforms, booleans } from '@jscad/modeling';

const { cuboid, sphere, cylinder } = primitives;
const { translate, rotate, scale } = transforms;
const { subtract, union, intersect } = booleans;

// Wrap V2 functions with V1-compatible API
export const cube = (options: { size?: number | number[], center?: boolean }) => {
  const size = options.size ?? 1;
  return cuboid({ size: Array.isArray(size) ? size : [size, size, size] });
};

// Convert degrees to radians for rotation
export const rotateX = (degrees: number, ...objects: any[]) => {
  const radians = degrees * Math.PI / 180;
  return rotate([radians, 0, 0], ...objects);
};

// Alias for renamed function
export const difference = subtract;
```

## Estimated Effort

| Phase | Effort | Notes |
|-------|--------|-------|
| Phase 1 | 1 hour | Setup |
| Phase 2 | 4 hours | Compatibility layer |
| Phase 3 | 8 hours | Core module migration |
| Phase 4 | 4 hours | Custom BSP/split modules |
| Phase 5 | 2 hours | Update consumers |
| Phase 6 | 4 hours | Testing |
| Phase 7 | 1 hour | Cleanup |
| **Total** | **~24 hours** | |

## Resources

- [V1 → V2 Migration Guide](https://github.com/jscad/OpenJSCAD.org/discussions/883)
- [@jscad/modeling npm](https://www.npmjs.com/package/@jscad/modeling)
- [V1→V2 Conversion Script](https://gist.github.com/apla/90edff2e4993f3e3592f8795c2050cc5)
- [JSCAD User Guide](https://openjscad.xyz/docs/)

## Rollback Plan

Until migration is complete, revert to a known working version of cram.ui:
```bash
# In project-varese
npm install cram.ui@github:10log/cram#<last-working-commit>
```
