
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-duas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen pb-20 relative overflow-hidden">
      <!-- Background Decor -->
      <div class="fixed inset-0 pointer-events-none">
        <div class="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-drift"></div>
        <div class="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-drift" style="animation-delay: -5s;"></div>
        <div class="absolute inset-0 dot-grid opacity-[0.1] dark:opacity-[0.03]"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-10 relative z-10">

        <!-- Header -->
        <div class="animate-fade-up text-center mb-16 relative">
          <div class="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/5 animate-float-slow rotate-3">
            <svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-txt mb-4 font-quran">جوامع الدعاء</h1>
          <p class="text-txt-muted text-lg max-w-lg mx-auto leading-relaxed">أدعية مختارة من الكتاب والسنة للميت، وللوالدين، ولتفريج الكرب.</p>
        </div>

        <!-- Filter Tabs -->
        <div class="animate-fade-up delay-100 flex flex-wrap gap-3 mb-12 justify-center sticky top-24 z-20 py-4 glass-panel rounded-2xl md:rounded-full bg-surface/80 backdrop-blur-md shadow-sm border border-brd/50 max-w-4xl mx-auto px-4">
          @for (cat of categories; track cat) {
            <button (click)="selectedCategory = cat" 
              class="px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 relative overflow-hidden group"
              [class]="selectedCategory === cat ? 'bg-primary text-primary-text shadow-lg shadow-primary/25' : 'bg-transparent text-txt-muted hover:text-primary hover:bg-primary/5'">
              <span class="relative z-10">{{cat}}</span>
              @if (selectedCategory === cat) { <div class="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary animate-shimmer opacity-20"></div> }
            </button>
          }
        </div>

        <!-- Masonry Grid -->
        <div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 animate-stagger">
          @for (dua of filteredDuas; track dua.id) {
            <div class="break-inside-avoid group relative bg-surface-el rounded-[2rem] border border-brd p-1 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/30">
              <div class="bg-surface rounded-[1.7rem] p-6 relative overflow-hidden h-full">
                <!-- Decorative Quotes -->
                <div class="absolute top-4 right-4 text-4xl text-primary/5 font-quran leading-none select-none">❝</div>
                
                <!-- Category Badge -->
                <div class="flex justify-between items-start mb-4">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-el border border-brd text-txt-muted text-[10px] font-bold rounded-full uppercase tracking-wider group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {{dua.category}}
                  </span>
                  
                  <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <button (click)="copyDua(dua.id, dua.text)" 
                      class="w-8 h-8 rounded-full flex items-center justify-center bg-surface-el hover:bg-primary hover:text-primary-text transition-colors shadow-sm"
                      [title]="copiedId === dua.id ? 'تم النسخ' : 'نسخ النص'">
                      @if (copiedId === dua.id) {
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                      } @else {
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                      }
                    </button>
                    <!-- Share Button could be added here -->
                  </div>
                </div>

                <!-- Text -->
                <p class="text-xl md:text-2xl font-quran text-txt leading-[2] text-center mb-6 relative z-10 px-2" [class.text-2xl]="dua.text.length < 100">
                  {{dua.text}}
                </p>

                <!-- Footer -->
                @if (dua.source) {
                  <div class="pt-4 border-t border-brd/50 flex items-center justify-center">
                    <span class="inline-flex items-center gap-1.5 text-xs text-txt-muted font-bold bg-surface-el px-3 py-1 rounded-lg">
                      <svg class="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                      {{dua.source}}
                    </span>
                  </div>
                }
                
                <div class="absolute bottom-4 left-4 text-4xl text-primary/5 font-quran leading-none select-none rotate-180">❝</div>
              </div>
            </div>
          }
        </div>

        @if (filteredDuas.length === 0) {
          <div class="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
            <div class="w-20 h-20 bg-surface-el border border-brd rounded-[2rem] flex items-center justify-center mb-4 rotate-6 shadow-lg">
              <svg class="w-10 h-10 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
            </div>
            <h3 class="text-xl font-black text-txt mb-2">لا توجد أدعية</h3>
            <p class="text-txt-muted">حاول اختيار تصنيف آخر</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .glass-panel { background: rgba(var(--surface-rgb), 0.8); backdrop-filter: blur(12px); }
  `]
})
export class DuasComponent {
  copiedId: number | null = null;
  categories = ['الكل', 'للميت', 'من القرآن', 'للوالدين', 'تفريج الهم', 'استغفار', 'أذكار الصباح', 'أذكار المساء', 'قبل النوم'];
  selectedCategory = 'الكل';

  allDuas = [
    // --- للميت (25 دعاء) ---
    { id: 1, category: 'للميت', text: 'اللهم اغفر له وارحمه وعافه واعف عنه وأكرم نزله ووسع مدخله واغسله بالماء والثلج والبرد ونقه من الخطايا كما ينقى الثوب الأبيض من الدنس.', source: 'رواه مسلم' },
    { id: 2, category: 'للميت', text: 'اللهم أبدله داراً خيراً من داره وأهلاً خيراً من أهله وزوجاً خيراً من زوجه وأدخله الجنة وأعذه من عذاب القبر ومن عذاب النار.', source: 'رواه مسلم' },
    { id: 3, category: 'للميت', text: 'اللهم اغفر لحينا وميتنا وشاهدنا وغائبنا وصغيرنا وكبيرنا وذكرنا وأنثانا.', source: 'أبو داود' },
    { id: 4, category: 'للميت', text: 'اللهم إن كان محسناً فزد في حسناته وإن كان مسيئاً فتجاوز عن سيئاته.', source: 'دعاء مأثور' },
    { id: 5, category: 'للميت', text: 'اللهم إنه في ذمتك وحبل جوارك فقه فتنة القبر وعذاب النار وأنت أهل الوفاء والحق فاغفر له وارحمه إنك أنت الغفور الرحيم.', source: 'أبو داود' },
    { id: 6, category: 'للميت', text: 'اللهم ادخله الجنة من غير مناقشة حساب ولا سابقة عذاب.', source: 'دعاء عام' },
    { id: 7, category: 'للميت', text: 'اللهم شفع فيه نبينا ومصطفاك، واحشره تحت لوائه، واسقه من يده الشريفة شربة هنيئة لا يظمأ بعدها أبداً.', source: 'دعاء عام' },
    { id: 8, category: 'للميت', text: 'اللهم إنه عبدك وابن عبدك خرج من الدنيا وسعتها ومحبوبها وأحبائه فيها إلى ظلمة القبر وما هو لاقيه.', source: 'دعاء عام' },
    { id: 9, category: 'للميت', text: 'اللهم انظر إليه نظرة رضا، فإن من تنظر إليه نظرة رضا لا تعذبه أبداً.', source: 'دعاء عام' },
    { id: 10, category: 'للميت', text: 'اللهم اسكنه فسيح الجنان، واغفر له يا رحمن، وارحمه يا رحيم، وتجاوز عما تعلم يا عليم.', source: 'دعاء عام' },
    { id: 11, category: 'للميت', text: 'اللهم احشره مع المتقين إلى الرحمن وفداً.', source: 'دعاء عام' },
    { id: 12, category: 'للميت', text: 'اللهم احشره مع أصحاب اليمين، واجعل تحيته سلام لك من أصحاب اليمين.', source: 'دعاء عام' },
    { id: 13, category: 'للميت', text: 'اللهم بشره بقولك: كلوا واشربوا هنيئاً بما أسلفتم في الأيام الخالية.', source: 'دعاء عام' },
    { id: 14, category: 'للميت', text: 'اللهم اجعل قبره روضة من رياض الجنة، ولا تجعله حفرة من حفر النار.', source: 'الترمذي' },
    { id: 15, category: 'للميت', text: 'اللهم أفسح له في قبره مد بصره، وافرش قبره من فراش الجنة.', source: 'دعاء عام' },
    { id: 16, category: 'للميت', text: 'اللهم أعذه من عذاب القبر، وجاف الأرض عن جنبيه.', source: 'دعاء عام' },
    { id: 17, category: 'للميت', text: 'اللهم املأ قبره بالرضا والنور والفسحة والسرور.', source: 'دعاء عام' },
    { id: 18, category: 'للميت', text: 'اللهم إنه نزل بك وأنت خير منزول به، وأصبح فقيراً إلى رحمتك وأنت غني عن عذابه.', source: 'دعاء عام' },
    { id: 19, category: 'للميت', text: 'اللهم آته برحمتك ورضاك، وقه فتنة القبر وعذابه، وآته برحمتك الأمن من عذابك حتى تبعثه إلى جنتك يا أرحم الراحمين.', source: 'دعاء عام' },
    { id: 20, category: 'للميت', text: 'اللهم يمن كتابة، ويسر حسابه، وثقل بالحسنات ميزانه، وثبت على الصراط أقدامه.', source: 'دعاء عام' },
    { id: 21, category: 'للميت', text: 'اللهم اجعله في بطن القبر مطمئناً، وعند قيام الأشهاد آمناً، وبجود رضوانك واثقاً.', source: 'دعاء عام' },
    { id: 22, category: 'للميت', text: 'اللهم احمه تحت الأرض، واستره يوم العرض، ولا تخزه يوم يبعثون، يوم لا ينفع مال ولا بنون إلا من أتى الله بقلب سليم.', source: 'دعاء عام' },
    { id: 23, category: 'للميت', text: 'اللهم استقبله عندك خالياً من الذنوب والخطايا، واستقبله بمحض إرادتك وعفوك وأنت راض عن غير غضبان عليه.', source: 'دعاء عام' },
    { id: 24, category: 'للميت', text: 'اللهم إني أسألك الفردوس الأعلى نزلاً له.', source: 'دعاء عام' },
    { id: 25, category: 'للميت', text: 'اللهم ارحم جميع موتى المسلمين الذين شهدوا لك بالوحدانية ولنبيك بالرسالة وماتوا على ذلك.', source: 'دعاء عام' },

    // --- للوالدين (10 دعاء) ---
    { id: 26, category: 'للوالدين', text: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا.', source: 'الإسراء: 24' },
    { id: 27, category: 'للوالدين', text: 'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ.', source: 'إبراهيم: 41' },
    { id: 28, category: 'للوالدين', text: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحًا تَرْضَاهُ.', source: 'الأحقاف: 15' },
    { id: 29, category: 'للوالدين', text: 'اللهم اغفر لوالدي وارحمهما وعافهما واعف عنهما وأكرم نزلهما.', source: 'دعاء عام' },
    { id: 30, category: 'للوالدين', text: 'اللهم يا ذا الجلال والإكرام يا حي يا قيوم، ندعوك باسمك الأعظم أن تبسط على والدي من بركاتك ورحمتك ورزقك.', source: 'دعاء عام' },
    { id: 31, category: 'للوالدين', text: 'اللهم لا تجعل لهما ذنباً إلا غفرته، ولا هماً إلا فرجته، ولا حاجة من حوائج الدنيا هي لك رضا ولهما فيها صلاح إلا قضيتها.', source: 'دعاء عام' },
    { id: 32, category: 'للوالدين', text: 'اللهم اجعل أوقاتهما بذكرك معمورة، وقربهما برحمتك من الطاعات.', source: 'دعاء عام' },
    { id: 33, category: 'للوالدين', text: 'اللهم ارزقهما عيشاً قاراً، ورزقاً داراً، وعملاً باراً.', source: 'دعاء عام' },
    { id: 34, category: 'للوالدين', text: 'اللهم اجعلنا ذخرًا لوالدينا يا رب العالمين بعد وفاتهم بصلاحنا وصلاح أعمالنا.', source: 'دعاء عام' },
    { id: 35, category: 'للوالدين', text: 'اللهم أقر أعينهما بما يتمنياه لنا في الدنيا، واجعلنا لهما قرة عين يوم يقوم الأشهاد.', source: 'دعاء عام' },

    // --- من القرآن (10 دعاء) ---
    { id: 36, category: 'من القرآن', text: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ.', source: 'البقرة: 201' },
    { id: 37, category: 'من القرآن', text: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ.', source: 'آل عمران: 8' },
    { id: 38, category: 'من القرآن', text: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا.', source: 'الفرقان: 74' },
    { id: 39, category: 'من القرآن', text: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ.', source: 'إبراهيم: 40' },
    { id: 40, category: 'من القرآن', text: 'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ.', source: 'القصص: 24' },
    { id: 41, category: 'من القرآن', text: 'رَّبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ وَاجْعَل لِّي مِن لَّدُنكَ سُلْطَانًا نَّصِيرًا.', source: 'الإسراء: 80' },
    { id: 42, category: 'من القرآن', text: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ.', source: 'البقرة: 250' },
    { id: 43, category: 'من القرآن', text: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ.', source: 'الأعراف: 23' },
    { id: 44, category: 'من القرآن', text: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ.', source: 'آل عمران: 173' },
    { id: 45, category: 'من القرآن', text: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ.', source: 'الأنبياء: 87' },

    // --- متنوع (أكثر من 15 دعاء) ---
    { id: 46, category: 'تفريج الهم', text: 'اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل، والبخل والجبن، وضلع الدين، وغلبة الرجال.', source: 'البخاري' },
    { id: 47, category: 'تفريج الهم', text: 'يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين.', source: 'الترمذي' },
    { id: 48, category: 'تفريج الهم', text: 'اللهم لا سهل إلا ما جعلته سهلاً، وأنت تجعل الحزن إذا شئت سهلاً.', source: 'ابن حبان' },
    { id: 49, category: 'أذكار الصباح', text: 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور.', source: 'الترمذي' },
    { id: 50, category: 'أذكار الصباح', text: 'أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.', source: 'مسلم' },
    { id: 51, category: 'أذكار المساء', text: 'اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير.', source: 'الترمذي' },
    { id: 52, category: 'أذكار المساء', text: 'أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له.', source: 'مسلم' },
    { id: 53, category: 'استغفار', text: 'أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه.', source: 'الترمذي' },
    { id: 54, category: 'استغفار', text: 'اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك وأنا على عهدك ووعدك ما استطعت... سيد الاستغفار.', source: 'البخاري' },
    { id: 55, category: 'قبل النوم', text: 'باسمك اللهم أموت وأحيا.', source: 'البخاري' },
    { id: 56, category: 'قبل النوم', text: 'اللهم قني عذابك يوم تبعث عبادك.', source: 'أبو داود' },
    { id: 57, category: 'استغفار', text: 'رب اغفر لي وتب علي إنك أنت التواب الرحيم.', source: 'أبو داود' },
  ];

  get filteredDuas() {
    if (this.selectedCategory === 'الكل') return this.allDuas;
    return this.allDuas.filter(d => d.category === this.selectedCategory);
  }

  copyDua(id: number, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedId = id;
      setTimeout(() => this.copiedId = null, 2000);
    });
  }
}
