// -------------------------------------------------------------------------- //
// ProofMind Frontend SPA Application Core                                    //
// -------------------------------------------------------------------------- //

const API_BASE = "/api";

// Application State
const state = {
  events: [],
  decisions: {},
  settings: {
    sourceChainId: "11155111",
    creditcoinChainId: "102031",
    creditcoinRpcUrl: "https://rpc.cc3-testnet.creditcoin.network",
    proofBuilderUrl: "https://prover.cc3-testnet.creditcoin.network",
    sourceContractAddress: "0x1111111111111111111111111111111111111111",
    ascContractAddress: "0x2222222222222222222222222222222222222222",
    decisionContractAddress: "0x3333333333333333333333333333333333333333"
  },
  userWallet: null,
  network: null
};

// Wallet connection handlers
async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      state.userWallet = accounts[0];
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      state.network = chainId;
      updateWalletUI();
      // If we are in the demo sandbox, reload to show the Use Connected Wallet option
      if (window.location.hash === "#/demo") {
        renderDemoSandbox();
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  } else {
    alert("Metamask or another Web3 browser wallet is not detected. Please install a wallet extension.");
  }
}

function updateWalletUI() {
  const btn = document.getElementById("btn-connect-wallet");
  if (!btn) return;
  if (state.userWallet) {
    btn.textContent = `${state.userWallet.slice(0, 6)}...${state.userWallet.slice(-4)}`;
    btn.style.borderColor = "var(--success)";
  } else {
    btn.textContent = "Connect Wallet";
    btn.style.borderColor = "rgba(255,255,255,0.1)";
  }
}

if (typeof window.ethereum !== "undefined") {
  window.ethereum.on("accountsChanged", (accounts) => {
    state.userWallet = accounts[0] || null;
    updateWalletUI();
    if (window.location.hash === "#/demo") renderDemoSandbox();
  });
  window.ethereum.on("chainChanged", (chainId) => {
    state.network = chainId;
    updateWalletUI();
  });
}

// Router
function router() {
  const hash = window.location.hash || "#/";
  
  // Update nav active states
  document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
  
  if (hash === "#/" || hash === "") {
    document.getElementById("nav-home").classList.add("active");
    renderOverview();
  } else if (hash === "#/events") {
    document.getElementById("nav-events").classList.add("active");
    renderEvents();
  } else if (hash.startsWith("#/events/")) {
    document.getElementById("nav-events").classList.add("active");
    const evidenceId = hash.split("/")[2];
    renderEventDetail(evidenceId);
  } else if (hash === "#/decisions") {
    document.getElementById("nav-decisions").classList.add("active");
    renderDecisions();
  } else if (hash === "#/settings") {
    document.getElementById("nav-settings").classList.add("active");
    renderSettings();
  } else if (hash === "#/demo") {
    document.getElementById("nav-demo").classList.add("active");
    renderDemoSandbox();
  }
}

// Fetch API wrapper
async function fetchAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, options);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

// Format hashes/addresses safely
function formatHash(hash) {
  if (!hash) return "N/A";
  if (hash.length <= 12) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

// --- Screen Renderers ---

async function renderOverview() {
  const container = document.getElementById("main-content");
  container.innerHTML = `<div class="loading">Loading dashboard metrics...</div>`;

  try {
    const { data: events } = await fetchAPI("/events");
    state.events = events;

    const totalEvents = events.length;
    const verifiedEvents = events.filter(e => e.status === "EXECUTED").length;
    const pendingEvents = events.filter(e => e.status !== "EXECUTED").length;
    const failedEvents = events.filter(e => e.status === "FAILED_FINAL").length;

    container.innerHTML = `
      <section class="overview-section">
        <h2 style="font-family: var(--font-title); font-size: 2rem; margin-bottom: 2rem;">Security & Risk Command</h2>
        
        <!-- Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-title">Cross-Chain Signals</div>
            <div class="metric-value">${totalEvents}</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">Verified Proofs</div>
            <div class="metric-value" style="color: var(--success);">${verifiedEvents}</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">In-Flight Audits</div>
            <div class="metric-value" style="color: var(--warning);">${pendingEvents}</div>
          </div>
          <div class="metric-card">
            <div class="metric-title">Failed Audits</div>
            <div class="metric-value" style="color: var(--danger);">${failedEvents}</div>
          </div>
        </div>

        <!-- Recent Events Table -->
        <div class="card-section">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="font-family: var(--font-title); font-size: 1.3rem;">Recent Risk Signal Stream</h3>
            <a href="#/events" class="btn btn-primary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">View All</a>
          </div>
          
          <div class="table-container">
            <table class="app-table">
              <thead>
                <tr>
                  <th>Signal ID</th>
                  <th>Source Tx</th>
                  <th>Subject Account</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                ${events.slice(0, 5).map(e => `
                  <tr>
                    <td><code>${formatHash(e.id)}</code></td>
                    <td><a href="https://sepolia.etherscan.io/tx/${e.transactionHash}" target="_blank" style="color: var(--primary); text-decoration: none;">${formatHash(e.transactionHash)}</a></td>
                    <td><code>${formatHash(e.decodedPayload?.subject)}</code></td>
                    <td style="font-weight: 600;">${e.decodedPayload?.signalValue || 0}</td>
                    <td><span class="badge ${e.status?.toLowerCase().replace(/_/g, '-')}">${e.status || "WAITING"}</span></td>
                    <td><a href="#/events/${e.id}" class="btn" style="padding: 0.3rem 0.6rem; font-size: 0.8rem; background: rgba(255,255,255,0.05);">Inspect</a></td>
                  </tr>
                `).join('')}
                ${events.length === 0 ? '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No signals detected. Go to Demo Sandbox to trigger one.</td></tr>' : ''}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  } catch (err) {
    container.innerHTML = `<div class="error-state">Failed to load metrics: ${err.message}</div>`;
  }
}

async function renderEvents() {
  const container = document.getElementById("main-content");
  container.innerHTML = `<div class="loading">Loading signal records...</div>`;

  try {
    const { data: events } = await fetchAPI("/events");
    state.events = events;

    container.innerHTML = `
      <section class="events-section">
        <h2 style="font-family: var(--font-title); font-size: 2rem; margin-bottom: 2rem;">Cross-Chain Signal Audits</h2>
        
        <div class="table-container">
          <table class="app-table">
            <thead>
              <tr>
                <th>Signal ID (Evidence ID)</th>
                <th>Source Block</th>
                <th>Source Tx</th>
                <th>Subject</th>
                <th>Risk Signal</th>
                <th>Audit Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${events.map(e => `
                <tr>
                  <td><code>${e.id}</code></td>
                  <td>${e.blockNumber}</td>
                  <td><a href="https://sepolia.etherscan.io/tx/${e.transactionHash}" target="_blank" style="color: var(--primary); text-decoration: none;">${formatHash(e.transactionHash)}</a></td>
                  <td><code>${e.decodedPayload?.subject}</code></td>
                  <td style="font-weight: 600; font-size: 1rem;">${e.decodedPayload?.signalValue || 0}</td>
                  <td><span class="badge ${e.status?.toLowerCase().replace(/_/g, '-')}">${e.status}</span></td>
                  <td><a href="#/events/${e.id}" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Audit Trail</a></td>
                </tr>
              `).join('')}
              ${events.length === 0 ? '<tr><td colspan="7" style="text-align: center;">No events found.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </section>
    `;
  } catch (err) {
    container.innerHTML = `<div class="error-state">Error: ${err.message}</div>`;
  }
}

async function renderEventDetail(evidenceId) {
  const container = document.getElementById("main-content");
  container.innerHTML = `<div class="loading">Fetching audit trail...</div>`;

  try {
    const event = await fetchAPI(`/events/${evidenceId}`);
    const { timeline } = await fetchAPI(`/events/${evidenceId}/timeline`);

    // Try fetching decision if verified
    let decision = null;
    if (event.status === "EXECUTED" || event.verificationStatus === "VERIFIED") {
      try {
        decision = await fetchAPI(`/decisions/${evidenceId}`);
      } catch (err) {
        // May not have run AI step yet
      }
    }

    container.innerHTML = `
      <section class="detail-section">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
          <a href="#/events" class="btn" style="background: rgba(255,255,255,0.05); font-size: 1.2rem;">←</a>
          <h2 style="font-family: var(--font-title); font-size: 2rem;">Audit Trail: <code>${formatHash(evidenceId)}</code></h2>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem;">
          
          <!-- Left side: Timeline -->
          <div class="card-section" style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--border-glow);">
            <h3 style="font-family: var(--font-title); font-size: 1.3rem; margin-bottom: 1.5rem;">Verification Timeline</h3>
            
            <div class="timeline-container">
              ${timeline.map(t => `
                <div class="timeline-step ${t.status.toLowerCase()}">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <h4 style="font-size: 0.95rem; font-weight: 600;">${t.stage.replace(/_/g, ' ')}</h4>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">${new Date(t.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right side: Evidence metadata drawer -->
          <div class="card-section" style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--border-glow);">
            <h3 style="font-family: var(--font-title); font-size: 1.3rem; margin-bottom: 1.5rem;">Evidence & AI Decision</h3>
            
            <div class="info-group" style="display: flex; flex-direction: column; gap: 1.2rem;">
              <div>
                <span style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Cryptographic Source</span>
                <p style="font-size: 0.9rem; margin-top: 0.2rem;">Ethereum Sepolia (Chain Key 1)</p>
                <p style="font-size: 0.85rem; color: var(--text-muted);">Tx: <code>${event.transactionHash}</code></p>
              </div>

              <div>
                <span style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Verified Subject & Signal</span>
                <p style="font-size: 0.95rem; font-weight: 600; margin-top: 0.2rem; color: var(--success);">
                  Subject: <code>${event.decodedPayload?.subject}</code>
                </p>
                <p style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">
                  Signal Value: ${event.decodedPayload?.signalValue || 0}
                </p>
              </div>

              <div>
                <span style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Attestcoin Verification</span>
                <p style="font-size: 0.95rem; margin-top: 0.2rem;">
                  Status: <span class="badge ${event.verificationStatus?.toLowerCase()}">${event.verificationStatus}</span>
                </p>
                ${event.ascTxHash ? `<p style="font-size: 0.85rem; color: var(--text-muted);">CC3 Verification Tx: <code>${event.ascTxHash}</code></p>` : ''}
              </div>

              <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.2rem;">
                <span style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">AI Decision Engine</span>
                
                ${decision ? `
                  <div style="margin-top: 0.5rem; background: rgba(255,255,255,0.02); padding: 1rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                      <span class="badge ${decision.decision.toLowerCase()}" style="font-size: 0.85rem; padding: 0.3rem 0.8rem;">
                        ${decision.decision}
                      </span>
                      <span style="font-weight: 700; font-family: var(--font-title); font-size: 1.2rem; color: var(--primary);">
                        Score: ${decision.score}
                      </span>
                    </div>
                    <p style="font-size: 0.9rem; font-weight: 500; color: var(--text-primary);">
                      Action Proposal: <code style="color: var(--warning);">${decision.action}</code>
                    </p>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">
                      Reasoning: "${decision.reasoning}"
                    </p>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.75rem;">
                      Model: ${decision.modelVersion}
                    </p>
                  </div>
                ` : `
                  <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">No decision computed.</p>
                  ${event.verificationStatus === "VERIFIED" ? `
                    <button id="btn-trigger-ai" class="btn btn-primary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem; margin-top: 0.75rem;">
                      Run AI Decision Model
                    </button>
                  ` : ''}
                `}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Hook up trigger button
    const btn = document.getElementById("btn-trigger-ai");
    if (btn) {
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        btn.textContent = "Computing...";
        try {
          await fetchAPI(`/ai/decisions/${evidenceId}`, { method: "POST" });
          renderEventDetail(evidenceId);
        } catch (err) {
          alert(`Inference failed: ${err.message}`);
          btn.disabled = false;
          btn.textContent = "Run AI Decision Model";
        }
      });
    }

  } catch (err) {
    container.innerHTML = `<div class="error-state">Failed to load detail: ${err.message}</div>`;
  }
}

async function renderDecisions() {
  const container = document.getElementById("main-content");
  container.innerHTML = `<div class="loading">Loading AI recommendations...</div>`;

  try {
    const { data: events } = await fetchAPI("/events");
    const decisions = [];

    for (const e of events) {
      if (e.status === "EXECUTED" || e.verificationStatus === "VERIFIED") {
        try {
          const dec = await fetchAPI(`/decisions/${e.id}`);
          decisions.push(dec);
        } catch (err) {}
      }
    }

    container.innerHTML = `
      <section class="decisions-section">
        <h2 style="font-family: var(--font-title); font-size: 2rem; margin-bottom: 2rem;">AI Decision Proposals</h2>
        
        <div class="table-container">
          <table class="app-table">
            <thead>
              <tr>
                <th>Evidence ID</th>
                <th>Model Decision</th>
                <th>Score</th>
                <th>Policy Action</th>
                <th>Limit Amount</th>
                <th>Reason Codes</th>
                <th>Cryptographic Signature</th>
              </tr>
            </thead>
            <tbody>
              ${decisions.map(d => `
                <tr>
                  <td><code>${formatHash(d.evidenceId)}</code></td>
                  <td><span class="badge ${d.decision.toLowerCase()}">${d.decision}</span></td>
                  <td style="font-weight: 700; font-family: var(--font-title);">${d.score}</td>
                  <td><code>${d.action}</code></td>
                  <td>${d.limit !== "0" ? `${ethers.formatEther(d.limit)} Tokens` : "N/A"}</td>
                  <td style="font-size: 0.8rem; color: var(--text-secondary); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    "${d.reasoning}"
                  </td>
                  <td><code>${formatHash(d.signature)}</code></td>
                </tr>
              `).join('')}
              ${decisions.length === 0 ? '<tr><td colspan="7" style="text-align: center;">No AI decisions calculated yet.</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </section>
    `;
  } catch (err) {
    container.innerHTML = `<div class="error-state">Error loading decisions: ${err.message}</div>`;
  }
}

function renderSettings() {
  const container = document.getElementById("main-content");
  container.innerHTML = `
    <section class="settings-section" style="max-width: 800px; margin: 0 auto;">
      <h2 style="font-family: var(--font-title); font-size: 2rem; margin-bottom: 2rem;">System Environment</h2>
      
      <div style="background: var(--bg-card); padding: 2rem; border-radius: var(--radius-lg); border: 1px solid var(--border-glow); display: flex; flex-direction: column; gap: 1.5rem;">
        <div>
          <span style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Source Blockchain</span>
          <p style="font-size: 1rem; font-weight: 500; margin-top: 0.2rem;">Ethereum Sepolia (Chain ID: ${state.settings.sourceChainId})</p>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Contract: <code>${state.settings.sourceContractAddress}</code></p>
        </div>

        <div>
          <span style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Execution Blockchain</span>
          <p style="font-size: 1rem; font-weight: 500; margin-top: 0.2rem;">Creditcoin CC3 Testnet (Chain ID: ${state.settings.creditcoinChainId})</p>
          <p style="font-size: 0.85rem; color: var(--text-muted);">RPC URL: <code>${state.settings.creditcoinRpcUrl}</code></p>
        </div>

        <div>
          <span style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Attestcoin Verifier Boundary</span>
          <p style="font-size: 0.95rem; margin-top: 0.2rem;">Proof Builder Endpoint: <code>${state.settings.proofBuilderUrl}</code></p>
          <p style="font-size: 0.85rem; color: var(--text-muted);">ASC Contract: <code>${state.settings.ascContractAddress}</code></p>
        </div>

        <div>
          <span style="font-size: 0.8rem; color: var(--text-secondary); text-transform: uppercase;">Deterministic Policy Contract</span>
          <p style="font-size: 0.95rem; margin-top: 0.2rem;">Decision Contract: <code>${state.settings.decisionContractAddress}</code></p>
        </div>
      </div>
    </section>
  `;
}

function renderDemoSandbox() {
  const container = document.getElementById("main-content");
  container.innerHTML = `
    <section class="demo-section" style="max-width: 600px; margin: 0 auto;">
      <h2 style="font-family: var(--font-title); font-size: 2rem; margin-bottom: 1rem;">Demo Sandbox</h2>
      <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 2rem;">
        Trigger a simulated cross-chain financial event and monitor the cryptographic verification and AI decision pipeline.
      </p>

      <div style="background: var(--bg-card); padding: 2.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-glow);">
        <form id="sandbox-form" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Subject Account Address</label>
            <input type="text" id="sb-subject" value="0x70997970C51812dc3A010C7d01b50e0d17dc79C8" required
                   style="width: 100%; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); padding: 0.75rem 1rem; border-radius: var(--radius-md); color: white; font-family: monospace;">
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Financial Risk Signal (0 - 100)</label>
            <input type="number" id="sb-signal" min="0" max="100" value="45" required
                   style="width: 100%; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); padding: 0.75rem 1rem; border-radius: var(--radius-md); color: white; font-weight: 600;">
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem;">
              Signals &lt;= 50: ALLOW (Approve loan limits)<br>
              Signals 51 - 80: REVIEW (Review flag flag)<br>
              Signals &gt; 80: REJECT (Block limits)
            </p>
          </div>

          <button type="submit" class="btn btn-primary" style="padding: 0.8rem; font-size: 1rem; border-radius: var(--radius-md);">
            Trigger Signal Event
          </button>
        </form>
      </div>
    </section>
  `;

  document.getElementById("sandbox-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const subject = document.getElementById("sb-subject").value;
    const signalValue = parseInt(document.getElementById("sb-signal").value, 10);

    const btn = e.target.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Emitting event...";

    try {
      // Call backend route to submit mock event
      const res = await fetchAPI("/demo/submit-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, signalValue })
      });

      alert(`Mock signal submitted successfully!\nSignal ID: ${res.signalId}`);
      window.location.hash = `#/events/${res.signalId}`;
    } catch (err) {
      alert(`Submission failed: ${err.message}`);
      btn.disabled = false;
      btn.textContent = "Trigger Signal Event";
    }
  });
}

// Global Event Listeners
window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", () => {
  router();
  updateWalletUI();

  const connectBtn = document.getElementById("btn-connect-wallet");
  if (connectBtn) {
    connectBtn.addEventListener("click", connectWallet);
  }
  
  // Expose ethers.formatEther mapping just in case we need it
  window.ethers = {
    formatEther: (wei) => {
      if (!wei) return "0.0";
      try {
        const val = BigInt(wei);
        const integerPart = val / 1000000000000000000n;
        const fractionalPart = val % 1000000000000000000n;
        return `${integerPart}.${fractionalPart.toString().padStart(18, '0').slice(0, 4)}`;
      } catch {
        return "0.0";
      }
    }
  };
});
