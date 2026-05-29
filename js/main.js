/**
 * MAIN.JS
 * Interactivity for navigation, technical terminal, tab switching, and interactive skill vectors.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. NAVBAR SCROLL EFFECT
  // ==========================================================================
  const navbar = document.querySelector('.navbar-container');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ==========================================================================
  // 2. MOBILE NAVIGATION MENU
  // ==========================================================================
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking navigation items
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ==========================================================================
  // 3. WORK PAGE: TAB CONTROLLER
  // ==========================================================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabBtns.length > 0 && tabPanels.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');

        // Toggle Buttons
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle Panels
        tabPanels.forEach(panel => {
          if (panel.id === target) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  }

  // ==========================================================================
  // 4. INTERACTIVE SKILLS PREVIEW PANEL
  // ==========================================================================
  const skillItems = document.querySelectorAll('.skill-interactive-item');
  const previewPlaceholder = document.querySelector('.preview-placeholder');
  const previewContent = document.querySelector('.preview-content');
  const previewTitle = document.querySelector('.preview-title');
  const previewDesc = document.querySelector('.preview-description');
  const previewProjList = document.querySelector('.preview-project-list');

  // Skill definitions & related projects mapping
  const skillsDatabase = {
    'machine-learning': {
      title: 'Machine Learning',
      desc: 'Developing specialized predictive models, constraints solvers, anomaly detection systems, and statistical formulations using clean algorithmic logic.',
      projects: [
        { name: 'HR Sentiment Analysis Platform', type: 'Professional', link: 'projects.html#hr-sentiment' },
        { name: 'Expense Management & Fraud Detection', type: 'Professional', link: 'projects.html#expense-fraud' },
        { name: 'Sales Forecasting System', type: 'Professional', link: 'projects.html#sales-forecasting' },
        { name: 'NYC Taxi Revenue Welch\'s T-Testing', type: 'Personal', link: 'projects.html#nyc-taxi' }
      ]
    },
    'forecasting': {
      title: 'Forecasting Systems',
      desc: 'Formulating time-series metrics, transactional projection charts, and supply vectors using econometric models to optimize pipeline outputs.',
      projects: [
        { name: 'Sales Forecasting System', type: 'Professional', link: 'projects.html#sales-forecasting' },
        { name: 'Smart Auto-Restock Agent', type: 'Personal', link: 'projects.html#auto-restock' }
      ]
    },
    'nlp': {
      title: 'Natural Language Processing (NLP)',
      desc: 'Building NLP pipelines employing fine-tuned DistilBERT transformer models, text mining algorithms, and custom tokenizers to structure verbal and text metrics.',
      projects: [
        { name: 'Priya AI Voice Agent', type: 'Professional', link: 'projects.html#priya-voice' },
        { name: 'HR Sentiment Analysis Platform', type: 'Professional', link: 'projects.html#hr-sentiment' },
        { name: 'AI Job Market Bibliometrics', type: 'Personal', link: 'projects.html#job-market' }
      ]
    },
    'llms': {
      title: 'Large Language Models (LLMs)',
      desc: 'Orchestrating dense prompt vectors, local instruction parsing, structured JSON schema generators, and agentic workflows using public and confidential LLM pipelines.',
      projects: [
        { name: 'Priya AI Voice Agent', type: 'Professional', link: 'projects.html#priya-voice' },
        { name: 'Smart Auto-Restock Agent', type: 'Personal', link: 'projects.html#auto-restock' }
      ]
    },
    'rag': {
      title: 'Retrieval Augmented Generation (RAG)',
      desc: 'Connecting embedded document blocks and semantic search files with local vector store structures to retrieve precise facts in sub-second timelines.',
      projects: [
        { name: 'Priya AI Voice Agent', type: 'Professional', link: 'projects.html#priya-voice' },
        { name: 'Smart Auto-Restock Agent', type: 'Personal', link: 'projects.html#auto-restock' }
      ]
    },
    'optimization': {
      title: 'Linear & Simplex Optimization',
      desc: 'Structuring linear allocation simplex arrays and operations constraints matrices (using SciPy Optimize) to solve operational bounds and compute optimal paths.',
      projects: [
        { name: 'Scheme Optimization Engine', type: 'Professional', link: 'projects.html#scheme-optimization' },
        { name: 'Smart Auto-Restock Agent', type: 'Personal', link: 'projects.html#auto-restock' }
      ]
    },
    'data-engineering': {
      title: 'Data Engineering & Pipelines',
      desc: 'Drafting ETL ingestion grids, scheduling relational databases scripts, and configuring transactional schemas using SQL, Postgres, and hourly cron scripts.',
      projects: [
        { name: 'Competitor Ad Intelligence Platform', type: 'Personal', link: 'projects.html#ad-intel' },
        { name: 'Smart Auto-Restock Agent', type: 'Personal', link: 'projects.html#auto-restock' }
      ]
    },
    'analytics': {
      title: 'Advanced Data Analytics',
      desc: 'Structuring custom econometric formulas, multi-network sponsor tracking scripts, and business segments analysis using Python, R, and Pandas arrays.',
      projects: [
        { name: 'Competitor Ad Intelligence Platform', type: 'Personal', link: 'projects.html#ad-intel' },
        { name: 'Global Demographics & Languages', type: 'Personal', link: 'projects.html#global-demographics' },
        { name: 'NYC Taxi Revenue Welch\'s T-Testing', type: 'Personal', link: 'projects.html#nyc-taxi' },
        { name: 'Consumer Behaviour & UPI Econometrics', type: 'Personal', link: 'projects.html#upi-adoption' },
        { name: 'AI Job Market Bibliometrics', type: 'Personal', link: 'projects.html#job-market' }
      ]
    },
    'visualization': {
      title: 'Information Visualization',
      desc: 'Building clean interactive tracking cards, charts layouts, and live cloud UI dashboards using Power BI (DAX logical flows), Streamlit, and Seaborn matrices.',
      projects: [
        { name: 'Competitor Ad Intelligence Platform', type: 'Personal', link: 'projects.html#ad-intel' },
        { name: 'Global Demographics & Languages', type: 'Personal', link: 'projects.html#global-demographics' },
        { name: 'Consumer Behaviour & UPI Econometrics', type: 'Personal', link: 'projects.html#upi-adoption' }
      ]
    }
  };

  if (skillItems.length > 0 && previewContent) {
    skillItems.forEach(item => {
      item.addEventListener('click', () => {
        const skillKey = item.getAttribute('data-skill');
        const data = skillsDatabase[skillKey];

        if (!data) return;

        // Active State toggles
        skillItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Load Content
        previewTitle.textContent = data.title;
        previewDesc.textContent = data.desc;

        // Clear Project Links
        previewProjList.innerHTML = '';

        // Build Project Links
        data.projects.forEach(proj => {
          const badgeClass = proj.type === 'Professional' ? 'badge-confidential' : 'badge-public';
          const badgeText = proj.type === 'Professional' ? 'Confidential' : 'Public Rep';
          
          const a = document.createElement('a');
          a.href = proj.link;
          a.className = 'preview-project-link';
          a.innerHTML = `
            <span>${proj.name}</span>
            <span class="badge ${badgeClass}">${badgeText}</span>
          `;
          previewProjList.appendChild(a);
        });

        // Hide Placeholder, Display content panel
        if (previewPlaceholder) previewPlaceholder.style.display = 'none';
        previewContent.classList.add('active');
      });
    });

    // Auto-click the first item on load for seamless display
    skillItems[0].click();
  }

  // ==========================================================================
  // 5. INTERACTIVE TERMINAL EMULATOR
  // ==========================================================================
  const termBody = document.querySelector('.terminal-body');
  const termInput = document.querySelector('.terminal-input');
  const suggestBtns = document.querySelectorAll('.terminal-suggest-btn');

  // Command Responses database
  const terminalDatabase = {
    help: `Available systems inventory commands:
  • ask voice-ai      - Inspect Priya Voice Agent RAG pipeline spec
  • show architecture - Display active live node architecture diagram
  • view forecasting  - Print analytical details of optimization engine
  • about             - Print engineering bio and technical targets
  • clear             - Clean system screen buffer`,
    
    about: `SYSTEM STATUS: ACTIVE
PROFILE: Anjani Malhotra
SPECIALIZATION: AI Systems & Applied Data Analytics
ALIGNMENT: AI Engineer | Machine Learning Builder | Data Systems Specialist

MISSION STATEMENT:
"Building RAG, NLP, and quantitative decision systems that translate complex data architecture into real-world business performance."`,

    'ask voice-ai': `PROJECT PROFILE: PRIYA VOICE AGENT
--------------------------------------------------
Status: Internal Enterprise Solution (Earnest Analytics)
Stack Architecture: RAG | ChromaDB | Bhashini AI | Node orchestration
Audio Interface: Web Speech API STT/TTS (Multilingual Indian Dialect support)

PIPELINE PATHWAY:
  User Speech -> Bhashini Translation -> Context Embeddings -> ChromaDB Query
  -> Context Insertion -> LLM Orchestration -> Voice Synthesizer -> Audio Output

PERFORMANCE BENCHMARK:
  - Latency: < 450ms (average)
  - Multilingual Accuracy: 92.4% (synthesized output)`,

    'show architecture': `ACTIVE SYSTEM FLOW MAP:
--------------------------------------------------
[ Client UI / Audio ] --(Voice Payload)--> [ Bhashini Translation API ]
                                                    |
                                            (Semantic Vector)
                                                    v
[ ChromaDB Context ] <--(RAG Fetch)------- [ DistilBERT Embeddings ]
        |
    (Context Array)
        v
[ LLM Orchestrator ] --(Synthesized Text)--> [ STT / Waveform Output ]

STATUS: ALL SYSTEMS NOMINAL [100%]`,

    'view forecasting': `SYSTEM DEPLOYMENT: SCHEME OPTIMIZATION & FORECASTING
--------------------------------------------------
Status: Internal Enterprise Solution (Earnest Analytics)
Mathematical Core: Linear Programming, Simplex Method
Integrations: Python SciPy, Streamlit dashboard core, Statsmodels

APPLIED LOGIC:
  Maximize:    Z = C^T * X  (Business impact objective function)
  Subject to:  A * X <= B   (Resource constraints & limits)
               X >= 0       (Non-negativity vector)

APPLICATIONS DETECTED:
  - Inventory forecasting (Payman Auto-restock Agent)
  - Dynamic budget allocation across advertising networks`
  };

  const writeTerminalOutput = (cmdText, isInput = false) => {
    if (!termBody) return;

    const lineWrap = document.createElement('div');
    lineWrap.className = 'terminal-line-wrap';

    if (isInput) {
      lineWrap.innerHTML = `
        <div class="terminal-cmd-entry">
          <span class="terminal-prompt-char">&gt;</span>
          <span>${cmdText}</span>
        </div>
      `;
      termBody.appendChild(lineWrap);
    } else {
      const responseEl = document.createElement('div');
      responseEl.className = 'terminal-response-output';
      lineWrap.appendChild(responseEl);
      termBody.appendChild(lineWrap);

      // Fast typing simulation
      let i = 0;
      const speed = 3;
      const interval = setInterval(() => {
        responseEl.textContent += cmdText.charAt(i);
        i++;
        if (i >= cmdText.length) {
          clearInterval(interval);
          termBody.scrollTop = termBody.scrollHeight;
        }
      }, speed);
    }

    termBody.scrollTop = termBody.scrollHeight;
  };

  const executeCommand = (cmd) => {
    const cleanCmd = cmd.trim().toLowerCase();
    
    writeTerminalOutput(cmd, true);

    if (cleanCmd === '') {
      return;
    }

    if (cleanCmd === 'clear') {
      const welcome = termBody.querySelector('.terminal-welcome');
      termBody.innerHTML = '';
      if (welcome) termBody.appendChild(welcome);
      return;
    }

    const response = terminalDatabase[cleanCmd];
    if (response) {
      writeTerminalOutput(response, false);
    } else {
      writeTerminalOutput(`Command not found: "${cmd}". Type "help" or click suggestions to see available pipelines.`, false);
    }
  };

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = termInput.value;
        executeCommand(cmd);
        termInput.value = '';
      }
    });

    suggestBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        executeCommand(cmd);
      });
    });
  }
});
