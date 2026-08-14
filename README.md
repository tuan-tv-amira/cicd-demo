# CI/CD Demo — minimal example to explain the concept to clients

This is a tiny repo with **no real-world purpose** — it only exists to visually illustrate the
**CI/CD** (Continuous Integration / Continuous Deployment) concept, for use when explaining it to
a client who isn't familiar with the technique.

## What's in this repo

- `site/index.html` + `site/app.js` — an extremely simple static website (no build step, no
  libraries to install).
- `test.js` — a trivially simple test for the logic in `app.js` (uses Node's built-in `assert`
  module, nothing to install).
- `.github/workflows/ci-cd.yml` — the automatic CI/CD pipeline (push → test → real deploy to
  GitHub Pages). See "How it works" below.
- `.github/workflows/deploy-demo.yml` — a pipeline that mirrors the **exact structure** of
  RiskMapGenerator's real pipeline (`deploy.yml`): manually pick a dev/prod environment,
  build+push several services via a matrix, then "restart" the main service — but without calling
  real AWS, every step just echoes to the log. See "Multi-environment simulated pipeline" below.

## How it works (exactly what CI/CD stands for)

```
You edit code, push to GitHub
        │
        ▼
┌───────────────────┐
│  1) CI             │   Automatically runs `node test.js`.
│  Check the code    │   If the test fails → stops right here, NOTHING gets deployed.
└───────────────────┘
        │ (only if the test passes AND the code is on the main branch)
        ▼
┌───────────────────┐
│  2) CD             │   Automatically packages the site/ folder and publishes it to
│  Deploy            │   GitHub Pages — a real website, with a public URL, anyone can view.
└───────────────────┘
        │
        ▼
  The live website updates immediately,
  nobody has to click a "deploy" button
```

This is exactly the two halves of the term CI/CD:
- **CI (Continuous Integration)** = step 1 — automatically *checks* every change.
- **CD (Continuous Deployment)** = step 2 — automatically *deploys* it if the check passes.

## How to try this out for a client demo

1. Create a new (public) repo on GitHub, push this entire folder to its `main` branch.
2. Go to **Settings → Pages**, under "Build and deployment" set the source to **GitHub Actions**
   (only needs doing once).
3. Open the **Actions** tab — the `CI/CD Demo` pipeline will run automatically right after the
   push, going through steps `1) CI` then `2) CD` exactly as in the diagram above.
4. Once the `deploy` job finishes, the website will be live at a URL like
   `https://<your-account>.github.io/<repo-name>/`.
5. **To demo the "magic" to a client**: change one word in `site/index.html` (e.g. the greeting
   text), commit, push — then open the Actions tab for them to watch the pipeline run, and refresh
   the live site to show the content changed **with nobody deploying it by hand**.

To demo "CI blocks broken code": edit `site/app.js` so `greet` returns something different from
what `test.js` expects, then push — the `test` job will fail (show red), and the `deploy` job
**will not run** (because `deploy` depends on `needs: test`) — the live website is completely
unaffected by the broken code.

## Multi-environment simulated pipeline (`deploy-demo.yml`)

Unlike `ci-cd.yml` above (fully automatic, runs on every push), this file mirrors the **manual,
per-environment CD** style used by `RiskMapGenerator/.github/workflows/deploy.yml` — useful for
explaining the "deploy" side specifically to a client who's already comfortable with basic CI/CD.

How to run it: **Actions** tab → select the `CD Pipeline (Demo...)` workflow → **Run workflow**
button → pick `environment` as `dev` or `prod` → **Run workflow**.

Same structure as the real pipeline, with exactly one difference: no step touches AWS.

| Step in `deploy-demo.yml` | Corresponding step in `deploy.yml` (real RMG pipeline) |
|---|---|
| `workflow_dispatch` + pick dev/prod environment | Identical |
| `build-push` job, matrix `[gateway, worker, lambda]` | Identical |
| `environment: ${{ inputs.environment }}` (a separate GitHub Environment per environment) | Identical - the real pipeline uses this to pick the right `AWS_ROLE` secret |
| "Log in to the target infrastructure" (echo) | "Configure AWS credentials" (assumes an IAM Role via OIDC) |
| Cache + "Fetch reference data" (creates a placeholder file) | Cache + `aws s3 sync` downloading map data from S3 |
| "Build & push (simulated)" (echo + sleep) | `docker buildx build` + a real push to ECR |
| `restart-gateway` job, waits for `build-push` to finish (`needs`) | Identical |
| "Restart the main service" (echo + sleep) | `aws ecs update-service --force-new-deployment` + waiting for it to stabilize |
| Final Step Summary | Identical |

Use this file to explain: "this is **exactly how** the real system behaves when you click deploy
to production - the only difference is there's no real AWS account behind it here, to avoid any
cost or risk while demoing."

## How this relates to the project's real pipeline (RiskMapGenerator)

This example is deliberately simplified as much as possible, but matches the structure of the
real CI/CD pipeline in use:

| In this demo | In RiskMapGenerator |
|---|---|
| `node test.js` | Build + run Java/Maven tests (`ci.yml`) |
| Deploy to GitHub Pages | Build Docker image → push to AWS ECR → restart ECS/Lambda (`deploy.yml`) |
| Trigger: push to `main` | Trigger: manual ("Run workflow"), pick dev/prod environment |
| Environment: GitHub Pages (free, no account needed) | Environment: a real AWS account, with separate `dev`/`prod` |

The core idea is identical either way: **code is always checked automatically first, and only
what has passed that check gets published to the real environment** — no one has to manually
build/copy/deploy anything, which cuts down on mistakes.
