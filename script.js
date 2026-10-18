/**
 * ATUL KUMAR KHETAN (phantomhive) — SENIOR CLOUD ENGINEER (L5)
 * Interactive Controller: Particle Canvas, Telemetry HUD, Architecture Explorer, Terminal Emulator, Sound Engine & Mobile Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypewriter();
  initAudioEngine();
  initArchitectureExplorer();
  initSkillsFilter();
  initTerminalEmulator();
  initMobileNavigation();
  initScrollSpy();
  initClipboardAndToasts();
});

/* ==========================================================================
   1. AMBIENT PARTICLE MESH CANVAS (CLOUD CLUSTER SIMULATOR)
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 18000), 70);
  const maxDistance = 140;
  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.6 + 0.8;
      this.color = Math.random() > 0.3 ? '#38bdf8' : '#a855f7';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse gentle repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.8;
          this.y -= (dy / dist) * force * 1.8;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting edges
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const lineAlpha = (1 - dist / maxDistance) * 0.16;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#38bdf8';
          ctx.globalAlpha = lineAlpha;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. TYPEWRITER EFFECT (HERO SPECIALIZATIONS)
   ========================================================================== */
function initTypewriter() {
  const target = document.querySelector('.typewriter-text');
  if (!target) return;

  const roles = [
    'Senior Cloud Infrastructure Engineer (L5 @ Uber)',
    'Planetary Bare-Metal & Fleet Observability Architect',
    'High-Throughput Observability & Distributed SRE',
    'Zero-Trust Security & Multi-Cloud FinOps Lead',
    'Distributed Systems & Low-Latency Architecture'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 90;

  function typeLoop() {
    const currentText = roles[roleIdx];

    if (isDeleting) {
      charIdx--;
      delay = 35;
    } else {
      charIdx++;
      delay = 75;
    }

    target.textContent = currentText.substring(0, charIdx);

    if (!isDeleting && charIdx === currentText.length) {
      isDeleting = true;
      delay = 2200;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 350;
    }

    setTimeout(typeLoop, delay);
  }

  typeLoop();
}

/* ==========================================================================
   3. WEB AUDIO SYNTHESIZER (MICRO UI AUDIO FEEDBACK)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioEngine() {
  const toggleBtn = document.getElementById('audio-toggle');
  if (!toggleBtn) return;

  const saved = localStorage.getItem('phantomhive_audio');
  if (saved === 'true') {
    soundEnabled = true;
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('title', 'Sound FX: ON (Click to mute)');
  }

  toggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem('phantomhive_audio', soundEnabled);

    if (soundEnabled) {
      toggleBtn.classList.add('active');
      toggleBtn.innerHTML = '<i class="fas fa-volume-high"></i>';
      toggleBtn.setAttribute('title', 'Sound FX: ON (Click to mute)');
      playSynthBeep(880, 'sine', 0.08);
      showToast('Sound feedback enabled');
    } else {
      toggleBtn.classList.remove('active');
      toggleBtn.innerHTML = '<i class="fas fa-volume-xmark"></i>';
      toggleBtn.setAttribute('title', 'Sound FX: OFF (Click to unmute)');
      showToast('Sound muted');
    }
  });

  document.querySelectorAll('button, .nav-link, .mobile-nav-link, .arch-node, .term-chip').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (soundEnabled) playSynthBeep(520, 'sine', 0.03, 0.02);
    });
    el.addEventListener('click', () => {
      if (soundEnabled) playSynthBeep(740, 'triangle', 0.05, 0.04);
    });
  });
}

function playSynthBeep(freq = 600, type = 'sine', duration = 0.05, gainLevel = 0.03) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Handled gracefully
  }
}


/* ==========================================================================
   5. INTERACTIVE CLOUD ARCHITECTURE EXPLORER (SANITIZED / HIGH LEVEL)
   ========================================================================== */
const architectureData = {
  'fleet-observability': {
    title: 'Fleet Observability & Zero-Touch Automation',
    subtitle: 'Distributed host fleet federated into central metrics via resilient mTLS proxies',
    nodes: [
      {
        id: 'node-hosts',
        icon: 'fas fa-server',
        title: 'Physical Host Fleet',
        sub: 'Distributed Labs & Data Centers',
        detailTitle: 'Physical Host Fleet & Telemetry Sources',
        desc: 'Re-architected fleet telemetry across bare-metal servers and large-scale hardware devices. Replaced fragile per-host push cron scripts with unified pull-based node exporters.',
        tech: ['Bare Metal', 'Linux/Ubuntu', 'macOS Fleet', 'DCIM Topology', 'node_exporter'],
        metricTitle: 'Scrape Reliability',
        metricVal: '100% fleet coverage (>99% scrape success)'
      },
      {
        id: 'node-dcim',
        icon: 'fas fa-network-wired',
        title: 'DCIM & Auto-Discovery',
        sub: 'Rack & Subnet Topology Discovery',
        detailTitle: 'Zero-Touch DCIM Integration',
        desc: 'Built subnet and rack-aware host discovery integrated with centralized DCIM. Automatic IPAM allocation, cabling documentation, and dynamic Prometheus service discovery (SD) configs generated without human toil.',
        tech: ['DCIM', 'IPAM', 'REST API', 'Python Automation'],
        metricTitle: 'Facility Onboarding',
        metricVal: '3 new colocation facilities on-boarded zero-touch'
      },
      {
        id: 'node-proxy',
        icon: 'fas fa-shield-halved',
        title: 'Resilient mTLS Proxy Tier',
        sub: 'Mutual TLS & Boundary Ingress',
        detailTitle: 'High-Availability mTLS Proxy Tier',
        desc: 'Architected a resilient mTLS proxy cluster handling dynamic certificate authentication, rate limiting, and encrypted metric transit across firewalled lab environments.',
        tech: ['Envoy Ingress', 'PKI / mTLS', 'Short-Lived Certs', 'Zero-Trust'],
        metricTitle: 'Network Optimization',
        metricVal: 'Reduced lab network traffic spikes by 90%'
      },
      {
        id: 'node-prom',
        icon: 'fas fa-chart-line',
        title: 'Prometheus Federation',
        sub: 'Per-Site Control Planes',
        detailTitle: 'Regional Scrape Architecture',
        desc: 'Deployed isolated, highly-available Prometheus instances inside each physical zone. Scrapes local node exporters every 15s with 60-second hardware health telemetry.',
        tech: ['Prometheus', 'PromQL', 'Alertmanager', 'SLO / SLI'],
        metricTitle: 'Telemetry Frequency',
        metricVal: '60s hardware link telemetry & 15s node metrics'
      },
      {
        id: 'node-m3',
        icon: 'fas fa-database',
        title: 'Central Metrics & Grafana',
        sub: 'Global Dashboards & Alerting',
        detailTitle: 'Central Observability & On-Call Integration',
        desc: 'Federates distributed Prometheus metrics into high-scale storage for multi-year trending and unified Grafana dashboards. Tiered P0/P1 alerts routed to on-call systems within 2 minutes of detection.',
        tech: ['Metrics Storage', 'Grafana', 'PagerDuty', 'Incident SRE'],
        metricTitle: 'Mean Time to Repair (MTTR)',
        metricVal: 'Cut MTTR across 8 labs; alerts routed <2 mins'
      }
    ]
  },
  'gitops-eks': {
    title: 'Multi-Region Kubernetes (EKS) GitOps & Kafka Streaming',
    subtitle: '100+ microservices on multi-region AWS EKS with ArgoCD canary rollouts at 99.99% uptime',
    nodes: [
      {
        id: 'node-git',
        icon: 'fab fa-git-alt',
        title: 'Git Version Control',
        sub: 'Monorepo Infrastructure as Code',
        detailTitle: 'Declarative Source of Truth',
        desc: 'All Kubernetes manifests, Helm charts, and Terraform configs versioned declaratively. Built automated pull request validation with linting and policy-as-code.',
        tech: ['Git', 'GitHub Actions', 'Monorepo', 'Helm', 'Kustomize'],
        metricTitle: 'Configuration Drift',
        metricVal: '0% unmanaged state drift'
      },
      {
        id: 'node-ci',
        icon: 'fas fa-gears',
        title: 'CI / CD Pipeline',
        sub: 'Automated Build & Test Suite',
        detailTitle: 'Idempotent Container Builds & Security Scan',
        desc: 'High-speed distributed CI pipeline running unit, integration, and security scans before pushing signed immutable container images to registry.',
        tech: ['Buildkite CI', 'Docker', 'Vulnerability Scanners', 'ECR'],
        metricTitle: 'Release Automation',
        metricVal: '40% reduction in deployment toil'
      },
      {
        id: 'node-argo',
        icon: 'fas fa-ship',
        title: 'ArgoCD GitOps Engine',
        sub: 'Canary & Blue-Green Gates',
        detailTitle: 'Progressive Delivery Controller',
        desc: 'ArgoCD orchestrates progressive rollouts across clusters. Automated canary analysis checks error rates and latency metrics before promoting traffic, cutting rollback incidents 70%.',
        tech: ['ArgoCD', 'Canary Rollouts', 'Prometheus Metrics Gate'],
        metricTitle: 'Rollback Incidents',
        metricVal: '-70% rollback failures through progressive delivery'
      },
      {
        id: 'node-eks',
        icon: 'fab fa-aws',
        title: 'Multi-Region AWS EKS',
        sub: '100+ Production Microservices',
        detailTitle: 'Elastic Kubernetes Service at Scale',
        desc: 'Multi-region EKS clusters configured with autoscaling, least-privilege IAM, and cross-AZ resilience maintaining 99.99% uptime for enterprise CXM SaaS.',
        tech: ['AWS EKS', 'Autoscaling', 'Least-Privilege IAM', 'Multi-AZ'],
        metricTitle: 'Platform Availability',
        metricVal: '99.99% uptime across 100+ microservices'
      },
      {
        id: 'node-kafka',
        icon: 'fas fa-stream',
        title: 'Apache Kafka Event Mesh',
        sub: 'High-Throughput Event Streaming',
        detailTitle: 'Kafka Event Mesh Architecture',
        desc: 'Deployed enterprise-grade Kafka clusters for high-volume event ingestion and message streaming, tightly monitored by Prometheus and distributed tracing.',
        tech: ['Apache Kafka', 'KRaft', 'Prometheus', 'Distributed Tracing'],
        metricTitle: 'AWS Cost Reduction',
        metricVal: '~25% AWS cost savings via FinOps right-sizing'
      }
    ]
  },
  'zero-trust': {
    title: 'Zero-Trust Multi-Cloud Security & Dynamic SSH CA',
    subtitle: 'Identity-aware proxies, HashiCorp Vault PKI, and FedRAMP/SOC 2 compliance',
    nodes: [
      {
        id: 'node-client',
        icon: 'fas fa-user-shield',
        title: 'Authenticated Clients',
        sub: 'OIDC / SSO Identity Assertion',
        detailTitle: 'Authenticated Client Boundary',
        desc: 'Developers and automation scripts authenticate via corporate SSO using multi-factor authentication, removing static VPN and credential reliance.',
        tech: ['OIDC', 'SSO', 'MFA', 'Zero-Trust Perimeter'],
        metricTitle: 'Access Protocol',
        metricVal: 'Zero static passwords or permanent credentials'
      },
      {
        id: 'node-zero-trust',
        icon: 'fas fa-door-open',
        title: 'Zero-Trust Access Gateway',
        sub: 'Identity-Aware Access Gateway',
        detailTitle: 'Layer 7 Contextual Access Proxy',
        desc: 'Acts as the single edge ingress gate. Every request is authorized per-action based on user identity, device posture, and session lifetime.',
        tech: ['Identity-Aware Proxy', 'Envoy Ingress', 'Contextual IAM'],
        metricTitle: 'Attack Surface',
        metricVal: '100% elimination of exposed public management ports'
      },
      {
        id: 'node-vault',
        icon: 'fas fa-key',
        title: 'Vault & Dynamic SSH CA',
        sub: 'Short-Lived Ephemeral Certs',
        detailTitle: 'Centralized Secret & PKI Authority',
        desc: 'Replaced long-lived SSH authorized_keys across the fleet with a dynamic SSH Certificate Authority. Engineers receive cryptographically signed short-lived certificates.',
        tech: ['HashiCorp Vault', 'SSH CA', 'PKI / mTLS', 'Auto-Rotation'],
        metricTitle: 'Host CA Coverage',
        metricVal: '100% of physical and cloud hosts on SSH CA'
      },
      {
        id: 'node-cloud',
        icon: 'fas fa-cloud',
        title: 'Multi-Cloud Infrastructure',
        sub: 'AWS, GCP & Colocation',
        detailTitle: 'Sovereign Multi-Cloud Architecture',
        desc: 'Unified security standards across AWS, GCP, and bare-metal colocation. Enforced least-privilege IAM, automated secrets rotation, and automated failover.',
        tech: ['AWS', 'GCP', 'Colo Bare-Metal', 'Terraform Modules'],
        metricTitle: 'Cloud Cost Optimization',
        metricVal: 'Saved $500K/yr (~40%) with automated right-sizing'
      },
      {
        id: 'node-audit',
        icon: 'fas fa-stamp',
        title: 'Enterprise Compliance Audit',
        sub: 'FedRAMP, NIST 800-53 & SOC 2',
        detailTitle: 'Flawless Enterprise Compliance Posture',
        desc: 'Designed architectures to satisfy stringent federal and financial compliance frameworks. Passed SOC 2 Type II, FedRAMP, and PCI DSS audits with zero major findings.',
        tech: ['FedRAMP', 'NIST 800-53', 'PCI DSS', 'SOC 2 Type II', 'ISO 27001'],
        metricTitle: 'Audit Record',
        metricVal: '100% compliant audits with 0 critical findings'
      }
    ]
  }
};

function initArchitectureExplorer() {
  const tabBtns = document.querySelectorAll('.arch-tab-btn');
  const diagramFlow = document.getElementById('arch-diagram-flow');
  const inspectorTitle = document.getElementById('inspector-title');
  const inspectorDesc = document.getElementById('inspector-desc');
  const inspectorTags = document.getElementById('inspector-tags');
  const inspectorMetricTitle = document.getElementById('inspector-metric-title');
  const inspectorMetricVal = document.getElementById('inspector-metric-val');

  let currentArchKey = 'fleet-observability';

  function renderArchitecture(archKey) {
    const arch = architectureData[archKey];
    if (!arch || !diagramFlow) return;

    diagramFlow.innerHTML = '';

    arch.nodes.forEach((node, index) => {
      const nodeEl = document.createElement('div');
      nodeEl.className = `arch-node ${index === 0 ? 'selected' : ''}`;
      nodeEl.dataset.nodeId = node.id;

      nodeEl.innerHTML = `
        <div class="node-step-tag">0${index + 1}</div>
        <div class="node-icon-wrap">
          <i class="${node.icon}"></i>
        </div>
        <div class="node-title">${node.title}</div>
        <div class="node-subtitle">${node.sub}</div>
        <div class="node-click-hint"><i class="fas fa-arrow-pointer"></i> inspect</div>
      `;

      nodeEl.addEventListener('click', () => {
        document.querySelectorAll('.arch-node').forEach((n) => n.classList.remove('selected'));
        nodeEl.classList.add('selected');
        updateInspector(node);
        if (soundEnabled) playSynthBeep(640, 'triangle', 0.05);
      });

      diagramFlow.appendChild(nodeEl);
    });

    if (arch.nodes.length > 0) {
      updateInspector(arch.nodes[0]);
    }
  }

  function updateInspector(node) {
    if (inspectorTitle) inspectorTitle.innerHTML = `<i class="${node.icon}"></i> ${node.detailTitle}`;
    if (inspectorDesc) inspectorDesc.textContent = node.desc;
    if (inspectorMetricTitle) inspectorMetricTitle.textContent = node.metricTitle;
    if (inspectorMetricVal) inspectorMetricVal.textContent = node.metricVal;

    if (inspectorTags) {
      inspectorTags.innerHTML = '';
      node.tech.forEach((t) => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = t;
        inspectorTags.appendChild(tag);
      });
    }
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentArchKey = btn.dataset.arch;
      renderArchitecture(currentArchKey);
    });
  });

  renderArchitecture(currentArchKey);
}

/* ==========================================================================
   6. SKILL MATRIX FILTERING & INSTANT SEARCH
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const searchInput = document.getElementById('skills-search');
  const skillCards = document.querySelectorAll('.skill-card');

  let currentCategory = 'all';
  let searchTerm = '';

  function applyFilters() {
    skillCards.forEach((card) => {
      const cardCategory = card.dataset.category || '';
      const cardTitle = (card.querySelector('.skill-title')?.textContent || '').toLowerCase();
      const cardContext = (card.querySelector('.skill-context')?.textContent || '').toLowerCase();

      const matchesCat = currentCategory === 'all' || cardCategory === currentCategory;
      const matchesSearch =
        searchTerm === '' || cardTitle.includes(searchTerm) || cardContext.includes(searchTerm);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.filter;
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

/* ==========================================================================
   7. INTERACTIVE TERMINAL EMULATOR (CMD + K)
   ========================================================================== */
function initTerminalEmulator() {
  const backdrop = document.getElementById('terminal-modal-backdrop');
  const openBtns = document.querySelectorAll('.trigger-terminal');
  const closeBtn = document.getElementById('terminal-close-btn');
  const inputField = document.getElementById('terminal-input');
  const historyLog = document.getElementById('terminal-history');
  const chips = document.querySelectorAll('.term-chip');

  if (!backdrop) return;

  const commandHistory = [];
  let historyIdx = -1;

  function openTerminal() {
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    if (inputField) {
      setTimeout(() => inputField.focus(), 150);
    }
    if (soundEnabled) playSynthBeep(880, 'sine', 0.08);
  }

  function closeTerminal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (soundEnabled) playSynthBeep(440, 'sine', 0.05);
  }

  openBtns.forEach((btn) => btn.addEventListener('click', openTerminal));
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeTerminal();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (backdrop.classList.contains('open')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    } else if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeTerminal();
    }
  });

  if (inputField) {
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = inputField.value.trim();
        if (cmd) {
          commandHistory.push(cmd);
          historyIdx = commandHistory.length;
          executeCommand(cmd);
          inputField.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        if (historyIdx > 0) {
          historyIdx--;
          inputField.value = commandHistory[historyIdx];
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIdx < commandHistory.length - 1) {
          historyIdx++;
          inputField.value = commandHistory[historyIdx];
        } else {
          historyIdx = commandHistory.length;
          inputField.value = '';
        }
      }
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.dataset.cmd;
      if (cmd) {
        executeCommand(cmd);
        if (inputField) inputField.focus();
      }
    });
  });

  function executeCommand(cmd) {
    if (!historyLog) return;

    const entryEl = document.createElement('div');
    entryEl.className = 'term-entry-command';
    entryEl.innerHTML = `<span>atul@phantomhive:~$</span> <span style="color: #fff">${escapeHTML(cmd)}</span>`;
    historyLog.appendChild(entryEl);

    const outputEl = document.createElement('div');
    outputEl.className = 'term-entry-output';

    const normalized = cmd.toLowerCase().trim();

    switch (normalized) {
      case 'help':
        outputEl.innerHTML = `
<span style="color: #38bdf8">Available Cloud Commands:</span>
  <span style="color: #34d399">whoami</span>        - Executive profile & L5 Cloud Engineer credentials
  <span style="color: #34d399">resume</span>        - View & download updated Senior Cloud Engineer L5 resume (PDF)
  <span style="color: #34d399">fleet</span>         - Display regional fleet status & infrastructure health posture
  <span style="color: #34d399">kubectl</span>       - Run mocked Kubernetes pod inspection ('kubectl get pods -A')
  <span style="color: #34d399">terraform</span>     - Run simulated Infrastructure as Code state query
  <span style="color: #34d399">skills</span>        - Show production technology stack & mastery breakdown
  <span style="color: #34d399">experience</span>    - Career trajectory (Uber L5, Sprinklr Lead, MavQ Senior)
  <span style="color: #34d399">ratings</span>       - Algorithmic foundations and problem solving track record
  <span style="color: #34d399">contact</span>       - Direct communication channels & links
  <span style="color: #34d399">matrix</span>        - Trigger digital rain matrix simulation
  <span style="color: #34d399">clear</span>         - Clear the terminal screen
  <span style="color: #34d399">sudo</span>          - Request elevated root access
`;
        break;

      case 'whoami':
        outputEl.innerHTML = `
<span style="color: #38bdf8">ATUL KUMAR KHETAN</span> (alias: <span style="color: #c084fc">phantomhive</span>)
<span style="color: #94a3b8">Current Role:</span>   Senior Cloud Engineer (L5) @ Uber Technologies Inc.
<span style="color: #94a3b8">Location:</span>       Hyderabad, India
<span style="color: #94a3b8">Focus:</span>          Fleet Observability, Bare-Metal Automation, Zero-Trust Architecture, SRE
<span style="color: #94a3b8">Credentials:</span>    Google Cloud Certified Professional Cloud Architect & Associate Cloud Engineer
<span style="color: #94a3b8">Core Principle:</span> "O(1) algorithmic efficiency married with resilient distributed systems."
`;
        break;

      case 'resume':
      case 'cv':
        outputEl.innerHTML = `
<span style="color: #38bdf8">ATUL KUMAR KHETAN — SENIOR CLOUD ENGINEER (L5) RESUME</span>
📄 Initiating download of updated PDF resume...
Direct Link: <a href="Atul_Khetan_Senior_Cloud_Engineer_Resume.pdf" download="Atul_Khetan_Senior_Cloud_Engineer_Resume.pdf" target="_blank" style="color: #34d399; text-decoration: underline;">Atul_Khetan_Senior_Cloud_Engineer_Resume.pdf</a>
`;
        window.open('Atul_Khetan_Senior_Cloud_Engineer_Resume.pdf', '_blank');
        break;

      case 'fleet':
        outputEl.innerHTML = `
<span style="color: #38bdf8">DISTRIBUTED INFRASTRUCTURE & FLEET POSTURE:</span>
+-------------------------+--------------------+--------------------+---------------+
| Regional Zone           | Environment Tier   | Ingress Gateway    | Fleet Health  |
+-------------------------+--------------------+--------------------+---------------+
| Region-US-West          | Production Cluster | Zero-Trust Proxy   | Nominal (100%)|
| Region-US-East          | Production Cluster | Zero-Trust Proxy   | Nominal (100%)|
| Region-APAC (Hyd)       | Core Control Plane | Zero-Trust Proxy   | Nominal (100%)|
+-------------------------+--------------------+--------------------+---------------+
| <span style="color: #34d399">GLOBAL FLEET POSTURE</span>    | <span style="color: #34d399">Distributed Scale</span>  | <span style="color: #34d399">Dynamic SSH CA</span>     | <span style="color: #34d399">NOMINAL (0 P0)</span>  |
+-------------------------+--------------------+--------------------+---------------+
`;
        break;

      case 'kubectl':
      case 'kubectl get pods':
      case 'kubectl get pods -a':
        outputEl.innerHTML = `
<span style="color: #38bdf8">NAMESPACE       NAME                                READY   STATUS    RESTARTS   AGE</span>
observability   metrics-storage-coordinator-0       1/1     Running   0          42d
observability   prometheus-federation-agent-6x8p    1/1     Running   0          18d
observability   grafana-enterprise-dashboard-492k   1/1     Running   0          65d
zero-trust      identity-proxy-ingress-7b4d9        1/1     Running   0          30d
security        vault-ssh-cert-authority-leader-0   1/1     Running   0          90d
argocd          argocd-canary-rollout-controller-v2 1/1     Running   0          120d
production      streaming-event-processor-kafka-0   1/1     Running   0          14d
`;
        break;

      case 'terraform':
      case 'terraform plan':
        outputEl.innerHTML = `
<span style="color: #38bdf8">Terraform Enterprise v1.9.0</span>
Initializing backend: <span style="color: #c084fc">s3://infrastructure-state-prod</span>
Success! 14 enterprise modules evaluated.
<span style="color: #34d399">Plan: 0 to add, 0 to change, 0 to destroy.</span>
All infrastructure resources match desired GitOps state. Zero configuration drift detected.
`;
        break;

      case 'skills':
        outputEl.innerHTML = `
<span style="color: #38bdf8">CORE TECHNICAL ARSENAL:</span>
• <span style="color: #38bdf8">Cloud & DC:</span>       AWS (EKS, VPC, DirectConnect), GCP (GKE, Cloud Armor), Colocation Fleet
• <span style="color: #38bdf8">Orchestration:</span>   Kubernetes, Helm, ArgoCD GitOps, Apache Kafka (KRaft), Knative
• <span style="color: #38bdf8">IaC & CI/CD:</span>     Terraform, Bazel/Monorepo, Ansible, Docker, Buildkite
• <span style="color: #38bdf8">Observability:</span>   Prometheus, M3, Grafana, Loki, Tempo, Alertmanager, PagerDuty, SLOs
• <span style="color: #38bdf8">Zero-Trust:</span>      Identity-Aware Proxies, SSH CA, Vault, SSO/OIDC, PKI/mTLS, FedRAMP, SOC 2
• <span style="color: #38bdf8">Languages:</span>       Go, Python, Bash, SQL, C++, YAML
`;
        break;

      case 'experience':
        outputEl.innerHTML = `
<span style="color: #34d399">1. Uber Technologies Inc. (Jan 2026 – Present)</span>
   Senior Cloud Engineer (L5) | Fleet Observability, 2,000+ Host Fleet, Zero-Touch DCIM

<span style="color: #38bdf8">2. Sprinklr (Mar 2025 – Dec 2025)</span>
   Lead DevOps Engineer | Multi-Region EKS, Kafka Streaming, ArgoCD GitOps, 25% AWS Cost Cut

<span style="color: #c084fc">3. MavQ Inc. / MTX Group (Jul 2019 – Mar 2025)</span>
   Senior DevOps Engineer | FedRAMP/NIST 800-53 Compliance, $500K/yr FinOps Savings, DR Failover
`;
        break;

      case 'ratings':
        outputEl.innerHTML = `
<span style="color: #f59e0b">ALGORITHMIC PROBLEM SOLVING TRACK RECORD:</span>
• <span style="color: #f59e0b">CodeChef:</span>       1949 Peak Rating (Div 1 Competitive Contests)
• <span style="color: #f59e0b">Codeforces:</span>     1551 Peak Rating (Specialist Tier)
• <span style="color: #f59e0b">HackerEarth:</span>    1529 Peak Rating
• <span style="color: #f59e0b">Project Euler:</span>  85+ Complex Mathematical Algorithmic Solutions
`;
        break;

      case 'contact':
        outputEl.innerHTML = `
<span style="color: #38bdf8">CONNECT WITH ATUL:</span>
• Email:      <a href="mailto:khetanatulz@gmail.com" style="color: #34d399">khetanatulz@gmail.com</a>
• LinkedIn:   <a href="https://linkedin.com/in/atul-khetan" target="_blank" style="color: #38bdf8">linkedin.com/in/atul-khetan</a>
• GitHub:     <a href="https://github.com/phantomhieve" target="_blank" style="color: #c084fc">github.com/phantomhieve</a>
• Portfolio:  <a href="https://phantomhieve.github.io/profile/" target="_blank" style="color: #f59e0b">phantomhieve.github.io/profile</a>
`;
        break;

      case 'matrix':
        outputEl.innerHTML = '<span style="color: #34d399">Initializing Matrix protocol... look at the screen!</span>';
        triggerMatrixEffect();
        break;

      case 'sudo':
      case 'sudo su':
        outputEl.innerHTML = `
<span style="color: #ef4444">PERMISSION DENIED.</span>
Nice try! Root access on phantomhive infrastructure is enforced via <span style="color: #38bdf8">Zero-Trust Identity Proxies</span>
and short-lived cryptographic certs via <span style="color: #c084fc">HashiCorp Vault SSH CA</span>.
This incident will be reported with love. 😉
`;
        break;

      case 'clear':
        historyLog.innerHTML = '';
        return;

      default:
        outputEl.innerHTML = `<span style="color: #ef4444">Command not found: '${escapeHTML(cmd)}'.</span> Type <span style="color: #34d399">'help'</span> for list of commands.`;
        break;
    }

    historyLog.appendChild(outputEl);
    historyLog.scrollTop = historyLog.scrollHeight;

    if (soundEnabled) playSynthBeep(480, 'sine', 0.04);
  }
}

function triggerMatrixEffect() {
  const backdrop = document.getElementById('terminal-modal-backdrop');
  if (!backdrop) return;

  const modal = backdrop.querySelector('.terminal-modal');
  modal.style.borderColor = '#10b981';
  modal.style.boxShadow = '0 0 60px rgba(16, 185, 129, 0.4)';

  setTimeout(() => {
    modal.style.borderColor = '';
    modal.style.boxShadow = '';
  }, 3500);
}

/* ==========================================================================
   8. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-nav-close');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openMenu() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (soundEnabled) playSynthBeep(720, 'sine', 0.05);
  }

  function closeMenu() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (soundEnabled) playSynthBeep(420, 'sine', 0.04);
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* ==========================================================================
   9. ACTIVE SCROLL SPY & NAVBAR BLUR
   ========================================================================== */
function initScrollSpy() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    sections.forEach((sec) => {
      const secHeight = sec.offsetHeight;
      const secTop = sec.offsetTop - 140;
      const secId = sec.getAttribute('id');

      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${secId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   10. CLIPBOARD HELPER & TOAST ENGINE
   ========================================================================== */
function initClipboardAndToasts() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
        if (soundEnabled) playSynthBeep(920, 'sine', 0.08);
      }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied to clipboard: ${textToCopy}`);
      });
    });
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-circle-check"></i> <span>${escapeHTML(message)}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}