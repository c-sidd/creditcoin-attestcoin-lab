import { useEffect, useState } from "react";

interface EthereumProvider {
  request(args: { method: string; params?: unknown[] }): Promise<any>;
}

declare global {
  interface Window { ethereum?: EthereumProvider; }
}

interface JobRecord {
  event_id: string;
  chain_key: number;
  contract_address: string;
  transaction_hash: string;
  block_number: number;
  encoded_data: string;
  status: string;
}

interface AiDecisionResponse {
  inputFact: any;
  recommendation: { decision: string; score: number; amount: string; reasonCodes: string[] };
  policyOutcome: { admissible: boolean; decision: string; action: string; amount: string; reason: string; requiresManualReview: boolean };
  transactionIntent?: { to: string; data: string; args: any };
  metadata: { provider: string; model: string };
}

const API_URL = `${(import.meta as any).env.VITE_API_URL || "http://localhost:3001"}/api/v1`;
const DESTINATION_CHAIN_ID = (import.meta as any).env.VITE_DESTINATION_CHAIN_ID || "102031";

function App() {
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobRecord | null>(null);
  const [aiResponse, setAiResponse] = useState<AiDecisionResponse | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletMode, setWalletMode] = useState<"REAL" | "SIMULATED">("SIMULATED");
  const [busy, setBusy] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/evidence`);
      if (!response.ok) throw new Error("Backend request failed");
      const json = await response.json();
      setJobs(json.data || []);
      setError("");
    } catch (err: any) {
      setError(err.message || "Unable to reach backend");
    }
  };

  useEffect(() => {
    fetchJobs();
    const timer = window.setInterval(fetchJobs, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const connectWallet = async () => {
    setError("");
    if (!window.ethereum) {
      setWalletMode("SIMULATED");
      setWalletAddress("");
      setError("MetaMask/EVM wallet not detected. Using explicitly labeled Simulated Local Demo Mode.");
      return;
    }
    try {
      setBusy(true);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const expected = `0x${BigInt(DESTINATION_CHAIN_ID).toString(16)}`;
      if (String(chainId).toLowerCase() !== expected.toLowerCase()) {
        throw new Error(`Wrong network. Connected chain is ${chainId}; expected chain ${DESTINATION_CHAIN_ID}.`);
      }
      setWalletAddress(accounts[0]);
      setWalletMode("REAL");
    } catch (err: any) {
      setWalletMode("SIMULATED");
      setWalletAddress("");
      setError(err.message || "Wallet connection failed");
    } finally {
      setBusy(false);
    }
  };

  const runAiDecision = async (job: JobRecord) => {
    setBusy(true);
    setAiResponse(null);
    setTxHash("");
    setError("");
    try {
      if (job.status !== "EXECUTED") {
        throw new Error("AI evaluation is blocked until Attestcoin verification reaches EXECUTED status.");
      }
      const response = await fetch(`${API_URL}/evidence/${job.event_id}/decision`, { method: "POST" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "AI decision failed");
      setAiResponse(json);
    } catch (err: any) {
      setError(err.message || "AI decision failed");
    } finally {
      setBusy(false);
    }
  };

  const submitTransactionIntent = async () => {
    if (!aiResponse?.transactionIntent) return;
    setBusy(true);
    setError("");
    setTxHash("");
    try {
      if (walletMode === "REAL" && window.ethereum && walletAddress) {
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        const expected = `0x${BigInt(DESTINATION_CHAIN_ID).toString(16)}`;
        if (String(chainId).toLowerCase() !== expected.toLowerCase()) {
          throw new Error(`Wrong network. Switch MetaMask to chain ${DESTINATION_CHAIN_ID}.`);
        }
        const hash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [{ from: walletAddress, to: aiResponse.transactionIntent.to, data: aiResponse.transactionIntent.data }]
        });
        setTxHash(hash);
      } else {
        setTxHash(`SIMULATED-${Date.now().toString(16)}`);
      }
    } catch (err: any) {
      setError(err.message || "Transaction submission failed");
    } finally {
      setBusy(false);
    }
  };

  const statusClass = (status: string) => {
    if (status === "EXECUTED") return "text-emerald-400";
    if (status === "ASC_FAILED") return "text-red-400";
    if (status === "PROOF_RECEIVED") return "text-sky-400";
    return "text-amber-400";
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <h1 className="text-2xl font-bold">PROOFMIND OPERATOR DASHBOARD</h1>
          <p className="text-xs text-slate-500 mt-1">AI decisions only after Attestcoin-verified evidence</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-3 py-1.5 rounded border ${walletMode === "REAL" ? "border-emerald-500/40 text-emerald-400" : "border-amber-500/40 text-amber-400"}`}>
            {walletMode === "REAL" ? "REAL EVM WALLET" : "SIMULATED LOCAL DEMO MODE"}
          </span>
          <button onClick={connectWallet} disabled={busy} className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 rounded-lg px-4 py-2">
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
          </button>
        </div>
      </header>

      {error && <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-300">{error}</div>}

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <h2 className="text-sm font-bold text-slate-400 mb-4">EVIDENCE LIFECYCLE</h2>
          <div className="space-y-3">
            {jobs.length === 0 ? <p className="text-xs text-slate-500">No evidence records found.</p> : jobs.map((job) => (
              <button key={job.event_id} onClick={() => { setSelectedJob(job); setAiResponse(null); setTxHash(""); }} className={`w-full text-left p-3 rounded-xl border ${selectedJob?.event_id === job.event_id ? "border-indigo-500 bg-slate-800" : "border-slate-800 bg-slate-950/50"}`}>
                <div className="flex justify-between gap-3 text-xs font-mono"><span>{job.transaction_hash.slice(0, 12)}...</span><span className={statusClass(job.status)}>{job.status}</span></div>
                <div className="text-[11px] text-slate-500 mt-2">Block #{job.block_number} · ChainKey {job.chain_key}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="lg:col-span-2 space-y-6">
          {selectedJob ? <>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-slate-400 mb-4">EVIDENCE INSPECTOR</h2>
              <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                <div><span className="text-slate-500 block">Source Contract</span>{selectedJob.contract_address}</div>
                <div><span className="text-slate-500 block">Source Transaction</span>{selectedJob.transaction_hash}</div>
                <div><span className="text-slate-500 block">Event ID</span>{selectedJob.event_id}</div>
                <div><span className="text-slate-500 block">Block</span>{selectedJob.block_number}</div>
              </div>
              <button disabled={busy || selectedJob.status !== "EXECUTED"} onClick={() => runAiDecision(selectedJob)} className="mt-5 bg-indigo-600 disabled:bg-slate-700 rounded-lg px-4 py-2 text-xs font-semibold">
                {busy ? "Working..." : "Evaluate AI Decision"}
              </button>
              {selectedJob.status !== "EXECUTED" && <p className="text-xs text-amber-400 mt-3">AI is locked until the worker confirms on-chain Attestcoin verification.</p>}
            </div>

            {aiResponse && <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-5">
              <h2 className="text-sm font-bold text-slate-400">AI RISK EVALUATION</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950/60 rounded-xl"><span className="text-[10px] text-slate-500 block">AI DECISION</span><b>{aiResponse.recommendation.decision}</b></div>
                <div className="p-4 bg-slate-950/60 rounded-xl"><span className="text-[10px] text-slate-500 block">RISK SCORE</span><b>{aiResponse.recommendation.score}/100</b></div>
                <div className="p-4 bg-slate-950/60 rounded-xl"><span className="text-[10px] text-slate-500 block">POLICY</span><b>{aiResponse.policyOutcome.admissible ? "ADMISSIBLE" : "REJECTED"}</b></div>
              </div>
              <p className="text-xs text-slate-400">{aiResponse.policyOutcome.reason}</p>
              {aiResponse.transactionIntent && <button disabled={busy} onClick={submitTransactionIntent} className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 rounded-lg px-4 py-2 text-xs font-semibold">{walletMode === "REAL" ? "Sign & Execute with MetaMask" : "Run Simulated Demo Execution"}</button>}
              {txHash && <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono break-all">{walletMode === "REAL" ? `Submitted transaction: ${txHash}` : `Simulated transaction: ${txHash}`}</div>}
              <div className="text-[11px] text-slate-500">Provider: {aiResponse.metadata.provider} · Model: {aiResponse.metadata.model}</div>
            </div>}
          </> : <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center text-sm text-slate-500">Select an evidence record to inspect it.</div>}
        </section>
      </div>
    </main>
  );
}

export default App;
