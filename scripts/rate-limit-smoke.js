const url = process.env.RATE_LIMIT_URL || 'http://localhost:4000/auth/login';
const total = Number(process.env.RATE_LIMIT_REQUESTS || 20);
const concurrency = Math.min(Number(process.env.RATE_LIMIT_CONCURRENCY || 3), 10);

if (!Number.isInteger(total) || total < 1 || total > 100) {
  throw new Error('RATE_LIMIT_REQUESTS must be an integer from 1 to 100');
}

const results = [];
let nextRequest = 0;

async function worker() {
  while (nextRequest < total) {
    const requestNumber = nextRequest++;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: 'rate-limit-test@example.com', password: 'invalid' }),
        signal: AbortSignal.timeout(5000),
      });
      results[requestNumber] = response.status;
    } catch (error) {
      results[requestNumber] = error.name === 'TimeoutError' ? 'timeout' : 'error';
    }
  }
}

async function main() {
  await Promise.all(
    Array.from({ length: Math.min(concurrency, total) }, () => worker()),
  );

  const counts = results.reduce((summary, result) => {
    summary[result] = (summary[result] || 0) + 1;
    return summary;
  }, {});

  console.log(`Tested ${total} requests against ${url}`);
  console.table(counts);

  if (!counts[429]) {
    console.warn('No 429 responses observed. Confirm RateLimitGuard is registered and the route has @RateLimit metadata.');
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
