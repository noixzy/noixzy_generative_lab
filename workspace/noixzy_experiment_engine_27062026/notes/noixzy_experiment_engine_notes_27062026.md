# noixzy_experiment_engine_27062026

## Purpose
Experimental batch ideation and testing scaffold for organizing visual experiments in motion graphics, Blender, TouchDesigner, algorithmic architecture, and related creative domains.

## Structure
- `experiment_index.html` - Local browser dashboard
- `experiment_manifest.json` - Categories, flags, status types
- `experiment_seed_data.json` - 20 starter experiment entries
- `experiment_cards.js` - Card rendering and filtering logic
- `experiment_styles.css` - Dark, technical, compact styling

## Usage
Open `experiment_index.html` directly in browser. No server required.

## Features
- Category filtering (16 categories from brutalist architecture to lightweight physics)
- Status tracking (seed/test/promising/parked)
- Flag badges (light_physics, audio_hook, blender, ae, touchdesigner, projection_mapping, cpu_gpu_light)
- Random pairing generator (combines geometry, art reference, color, motion, audio hooks)
- Live stats counter

## Experiment Fields
Each card displays:
- Title, category, status
- Geometry idea
- Art/history reference
- Color system
- Motion idea
- Blender approach
- AE/TouchDesigner approach
- Audio/force-field hook
- Flag badges

## Next Steps
- Add more experiment entries as ideas emerge
- Update status as experiments are tested
- Use random pairing for quick ideation prompts
- Reference for Blender add-on audit preparation
- Link to actual test files when created

## Maintenance
Modify `experiment_seed_data.json` to add/edit experiments.
No dependencies, self-contained static files.
