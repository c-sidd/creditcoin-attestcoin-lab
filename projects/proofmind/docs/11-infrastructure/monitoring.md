# Monitoring

Track:
- source scan cursor;
- events detected/processed;
- attestation wait duration;
- proof request latency/failures;
- ASC submission success/revert rate;
- retry counts;
- AI provider latency/errors;
- policy rejections;
- execution transaction status;
- worker restart/recovery events.

Every log line should include a correlation/event ID where possible. Alerts should focus on stuck jobs, repeated upstream failures, unexpected reverts and executor balance/configuration issues.
