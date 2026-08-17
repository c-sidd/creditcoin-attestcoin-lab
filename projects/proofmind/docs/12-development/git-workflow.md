# Git Workflow

## Branches
- `main`: stable documentation/demo baseline.
- feature branches: one coherent milestone or fix.

## Commits
Prefer Conventional Commits such as:
- `docs(proofmind): ...`
- `feat(worker): ...`
- `feat(contracts): ...`
- `test(worker): ...`
- `fix(attestcoin): ...`

## Rule
Every implementation milestone updates its status/evidence and relevant documentation. Do not leave architectural changes undocumented.

Before merging:
- tests pass;
- secrets absent;
- docs match code;
- deployment/config changes are recorded;
- no protocol assumption was invented.
