import fs from 'fs';

const files = ['src/lib/seo.ts','scripts/prerender-routes.mjs'];
const map = {
'/':'تحليل العقود بالذكاء الاصطناعي وتدقيق المخاطر | JurisTech',
'/dashboard':'لوحة الذكاء القانوني وتحليل مخاطر العقود | JurisTech',
'/chat':'المستشار القانوني بالذكاء الاصطناعي على مدار الساعة | JurisTech',
'/contracts':'استوديو صياغة العقود التجارية بالذكاء الاصطناعي | JurisTech',
'/risk':'تقييم مخاطر العقود وتدقيق الثغرات القانونية | JurisTech',
'/company-formation':'تأسيس الشركات والحوكمة والامتثال القانوني | JurisTech',
'/vault':'الخزنة القانونية الآمنة وإدارة المستندات | JurisTech',
'/repository':'مكتبة العقود والقوالب القانونية العالمية | JurisTech',
'/templates':'استوديو القوالب القانونية ومولد العقود الذكي | JurisTech',
'/negotiation':'التفاوض على العقود والتوقيع الإلكتروني | JurisTech',
'/enterprise-audit':'تدقيق الامتثال والتنظيم للشركات والمؤسسات | JurisTech',
'/legal-compliance':'مركز الامتثال القانوني والتنظيمي العالمي | JurisTech',
'/lead-radar':'اكتشاف العملاء المحتملين وذكاء مخاطر الشركات | JurisTech',
'/sovereign-ai-hub':'منصة الذكاء الاصطناعي القانوني السيادي | JurisTech',
'/deal-shield':'DealShield 360 لاكتشاف احتياجات العملاء والصفقات الدولية | JurisTech',
'/youtube-studio':'استوديو قناة JurisTech على YouTube ونمو المحتوى',
'/youtube':'قناة JurisTech الرسمية على YouTube',
'/youtube-channel':'قناة JurisTech الرسمية والمحتوى القانوني',
'/b2b-proposals':'مولد عروض B2B ومحرك طلبات العروض للشركات | JurisTech',
'/payment':'الاشتراكات والدفع الآمن لخدمات JurisTech',
'/support':'الدعم الفني والاستشارات التشغيلية على مدار الساعة | JurisTech',
'/about':'عن JurisTech ومنظومة الذكاء الاصطناعي القانوني',
'/video-hub':'مركز الفيديوهات التعليمية والشروحات القانونية | JurisTech',
'/marketing':'النمو العالمي والشراكات الاستراتيجية للشركات | JurisTech',
'/reports':'تقارير الذكاء القانوني وتحليلات مخاطر العقود | JurisTech',
'/privacy':'سياسة الخصوصية وحوكمة البيانات | JurisTech',
'/terms':'شروط الخدمة واتفاقية استخدام JurisTech',
'/refund':'سياسة الاسترداد والإلغاء | JurisTech',
'/pricing':'الأسعار والاشتراكات المؤسسية | JurisTech',
'/billing':'الفوترة وإدارة الاشتراك | JurisTech',
'/trust':'بوابة الثقة والأمان المؤسسي | JurisTech'
};
const desc = Object.fromEntries(Object.entries(map).map(([r,t])=>[r,
`منصة JurisTech للذكاء الاصطناعي القانوني: تحليل العقود، اكتشاف المخاطر، الصياغة القانونية والامتثال عبر اختصاصات وأسواق دولية. ${t.replace(' | JurisTech','')}.`]));
function patch(file){
 let s=fs.readFileSync(file,'utf8');
 for(const [route,title] of Object.entries(map)){
   const re=new RegExp("(['\\\"]"+route.replace('/','\\/')+"['\\\"]\\s*:\\s*\\{)([\\s\\S]*?)(?=\\n\\s*\\},)","m");
   s=s.replace(re,(all,head,body)=>{
     body=body.replace(/titleAr:\s*'[^']*',/,()=>`titleAr: '${title.replace(/'/g,"\\'")}',`);
     body=body.replace(/descriptionAr:\s*'[^']*',/,()=>`descriptionAr: '${desc[route].replace(/'/g,"\\'")}',`);
     return head+body;
   });
 }
 fs.writeFileSync(file,s,'utf8');
}
files.forEach(patch);
console.log('ARABIC_SEO_REPAIRED');
