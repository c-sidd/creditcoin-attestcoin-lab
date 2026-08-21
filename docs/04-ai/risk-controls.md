# AI Risk Controls

## Hard controls
- No private keys in prompts, model context or model-accessible tools.
- Allowlist contracts and actions.
- Validate all numeric ranges and addresses.
- Require verified evidence references.
- Enforce intent expiry and nonce/replay protection.
- Reject malformed or ambiguous model output.
- Keep a human/operator approval mode available during development.

## Soft controls
- Confidence/reason codes for UX only.
- Model temperature and provider settings are configuration, not security controls.
- Explanations are informational and must not be treated as proof.

## Fail closed
If evidence, policy, schema validation, authorization or chain state is uncertain, do not execute the action.
