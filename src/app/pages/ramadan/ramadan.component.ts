import { Component, OnDestroy, HostListener, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CopyCard {
  id: string;
  title: string;
  text: string;
}

interface ReflectionCard {
  ayah: string;
  reflection: string;
}

interface ActionCard {
  title: string;
  suggestion: string;
}

interface DuaGroup {
  id: string;
  title: string;
  items: { id: string; text: string }[];
}

interface DhikrGroup {
  id: string;
  title: string;
  items: { id: string; text: string; target?: number }[];
}

interface KhatmaPlan {
  id: string;
  title: string;
  subtitle: string;
  rows: { day: string; target: string }[];
}

interface FiqhItem {
  id: string;
  question: string;
  answer: string;
}

interface LibraryItem {
  title: string;
  description: string;
  content: string[];
}

interface WardTodoItem {
  id: string;
  title: string;
  done: boolean;
  createdAt?: number;
}

interface SebhaState {
  phrase: string;
  target: number;
  count: number;
  rounds: number;
  lastUpdated?: number;
}

@Component({
  selector: 'app-ramadan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ramadan.component.html',
  styleUrl: './ramadan.component.css'
})
export class RamadanComponent implements OnDestroy {
  private readonly STORAGE_KEYS = {
    sebha: 'ramadan-sebha-state-v2',
    ward: 'ramadan-ward-todo-',
    preferences: 'ramadan-preferences-v1'
  } as const;

  private dayWatcherId: ReturnType<typeof setInterval> | null = null;
  private activeDateKey = '';
  private copyTimeoutId: ReturnType<typeof setTimeout> | null = null;

  copiedKey: string | null = null;
  openFiqhId: string | null = null;
  openLibraryTitle: string | null = null;
  openDuaGroupId: string | null = null;
  newWardTask = '';

  sebhaPhrases = [
    'سبحان الله',
    'الحمد لله',
    'الله أكبر',
    'لا إله إلا الله',
    'لا حول ولا قوة إلا بالله',
    'اللهم صل وسلم على نبينا محمد',
    'أستغفر الله وأتوب إليه',
    'سبحان الله وبحمده سبحان الله العظيم',
    'لا إله إلا الله وحده لا شريك له',
    'حسبي الله ونعم الوكيل'
  ];

  selectedPhrase = this.sebhaPhrases[0];
  tasbihCount = 0;
  tasbihTarget = 33;
  completedRounds = 0;

  wardTodo: WardTodoItem[] = [];
  suggestedWardIdeas = [
    'قراءة صفحتين بعد كل صلاة',
    'تسميع ما تم حفظه من سورة قصيرة',
    'قراءة تفسير 10 دقائق',
    'دعاء شامل للأهل قبل الإفطار',
    'صدقة إلكترونية يومية بسيطة',
    'ركعتا شكر بعد التراويح',
    'صلة رحم يومية',
    'قراءة حديث نبوي وتطبيقه',
    'استغفار 100 مرة',
    'الصلاة على النبي 100 مرة'
  ];

  todayLabel = this.getTodayLabel();

  quickActions = [
    { label: 'ورد اليوم', target: 'ward-todo' },
    { label: 'دعاء الإفطار', target: 'duas' },
    { label: 'أذكار رمضان', target: 'adhkar' },
    { label: 'خطة الختمة', target: 'khatma' },
  ];

  todayDua: CopyCard = { id: 'today-dua', title: 'دعاء اليوم', text: '' };
  todayDhikr: CopyCard = { id: 'today-dhikr', title: 'ذكر اليوم', text: '' };
  todayReflection: ReflectionCard = { ayah: '', reflection: '' };
  todayAction: ActionCard = { title: 'عمل صالح اليوم', suggestion: '' };

  dailyDuas = [
    'اللهم أعني على ذكرك وشكرك وحسن عبادتك، وتقبل صيامي وقيامي.',
    'اللهم اجعل هذا اليوم رحمة ومغفرة وعتقًا من النار.',
    'اللهم أصلح قلبي ونيتي وبارك لي في وقتي.',
    'اللهم ارزقني الإخلاص في القول والعمل.',
    'اللهم إني أسألك العفو والعافية في ديني ودنياي.',
    'اللهم اجعلني من المقبولين في هذا الشهر.',
    'اللهم بلغني رمضان وأنت راض عني.',
    'اللهم ارزقني قلبًا خاشعًا ولسانًا ذاكرًا.'
  ];

  dailyAdhkar = [
    'سبحان الله وبحمده، سبحان الله العظيم.',
    'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد.',
    'أستغفر الله العظيم وأتوب إليه.',
    'اللهم صل وسلم على نبينا محمد.',
    'حسبي الله ونعم الوكيل.',
    'لا حول ولا قوة إلا بالله.',
    'اللهم إني أعوذ بك من الهم والحزن.',
    'رب اغفر لي ولوالدي.'
  ];

  dailyReflections: ReflectionCard[] = [
    { ayah: '﴿ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾', reflection: 'تذكير عملي أن بعد كل ضيق بابًا من التيسير.' },
    { ayah: '﴿ وَاذْكُر رَّبَّكَ كَثِيرًا ﴾', reflection: 'الثبات في الذكر ينعكس مباشرة على هدوء القلب.' },
    { ayah: '﴿ وَقُولُوا لِلنَّاسِ حُسْنًا ﴾', reflection: 'حسن الخلق في رمضان عبادة لا تقل عن باقي الطاعات.' },
    { ayah: '﴿ وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ﴾', reflection: 'وقت التعب هو أنسب وقت للدعاء والصلاة.' },
    { ayah: '﴿ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ ﴾', reflection: 'الصبر على الطاعة يثمر قربًا من الله.' },
    { ayah: '﴿ فَاذْكُرُونِي أَذْكُرْكُمْ ﴾', reflection: 'ذكر الله سبب لذكره لك في الملأ الأعلى.' },
    { ayah: '﴿ وَلَذِكْرُ اللَّهِ أَكْبَرُ ﴾', reflection: 'الذكر أعظم من كل عبادة أخرى.' },
    { ayah: '﴿ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾', reflection: 'اليسر يأتي بعد العسر لا قبله، فاصبر.' }
  ];

  dailyActions = [
    'أرسل صدقة بسيطة لشخص محتاج قبل المغرب.',
    'اتصل بقريب لم تتواصل معه من فترة وابدأ بالسلام.',
    'اقرأ صفحة تفسير واحدة بعد التراويح.',
    'سامح شخصًا أساء لك وادعُ له.',
    'ساعد أحدًا في حاجة صغيرة دون أن يطلب.',
    'اقرأ سيرة النبي ﷺ لمدة 10 دقائق.',
    'تبسّم في وجه كل من تقابله اليوم.',
    'أزل أذى من الطريق واحتسب الأجر.'
  ];

  duaGroups: DuaGroup[] = [
    {
      id: 'before-iftar',
      title: 'قبل الإفطار',
      items: [
        { id: 'bef1', text: 'اللهم إني لك صمت وعلى رزقك أفطرت.' },
        { id: 'bef2', text: 'اللهم تقبل صيامي واغفر ذنبي.' },
        { id: 'bef3', text: 'اللهم إنك عفو تحب العفو فاعف عني.' },
        { id: 'bef4', text: 'اللهم ارزقني دعوة لا ترد قبل الإفطار.' },
        { id: 'bef5', text: 'اللهم اجعلني من عتقائك من النار.' },
        { id: 'bef6', text: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة.' }
      ]
    },
    {
      id: 'after-iftar',
      title: 'بعد الإفطار',
      items: [
        { id: 'aft1', text: 'ذهب الظمأ وابتلت العروق وثبت الأجر إن شاء الله.' },
        { id: 'aft2', text: 'اللهم لك الحمد حتى ترضى ولك الحمد إذا رضيت.' },
        { id: 'aft3', text: 'اللهم بارك لنا فيما رزقتنا واجعلنا من الشاكرين.' },
        { id: 'aft4', text: 'اللهم اجعل فطري قوة على طاعتك لا على معصيتك.' },
        { id: 'aft5', text: 'الحمد لله الذي أطعمني هذا ورزقنيه من غير حول مني ولا قوة.' }
      ]
    },
    {
      id: 'suhoor',
      title: 'السحور',
      items: [
        { id: 'suh1', text: 'اللهم بارك لنا فيما رزقتنا وقنا عذاب النار.' },
        { id: 'suh2', text: 'اللهم اجعل سحورنا قوة على طاعتك.' },
        { id: 'suh3', text: 'اللهم ارزقنا نية صادقة وصيامًا مقبولًا.' },
        { id: 'suh4', text: 'اللهم أيقظ قلوبنا قبل أجسادنا لطاعتك.' }
      ]
    },
    {
      id: 'qiyam',
      title: 'القيام والوتر',
      items: [
        { id: 'qiy1', text: 'اللهم إنك عفو تحب العفو فاعف عني.' },
        { id: 'qiy2', text: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.' },
        { id: 'qiy3', text: 'اللهم ارزقني خشوعًا دائمًا وقلبًا سليمًا.' },
        { id: 'qiy4', text: 'اللهم اجعل قيامي شاهدًا لي لا عليّ.' },
        { id: 'qiy5', text: 'اللهم اهدني فيمن هديت وعافني فيمن عافيت.' }
      ]
    },
    {
      id: 'last10',
      title: 'العشر الأواخر / ليلة القدر',
      items: [
        { id: 'l10-1', text: 'اللهم إنك عفو كريم تحب العفو فاعف عنا.' },
        { id: 'l10-2', text: 'اللهم بلغنا ليلة القدر وأعنا فيها على ذكرك وشكرك وحسن عبادتك.' },
        { id: 'l10-3', text: 'اللهم اكتب لنا فيها خير الدنيا والآخرة.' },
        { id: 'l10-4', text: 'اللهم لا تحرمنا بركة ليلة القدر وفضلها.' },
        { id: 'l10-5', text: 'اللهم اجعلنا من المقبولين في هذه الليلة المباركة.' }
      ]
    }
  ];

  dhikrGroups: DhikrGroup[] = [
    {
      id: 'morning',
      title: 'أذكار الصباح',
      items: [
        { id: 'm1', text: 'أصبحنا وأصبح الملك لله.' },
        { id: 'm2', text: 'اللهم بك أصبحنا وبك أمسينا.' },
        { id: 'm3', text: 'أصبحنا على فطرة الإسلام وكلمة الإخلاص.' }
      ]
    },
    {
      id: 'evening',
      title: 'أذكار المساء',
      items: [
        { id: 'e1', text: 'أمسينا وأمسى الملك لله.' },
        { id: 'e2', text: 'اللهم إني أمسيت أشهدك وأشهد حملة عرشك.' },
        { id: 'e3', text: 'أمسينا وأمسى الملك لله والحمد لله.' }
      ]
    },
    {
      id: 'istighfar',
      title: 'استغفار وصلاة على النبي',
      items: [
        { id: 'i1', text: 'أستغفر الله العظيم وأتوب إليه.', target: 100 },
        { id: 'i2', text: 'اللهم صل وسلم على نبينا محمد.', target: 100 },
        { id: 'i3', text: 'سبحان الله وبحمده سبحان الله العظيم.', target: 100 }
      ]
    },
    {
      id: 'sleep',
      title: 'أذكار النوم',
      items: [
        { id: 'sl1', text: 'باسمك اللهم أموت وأحيا.' },
        { id: 'sl2', text: 'اللهم قني عذابك يوم تبعث عبادك.' },
        { id: 'sl3', text: 'اللهم باسمك أحيا وباسمك أموت.' }
      ]
    },
    {
      id: 'after-prayer',
      title: 'أذكار بعد الصلاة',
      items: [
        { id: 'p1', text: 'سبحان الله 33، الحمد لله 33، الله أكبر 33.' },
        { id: 'p2', text: 'لا إله إلا الله وحده لا شريك له له الملك وله الحمد وهو على كل شيء قدير.' },
        { id: 'p3', text: 'اللهم لا مانع لما أعطيت ولا معطي لما منعت.' }
      ]
    }
  ];

  khatmaPlans: KhatmaPlan[] = [
    {
      id: '30',
      title: 'ختمة 30 يوم',
      subtitle: 'جزء يوميا',
      rows: [
        { day: 'اليوم 1 - اليوم 10', target: 'جزء 1 إلى جزء 10' },
        { day: 'اليوم 11 - اليوم 20', target: 'جزء 11 إلى جزء 20' },
        { day: 'اليوم 21 - اليوم 30', target: 'جزء 21 إلى جزء 30' }
      ]
    },
    {
      id: '15',
      title: 'ختمة 15 يوم',
      subtitle: 'جزئين يوميا',
      rows: [
        { day: 'اليوم 1 - اليوم 5', target: 'جزء 1 إلى جزء 10' },
        { day: 'اليوم 6 - اليوم 10', target: 'جزء 11 إلى جزء 20' },
        { day: 'اليوم 11 - اليوم 15', target: 'جزء 21 إلى جزء 30' }
      ]
    },
    {
      id: '10',
      title: 'ختمة 10 أيام',
      subtitle: '3 أجزاء يوميا',
      rows: [
        { day: 'اليوم 1 - اليوم 4', target: 'جزء 1 إلى جزء 12' },
        { day: 'اليوم 5 - اليوم 7', target: 'جزء 13 إلى جزء 21' },
        { day: 'اليوم 8 - اليوم 10', target: 'جزء 22 إلى جزء 30' }
      ]
    }
  ];

  fiqhItems: FiqhItem[] = [
    {
      id: 'break-fast',
      question: 'ما الذي يفطر؟',
      answer: 'الأكل والشرب عمدًا، والجماع، وكل ما كان في معنى ذلك عمدًا نهار رمضان.',
    },
    {
      id: 'niyyah',
      question: 'السحور والنية',
      answer: 'السحور سنة وبركة، والنية محلها القلب ولا يشترط التلفظ بها.',
    },
    {
      id: 'travel',
      question: 'المرض والسفر',
      answer: 'يجوز الفطر للمريض والمسافر، ويقضي المسلم ما أفطره في أيام أخرى.',
    },
    {
      id: 'women',
      question: 'الحيض والنفاس',
      answer: 'الحائض والنفساء تفطران وتقضيان الصيام بعد رمضان، ولا تصليان في تلك المدة.',
    },
    {
      id: 'zakat',
      question: 'زكاة الفطر',
      answer: 'تُخرج قبل صلاة العيد، والأفضل قبلها بيوم أو يومين، وهي طهرة للصائم وإعانة للمحتاج.',
    },
    {
      id: 'mistakes',
      question: 'الأخطاء في الصيام',
      answer: 'من أكل أو شرب ناسيًا فليتم صومه، فإنما أطعمه الله وسقاه، ولا قضاء عليه.',
    },
    {
      id: 'kaffarah',
      question: 'الكفارة والفدية',
      answer: 'من أفطر عمدًا بجماع فعليه كفارة مغلظة، وأما المرض والسفر فقضاء فقط.',
    }
  ];

  tenNightsPlan = [
    'قيام + وتر يومي بلا انقطاع.',
    'ورد قرآن إضافي (نصف جزء أو جزء فوق المعتاد).',
    'صدقة يومية ولو بسيطة.',
    'ساعة دعاء مركّزة قبل الفجر.',
    'تقليل الملهيات وتثبيت وقت خلوة يومي.',
    'الاعتكاف في المسجد إن أمكن.',
    'مضاعفة الاستغفار والتوبة.',
    'إحياء الليل بالذكر والقرآن.'
  ];

  laylatQadrFocus = [
    'الإكثار من: اللهم إنك عفو تحب العفو فاعف عني.',
    'إطالة السجود والدعاء بجوامع الخير.',
    'تجديد التوبة والعزم على الاستقامة بعد رمضان.',
    'كثرة الصلاة على النبي ﷺ.',
    'قراءة القرآن بتدبر وخشوع.'
  ];

  libraryItems: LibraryItem[] = [
    {
      title: 'أدعية رمضان مكتوبة',
      description: 'مجموعة أدعية مرتبة حسب الأوقات.',
      content: [
        'اللهم إني لك صمت وعلى رزقك أفطرت.',
        'ذهب الظمأ وابتلت العروق وثبت الأجر إن شاء الله.',
        'اللهم تقبل صيامي وقيامي واغفر لي ولوالدي.',
        'اللهم أعني على ذكرك وشكرك وحسن عبادتك.',
        'اللهم إنك عفو تحب العفو فاعف عني.',
        'اللهم اجعل القرآن ربيع قلبي ونور صدري.',
        'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.',
        'اللهم ارزقني الإخلاص في القول والعمل.',
        'اللهم بلغني ليلة القدر وارزقني خيرها.',
        'اللهم بارك لي في سحوري وإفطاري.',
        'اللهم لا تخرجني من رمضان إلا بذنب مغفور.',
        'اللهم أصلح لي ديني ودنياي وآخرتي.',
        'اللهم اهدني وسددني ووفقني لما تحب.',
        'اللهم اجعلني من عتقائك من النار.',
        'اللهم اشرح صدري ويسر أمري.',
        'اللهم اغفر للمؤمنين والمؤمنات الأحياء منهم والأموات.',
        'اللهم ارزقني قلبًا خاشعًا ولسانًا ذاكرًا.',
        'اللهم اجعلني من المقبولين في هذا الشهر.',
        'اللهم استرني فوق الأرض وتحت الأرض ويوم العرض.',
        'اللهم ارزقني حسن الخاتمة وثباتًا على الطاعة.'
      ]
    },
    {
      title: 'رسائل وخواطر رمضانية قصيرة',
      description: 'رسائل جاهزة للمشاركة اليومية.',
      content: [
        'رمضان فرصة جديدة لبداية صادقة مع الله.',
        'اجعل لك كل يوم موعدًا ثابتًا مع القرآن.',
        'الكلمة الطيبة عبادة.. خصوصًا في رمضان.',
        'لا تؤجل التوبة، بابها مفتوح الآن.',
        'قليل دائم خير من كثير منقطع.',
        'أفضل ما تهديه لقلبك: لحظات خلوة مع الله.',
        'لا تنسَ دعاء من تحب قبل الإفطار.',
        'النية الصالحة تحول العادات إلى عبادات.',
        'حسن الخلق يرفع أجر الصائم.',
        'رمضان مدرسة.. والناجح من استمر بعده.',
        'ابدأ يومك بذكر الله، ينشرح صدرك.',
        'اجعل لك صدقة سر لا يعلمها إلا الله.',
        'السكينة تأتي مع كثرة الاستغفار.',
        'خفف من ضجيج الدنيا لتسمع صوت قلبك.',
        'كل سجدة صادقة تداوي تعبًا لا يراه الناس.',
        'ما بين أذان وإقامة دعوات لا ترد بإذن الله.',
        'أحسن لمن حولك.. فالأجر مضاعف.',
        'رب دعوة في جوف الليل تغيّر عمرك كله.',
        'إذا ضاق صدرك، افتح المصحف.',
        'رمضان ليس صيام بطن فقط.. بل صيام قلب ولسان.'
      ]
    },
    {
      title: 'فضائل رمضان',
      description: 'مختصر فضائل الشهر الكريم.',
      content: [
        'تفتح فيه أبواب الجنة وتغلق أبواب النار.',
        'فيه ليلة القدر خير من ألف شهر.',
        'الصيام عبادة عظيمة يجزي الله بها جزاءً خاصًا.',
        'شهر القرآن وتلاوته وتدبره.',
        'موسم لمغفرة الذنوب ورفع الدرجات.',
        'الدعاء فيه أرجى للقبول، خاصة عند الإفطار.',
        'التراويح سبب لقيام رمضان إيمانًا واحتسابًا.',
        'فيه فرصة عملية لتزكية النفس.',
        'يعوّد النفس على الصبر والانضباط.',
        'موسم للرحمة والتكافل والإحسان.',
        'الصدقة فيه أعظم أجرًا.',
        'السحور فيه بركة عظيمة.',
        'يشحذ الهمة للطاعات المتنوعة.',
        'من أعظم مواسم إصلاح القلب.',
        'فرصة لمحاسبة النفس وتجديد العهد مع الله.',
        'الإكثار من الذكر فيه يزيد الطمأنينة.',
        'فرصة للتقليل من الذنوب والعادات السيئة.',
        'صلة الرحم فيه عبادة مضاعفة الأثر.',
        'الاعتكاف فيه عبادة عظيمة في العشر الأواخر.',
        'ختامه عيد وفرحة بطاعة الله.'
      ]
    },
    {
      title: 'أحاديث صحيحة عن الصيام',
      description: 'انتقاء أحاديث صحيحة مشهورة.',
      content: [
        'من صام رمضان إيمانًا واحتسابًا غفر له ما تقدم من ذنبه.',
        'من قام رمضان إيمانًا واحتسابًا غفر له ما تقدم من ذنبه.',
        'من قام ليلة القدر إيمانًا واحتسابًا غفر له ما تقدم من ذنبه.',
        'الصيام جُنّة.',
        'للصائم فرحتان: فرحة عند فطره وفرحة عند لقاء ربه.',
        'خلوف فم الصائم أطيب عند الله من ريح المسك.',
        'تسحروا فإن في السحور بركة.',
        'لا يزال الناس بخير ما عجلوا الفطر.',
        'إذا جاء رمضان فتحت أبواب الجنة وغلقت أبواب النار وصفدت الشياطين.',
        'إن في الجنة بابًا يقال له الريان يدخل منه الصائمون.',
        'من فطّر صائمًا كان له مثل أجره.',
        'الصوم لي وأنا أجزي به.',
        'إذا صام أحدكم فلا يرفث ولا يجهل.',
        'فإن سابه أحد أو قاتله فليقل إني صائم.',
        'كان النبي صلى الله عليه وسلم يفطر قبل أن يصلي.',
        'ذهب الظمأ وابتلت العروق وثبت الأجر إن شاء الله.',
        'الدعاء لا يرد بين الأذان والإقامة.',
        'أفضل الصيام بعد رمضان صيام شهر الله المحرم.',
        'أحب الأعمال إلى الله أدومها وإن قل.',
        'من لم يدع قول الزور والعمل به فليس لله حاجة أن يدع طعامه وشرابه.'
      ]
    },
    {
      title: 'أخطاء شائعة في رمضان',
      description: 'تنبيهات عملية لتجنب الأخطاء المتكررة.',
      content: [
        'تأخير الصلاة عن وقتها بسبب النوم أو الانشغال.',
        'الانشغال الزائد بالطعام وإهمال العبادة.',
        'ترك ورد القرآن حتى تتراكم الأجزاء.',
        'السهر المفرط الذي يضيع الفجر.',
        'الخصومات وسوء الخلق أثناء الصيام.',
        'إضاعة وقت طويل على الهاتف بلا فائدة.',
        'الغفلة عن الدعاء قبل الإفطار.',
        'عدم استحضار النية والإخلاص.',
        'الإفراط في الأكل عند المغرب.',
        'ترك السحور دون عذر.',
        'التشدد على النفس بما لا يطيق ثم الانقطاع.',
        'نسيان حق الأهل وحسن المعاملة.',
        'إهمال الصدقة طوال الشهر.',
        'تضييع العشر الأواخر في العادات.',
        'ترك قيام الليل بدعوى التعب فقط.',
        'تأجيل التوبة إلى آخر رمضان.',
        'عدم وضع خطة يومية واضحة للطاعة.',
        'الانشغال بالمظاهر أكثر من الجوهر.',
        'الكسل عن الذكر والاستغفار.',
        'العودة للمعاصي بعد انتهاء الشهر مباشرة.'
      ]
    }
  ];

  constructor() {
    this.initializeComponent();
  }

  get wardProgress(): number {
    if (!this.wardTodo.length) return 0;
    const done = this.wardTodo.filter(item => item.done).length;
    return Math.round((done / this.wardTodo.length) * 100);
  }

  get wardDoneCount(): number {
    return this.wardTodo.filter(item => item.done).length;
  }

  get wardRemainingCount(): number {
    return this.wardTodo.length - this.wardDoneCount;
  }

  get tasbihProgress(): number {
    return Math.min(Math.round((this.tasbihCount / this.tasbihTarget) * 100), 100);
  }

  @HostListener('window:beforeunload')
  onBeforeUnload() {
    this.saveSebhaState();
    this.saveWardTodo();
  }

  copyText(value: string, key: string) {
    if (!value?.trim()) return;

    navigator.clipboard.writeText(value).then(() => {
      this.copiedKey = key;
      if (this.copyTimeoutId) {
        clearTimeout(this.copyTimeoutId);
      }
      this.copyTimeoutId = setTimeout(() => {
        if (this.copiedKey === key) {
          this.copiedKey = null;
        }
      }, 2000);
    }).catch(() => {
      this.copiedKey = null;
    });
  }

  refreshDailyContent() {
    const idx = this.getDayIndex();
    this.todayDua = {
      id: 'today-dua',
      title: 'دعاء اليوم',
      text: this.dailyDuas[idx % this.dailyDuas.length]
    };
    this.todayDhikr = {
      id: 'today-dhikr',
      title: 'ذكر اليوم',
      text: this.dailyAdhkar[idx % this.dailyAdhkar.length]
    };
    this.todayReflection = this.dailyReflections[idx % this.dailyReflections.length];
    this.todayAction = {
      title: 'عمل صالح اليوم',
      suggestion: this.dailyActions[idx % this.dailyActions.length]
    };
  }

  toggleDuaGroup(groupId: string) {
    this.openDuaGroupId = this.openDuaGroupId === groupId ? null : groupId;
  }

  setTasbihTarget(target: number) {
    if (target <= 0) return;
    this.tasbihTarget = target;
    if (this.tasbihCount > target) {
      this.tasbihCount = target;
    }
    this.saveSebhaState();
  }

  decrementTasbih() {
    if (this.tasbihCount > 0) {
      this.tasbihCount -= 1;
      this.saveSebhaState();
    }
  }

  incrementTasbih() {
    if (this.tasbihCount < this.tasbihTarget) {
      this.tasbihCount += 1;
    } else {
      this.completedRounds += 1;
      this.tasbihCount = 1;
    }
    this.saveSebhaState();
  }

  resetTasbih() {
    this.tasbihCount = 0;
    this.completedRounds = 0;
    this.saveSebhaState();
  }

  onPhraseChange() {
    this.tasbihCount = 0;
    this.completedRounds = 0;
    this.saveSebhaState();
  }

  addWardTask() {
    const title = this.newWardTask.trim();
    if (!title || title.length > 200) return;

    const exists = this.wardTodo.some(item =>
      item.title.toLowerCase() === title.toLowerCase()
    );

    if (exists) {
      this.newWardTask = '';
      return;
    }

    this.wardTodo.unshift({
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      done: false,
      createdAt: Date.now()
    });

    this.newWardTask = '';
    this.saveWardTodo();
  }

  addWardIdea(title: string) {
    if (!title?.trim()) return;

    const exists = this.wardTodo.some(item =>
      item.title.toLowerCase() === title.toLowerCase()
    );

    if (exists) return;

    this.wardTodo.unshift({
      id: `idea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      done: false,
      createdAt: Date.now()
    });

    this.saveWardTodo();
  }

  toggleWardTask(id: string) {
    const task = this.wardTodo.find(item => item.id === id);
    if (task) {
      task.done = !task.done;
      this.saveWardTodo();
    }
  }

  removeWardTask(id: string) {
    this.wardTodo = this.wardTodo.filter(item => item.id !== id);
    this.saveWardTodo();
  }

  resetWardTodo() {
    this.wardTodo = this.defaultWardTasks();
    this.saveWardTodo();
  }

  toggleFiqh(id: string) {
    this.openFiqhId = this.openFiqhId === id ? null : id;
  }

  toggleLibraryItem(title: string) {
    this.openLibraryTitle = this.openLibraryTitle === title ? null : title;
  }

  scrollToSection(sectionId: string) {
    if (!sectionId) return;

    const el = document.getElementById(sectionId);
    if (!el) return;

    const offset = 140;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private initializeComponent() {
    this.refreshDailyContent();
    this.loadSebhaState();
    this.loadWardTodo();
    this.openLibraryTitle = this.libraryItems[0]?.title ?? null;
    this.openDuaGroupId = this.duaGroups[0]?.id ?? null;
    this.activeDateKey = this.getDateKey();
    this.startDayWatcher();
  }

  private cleanup() {
    if (this.dayWatcherId) {
      clearInterval(this.dayWatcherId);
      this.dayWatcherId = null;
    }

    if (this.copyTimeoutId) {
      clearTimeout(this.copyTimeoutId);
      this.copyTimeoutId = null;
    }

    this.saveSebhaState();
    this.saveWardTodo();
  }

  private defaultWardTasks(): WardTodoItem[] {
    return [
      { id: 'w1', title: 'قراءة ورد القرآن اليومي', done: false, createdAt: Date.now() },
      { id: 'w2', title: 'مراجعة تفسير مختصر للورد', done: false, createdAt: Date.now() },
      { id: 'w3', title: 'أذكار الصباح والمساء', done: false, createdAt: Date.now() },
      { id: 'w4', title: 'دعاء قبل الإفطار بتركيز', done: false, createdAt: Date.now() },
      { id: 'w5', title: 'صلاة التراويح', done: false, createdAt: Date.now() },
      { id: 'w6', title: 'صدقة يومية', done: false, createdAt: Date.now() }
    ];
  }

  private loadWardTodo() {
    try {
      const key = this.STORAGE_KEYS.ward + this.getDateKey();
      const raw = localStorage.getItem(key);

      if (!raw) {
        this.wardTodo = this.defaultWardTasks();
        return;
      }

      const parsed = JSON.parse(raw) as WardTodoItem[];

      if (!Array.isArray(parsed) || parsed.length === 0) {
        this.wardTodo = this.defaultWardTasks();
        return;
      }

      this.wardTodo = parsed.filter(item =>
        item.id && item.title && typeof item.done === 'boolean'
      );

      if (this.wardTodo.length === 0) {
        this.wardTodo = this.defaultWardTasks();
      }
    } catch (error) {
      console.error('Error loading ward todo:', error);
      this.wardTodo = this.defaultWardTasks();
    }
  }

  private saveWardTodo() {
    try {
      const key = this.STORAGE_KEYS.ward + this.getDateKey();
      localStorage.setItem(key, JSON.stringify(this.wardTodo));
    } catch (error) {
      console.error('Error saving ward todo:', error);
    }
  }

  private loadSebhaState() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEYS.sebha);
      if (!raw) return;

      const parsed = JSON.parse(raw) as SebhaState;

      if (parsed.phrase && this.sebhaPhrases.includes(parsed.phrase)) {
        this.selectedPhrase = parsed.phrase;
      }

      if (parsed.target && [33, 100, 300].includes(parsed.target)) {
        this.tasbihTarget = parsed.target;
      }

      this.tasbihCount = Math.max(0, parsed.count || 0);
      this.completedRounds = Math.max(0, parsed.rounds || 0);
    } catch (error) {
      console.error('Error loading sebha state:', error);
      localStorage.removeItem(this.STORAGE_KEYS.sebha);
    }
  }

  private saveSebhaState() {
    try {
      const state: SebhaState = {
        phrase: this.selectedPhrase,
        target: this.tasbihTarget,
        count: this.tasbihCount,
        rounds: this.completedRounds,
        lastUpdated: Date.now()
      };
      localStorage.setItem(this.STORAGE_KEYS.sebha, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving sebha state:', error);
    }
  }

  private getDayIndex(): number {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - yearStart.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private getDateKey(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private getTodayLabel(): string {
    try {
      return new Date().toLocaleDateString('ar-EG', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    } catch {
      return new Date().toLocaleDateString('ar', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
  }

  private startDayWatcher() {
    this.dayWatcherId = setInterval(() => {
      const nextKey = this.getDateKey();

      if (nextKey === this.activeDateKey) return;

      this.activeDateKey = nextKey;
      this.todayLabel = this.getTodayLabel();
      this.refreshDailyContent();
      this.loadWardTodo();
    }, 60 * 1000);
  }
}
