# Deploying the Cloud Classification Worker

Four steps. The first two involve creating accounts/keys I can't do for you — everything after that is copy/paste.

## 1. Get an Anthropic API key

This is separate from any Claude subscription you have (claude.ai) — it's a developer key, billed per-use, not a monthly plan.

1. Go to **https://console.anthropic.com** and sign up (or log in)
2. Add a payment method under **Settings → Billing** (Cloud Classification is cheap — see cost estimate below — but the API won't work without billing set up)
3. Go to **Settings → API Keys → Create Key**
4. Copy the key somewhere safe. It starts with `sk-ant-...` and you won't be able to see it again after this screen.

**Estimated cost:** Haiku 4.5 vision pricing is roughly $1 per million input tokens. One photo classification is a small fraction of a cent — classifying a backlog of even a few hundred photos should cost well under a dollar total. Ongoing use (a few photos a week) would be pennies a month.

## 2. Deploy the Worker to your Cloudflare account

You already have a Cloudflare account (it's what hosts Weatherglass itself).

1. Go to **https://dash.cloudflare.com** → **Workers & Pages** → **Create** → **Create Worker**
2. Give it a name, e.g. `weatherglass-cloud-classify` — note the `.workers.dev` URL it's assigned, you'll need it later
3. Click **Edit code**, delete the placeholder code, and paste in the entire contents of `cloud-classify-worker.js` (provided alongside this file)
4. Click **Deploy**

## 3. Add your API key as a Worker secret

Never paste the API key directly into the Worker code — secrets keep it encrypted and out of your Worker's visible source.

1. In your Worker's dashboard page, go to **Settings → Variables and Secrets**
2. Click **Add** → **Secret**
3. Name: `ANTHROPIC_API_KEY`
4. Value: paste the key from Step 1
5. Save, then redeploy if prompted

## 4. Point Weatherglass at your Worker

1. Open Weatherglass → **Settings → Cloud Classification**
2. Paste your Worker's URL (the `https://your-worker-name.your-subdomain.workers.dev` address from Step 2) into the **AI Worker URL** field
3. Save

That's it — the **"Ask AI"** button in the Classify Cloud Photos queue will now work.

## Testing it

Once configured, open Settings → Classify Cloud Photos, and tap **Ask AI** on any photo. You should see a genus suggestion with a confidence level and a one-sentence explanation within a few seconds. If something's wrong, the error message returned will usually say exactly what — most common issues are a missing/incorrect secret name (must be exactly `ANTHROPIC_API_KEY`) or billing not set up on the Anthropic account yet.
