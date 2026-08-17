# Prompt 02 — Verify Documentation

Read the complete ProofMind documentation set and the Creditcoin protocol/reference material discovered in Prompt 01.

## Goal
Find missing, contradictory, ambiguous, stale, or implementation-dangerous documentation before code is written.

## Check
- product requirements vs architecture
- architecture vs data flow
- Creditcoin claims vs official docs/reference code
- contract interfaces vs worker payloads
- AI outputs vs contract inputs
- security assumptions vs implementation requirements
- environment/network values
- testing and deployment requirements

## Rules
Do not silently rewrite protocol facts. Mark each issue as `Creditcoin fact`, `Project Design`, `Implementation Note`, or `Open Question`.

## Verify
Every identified requirement has an owner/component and acceptance criterion.

## Documentation
Fix only project documentation that is demonstrably wrong/incomplete; record meaningful decisions.

## Acceptance
A traceable requirement → component → test path exists for all MVP requirements.