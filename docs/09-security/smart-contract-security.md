# Smart Contract Security

- Restrict privileged business functions to the ASC or explicitly authorized executor.
- Use replay protection keyed by source transaction/log/action identifier.
- Validate all decoded fields and numeric bounds.
- Avoid arbitrary external calls from AI-controlled parameters.
- Emit events for accepted/rejected execution.
- Follow checks-effects-interactions and protect any external-call boundary.
- Add tests for unauthorized callers, duplicate events, malformed values, expired intents and invalid proof outcomes.
- Treat deployed addresses as immutable configuration after deployment; changes require an explicit governance/admin path.

Protocol verification must remain separate from application policy so a policy change cannot accidentally disable proof verification.
