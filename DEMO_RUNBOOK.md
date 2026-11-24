# Judge Demo Runbook — Hack the Vibe 2026

This runbook guides evaluators and judges through live verification of **Primary Visual Lab** (Educational Track), covering core features and the two declared advanced challenges:
- **A03: Advanced Security & Access Control**
- **A07: Automated Multi-Step Workflow**

---

## 1. Core Visual Manipulatives (M01, M05, M07)
1. **Bangla / English Place Value Regrouping:**
   - Navigate to `/bn/lessons/subtraction-regrouping/present`.
   - Enter `52` and `27`.
   - Toggle **Classroom Presenter Mode** (large high-contrast tokens for single-screen projectors).
   - Advance step-by-step: observe the prediction gate asking students whether the ones column can subtract directly (`2 < 7`).
   - Click **Exchange** (ভাঙা): watch 1 mint ten-rod unbundle into 10 amber unit cubes with exact value invariance maintained throughout (`52 = 4 tens + 12 ones`).
   - Remove 7 ones and 2 tens to reveal answer `25`.
2. **Dynamic Catalogue & Search:**
   - Visit `/bn/lessons`.
   - Search in English for `subtraction` or in Bangla for `যোগ`.
   - Filter by topic (`addition`, `subtraction`) and verify instant responsive filtering.
3. **Printable Preparation Worksheet:**
   - Visit `/bn/lessons/subtraction-regrouping/print`.
   - Print media style hides web chrome, providing a clean black-and-white grid worksheet for students.

---

## 2. Advanced Challenge A03 Demo: Security & Access Control
**Judges' Test Scenario:** *A user attempts to modify another user's restricted record → must be rejected and logged to the audit event trail.*

1. **Test Accounts:**
   - Author A: `author1@lab.org` (Contributor)
   - Author B: `author2@lab.org` (Contributor)
   - Reviewer: `reviewer@lab.org` (Reviewer)
   - Admin: `admin@lab.org` (Admin)
2. **Step-by-step Execution:**
   - Author A creates a lesson draft (ID: `les_123`).
   - Author B logs in and attempts to update `les_123` via `PUT /api/lessons/les_123`:
     - **Result:** Request is blocked with HTTP 403 `RESOURCE_OWNERSHIP_MISMATCH`.
     - **Audit Trail:** An audit record is created in MongoDB (`audit_logs` collection) with `action: ACCESS_DENIED`, `actorId: author2`, `allowed: false`.
   - Unauthorized user attempts to quarantine a lesson:
     - **Result:** Request is blocked with HTTP 403 `UNAUTHORIZED_QUARANTINE_ATTEMPT`.
   - Admin suspends Author B:
     - Author B's active sessions are instantly revoked.
     - Any subsequent API call by Author B returns HTTP 403 `USER_SUSPENDED`.
3. **Automated Verification:**
   ```bash
   node --import tsx --test "tests/moderation_a03.test.ts"
   node --import tsx --test "tests/auth.test.ts"
   ```

---

## 3. Advanced Challenge A07 Demo: Multi-Step Workflow with Recovery
**Judges' Test Scenario:** *An intermediate step fails after earlier steps succeeded → visible persisted state in DB, bounded retry, recovery without duplicate publication.*

1. **Step-by-step Execution:**
   - Admin triggers publication workflow for approved lesson `les_456` via `POST /api/workflows/publish`:
     - Step 1: `validate_integrity` ✅ (Passes content hash check)
     - Step 2: `build_catalogue_index` ✅ (Builds search indices)
     - Step 3: `generate_static_snapshot` ❌ (Simulated network timeout/failure)
   - **Inspect State in MongoDB:**
     - Query `workflows` collection: workflow is persisted in status `failed`, `currentStep: 2`, with error message and failure log.
     - Lesson is NOT published yet (no premature or partial publication).
   - **Trigger Recovery:**
     - Admin initiates retry via `POST /api/workflows/wf_789/retry`:
     - The workflow checks retry bounds (`retryCount < maxRetries`).
     - The workflow resumes directly from Step 3 (`generate_static_snapshot`) without repeating steps 1 or 2.
     - Step 4 `finalize_publication` completes, updating lesson status to `published`.
   - **Idempotency Check:**
     - Retrying the completed workflow is rejected with `WORKFLOW_ALREADY_COMPLETED`.
2. **Automated Verification:**
   ```bash
   node --import tsx --test "tests/workflow_a07.test.ts"
   ```
