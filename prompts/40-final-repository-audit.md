# Prompt 40 — Final Repository Audit

Perform a read-only audit first. Compare repository contents with the architecture, requirements, security model, test plan, deployment plan, and prompt-chain acceptance criteria.

Check for missing files, dead code, stale docs, untracked generated artifacts, secrets, inconsistent environment names, incorrect network values, undocumented dependencies, failing tests, broken build scripts, and mismatched contract/API schemas.

Fix only verified issues, then rerun the relevant checks. Produce a gap list with severity and evidence. Do not declare completion if any critical requirement lacks evidence.