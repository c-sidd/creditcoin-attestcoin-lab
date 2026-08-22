import { useState, useEffect } from "react";

interface JobRecord {
  id: string;
  event_id: string;
  chain_key: number;
  contract_address: string;
  transaction_hash: string;
  block_number: number;
  log_index: number;
  event_name: string;
  encoded_data: string;
  status: string;
  attempts: number;
  last_error?: string;
  created_at: number;
  updated_at: number;
}

interface AiDecisionResponse {
  eventId: string;
  inputFact: any;
  recommendation: {
    decision: "APPROVE" | "REJECT";
    score: number;
    action: "ALLOW_LOAN" | "BLOCK";
    amount: string;
    reasonCodes: string[];
    expiresAt: number;
  };
  policyOutcome: {
    admissible: boolean;
    decision: "APPROVE" | "REJECT";
    action: "ALLOW_LOAN" | "BLOCK";
    amount: string;
    reason: string;
    requiresManualReview: boolean;
  };
  transactionIntent?: {
    to: string;
    data: string;
    args: any;
  };
  metadata: any;
}

function App() {
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Wallet State
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [connecting, setConnecting] = useState(false);

  // AI & Intent state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AiDecisionResponse | null>(null);
  const [txSubmitting, setTxSubmitting] = useState(false);
  const [txSuccessHash, setTxSuccessHash] = useState<string | null>(null);

  const API_URL = ((import.meta as any).env.VITE_API_URL || "http://localhost:3001") + "/api/v1";

  // Fetch jobs on mount and poll every 5 seconds
  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/evidence`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const json = await res.json();
      setJobs(json.data || []);
      setError(null);
    } catch (err: any) {
      setError("Failed to connect to ProofMind Backend. Ensure the server is running on port 3001.");
    } finally {
      setLoading(false);
    }
  };

  // Mock Wallet Connection
  const connectWallet = async () => {
    setConnecting(true);
    setTimeout(() => {
      setWalletAddress("0x7F9B18545f9DfbDC541f9DF3b6317585F849F9f");
      setWalletConnected(true);
      setConnecting(false);
    }, 1000);
  };

  // Trigger AI Decision Engine on backend
  const runAiDecision = async (job: JobRecord) => {
    setAiLoading(true);
    setAiResponse(null);
    setTxSuccessHash(null);
    try {
      const res = await fetch(`${API_URL}/evidence/${job.event_id}/decision`, {
        method: "POST"
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Failed to analyze decision");
      }
      const json = await res.json();
      setAiResponse(json);
    } catch (err: any) {
      alert(`AI Decision Error: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Submit serialized intent to contract (simulate browser wallet sign & send)
  const submitTransactionIntent = async () => {
    if (!aiResponse?.transactionIntent) return;
    setTxSubmitting(true);
    setTimeout(() => {
      setTxSuccessHash("0x" + Math.random().toString(16).substring(2, 66));
      setTxSubmitting(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EXECUTED":
        return "bg-emerald-500/25 border-emerald-500 text-emerald-400";
      case "PROOF_RECEIVED":
        return "bg-sky-500/25 border-sky-500 text-sky-400";
      case "WAITING_FOR_ATTESTATION":
        return "bg-amber-500/25 border-amber-500 text-amber-400 animate-pulse";
      case "ASC_FAILED":
        return "bg-red-500/25 border-red-500 text-red-400";
      default:
        return "bg-slate-500/25 border-slate-500 text-slate-400";
    }
  };

  const filteredJobs = filterStatus === "ALL" ? jobs : jobs.filter((j) => j.status === filterStatus);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            PROOFMIND OPERATOR DASHBOARD
          </h1>
          <p className="text-xs text-slate-500 mt-1">Autonomous Cross-Chain Risk Decision Engine</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            Dev Mode
          </span>

          {walletConnected ? (
            <div className="text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={connecting}
              className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg px-4 py-2 transition-all"
            >
              {connecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </header>

      {/* Main Grid Layout */}
      {error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm mb-6">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Pane - Jobs List */}
        <div className="lg:col-span-1 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold tracking-wider text-slate-400">EVIDENCE LIFECYCLE</h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300"
            >
              <option value="ALL">All States</option>
              <option value="DETECTED">Detected</option>
              <option value="WAITING_FOR_ATTESTATION">Waiting</option>
              <option value="PROOF_RECEIVED">Proof Received</option>
              <option value="EXECUTED">Executed</option>
              <option value="ASC_FAILED">Failed</option>
            </select>
          </div>

          {loading ? (
            <p className="text-xs text-slate-500 text-center py-8">Loading jobs...</p>
          ) : filteredJobs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No evidence records found.</p>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <div
                  key={job.event_id}
                  onClick={() => {
                    setSelectedJob(job);
                    setAiResponse(null);
                    setTxSuccessHash(null);
                  }}
                  className={`border p-3.5 rounded-xl cursor-pointer transition-all ${
                    selectedJob?.event_id === job.event_id
                      ? "bg-slate-800/40 border-indigo-500/80"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono font-bold">
                      {job.transaction_hash.substring(0, 10)}...
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 border rounded-full font-semibold ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex justify-between">
                    <span>Block: #{job.block_number}</span>
                    <span>ChainKey: {job.chain_key}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Pane - Evidence Inspector & AI Decisions */}
        <div className="lg:col-span-2 space-y-6">
          {selectedJob ? (
            <>
              {/* Evidence Inspector */}
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5">
                <h2 className="text-sm font-bold tracking-wider text-slate-400 mb-4">EVIDENCE INSPECTOR</h2>
                
                <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                  <div>
                    <span className="text-slate-500 block mb-1">Source Contract</span>
                    <span className="text-slate-300 break-all">{selectedJob.contract_address}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Transaction Hash</span>
                    <span className="text-slate-300 break-all">{selectedJob.transaction_hash}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Deterministic Event ID</span>
                    <span className="text-slate-300">{selectedJob.event_id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Block Number</span>
                    <span className="text-slate-300">{selectedJob.block_number}</span>
                  </div>
                </div>

                {/* Merkle Path visualization */}
                {selectedJob.status === "EXECUTED" || selectedJob.status === "PROOF_RECEIVED" ? (
                  <div className="border border-slate-800 bg-slate-950/30 rounded-xl p-4 text-xs">
                    <h3 className="font-bold text-slate-400 mb-3 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
                      Attestcoin Proof Payload
                    </h3>
                    <div className="space-y-2 text-[11px] font-mono text-slate-400">
                      <div>
                        <span className="text-slate-600 block">Merkle Root</span>
                        <span className="text-sky-400 break-all">
                          {JSON.parse(selectedJob.encoded_data).proof?.merkleProof?.root || "0x"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600 block">Continuity Lower Endpoint Digest</span>
                        <span className="text-slate-300 break-all">
                          {JSON.parse(selectedJob.encoded_data).proof?.continuityProof?.lowerEndpointDigest || "0x"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Proof payload not available until block is attested.</p>
                )}

                {/* AI Trigger */}
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => runAiDecision(selectedJob)}
                    disabled={aiLoading}
                    className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2 transition-all flex items-center gap-2"
                  >
                    {aiLoading ? "Invoking AI..." : "Evaluate AI Decision"}
                  </button>
                </div>
              </div>

              {/* AI Policy and Intent Panel */}
              {aiResponse ? (
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                  <h2 className="text-sm font-bold tracking-wider text-slate-400">AI RISK EVALUATION</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Recommendation */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-center">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">AI DECISION</span>
                      <span className={`text-lg font-bold ${aiResponse.recommendation.decision === "APPROVE" ? "text-emerald-400" : "text-red-400"}`}>
                        {aiResponse.recommendation.decision}
                      </span>
                    </div>

                    {/* Risk Score */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-center">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">RISK SCORE</span>
                      <span className={`text-lg font-bold ${aiResponse.recommendation.score > 70 ? "text-red-400" : aiResponse.recommendation.score > 50 ? "text-amber-400" : "text-emerald-400"}`}>
                        {aiResponse.recommendation.score} / 100
                      </span>
                    </div>

                    {/* Policy Outcome */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-center">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">POLICY STATUS</span>
                      <span className={`text-lg font-bold ${aiResponse.policyOutcome.admissible ? "text-emerald-400" : "text-red-400"}`}>
                        {aiResponse.policyOutcome.admissible ? "ADMISSIBLE" : "REJECTED"}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-4 text-xs space-y-2">
                    <div>
                      <span className="text-slate-500 block mb-0.5">Policy Rationale</span>
                      <span className="text-slate-300 font-semibold">{aiResponse.policyOutcome.reason}</span>
                    </div>
                    {aiResponse.policyOutcome.requiresManualReview ? (
                      <div className="text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded px-2.5 py-1.5 font-semibold text-[11px]">
                        ⚠️ This decision requires manual operator approval.
                      </div>
                    ) : null}
                  </div>

                  {/* Serialized Transaction Calldata */}
                  {aiResponse.transactionIntent ? (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono">
                      <h3 className="font-bold text-slate-400 mb-2">Serialized Transaction Intent</h3>
                      <div className="space-y-1 text-[11px] text-slate-400">
                        <div className="break-all"><span className="text-indigo-400">To:</span> {aiResponse.transactionIntent.to}</div>
                        <div className="break-all"><span className="text-indigo-400">Calldata:</span> {aiResponse.transactionIntent.data}</div>
                      </div>

                      {txSuccessHash ? (
                        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-center font-bold">
                          ✓ On-chain Submission Confirmed! Tx: {txSuccessHash.substring(0, 15)}...
                        </div>
                      ) : (
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={submitTransactionIntent}
                            disabled={!walletConnected || txSubmitting}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 py-2 font-semibold transition-all disabled:opacity-50"
                          >
                            {txSubmitting ? "Submitting..." : "Submit Transaction Intent"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </>
          ) : (
            <div className="bg-slate-900/30 border border-slate-850 rounded-2xl p-12 text-center text-slate-500 italic text-sm">
              Select an evidence job from the left panel to inspect Merkle paths, run AI decisions, and execute transaction intents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
