// noixzy_experiment_engine card rendering and interaction logic

let experimentsData = [];
let manifestData = {};
let currentFilter = 'all';

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  setupControls();
  renderExperiments();
  updateStats();
});

// Load JSON data
async function loadData() {
  try {
    const [seedResponse, manifestResponse] = await Promise.all([
      fetch('experiment_seed_data.json'),
      fetch('experiment_manifest.json')
    ]);
    
    const seedData = await seedResponse.json();
    const manifest = await manifestResponse.json();
    
    experimentsData = seedData.experiments;
    manifestData = manifest.manifest;
  } catch (error) {
    console.error('Error loading data:', error);
    document.getElementById('experimentGrid').innerHTML = 
      '<div class="no-results">Error loading experiment data. Check console.</div>';
  }
}

// Setup control buttons
function setupControls() {
  const controlsContainer = document.getElementById('controls');
  
  // All experiments button
  const allBtn = createButton('All', 'all', true);
  controlsContainer.appendChild(allBtn);
  
  // Category filter buttons
  manifestData.categories.forEach(category => {
    const btn = createButton(category.name, category.id, false);
    controlsContainer.appendChild(btn);
  });
  
  // Random pairing button
  const randomBtn = document.createElement('button');
  randomBtn.id = 'randomPairBtn';
  randomBtn.textContent = '⚡ Random Pairing';
  randomBtn.addEventListener('click', generateRandomPairing);
  controlsContainer.appendChild(randomBtn);
}

// Create filter button
function createButton(label, filterId, isActive) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.dataset.filter = filterId;
  if (isActive) btn.classList.add('active');
  
  btn.addEventListener('click', (e) => {
    // Update active state
    document.querySelectorAll('.controls button[data-filter]').forEach(b => {
      b.classList.remove('active');
    });
    btn.classList.add('active');
    
    // Apply filter
    currentFilter = filterId;
    renderExperiments();
    updateStats();
  });
  
  return btn;
}

// Render experiment cards
function renderExperiments() {
  const grid = document.getElementById('experimentGrid');
  grid.innerHTML = '';
  
  // Filter experiments
  const filtered = currentFilter === 'all' 
    ? experimentsData 
    : experimentsData.filter(exp => exp.category === currentFilter);
  
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="no-results">No experiments found for this category.</div>';
    return;
  }
  
  // Render each card
  filtered.forEach(exp => {
    const card = createExperimentCard(exp);
    grid.appendChild(card);
  });
}

// Create experiment card element
function createExperimentCard(exp) {
  const card = document.createElement('div');
  card.className = 'experiment-card';
  card.dataset.id = exp.id;
  
  // Get category name
  const category = manifestData.categories.find(c => c.id === exp.category);
  const categoryName = category ? category.name : exp.category;
  
  card.innerHTML = `
    <div class="card-header">
      <div class="card-title">${exp.title}</div>
      <div class="card-status ${exp.status}">${exp.status}</div>
    </div>
    
    <div class="card-category">${categoryName}</div>
    
    <div class="card-field">
      <div class="card-field-label">Geometry</div>
      <div class="card-field-value">${exp.geometry_idea}</div>
    </div>
    
    <div class="card-field">
      <div class="card-field-label">Art Reference</div>
      <div class="card-field-value">${exp.art_reference}</div>
    </div>
    
    <div class="card-field">
      <div class="card-field-label">Color System</div>
      <div class="card-field-value">${exp.color_system}</div>
    </div>
    
    <div class="card-field">
      <div class="card-field-label">Motion</div>
      <div class="card-field-value">${exp.motion_idea}</div>
    </div>
    
    <div class="card-field">
      <div class="card-field-label">Blender</div>
      <div class="card-field-value">${exp.blender_approach}</div>
    </div>
    
    <div class="card-field">
      <div class="card-field-label">AE / TouchDesigner</div>
      <div class="card-field-value">${exp.ae_touchdesigner_approach}</div>
    </div>
    
    <div class="card-field">
      <div class="card-field-label">Audio / Force Hook</div>
      <div class="card-field-value">${exp.audio_force_hook}</div>
    </div>
    
    <div class="card-flags">
      ${exp.flags.map(flag => `<span class="flag-badge ${flag}">${flag.replace(/_/g, ' ')}</span>`).join('')}
    </div>
  `;
  
  return card;
}

// Generate random pairing
function generateRandomPairing() {
  const randomOutput = document.getElementById('randomOutput');
  
  // Random selections from pool
  const geometries = experimentsData.map(e => e.geometry_idea);
  const artRefs = experimentsData.map(e => e.art_reference);
  const colorSystems = experimentsData.map(e => e.color_system);
  const motions = experimentsData.map(e => e.motion_idea);
  const hooks = experimentsData.map(e => e.audio_force_hook);
  
  const randomGeometry = geometries[Math.floor(Math.random() * geometries.length)];
  const randomArt = artRefs[Math.floor(Math.random() * artRefs.length)];
  const randomColor = colorSystems[Math.floor(Math.random() * colorSystems.length)];
  const randomMotion = motions[Math.floor(Math.random() * motions.length)];
  const randomHook = hooks[Math.floor(Math.random() * hooks.length)];
  
  // Random flags
  const allFlags = manifestData.flags;
  const numFlags = Math.floor(Math.random() * 3) + 2; // 2-4 flags
  const randomFlags = [];
  const flagPool = [...allFlags];
  for (let i = 0; i < numFlags && flagPool.length > 0; i++) {
    const idx = Math.floor(Math.random() * flagPool.length);
    randomFlags.push(flagPool.splice(idx, 1)[0]);
  }
  
  randomOutput.innerHTML = `
    <h3>⚡ Random Experiment Pairing</h3>
    <div class="pairing-item"><strong>Geometry:</strong> ${randomGeometry}</div>
    <div class="pairing-item"><strong>Art Reference:</strong> ${randomArt}</div>
    <div class="pairing-item"><strong>Color System:</strong> ${randomColor}</div>
    <div class="pairing-item"><strong>Motion:</strong> ${randomMotion}</div>
    <div class="pairing-item"><strong>Audio/Force Hook:</strong> ${randomHook}</div>
    <div class="pairing-item"><strong>Flags:</strong> ${randomFlags.map(f => f.replace(/_/g, ' ')).join(', ')}</div>
  `;
  
  randomOutput.classList.add('visible');
  
  // Scroll to output
  randomOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Update stats display
function updateStats() {
  const statsEl = document.getElementById('stats');
  
  const filtered = currentFilter === 'all' 
    ? experimentsData 
    : experimentsData.filter(exp => exp.category === currentFilter);
  
  const statusCounts = {
    seed: filtered.filter(e => e.status === 'seed').length,
    test: filtered.filter(e => e.status === 'test').length,
    promising: filtered.filter(e => e.status === 'promising').length,
    parked: filtered.filter(e => e.status === 'parked').length
  };
  
  statsEl.innerHTML = `
    Total: ${filtered.length} | 
    Seed: ${statusCounts.seed} | 
    Test: ${statusCounts.test} | 
    Promising: ${statusCounts.promising} | 
    Parked: ${statusCounts.parked}
  `;
}
