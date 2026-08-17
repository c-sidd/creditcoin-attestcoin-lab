# AI Tests

The AI layer is tested as an unreliable component.

- valid structured decision;
- malformed JSON;
- missing required fields;
- unknown action;
- out-of-range parameters;
- contradictory evidence;
- prompt injection embedded in source text;
- provider timeout;
- provider refusal/error;
- same evidence produces an auditable decision record;
- policy rejects otherwise plausible AI output.

A passing AI test never proves blockchain correctness. Protocol correctness is tested separately.
