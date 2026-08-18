import { VerifiedFact } from "../domain/verified-fact";

export interface RiskMetrics {
  repaymentReliability: number;
  defaultExposure: number;
  collateralCoverage: number;
  anomalyScore: number;
}

export interface RiskAssessment {
  riskScore: number;
  band: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  metrics: RiskMetrics;
  factIds: string[];
}

/**
 * Deterministic risk calculations. AI may interpret these results, but it
 * cannot modify the formulas or bypass policy enforcement.
 */
export function calculateRisk(facts: VerifiedFact[]): RiskAssessment {
  const verified = facts.filter((fact) => fact.status === "VERIFIED");
  const repayments = verified.filter((fact) => fact.signalType === "REPAYMENT");
  const defaults = verified.filter((fact) => fact.signalType === "DEFAULT");
  const collateral = verified.filter((fact) => fact.signalType === "COLLATERAL_UPDATE");

  const repaymentReliability = repayments.length === 0
    ? 50
    : Math.min(100, repayments.length * 20);
  const defaultExposure = Math.min(100, defaults.length * 30);
  const collateralCoverage = collateral.length === 0 ? 50 : Math.min(100, collateral.length * 25);

  const anomalyScore = Math.min(100, Math.max(0, defaultExposure - repaymentReliability / 2));
  const riskScore = Math.round(
    100 - repaymentReliability * 0.35 - collateralCoverage * 0.25 + defaultExposure * 0.25 + anomalyScore * 0.15,
  );
  const boundedScore = Math.max(0, Math.min(100, riskScore));

  const band = boundedScore >= 80
    ? "CRITICAL"
    : boundedScore >= 60
      ? "HIGH"
      : boundedScore >= 35
        ? "MEDIUM"
        : "LOW";

  return {
    riskScore: boundedScore,
    band,
    metrics: {
      repaymentReliability,
      defaultExposure,
      collateralCoverage,
      anomalyScore,
    },
    factIds: verified.map((fact) => fact.factId),
  };
}
