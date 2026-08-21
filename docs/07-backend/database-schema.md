# Database Schema

The backend stores orchestration/evidence state; it does not become the source of blockchain truth.

## Core tables

### `source_events`
- id
- chain_key
- contract_address
- tx_hash
- block_number
- log_index
- event_name
- decoded_payload
- detected_at
- unique key `(chain_key, tx_hash, log_index)`

### `processing_jobs`
- id
- source_event_id
- state
- attempts
- next_retry_at
- last_error_code
- created_at / updated_at

### `proof_submissions`
- id
- source_event_id
- request_reference
- proof_metadata
- proof_status
- submitted_at

### `verification_records`
- id
- source_event_id
- asc_tx_hash
- verification_status
- verified_payload
- verified_at

### `ai_decisions`
- id
- decision_id
- evidence_ids
- model/provider metadata
- structured_output
- policy_status
- created_at

### `execution_records`
- id
- decision_id
- target_contract
- intent_hash
- tx_hash
- execution_status
- error_code
- created_at

Sensitive secrets must never be stored in these tables.
