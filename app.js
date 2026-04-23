const BASE_CONFIG = {
  add_newline: false,
  palette: 'mytheme3',
  palettes: {
    mytheme1: {
      username_bg: '#3f1148',
      hostname_bg: '#54205f',
      user_fg: '#61afef',
      host_fg: '#61afef',
      dir_bg: '#4d2f53',
      dir_fg: '#ffff00',
      git_bg: '#474660',
      git_branch_fg: '#ffffff',
      git_status_fg: '#ffd75f',
      time_bg: '#436070',
      time_fg: '#999999'
    },
    mytheme2: {
      username_bg: '#31180C',
      hostname_bg: '#4A2412',
      user_fg: '#61afef',
      host_fg: '#61afef',
      dir_bg: '#422110',
      dir_fg: '#ffff00',
      git_bg: '#522914',
      git_branch_fg: '#ffffff',
      git_status_fg: '#ffd75f',
      time_bg: '#633118',
      time_fg: '#999999'
    },
    mytheme3: {
      username_bg: '#342C27',
      hostname_bg: '#544537',
      user_fg: '#1C62B8',
      host_fg: '#61afef',
      dir_bg: '#674D3A',
      dir_fg: '#ffff00',
      git_bg: '#403830',
      git_branch_fg: '#F5EBDD',
      git_status_fg: '#FFD39A',
      time_bg: '#2A1D1C',
      time_fg: '#999999'
    }
  }
};

const COLOR_KEYS = [
  'username_bg',
  'hostname_bg',
  'user_fg',
  'host_fg',
  'dir_bg',
  'dir_fg',
  'git_bg',
  'git_branch_fg',
  'git_status_fg',
  'time_bg',
  'time_fg'
];

const el = {
  themeSelect: document.getElementById('themeSelect'),
  colorControls: document.getElementById('colorControls'),
  promptLine: document.getElementById('promptLine'),
  tomlOutput: document.getElementById('tomlOutput'),
  addThemeBtn: document.getElementById('addThemeBtn'),
  resetBtn: document.getElementById('resetBtn'),
  downloadBtn: document.getElementById('downloadBtn')
};

const state = structuredClone(BASE_CONFIG);

function normalizeHex(hex) {
  const cleaned = (hex || '').trim();
  return /^#[0-9a-fA-F]{6}$/.test(cleaned) ? cleaned : null;
}

function currentPalette() {
  return state.palettes[state.palette];
}

function renderThemeOptions() {
  el.themeSelect.innerHTML = '';
  Object.keys(state.palettes).forEach((themeName) => {
    const option = document.createElement('option');
    option.value = themeName;
    option.textContent = themeName;
    if (themeName === state.palette) option.selected = true;
    el.themeSelect.append(option);
  });
}

function updateColor(key, color) {
  const parsed = normalizeHex(color);
  if (!parsed) return;
  currentPalette()[key] = parsed;
  renderPreview();
  renderToml();
}

function renderColorControls() {
  const palette = currentPalette();
  el.colorControls.innerHTML = '';

  COLOR_KEYS.forEach((key) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'color-item';

    const label = document.createElement('label');
    label.htmlFor = `${key}-hex`;
    label.textContent = key;

    const row = document.createElement('div');
    row.className = 'color-inputs';

    const picker = document.createElement('input');
    picker.type = 'color';
    picker.value = palette[key];
    picker.id = `${key}-picker`;
    picker.addEventListener('input', () => {
      text.value = picker.value.toUpperCase();
      updateColor(key, picker.value);
    });

    const text = document.createElement('input');
    text.type = 'text';
    text.value = palette[key].toUpperCase();
    text.id = `${key}-hex`;
    text.maxLength = 7;
    text.addEventListener('change', () => {
      const valid = normalizeHex(text.value);
      if (!valid) {
        text.value = palette[key].toUpperCase();
        return;
      }
      picker.value = valid;
      text.value = valid.toUpperCase();
      updateColor(key, valid);
    });

    row.append(picker, text);
    wrapper.append(label, row);
    el.colorControls.append(wrapper);
  });
}

function renderPreview() {
  const p = currentPalette();
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

  const segments = [
    { text: ' roger ', bg: p.username_bg, fg: p.user_fg },
    { text: ' DTVLU5CG4295FQS ', bg: p.hostname_bg, fg: p.host_fg },
    { text: ' ~/workspace/dtv ', bg: p.dir_bg, fg: p.dir_fg },
    { text: ' master ! ', bg: p.git_bg, fg: p.git_branch_fg },
    { text: ` ${now} `, bg: p.time_bg, fg: p.time_fg }
  ];

  el.promptLine.innerHTML = '';

  segments.forEach((segment, index) => {
    const seg = document.createElement('span');
    seg.className = 'segment';
    seg.textContent = segment.text;
    seg.style.backgroundColor = segment.bg;
    seg.style.color = segment.fg;
    el.promptLine.append(seg);

    if (index < segments.length - 1) {
      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.textContent = '';
      arrow.style.color = segment.bg;
      arrow.style.backgroundColor = segments[index + 1].bg;
      el.promptLine.append(arrow);
    } else {
      const endArrow = document.createElement('span');
      endArrow.className = 'arrow';
      endArrow.textContent = '';
      endArrow.style.color = segment.bg;
      endArrow.style.backgroundColor = 'transparent';
      el.promptLine.append(endArrow);
    }
  });
}

function renderToml() {
  const paletteName = state.palette;
  const p = currentPalette();

  const paletteToml = COLOR_KEYS.map((key) => `${key} = "${p[key].toUpperCase()}"`).join('\n');

  const output = `add_newline = false

format = """
[](fg:username_bg)\\
$username\\
[](fg:username_bg bg:hostname_bg)\\
$hostname\\
[](fg:hostname_bg bg:dir_bg)\\
$directory\\
[](fg:dir_bg bg:git_bg)\\
$git_branch$git_status\\
[](fg:git_bg bg:time_bg)\\
$time\\
[](fg:time_bg)\\
\\n$character
"""

palette = "${paletteName}"

[palettes.${paletteName}]
${paletteToml}

[username]
show_always = true
format = "[ $user ](bg:username_bg fg:user_fg)"
disabled = false

[hostname]
ssh_only = false
format = "[ $hostname ](bg:hostname_bg fg:host_fg)"
disabled = false

[directory]
format = "[ $path ](bg:dir_bg fg:dir_fg)"
home_symbol = "~"
truncate_to_repo = false
truncation_length = 0

[git_branch]
format = "[ $symbol$branch ](bg:git_bg fg:git_branch_fg)"
symbol = ""

[git_status]
format = "[($all_status$ahead_behind )](bg:git_bg fg:git_status_fg)"

[time]
disabled = false
time_format = "%Y-%m-%d %H:%M:%S"
format = "[ $time ](bg:time_bg fg:time_fg)"

[character]
success_symbol = "[❯](bold green)"
error_symbol = "[❯](bold red)"
`;

  el.tomlOutput.value = output;
}

function downloadToml() {
  const blob = new Blob([el.tomlOutput.value], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'starship.toml';
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function duplicateTheme() {
  const base = currentPalette();
  const nextName = `${state.palette}_copy_${Date.now().toString().slice(-4)}`;
  state.palettes[nextName] = structuredClone(base);
  state.palette = nextName;
  refresh();
}

function resetTheme() {
  if (BASE_CONFIG.palettes[state.palette]) {
    state.palettes[state.palette] = structuredClone(BASE_CONFIG.palettes[state.palette]);
    refresh();
    return;
  }

  const keys = Object.keys(state.palettes);
  if (keys.length > 1) {
    delete state.palettes[state.palette];
    state.palette = keys[0];
  }
  refresh();
}

function refresh() {
  renderThemeOptions();
  renderColorControls();
  renderPreview();
  renderToml();
}

el.themeSelect.addEventListener('change', () => {
  state.palette = el.themeSelect.value;
  refresh();
});

el.addThemeBtn.addEventListener('click', duplicateTheme);
el.resetBtn.addEventListener('click', resetTheme);
el.downloadBtn.addEventListener('click', downloadToml);

refresh();
