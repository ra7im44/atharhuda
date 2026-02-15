import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KhatmaService } from '../../services/khatma.service';
import { CreateKhatmaModalComponent } from '../../components/create-khatma-modal/create-khatma-modal.component';
import { KhatmaCardComponent } from '../../components/khatma-card/khatma-card.component';

interface FeatureCard {
  id: string;
  title: string;
  desc: string;
  icon: string;
  route: string;
  gradient: string;
  iconColor: string;
  hoverColor: string;
  badge?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CreateKhatmaModalComponent, KhatmaCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private khatmaService = inject(KhatmaService);
  private router = inject(Router);

  searchQuery = signal('');
  showCreateModal = signal(false);
  currentYear = new Date().getFullYear();

  steps = [
    { num: '١', title: 'أنشئ الختمة', desc: 'أدخل اسم المتوفى وأنشئ ختمة مقسمة إلى 30 جزءاً بثوانٍ معدودة وبخطوة واحدة.' },
    { num: '٢', title: 'شارك الرابط', desc: 'انسخ رابط الختمة وأرسله لعائلتك وأصدقائك عبر الواتساب للمشاركة في التلاوة.' },
    { num: '٣', title: 'يصل الأجر', desc: 'يتشارك الجميع قراءة الأجزاء ليتموا الختمة ويهدوا ثوابها، ويبقى لك أجر الدلالة.' },
  ];

  features: FeatureCard[] = [
    {
      id: 'khatmat',
      title: 'الختمات الجماعية',
      desc: 'أنشئ ختمة قرآنية وشارك الأجر مع عائلتك وأحبابك. 30 جزءاً يُوزّع بين المشاركين.',
      icon: 'book',
      route: '/khatmat',
      gradient: 'from-primary via-secondary to-primary',
      iconColor: 'text-primary',
      hoverColor: 'group-hover:text-primary',
      badge: 'الأكثر استخداماً'
    },
    {
      id: 'coach',
      title: 'المصحّح الذكي',
      desc: 'سجّل تلاوتك واحصل على تقييم فوري بالذكاء الاصطناعي مع ملاحظات تجويدية دقيقة.',
      icon: 'mic',
      route: '/coach',
      gradient: 'from-info to-primary',
      iconColor: 'text-info',
      hoverColor: 'group-hover:text-info',
      badge: 'AI'
    },
    {
      id: 'duas',
      title: 'أدعية للمتوفى',
      desc: 'أدعية مختارة من القرآن الكريم والسنة النبوية الصحيحة للدعاء لأمواتنا.',
      icon: 'heart',
      route: '/duas',
      gradient: 'from-accent to-secondary',
      iconColor: 'text-accent',
      hoverColor: 'group-hover:text-accent'
    },
    {
      id: 'tasabeeh',
      title: 'التسابيح والأذكار',
      desc: 'سبحة إلكترونية متطورة مع عداد ذكي وإحصائيات يومية لأذكارك وتسابيحك.',
      icon: 'counter',
      route: '/tasabeeh',
      gradient: 'from-secondary to-accent',
      iconColor: 'text-secondary',
      hoverColor: 'group-hover:text-secondary'
    },
    {
      id: 'ramadan',
      title: 'رمضانيات',
      desc: 'أدعية وأذكار يومية ومهام الورد وفقه الصيام والعشر الأواخر ومكتبة رمضانية شاملة.',
      icon: 'moon',
      route: '/ramadan',
      gradient: 'from-amber-500 to-orange-500',
      iconColor: 'text-amber-500',
      hoverColor: 'group-hover:text-amber-500',
      badge: 'موسمي'
    }
  ];

  dailyVerse = {
    text: '﴿ وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ﴾',
    surah: 'البقرة: ١٨٦'
  };

  statsData = computed(() => {
    const khatmas = this.khatmaService.khatmas();
    const totalKhatmas = khatmas.length;
    const totalCompleted = khatmas.reduce((s, k) => s + k.parts.filter(p => p.status === 'completed').length, 0);
    const participants = new Set<string>();
    khatmas.forEach(k => k.parts.forEach(p => {
      if (p.completedBy) participants.add(p.completedBy);
      if (p.reservedBy) participants.add(p.reservedBy);
    }));

    const totalParticipants = participants.size;

    return [
      { value: totalKhatmas, label: 'ختمة جارية', color: 'text-primary', delay: '0ms' },
      { value: totalCompleted, label: 'جزء مقروء', color: 'text-txt', delay: '100ms' },
      { value: totalParticipants, label: 'مشارك بالأجر', color: 'text-accent', delay: '200ms' },
    ];
  });

  hasNoKhatmas = computed(() => this.khatmaService.khatmas().length === 0);

  filteredKhatmas = computed(() => {
    const all = this.khatmaService.khatmas();
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return all;
    return all.filter(k =>
      k.title.toLowerCase().includes(query) ||
      (k.deceasedName && k.deceasedName.toLowerCase().includes(query)) ||
      k.createdBy.toLowerCase().includes(query)
    );
  });

  onKhatmaCreated(id: string) {
    this.router.navigate(['/khatmat', id]);
  }
}
