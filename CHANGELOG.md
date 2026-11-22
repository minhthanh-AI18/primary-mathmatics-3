# Math Genius 3A + 3B — V3.2.0

## V3.2 additions
- Offline, deterministic Smart Tutor: reveals a step-by-step explanation assembled only from the existing lesson and worked solution. It is not a generative AI service and needs no API key.
- Error reflection after an incorrect answer: learners can optionally identify calculation slips, misreading, operation choice, concept difficulty or uncertainty.
- Error reflections are stored additively in `errorLog`, summarized by the Parent Report and used as a cautious Smart Mode signal: repeated recent difficulty reflections lower the recommended level by one step.
- Parent Report: recent activity, daily question progress, topic support priorities and learner-reported error patterns.
- New navigation and responsive styling; all runtime files remain flat at repository root.

## Compatibility
- Existing localStorage keys, topic IDs, Supabase auth/config keys and remote `student_progress.payload` format remain unchanged.
- New fields are additive: `errorLog`; existing V3.1 `skillEvidence` and `dailyLearning` are preserved.
- No database migration or AI credentials required.
- Existing V3.0/V3.1 progress is retained. Back up before deployment.

## Validation
- Static syntax checks, flat path checks, manifest/icon checks and feature-presence smoke tests are included.
- Browser/device, offline installation and live Supabase behavior still require real deployment testing.
