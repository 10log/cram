# React 18 Migration Plan for CRAM

## Current State Analysis

### Current Versions
- React: 16.8.4
- React DOM: 16.8.4
- @blueprintjs/core: 3.23.0 (requires upgrade to 5.0+)
- @material-ui/core: 4.8.3 (requires upgrade to @mui v5+)
- Zustand: 3.3.1 (works but v4+ recommended)
- Styled-components: 5.2.1 (compatible)

### Identified Issues
1. `src/index.tsx:973` - Uses legacy `ReactDOM.render()` API
2. `src/components/TreeViewComponent.tsx` - Uses deprecated `componentWillMount` and class component `defaultProps`
3. Blueprint.js v3 doesn't support React 18
4. Material-UI v4 doesn't officially support React 18

---

## Migration Strategy

The migration will be done in phases to minimize breaking changes:

### Phase 1: Dependency Groundwork

#### 1. Update Blueprint.js (v3 → v5 or v6)
Blueprint.js v5+ is required for React 18 support. Major breaking changes between v3 and v5.

**Key changes:**
- Updated component APIs
- Removed `@blueprintjs/popover2` (merged into core)
- TypeScript improvements
- New theming system

**Packages to update:**
```json
"@blueprintjs/core": "^5.12.0",
"@blueprintjs/icons": "^5.12.0",
"@blueprintjs/select": "^5.2.0",
"@blueprintjs/table": "^5.2.0"
```

**Remove:**
- `@blueprintjs/popover2` (no longer needed)

**Resources:**
- [Blueprint 5.x Migration Guide](https://github.com/palantir/blueprint/wiki/5.0-pre-release-changelog)

#### 2. Update Material-UI (v4 → MUI v5)
Material-UI v4 does NOT support React 18. Must migrate to @mui/* packages (package names changed).

**Packages to remove:**
```json
"@material-ui/core": "^4.8.3",
"@material-ui/icons": "^4.5.1",
"@material-ui/lab": "^4.0.0-alpha.39"
```

**Packages to add:**
```json
"@mui/material": "^5.15.0",
"@mui/icons-material": "^5.15.0",
"@mui/lab": "^5.0.0-alpha.170",
"@emotion/react": "^11.11.0",
"@emotion/styled": "^11.11.0"
```

**Resources:**
- [MUI v5 Migration Guide](https://mui.com/material-ui/migration/migration-v4/)
- Codemods available for automated migration

#### 3. Update Zustand (v3 → v4)
v3 works with React 18 but v4+ recommended for `useSyncExternalStore` support.

```json
"zustand": "^4.5.0"
```

**Migration notes:**
- Minimal breaking changes
- Type parameters simplified
- Better concurrent rendering support

**Resources:**
- [Zustand v4 Migration Guide](https://zustand.docs.pmnd.rs/migrations/migrating-to-v4)

#### 4. Update React and React Types
```json
"react": "^18.2.0",
"react-dom": "^18.2.0",
"@types/react": "^18.2.0",
"@types/react-dom": "^18.2.0"
```

#### 5. Other Dependencies to Review
- `styled-components`: v5.2.1 should work but v6+ is React 18 optimized
- `react-window`: Check compatibility
- `react-color`: Check compatibility
- `react-charts`: Check compatibility
- `react-tabs`: Check compatibility
- `react-select`: Check compatibility

---

### Phase 2: Code Modifications

#### 1. Update Root Render Method (`src/index.tsx:973`)

**Before:**
```typescript
ReactDOM.render(
  <App {...cram.state} />,
  document.getElementById("root"),
  finishedLoading
);
```

**After:**
```typescript
import { createRoot } from 'react-dom/client';

const container = document.getElementById("root");
if (!container) throw new Error('Root container not found');
const root = createRoot(container);
root.render(<App {...cram.state} />);

// Call finishedLoading after render
finishedLoading();
```

#### 2. Fix TreeViewComponent (`src/components/TreeViewComponent.tsx`)

**Issues to fix:**
- Remove `static defaultProps` (deprecated in React 18)
- Check for deprecated lifecycle methods
- Use default parameters instead

**Before:**
```typescript
class TreeViewComponent extends Component<Props, State> {
  static defaultProps = { /* ... */ }
}
```

**After - Option 1 (Class Component):**
```typescript
class TreeViewComponent extends Component<Props, State> {
  // Remove static defaultProps
  // Use default parameters in the Props type or in destructuring
}
```

**After - Option 2 (Convert to Functional Component - Recommended):**
```typescript
function TreeViewComponent({
  depth = 0,
  deleteElement = <div>(X)</div>,
  // ... other props with defaults
}: Props) {
  // Use hooks instead of lifecycle methods
}
```

#### 3. Remove/Replace Deprecated Lifecycle Methods

Search for and replace:
- `componentWillMount` → `useEffect` or `componentDidMount`
- `componentWillReceiveProps` → `getDerivedStateFromProps` or `useEffect`
- `componentWillUpdate` → `getSnapshotBeforeUpdate` or `useEffect`

#### 4. Update Blueprint.js Imports and API Usage

**Import changes:**
```typescript
// Before
import { Popover2 } from "@blueprintjs/popover2";

// After
import { Popover2 } from "@blueprintjs/core";
```

**Component API changes to review:**
- Check all Blueprint components for prop changes
- Update any custom styling/theming
- Review portal and overlay usage
- Check form components and validation

#### 5. Update Material-UI Imports and API Usage

**Import changes:**
```typescript
// Before
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

// After
import { Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
```

**Styling changes:**
```typescript
// Before (makeStyles)
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

// After - Option 1 (styled)
const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

// After - Option 2 (sx prop)
<Box sx={{ padding: 2 }}>
```

#### 6. Update Zustand Store Patterns

**Type parameter changes:**
```typescript
// Before
const useStore = create<StoreState, SetState<StoreState>>((set) => ({
  // ...
}));

// After
const useStore = create<StoreState>()((set) => ({
  // ...
}));
```

---

### Phase 3: Testing & Validation

#### 1. Enable Strict Mode (Recommended)
```typescript
root.render(
  <React.StrictMode>
    <App {...cram.state} />
  </React.StrictMode>
);
```

#### 2. Test All Features
- ✓ Renderer and Three.js integration
- ✓ All solvers (RayTracer, RT60, Image Source, FDTD)
- ✓ File import/export (DXF, OBJ, STL, DAE)
- ✓ Material database
- ✓ UI interactions (panels, forms, charts)
- ✓ State management across all stores
- ✓ Acoustic calculations
- ✓ Project save/restore

#### 3. Check for Console Warnings
- React 18 will warn about deprecated patterns
- Fix any warnings that appear
- Check for hydration warnings
- Check for key warnings

#### 4. Performance Testing
- Check render performance
- Monitor state update performance
- Test with large models/scenes
- Profile with React DevTools

---

### Phase 4: Build Configuration

#### 1. Update package.json

**Dependencies:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@blueprintjs/core": "^5.12.0",
    "@blueprintjs/icons": "^5.12.0",
    "@blueprintjs/select": "^5.2.0",
    "@blueprintjs/table": "^5.2.0",
    "@mui/material": "^5.15.0",
    "@mui/icons-material": "^5.15.0",
    "@mui/lab": "^5.0.0-alpha.170",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
```

#### 2. Update Webpack/Babel Config
- Ensure JSX runtime is compatible
- May need to update `babel-preset-react-app`
- Check polyfills for React 18

---

## Migration Order (Recommended)

1. ✓ **Create feature branch** (`feature/react-18-migration`)
2. **Update Blueprint.js** (biggest UI impact)
   - Update packages
   - Fix imports and API usage
   - Test thoroughly
3. **Update Material-UI to MUI**
   - Use MUI codemods for automated migration
   - Fix remaining manual changes
4. **Update Zustand**
5. **Update React to v18**
   - Update packages
   - Update render method
   - Fix component patterns
6. **Enable StrictMode** and fix warnings
7. **Full regression testing**

---

## Risk Assessment

### High Risk Areas
- Blueprint.js v3 → v5 has significant breaking changes
- Material-UI v4 → MUI v5 requires package name changes and styling migration
- Custom Three.js/renderer integration may have subtle timing issues
- State updates during render may need adjustment

### Medium Risk Areas
- State management patterns with Zustand
- Form components and controlled inputs
- Chart components (plotly.js, visx)
- Event handling and messenger system

### Low Risk Areas
- Core acoustic computation (no React dependencies)
- File I/O and import handlers
- Three.js scene management
- Worker threads

---

## Tools & Resources

### Migration Tools

**Blueprint.js:**
- [v5 Pre-release Changelog](https://github.com/palantir/blueprint/wiki/5.0-pre-release-changelog)
- [API Documentation](https://blueprintjs.com/docs/)

**MUI:**
- Automated codemods:
  ```bash
  npx @mui/codemod v5.0.0/preset-safe src/
  ```
- [Migration Guide](https://mui.com/material-ui/migration/migration-v4/)

**React 18:**
- [Official Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [React 18 Working Group](https://github.com/reactwg/react-18)

**Zustand:**
- [v4 Migration Guide](https://zustand.docs.pmnd.rs/migrations/migrating-to-v4)

### Testing Checklist

After each phase:
- [ ] Run `npm run lint` - no TypeScript errors
- [ ] Run `npm run build` - successful build
- [ ] Run `npm start` - dev server starts
- [ ] Manual testing of affected features
- [ ] Check browser console for warnings/errors

---

## Estimated Effort

- **Phase 1 (Dependencies):** 2-4 hours
- **Phase 2 (Code Changes):** 8-16 hours
- **Phase 3 (Testing):** 4-8 hours
- **Phase 4 (Build Config):** 1-2 hours

**Total: 15-30 hours** depending on complexity of Blueprint/MUI API changes

---

## Rollback Plan

If critical issues arise:

1. **Git Reset:**
   ```bash
   git checkout master
   git branch -D feature/react-18-migration
   ```

2. **Keep Progress:**
   - Merge what works to a separate branch
   - Document blocking issues
   - Create issues for follow-up

---

## Post-Migration Tasks

- [ ] Update documentation
- [ ] Update CI/CD pipelines if needed
- [ ] Update deployment scripts
- [ ] Communicate changes to team
- [ ] Monitor for issues in production
- [ ] Create performance benchmarks

---

## Notes

- This migration was started on: 2025-12-02
- Branch: `feature/react-18-migration`
- Primary motivation: Access to React 18 features and maintain dependency support
