import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Dhikr {
  id: number;
  text: string;
  count: number;
  current: number;
  reference?: string;
}

export interface AdhkarCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  adhkar: Dhikr[];
}

export interface AdhkarGroup {
  groupTitle: string;
  groupIcon: string;
  groupColor: string;
  categories: AdhkarCategory[];
}

@Component({
  selector: 'app-tasabeeh',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasabeeh.component.html',
  styleUrls: ['./tasabeeh.component.css']
})
export class TasabeehComponent implements OnInit, OnDestroy {

  groups: AdhkarGroup[] = [];
  allCategories: AdhkarCategory[] = [];

  // State - 3 level hierarchy
  activeGroup: AdhkarGroup | null = null;
  activeCategory: AdhkarCategory | null = null;
  activeDhikr: Dhikr | null = null;
  activeDhikrIndex = 0;
  searchQuery = '';
  showCounter = false;

  // Current view: 'groups' | 'categories' | 'adhkar' | 'counter'
  get currentView(): string {
    if (this.showCounter && this.activeDhikr) return 'counter';
    if (this.activeCategory) return 'adhkar';
    if (this.activeGroup) return 'categories';
    return 'groups';
  }

  // Circle progress
  radius = 54;
  circumference = 2 * Math.PI * 54;
  dashOffset = this.circumference;

  // Stats
  todayTotal = 0;
  todayCompleted = 0;

  constructor() { }

  ngOnInit() {
    this.initializeData();
    this.loadProgress();
  }

  ngOnDestroy() {
    this.saveProgress();
  }

  @HostListener('window:beforeunload')
  onUnload() {
    this.saveProgress();
  }

  initializeData() {
    this.groups = [
      {
        groupTitle: 'أذكار الصباح والمساء', groupIcon: '🌤️', groupColor: '#f59e0b',
        categories: [
          {
            id: 'morning', title: 'أذكار الصباح', icon: '🌅', color: '#f59e0b',
            adhkar: [
              { id: 1, text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count: 1, current: 0, reference: 'مسلم' },
              { id: 2, text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', count: 1, current: 0, reference: 'الترمذي' },
              { id: 3, text: 'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ', count: 1, current: 0, reference: 'أبو داود' },
              { id: 4, text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي', count: 3, current: 0, reference: 'أبو داود' },
              { id: 5, text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', count: 3, current: 0, reference: 'مسلم' },
              { id: 6, text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', count: 3, current: 0, reference: 'الترمذي' },
              { id: 7, text: 'حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', count: 7, current: 0, reference: 'أبو داود' },
              { id: 8, text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', count: 100, current: 0, reference: 'مسلم' },
              { id: 9, text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count: 10, current: 0, reference: 'متفق عليه' },
              { id: 10, text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', count: 100, current: 0, reference: 'البخاري' },
            ]
          },
          {
            id: 'evening', title: 'أذكار المساء', icon: '🌙', color: '#6366f1',
            adhkar: [
              { id: 11, text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', count: 1, current: 0, reference: 'مسلم' },
              { id: 12, text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ', count: 1, current: 0, reference: 'الترمذي' },
              { id: 13, text: 'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ', count: 1, current: 0, reference: 'أبو داود' },
              { id: 14, text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', count: 3, current: 0, reference: 'مسلم' },
              { id: 15, text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', count: 3, current: 0, reference: 'الترمذي' },
              { id: 16, text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', count: 100, current: 0, reference: 'مسلم' },
              { id: 17, text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', count: 100, current: 0, reference: 'البخاري' },
            ]
          },
        ]
      },
      {
        groupTitle: 'أذكار النوم والاستيقاظ', groupIcon: '🌙', groupColor: '#8b5cf6',
        categories: [
          {
            id: 'wakeup', title: 'أذكار الاستيقاظ من النوم', icon: '☀️', color: '#f97316',
            adhkar: [
              { id: 20, text: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', count: 1, current: 0, reference: 'البخاري' },
              { id: 21, text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ', count: 1, current: 0, reference: 'البخاري' },
            ]
          },
          {
            id: 'sleep', title: 'أذكار النوم', icon: '🌜', color: '#8b5cf6',
            adhkar: [
              { id: 25, text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', count: 1, current: 0, reference: 'البخاري' },
              { id: 26, text: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ', count: 1, current: 0, reference: 'أبو داود' },
              { id: 27, text: 'سُبْحَانَ اللَّهِ', count: 33, current: 0, reference: 'متفق عليه' },
              { id: 28, text: 'الْحَمْدُ لِلَّهِ', count: 33, current: 0, reference: 'متفق عليه' },
              { id: 29, text: 'اللَّهُ أَكْبَرُ', count: 34, current: 0, reference: 'متفق عليه' },
              { id: 30, text: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ', count: 1, current: 0, reference: 'متفق عليه' },
            ]
          },
        ]
      },
      {
        groupTitle: 'أذكار الطهارة', groupIcon: '💧', groupColor: '#06b6d4',
        categories: [
          {
            id: 'bathroom-enter', title: 'أذكار دخول الحمّام', icon: '🚿', color: '#06b6d4',
            adhkar: [
              { id: 35, text: 'بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ', count: 1, current: 0, reference: 'متفق عليه' },
            ]
          },
          {
            id: 'bathroom-exit', title: 'أذكار الخروج من الحمّام', icon: '🚪', color: '#14b8a6',
            adhkar: [
              { id: 36, text: 'غُفْرَانَكَ', count: 1, current: 0, reference: 'أبو داود والترمذي' },
            ]
          },
          {
            id: 'wudu', title: 'أذكار الوضوء', icon: '💧', color: '#3b82f6',
            adhkar: [
              { id: 37, text: 'بِسْمِ اللَّهِ', count: 1, current: 0, reference: 'أبو داود' },
            ]
          },
          {
            id: 'after-wudu', title: 'أذكار بعد الوضوء', icon: '✨', color: '#22d3ee',
            adhkar: [
              { id: 38, text: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ', count: 1, current: 0, reference: 'مسلم' },
              { id: 39, text: 'اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ', count: 1, current: 0, reference: 'الترمذي' },
            ]
          },
        ]
      },
      {
        groupTitle: 'أذكار المسجد والصلاة', groupIcon: '🕌', groupColor: '#10b981',
        categories: [
          {
            id: 'masjid-enter', title: 'أذكار دخول المسجد', icon: '🕌', color: '#10b981',
            adhkar: [
              { id: 40, text: 'بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', count: 1, current: 0, reference: 'مسلم' },
            ]
          },
          {
            id: 'masjid-exit', title: 'أذكار الخروج من المسجد', icon: '🏠', color: '#059669',
            adhkar: [
              { id: 41, text: 'بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', count: 1, current: 0, reference: 'مسلم' },
            ]
          },
          {
            id: 'adhan', title: 'أذكار الأذان', icon: '📢', color: '#0ea5e9',
            adhkar: [
              { id: 42, text: 'يُردّد المؤذّن ما يقول المؤذّن إلّا في "حيّ على الصلاة" و "حيّ على الفلاح" فيقول: لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', count: 1, current: 0, reference: 'مسلم' },
            ]
          },
          {
            id: 'after-adhan', title: 'أذكار ما بعد الأذان', icon: '🤲', color: '#0284c7',
            adhkar: [
              { id: 43, text: 'اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ وَالصَّلَاةِ الْقَائِمَةِ آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ', count: 1, current: 0, reference: 'البخاري' },
            ]
          },
          {
            id: 'iqamah', title: 'أذكار الإقامة', icon: '🧎', color: '#7c3aed',
            adhkar: [
              { id: 44, text: 'اللَّهُمَّ أَقِمْهَا مَا دَامَتِ السَّمَاوَاتُ وَالأَرْضُ', count: 1, current: 0, reference: 'أبو داود' },
            ]
          },
          {
            id: 'after-prayer', title: 'أذكار بعد الصلاة', icon: '📿', color: '#a855f7',
            adhkar: [
              { id: 45, text: 'أَسْتَغْفِرُ اللَّهَ', count: 3, current: 0, reference: 'مسلم' },
              { id: 46, text: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ', count: 1, current: 0, reference: 'مسلم' },
              { id: 47, text: 'سُبْحَانَ اللَّهِ', count: 33, current: 0, reference: 'مسلم' },
              { id: 48, text: 'الْحَمْدُ لِلَّهِ', count: 33, current: 0, reference: 'مسلم' },
              { id: 49, text: 'اللَّهُ أَكْبَرُ', count: 33, current: 0, reference: 'مسلم' },
              { id: 50, text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count: 1, current: 0, reference: 'مسلم' },
              { id: 51, text: 'آيَةُ الْكُرْسِيِّ: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...', count: 1, current: 0, reference: 'النسائي' },
            ]
          },
          {
            id: 'tasbeeh', title: 'أذكار التسبيح والتحميد والتكبير', icon: '🔢', color: '#ec4899',
            adhkar: [
              { id: 52, text: 'سُبْحَانَ اللَّهِ', count: 33, current: 0, reference: 'مسلم' },
              { id: 53, text: 'الْحَمْدُ لِلَّهِ', count: 33, current: 0, reference: 'مسلم' },
              { id: 54, text: 'اللَّهُ أَكْبَرُ', count: 34, current: 0, reference: 'مسلم' },
              { id: 55, text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ', count: 100, current: 0, reference: 'البخاري ومسلم' },
              { id: 56, text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', count: 100, current: 0, reference: 'متفق عليه' },
            ]
          },
        ]
      },
      {
        groupTitle: 'أذكار القرآن', groupIcon: '📖', groupColor: '#0d9488',
        categories: [
          {
            id: 'quran-read', title: 'أذكار قراءة القرآن', icon: '📖', color: '#0d9488',
            adhkar: [
              { id: 60, text: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', count: 1, current: 0, reference: 'النحل: 98' },
              { id: 61, text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', count: 1, current: 0 },
            ]
          },
          {
            id: 'quran-khatm', title: 'أذكار ختم القرآن', icon: '🏅', color: '#eab308',
            adhkar: [
              { id: 62, text: 'صَدَقَ اللَّهُ الْعَظِيمُ، اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا', count: 1, current: 0 },
            ]
          },
        ]
      },
      {
        groupTitle: 'أذكار الطعام واللباس', groupIcon: '🍽️', groupColor: '#f97316',
        categories: [
          {
            id: 'food-before', title: 'أذكار الطعام (قبل الأكل)', icon: '🍽️', color: '#f97316',
            adhkar: [
              { id: 65, text: 'بِسْمِ اللَّهِ', count: 1, current: 0, reference: 'مسلم' },
              { id: 66, text: 'بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ (إذا نسي)', count: 1, current: 0, reference: 'أبو داود والترمذي' },
            ]
          },
          {
            id: 'food-after', title: 'أذكار الطعام (بعد الأكل)', icon: '🙏', color: '#84cc16',
            adhkar: [
              { id: 67, text: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ', count: 1, current: 0, reference: 'أبو داود والترمذي' },
            ]
          },
          {
            id: 'wear-cloth', title: 'أذكار لبس الثوب', icon: '👔', color: '#8b5cf6',
            adhkar: [
              { id: 68, text: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ', count: 1, current: 0, reference: 'أبو داود والترمذي' },
            ]
          },
          {
            id: 'remove-cloth', title: 'أذكار خلع الثوب', icon: '🧥', color: '#a78bfa',
            adhkar: [
              { id: 69, text: 'بِسْمِ اللَّهِ', count: 1, current: 0, reference: 'الترمذي' },
            ]
          },
        ]
      },
      {
        groupTitle: 'أذكار المنزل والسوق', groupIcon: '🏡', groupColor: '#10b981',
        categories: [
          {
            id: 'home-enter', title: 'أذكار دخول المنزل', icon: '🏡', color: '#10b981',
            adhkar: [
              { id: 70, text: 'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا', count: 1, current: 0, reference: 'أبو داود' },
            ]
          },
          {
            id: 'home-exit', title: 'أذكار الخروج من المنزل', icon: '🚶', color: '#0ea5e9',
            adhkar: [
              { id: 71, text: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', count: 1, current: 0, reference: 'أبو داود والترمذي' },
            ]
          },
          {
            id: 'souq', title: 'أذكار دخول السوق', icon: '🛒', color: '#f59e0b',
            adhkar: [
              { id: 72, text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ بِيَدِهِ الْخَيْرُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count: 1, current: 0, reference: 'الترمذي' },
            ]
          },
        ]
      },
      {
        groupTitle: 'أذكار السفر', groupIcon: '✈️', groupColor: '#3b82f6',
        categories: [
          {
            id: 'travel', title: 'أذكار السفر', icon: '✈️', color: '#3b82f6',
            adhkar: [
              { id: 75, text: 'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ', count: 1, current: 0, reference: 'مسلم' },
              { id: 76, text: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى وَمِنَ الْعَمَلِ مَا تَرْضَى', count: 1, current: 0, reference: 'مسلم' },
            ]
          },
          {
            id: 'ride', title: 'أذكار الركوب (السيارة/الدابة)', icon: '🚗', color: '#6366f1',
            adhkar: [
              { id: 77, text: 'بِسْمِ اللَّهِ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ', count: 1, current: 0, reference: 'أبو داود' },
            ]
          },
          {
            id: 'return-travel', title: 'أذكار الرجوع من السفر', icon: '🏠', color: '#22c55e',
            adhkar: [
              { id: 78, text: 'آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ', count: 1, current: 0, reference: 'مسلم' },
            ]
          },
        ]
      },
      {
        groupTitle: 'أذكار الحالات النفسية', groupIcon: '💚', groupColor: '#ef4444',
        categories: [
          {
            id: 'fear', title: 'أذكار الخوف والفزع', icon: '😰', color: '#ef4444',
            adhkar: [
              { id: 80, text: 'لَا إِلَهَ إِلَّا اللَّهُ', count: 1, current: 0, reference: 'متفق عليه' },
              { id: 81, text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ غَضَبِهِ وَعِقَابِهِ وَشَرِّ عِبَادِهِ', count: 3, current: 0, reference: 'أبو داود' },
            ]
          },
          {
            id: 'distress', title: 'أذكار الكرب والهمّ', icon: '😞', color: '#dc2626',
            adhkar: [
              { id: 82, text: 'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَوَاتِ وَرَبُّ الأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ', count: 1, current: 0, reference: 'متفق عليه' },
              { id: 83, text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ', count: 1, current: 0, reference: 'البخاري' },
              { id: 84, text: 'اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ وَأَصْلِحْ لِي شَأْنِي كُلَّهُ لَا إِلَهَ إِلَّا أَنْتَ', count: 1, current: 0, reference: 'أبو داود' },
            ]
          },
          {
            id: 'sadness', title: 'أذكار الحزن والضيق', icon: '💔', color: '#be185d',
            adhkar: [
              { id: 85, text: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا', count: 1, current: 0, reference: 'مسلم' },
              { id: 86, text: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', count: 7, current: 0, reference: 'البخاري' },
            ]
          },
          {
            id: 'anger', title: 'أذكار الغضب', icon: '😤', color: '#ea580c',
            adhkar: [
              { id: 87, text: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', count: 1, current: 0, reference: 'متفق عليه' },
            ]
          },
        ]
      },
      {
        groupTitle: 'أذكار العبادات الخاصة', groupIcon: '⭐', groupColor: '#eab308',
        categories: [
          {
            id: 'istikhara', title: 'أذكار الاستخارة', icon: '🌟', color: '#eab308',
            adhkar: [
              { id: 90, text: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ وَتَعْلَمُ وَلَا أَعْلَمُ وَأَنْتَ عَلَّامُ الْغُيُوبِ', count: 1, current: 0, reference: 'البخاري' },
            ]
          },
          {
            id: 'tawba', title: 'أذكار التوبة والاستغفار', icon: '🤲', color: '#22c55e',
            adhkar: [
              { id: 91, text: 'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ', count: 3, current: 0, reference: 'أبو داود والترمذي' },
              { id: 92, text: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ', count: 100, current: 0, reference: 'أبو داود' },
              { id: 93, text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ (سيد الاستغفار)', count: 1, current: 0, reference: 'البخاري' },
            ]
          },
          {
            id: 'protection', title: 'أذكار الحفظ والتحصين', icon: '🛡️', color: '#3b82f6',
            adhkar: [
              { id: 94, text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', count: 3, current: 0, reference: 'الترمذي' },
              { id: 95, text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', count: 3, current: 0, reference: 'مسلم' },
            ]
          },
          {
            id: 'ruqya', title: 'أذكار الرقية الشرعية', icon: '📿', color: '#059669',
            adhkar: [
              { id: 96, text: 'بِسْمِ اللَّهِ أَرْقِيكَ مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ اللَّهُ يَشْفِيكَ', count: 3, current: 0, reference: 'مسلم' },
              { id: 97, text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ', count: 3, current: 0, reference: 'البخاري' },
            ]
          },
        ]
      },
      {
        groupTitle: 'أذكار المرض والزيارة', groupIcon: '🏥', groupColor: '#f43f5e',
        categories: [
          {
            id: 'sick', title: 'أذكار المريض', icon: '🤒', color: '#ef4444',
            adhkar: [
              { id: 100, text: 'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا', count: 7, current: 0, reference: 'متفق عليه' },
            ]
          },
          {
            id: 'visit-sick', title: 'أذكار زيارة المريض', icon: '🏥', color: '#f43f5e',
            adhkar: [
              { id: 101, text: 'لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ', count: 1, current: 0, reference: 'البخاري' },
              { id: 102, text: 'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ', count: 7, current: 0, reference: 'أبو داود والترمذي' },
            ]
          },
          {
            id: 'graveyard', title: 'أذكار دخول المقابر', icon: '⚱️', color: '#78716c',
            adhkar: [
              { id: 103, text: 'السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَلَاحِقُونَ، نَسْأَلُ اللَّهَ لَنَا وَلَكُمُ الْعَافِيَةَ', count: 1, current: 0, reference: 'مسلم' },
            ]
          },
        ]
      },
      {
        groupTitle: 'أذكار الطقس والطبيعة', groupIcon: '🌧️', groupColor: '#0284c7',
        categories: [
          {
            id: 'rain-ask', title: 'أذكار الاستسقاء (طلب المطر)', icon: '🌧️', color: '#06b6d4',
            adhkar: [
              { id: 110, text: 'اللَّهُمَّ اسْقِنَا غَيْثًا مُغِيثًا مَرِيئًا مَرِيعًا نَافِعًا غَيْرَ ضَارٍّ عَاجِلًا غَيْرَ آجِلٍ', count: 1, current: 0, reference: 'أبو داود' },
            ]
          },
          {
            id: 'rain', title: 'أذكار نزول المطر', icon: '🌦️', color: '#0284c7',
            adhkar: [
              { id: 111, text: 'اللَّهُمَّ صَيِّبًا نَافِعًا', count: 1, current: 0, reference: 'البخاري' },
              { id: 112, text: 'مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ', count: 1, current: 0, reference: 'متفق عليه' },
            ]
          },
          {
            id: 'thunder', title: 'أذكار الرعد والبرق', icon: '⚡', color: '#eab308',
            adhkar: [
              { id: 113, text: 'سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ', count: 1, current: 0, reference: 'الموطأ' },
            ]
          },
          {
            id: 'wind', title: 'أذكار الرياح', icon: '🌬️', color: '#64748b',
            adhkar: [
              { id: 114, text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا فِيهَا وَخَيْرَ مَا أُرْسِلَتْ بِهِ وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ مَا فِيهَا وَشَرِّ مَا أُرْسِلَتْ بِهِ', count: 1, current: 0, reference: 'مسلم' },
            ]
          },
        ]
      },
      {
        groupTitle: 'أذكار متنوعة', groupIcon: '📝', groupColor: '#d97706',
        categories: [
          {
            id: 'rooster', title: 'أذكار عند سماع صياح الديك/نهيق الحمار', icon: '🐓', color: '#d97706',
            adhkar: [
              { id: 115, text: 'إذا سمعتم صياح الديكة فسلوا الله من فضله فإنها رأت ملكاً', count: 1, current: 0, reference: 'متفق عليه' },
              { id: 116, text: 'إذا سمعتم نهيق الحمار فتعوذوا بالله من الشيطان فإنه رأى شيطاناً', count: 1, current: 0, reference: 'متفق عليه' },
            ]
          },
          {
            id: 'sneeze', title: 'أذكار العطاس', icon: '🤧', color: '#f472b6',
            adhkar: [
              { id: 117, text: 'الْحَمْدُ لِلَّهِ (للعاطس)', count: 1, current: 0, reference: 'البخاري' },
              { id: 118, text: 'يَرْحَمُكَ اللَّهُ (للسامع)', count: 1, current: 0, reference: 'البخاري' },
              { id: 119, text: 'يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ (رد العاطس)', count: 1, current: 0, reference: 'البخاري' },
            ]
          },
          {
            id: 'hilal', title: 'أذكار رؤية الهلال', icon: '🌙', color: '#a855f7',
            adhkar: [
              { id: 120, text: 'اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالإِيمَانِ وَالسَّلَامَةِ وَالإِسْلَامِ رَبِّي وَرَبُّكَ اللَّهُ', count: 1, current: 0, reference: 'الترمذي' },
            ]
          },
        ]
      },
      {
        groupTitle: 'أذكار المناسبات', groupIcon: '🎉', groupColor: '#10b981',
        categories: [
          {
            id: 'last10', title: 'أذكار العشر الأواخر (رمضان)', icon: '🌟', color: '#f59e0b',
            adhkar: [
              { id: 125, text: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', count: 100, current: 0, reference: 'الترمذي' },
            ]
          },
          {
            id: 'laylat-qadr', title: 'أذكار ليلة القدر', icon: '⭐', color: '#eab308',
            adhkar: [
              { id: 126, text: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي', count: 100, current: 0, reference: 'الترمذي' },
            ]
          },
          {
            id: 'friday', title: 'أذكار يوم الجمعة', icon: '🕌', color: '#0ea5e9',
            adhkar: [
              { id: 127, text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', count: 100, current: 0, reference: 'أبو داود' },
            ]
          },
          {
            id: 'eid', title: 'أذكار العيد', icon: '🎉', color: '#10b981',
            adhkar: [
              { id: 128, text: 'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ', count: 33, current: 0 },
              { id: 129, text: 'تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ', count: 1, current: 0 },
            ]
          },
        ]
      },
    ];

    // Flatten all categories
    this.allCategories = this.groups.flatMap(g => g.categories);
  }

  // --- Navigation ---
  get filteredGroups(): AdhkarGroup[] {
    if (!this.searchQuery.trim()) return this.groups;
    const q = this.searchQuery.trim();
    return this.groups
      .map(g => ({
        ...g,
        categories: g.categories.filter(c =>
          c.title.includes(q) || c.adhkar.some(d => d.text.includes(q))
        )
      }))
      .filter(g => g.categories.length > 0);
  }

  get totalCategories(): number {
    return this.allCategories.length;
  }

  openGroup(group: AdhkarGroup) {
    this.activeGroup = group;
    this.activeCategory = null;
    this.activeDhikr = null;
    this.showCounter = false;
  }

  openCategory(cat: AdhkarCategory) {
    this.activeCategory = cat;
    this.activeDhikr = null;
    this.showCounter = false;
  }

  goBack() {
    if (this.showCounter) {
      this.showCounter = false;
      this.activeDhikr = null;
    } else if (this.activeCategory) {
      this.activeCategory = null;
    } else if (this.activeGroup) {
      this.activeGroup = null;
    }
  }

  getGroupCategoryCount(group: AdhkarGroup): number {
    return group.categories.length;
  }

  getGroupTotalAdhkar(group: AdhkarGroup): number {
    return group.categories.reduce((s, c) => s + c.adhkar.length, 0);
  }

  getGroupProgress(group: AdhkarGroup): number {
    const total = group.categories.reduce((s, c) => s + c.adhkar.length, 0);
    const done = group.categories.reduce((s, c) => s + c.adhkar.filter(d => d.current >= d.count).length, 0);
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  // --- Counter ---
  openCounter(dhikr: Dhikr, index: number) {
    this.activeDhikr = dhikr;
    this.activeDhikrIndex = index;
    this.showCounter = true;
    this.updateRing();
  }

  tap() {
    if (!this.activeDhikr) return;
    if (this.activeDhikr.current < this.activeDhikr.count) {
      this.activeDhikr.current++;
      this.todayTotal++;
      this.updateRing();
      this.saveProgress();
      if (navigator.vibrate) navigator.vibrate(5);
      if (this.activeDhikr.current === this.activeDhikr.count) {
        this.todayCompleted++;
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      }
    }
  }

  resetDhikr() {
    if (this.activeDhikr) {
      this.activeDhikr.current = 0;
      this.updateRing();
      this.saveProgress();
    }
  }

  adjustCount(n: number) {
    if (!this.activeDhikr) return;
    const v = this.activeDhikr.current + n;
    if (v >= 0) {
      this.activeDhikr.current = v;
      this.updateRing();
      this.saveProgress();
    }
  }

  nextDhikr() {
    if (!this.activeCategory) return;
    const list = this.activeCategory.adhkar;
    if (this.activeDhikrIndex < list.length - 1) {
      this.activeDhikrIndex++;
      this.activeDhikr = list[this.activeDhikrIndex];
      this.updateRing();
    }
  }

  prevDhikr() {
    if (!this.activeCategory) return;
    if (this.activeDhikrIndex > 0) {
      this.activeDhikrIndex--;
      this.activeDhikr = this.activeCategory.adhkar[this.activeDhikrIndex];
      this.updateRing();
    }
  }

  updateRing() {
    if (!this.activeDhikr) return;
    const progress = Math.min(this.activeDhikr.current / this.activeDhikr.count, 1);
    this.dashOffset = this.circumference - (progress * this.circumference);
  }

  getProgress(d: Dhikr): number {
    return Math.min(100, Math.round((d.current / d.count) * 100));
  }

  isCompleted(d: Dhikr): boolean {
    return d.current >= d.count;
  }

  getCategoryProgress(cat: AdhkarCategory): number {
    const total = cat.adhkar.length;
    const completed = cat.adhkar.filter(d => d.current >= d.count).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  getCategoryCompletedCount(cat: AdhkarCategory): number {
    return cat.adhkar.filter(d => d.current >= d.count).length;
  }

  // --- Persistence ---
  saveProgress() {
    const data: Record<string, number> = {};
    this.allCategories.forEach(cat => {
      cat.adhkar.forEach(d => {
        if (d.current > 0) data[`${cat.id}_${d.id}`] = d.current;
      });
    });
    const payload = {
      counts: data,
      todayTotal: this.todayTotal,
      todayCompleted: this.todayCompleted,
      lastDate: new Date().toDateString()
    };
    localStorage.setItem('adhkar_v1', JSON.stringify(payload));
  }

  loadProgress() {
    const raw = localStorage.getItem('adhkar_v1');
    if (!raw) return;
    try {
      const payload = JSON.parse(raw);
      if (payload.lastDate !== new Date().toDateString()) {
        // New day: reset all counters
        this.allCategories.forEach(cat => cat.adhkar.forEach(d => d.current = 0));
        this.todayTotal = 0;
        this.todayCompleted = 0;
      } else {
        const counts: Record<string, number> = payload.counts || {};
        this.allCategories.forEach(cat => {
          cat.adhkar.forEach(d => {
            const key = `${cat.id}_${d.id}`;
            if (counts[key] !== undefined) d.current = counts[key];
          });
        });
        this.todayTotal = payload.todayTotal || 0;
        this.todayCompleted = payload.todayCompleted || 0;
      }
    } catch {
      // ignore
    }
  }
}
