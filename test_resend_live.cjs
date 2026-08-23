const key = Buffer.from('cmVfUEVMeUZVRnZfR01SNHFQaDNNaDh4RWhSaWtDQVRhU0NL', 'base64').toString('utf-8');

async function send() {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + key,
    },
    body: JSON.stringify({
      from: 'JurisTech Solutions <onboarding@resend.dev>',
      to: ['drzyogo.ca@gmail.com'],
      subject: '🔴 [JurisTech Solutions] Official YouTube Channel Launch & Marketing Blast Live',
      html: `
        <div style="font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 30px; border-radius: 16px;">
          <h1 style="color: #22d3ee;">JurisTech Solutions ⚖️</h1>
          <h2>Official YouTube Channel Launch</h2>
          <p>The channel is officially connected: <a href="https://www.youtube.com/@JurisTechSolutions?sub_confirmation=1" style="color: #ef4444; font-weight: bold;">@JurisTechSolutions</a></p>
          <p>Platform Studio: <a href="https://www.juristech.solutions/youtube-studio" style="color: #38bdf8;">juristech.solutions/youtube-studio</a></p>
          <hr style="border: 1px solid #334155;" />
          <p style="font-size: 12px; color: #94a3b8;">Supervised by Dr. Mohammad Mustafa — Founder & Chairman JurisTech Solutions</p>
        </div>
      `,
    }),
  });

  const data = await res.json();
  console.log('Resend API Result:', data);
}

send();
