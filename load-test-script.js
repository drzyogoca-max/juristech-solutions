import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 100 },  // Rapid ramp-up to 100 concurrent VUs
    { duration: '30s', target: 500 },  // High concurrency load at 500 VUs
    { duration: '10s', target: 1000 }, // Peak concurrency benchmark: 1,000 VUs
    { duration: '5s', target: 0 },     // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests must complete within 200ms
    http_req_failed: ['rate<0.01'],   // Error rate must be under 1%
  },
};

export default function () {
  const url = 'https://www.juristech.solutions/api/contracts/generate-engine';
  const payload = JSON.stringify({
    contractType: 'B2B Enterprise Agreement',
    currency: 'USD',
    arbitration: 'LCIA',
    partiesData: 'Stress testing load simulation for global corporate deployment.'
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time under 200ms': (r) => r.timings.duration < 200,
  });

  sleep(0.5);
}
