# Radar Automation & Human-in-the-Loop Marketing System (Radar Automation README)

## 1. نظرة عامة والهدف
نظام أتمتة تسويقي آمن يراقب إشارات سلوك الزوار المصرّح بها فقط (`opt-in`)، يحسب درجات اهتمام العملاء (Lead Scoring)، يولّد عروضاً مخصصة آلياً بالذكاء الاصطناعي، ويضع كل رسالة في طابور مراجعة بشرية قبل الإرسال الفعلي.

### المبادئ الأساسية:
1. **الشفافية والموافقة**: جمع البيانات فقط بعد موافقة صريحة (`consent_flag = true`).
2. **التحكّم البشري**: يمنع منعاً باتاً الإرسال التلقائي للرسائل دون موافقة بشرية صريحة (Human-in-the-Loop).
3. **الامتثال القانوني**: الالتزام التام بقوانين حماية البيانات العامة GDPR وCAN-SPAM.
4. **سجلات التدقيق الكاملة**: تسجيل كل قرار مراجعة برقم المراجع البشري والختم الزمني.

---

## 2. بنية المشروع (Directory Architecture)
```text
project-risk-automation/
├─ infra/
│  ├─ docker-compose.yml
│  └─ nginx.conf
├─ backend/
│  ├─ api/
│  │  └─ review-queue/route.ts
│  ├─ airflow/
│  │  └─ dags/daily_pipeline.py
│  └─ requirements.txt
├─ frontend/
│  ├─ src/
│  │  ├─ tracking.js
│  │  └─ pages/admin/ReviewQueuePage.tsx
│  └─ package.json
├─ ml/
│  ├─ train_lead_scoring.py
│  └─ prompts/
├─ docs/
│  ├─ PRIVACY.md
│  ├─ CONSENT.md
│  └─ Radar_automation_README.md
└─ README.md
```

---

## 3. إعداد البيئة والتشغيل المباشر
```bash
# إنشاء بيئة Python وتثبيت المكتبات
python -m venv .venv
source .venv/bin/activate
pip install lightgbm pandas scikit-learn joblib airflow sendgrid

# تشغيل التدريب
python ml/train_lead_scoring.py
```

---

## 4. أحداث التتبع والـ Consent Tracking (`frontend/src/tracking.js`)
```javascript
export function trackEvent(userId, eventName, properties = {}) {
  if (!properties.consent) return; // Strict consent check
  console.log(`[Radar Event Captured]`, { distinct_id: userId, eventName, ...properties });
}
```

---

## 5. طابور المراجعة البشرية (Human Review Queue UI & API)
- المسار المباشر للوحة المراجعة البشرية: `/admin/review-queue`
- المسار البرمجي المباشر للتحكم: `/api/review-queue`
- الإرسال يتطلب ضغطة زر صريحة: `Approve & Send` من المراجع البشري.
