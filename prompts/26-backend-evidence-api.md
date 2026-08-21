# Prompt 26 — Evidence API

Implement APIs for event/evidence lifecycle, verification status, AI decision status, and transaction status as defined by the docs.

Expose stable identifiers and safe evidence metadata. Do not allow clients to mutate protocol verification results or submit arbitrary contract calls. Validate pagination, filtering, authorization, and error responses.

Test the complete status lifecycle and malformed/unauthorized requests. Document request/response examples and the source of each returned field.