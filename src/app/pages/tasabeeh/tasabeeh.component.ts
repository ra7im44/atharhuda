import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TasbihItem {
  id: number;
  title: string;
  text: string;
  count: number;     // الهدف (Target)
  current: number;   // العداد الحالي
  source?: string;
  benefit?: string;
  category: 'daily' | 'prayer' | 'urgent' | 'custom'; // تصنيفات
  isCustom?: boolean; // هل هو مضاف من المستخدم؟
}

export interface DailyStats {
  date: string;
  totalCounts: number;
  completedAwrad: number;
}

@Component({
  selector: 'app-tasabeeh',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasabeeh.component.html',
  styleUrls: ['./tasabeeh.component.css']
})
export class TasabeehComponent implements OnInit, OnDestroy {
  
  // 1. قاعدة البيانات (تشمل الأهداف والفئات)
  allTasabeeh: TasbihItem[] = [
    { id: 1, title: 'سبحان الله', text: 'سُبْحَانَ اللَّهِ', count: 33, current: 0, category: 'prayer', source: 'بعد الصلاة', benefit: 'تغفر الخطايا' },
    { id: 2, title: 'الحمد لله', text: 'الْحَمْدُ لِلَّهِ', count: 33, current: 0, category: 'prayer', source: 'بعد الصلاة', benefit: 'تملأ الميزان' },
    { id: 3, title: 'الله أكبر', text: 'اللَّهُ أَكْبَرُ', count: 34, current: 0, category: 'prayer', source: 'بعد الصلاة', benefit: 'تمام المائة' },
    { id: 4, title: 'الاستغفار', text: 'أَسْتَغْفِرُ اللَّهَ', count: 100, current: 0, category: 'daily', source: 'يومي', benefit: 'تفريج الهموم' },
    { id: 5, title: 'الصلاة على النبي', text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', count: 100, current: 0, category: 'daily', source: 'يومي', benefit: 'كفاية الهم' },
    { id: 6, title: 'ورد المستعجل', text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', count: 100, current: 0, category: 'urgent', source: 'خفيف', benefit: 'حط الخطايا' },
    { id: 7, title: 'التوحيد', text: 'لاَ إِلَهَ إِلاَّ اللَّهُ', count: 100, current: 0, category: 'daily', source: 'أفضل الذكر', benefit: 'مفتاح الجنة' }
  ];

  // المتغيرات
  displayTasabeeh: TasbihItem[] = []; // القائمة المعروضة حسب الفلتر
  activeCategory: string = 'all';
  activeItem: TasbihItem | null = null;
  
  // السجل والإحصائيات
  todayStats: DailyStats = { date: new Date().toDateString(), totalCounts: 0, completedAwrad: 0 };
  // إضافة ذكر جديد
  showAddModal = false;
  newDhikr: Partial<TasbihItem> = { count: 100, category: 'custom' };

  // إعدادات الدائرة
  radius = 54;
  circumference = 2 * Math.PI * this.radius;
  dashOffset = this.circumference;

  constructor() {}

  ngOnInit() {
    this.loadData();
    this.filterCategory('all');
    
    // تحديد أول عنصر نشط
    if (this.displayTasabeeh.length > 0) {
      this.setActive(this.displayTasabeeh[0]);
    }
  }

  ngOnDestroy() {
    this.saveData();
  }

  @HostListener('window:beforeunload')
  unloadHandler() {
    this.saveData();
  }

  // --- 1. منطق الفئات (Categories) ---
  filterCategory(cat: string) {
    this.activeCategory = cat;
    if (cat === 'all') {
      this.displayTasabeeh = this.allTasabeeh;
    } else {
      this.displayTasabeeh = this.allTasabeeh.filter(t => t.category === cat);
    }
    // تحديث العنصر النشط إذا اختفى من القائمة
    if (!this.displayTasabeeh.find(t => t.id === this.activeItem?.id)) {
      this.activeItem = this.displayTasabeeh[0] || null;
      this.updateRing();
    }
  }

  // --- 2. منطق العداد الذكي + السجل ---
  setActive(item: TasbihItem) {
    this.activeItem = item;
    this.updateRing();
  }

  tapSebha() {
    if (!this.activeItem) return;

    // زيادة العداد
    this.activeItem.current++;
    this.todayStats.totalCounts++;
    
    // تحديث الدائرة
    this.updateRing();
    
    // حفظ سريع
    this.saveData();

    // اهتزاز
    if (navigator.vibrate) navigator.vibrate(5);

    // التحقق من الهدف
    if (this.activeItem.current === this.activeItem.count) {
      this.todayStats.completedAwrad++;
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      // يمكن إضافة صوت أو تأثير هنا
    }
  }

  // أزرار التحكم (+10 / -1 / تصفير)
  adjustCount(amount: number) {
    if (!this.activeItem) return;
    const newVal = this.activeItem.current + amount;
    if (newVal >= 0) {
      this.activeItem.current = newVal;
      this.updateRing();
      this.saveData();
    }
  }

  resetCurrent() {
    if (this.activeItem) {
      this.activeItem.current = 0;
      this.updateRing();
      this.saveData();
    }
  }

  // --- 3. إضافة ذكر مخصص (Custom) ---
  addCustomDhikr() {
    const title = this.newDhikr.title?.trim();
    const count = Number(this.newDhikr.count);

    if (title && Number.isFinite(count) && count > 0) {
      const newItem: TasbihItem = {
        id: Date.now(), // ID فريد
        title,
        text: this.newDhikr.text?.trim() || title,
        count,
        current: 0,
        category: 'custom',
        source: 'مخصص',
        benefit: 'ذكر خاص',
        isCustom: true
      };
      
      this.allTasabeeh.push(newItem);
      this.filterCategory('custom'); // الانتقال لقائمة المخصص
      this.setActive(newItem);
      this.showAddModal = false;
      this.newDhikr = { count: 100, category: 'custom' }; // تصفير النموذج
      this.saveData();
    }
  }

  deleteCustomDhikr(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('هل تريد حذف هذا الذكر؟')) {
      this.allTasabeeh = this.allTasabeeh.filter(t => t.id !== id);
      this.filterCategory(this.activeCategory);
      this.saveData();
    }
  }

  // --- 4. المشاركة (Share) ---
  shareDhikr() {
    if (!this.activeItem) return;
    const text = `أذكركم بورد: ${this.activeItem.text} \n(العدد: ${this.activeItem.count}) \n\nمن تطبيق رمضانيات 🌙`;
    if (navigator.share) {
      navigator.share({ title: 'تذكير', text: text }).catch(console.error);
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        alert('تم نسخ النص للمشاركة');
      } else {
        alert(text);
      }
    }
  }

  // --- دوال مساعدة ---
  updateRing() {
    if (!this.activeItem) return;
    // حساب النسبة المئوية للدائرة (لا تتجاوز 100%)
    const progress = Math.min(this.activeItem.current / this.activeItem.count, 1);
    this.dashOffset = this.circumference - (progress * this.circumference);
  }

  getTasbihProgress(item: TasbihItem): number {
    return Math.min(100, Math.round((item.current / item.count) * 100));
  }

  isCompleted(item: TasbihItem): boolean {
    return item.current >= item.count;
  }

  // --- التخزين (Local Storage) ---
  saveData() {
    const data = {
      items: this.allTasabeeh,
      stats: this.todayStats,
      lastDate: new Date().toDateString()
    };
    localStorage.setItem('tasabeeh_v4_pro', JSON.stringify(data));
  }

  loadData() {
    const saved = localStorage.getItem('tasabeeh_v4_pro');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        
        // التحقق من اليوم الجديد لتصفير العدادات اليومية
        if (data.lastDate !== new Date().toDateString()) {
          // يوم جديد: نصفر العدادات الحالية، لكن نحتفظ بالأذكار المخصصة
          this.allTasabeeh = data.items.map((t: TasbihItem) => ({...t, current: 0}));
          this.todayStats = { date: new Date().toDateString(), totalCounts: 0, completedAwrad: 0 };
        } else {
          // نفس اليوم: استرجاع كل شيء
          this.allTasabeeh = data.items;
          this.todayStats = data.stats;
        }
      } catch {
        this.todayStats = { date: new Date().toDateString(), totalCounts: 0, completedAwrad: 0 };
      }
    }
  }
}
