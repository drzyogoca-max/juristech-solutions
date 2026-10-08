const payload = {
  to: 'partnerships@wingassistant.com',
  subject: 'JurisTech Solutions — Global Enterprise Legal AI Portfolio & Wing Assistant Briefing',
  text: `Dear Wing Assistant Enterprise & Partnership Team,

JurisTech Solutions (https://www.juristech.solutions) has officially dispatched executive briefings across 20 premier corporate legal practices across Canada, USA, UK, KSA, Kuwait, Oman, and Bahrain.

As a dedicated virtual operations and legal assistant platform, we would welcome exploring how JurisTech Sovereign AI Contract Risk Auditing, sub-15-minute multi-jurisdictional redlines, and automated indemnification checks can empower Wing Assistant legal support teams under zero-data-retention security protocols.

We would be pleased to schedule a brief 15-minute executive walkthrough.

Respectfully yours,

Dr. Mohammad Mustafa
Founder & Chairman | AI Risk Architect
JurisTech Solutions
Executive Office: founder@juristech.solutions
Official Portal: https://www.juristech.solutions
Direct Line / WhatsApp: +201126674337`,
};

async function notify() {
  const res = await fetch('https://www.juristech.solutions/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-cron-secret': 'jt_live_cron_9f8e7d6c5b4a3210fe_2026',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  console.log('Wing Assistant Partnership Briefing Dispatch Status:', data);
}

notify().catch(console.error);
