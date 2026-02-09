import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai = new GoogleGenAI({ apiKey: environment.geminiApiKey });

  async analyzeRecitation(audioBlob: Blob): Promise<any> {
    const base64 = await this.blobToBase64(audioBlob);

    const prompt = `أنت معلم تجويد قرآن كريم خبير ومتخصص. سأرسل لك تسجيلاً صوتياً لشخص يتلو القرآن الكريم.

مهمتك بالتفصيل:
1. استمع للتلاوة بدقة وحوّلها لنص مكتوب (transcription) بالتشكيل الكامل.
2. حدد أي سورة وأي آيات يقرأها القارئ.
3. قيّم التلاوة من 100 بناءً على: صحة النطق، أحكام التجويد (إدغام، إخفاء، قلقلة، مد)، مخارج الحروف.
4. حدد كل خطأ بدقة مع ذكر الكلمة الخاطئة ونوع الخطأ ووصفه.
5. قدم نصيحة عملية واحدة للتحسين.

أجب بصيغة JSON فقط بدون أي نص إضافي:
{
  "transcription": "النص المسموع بالتشكيل",
  "surah": "اسم السورة",
  "verses": "أرقام الآيات",
  "score": 85,
  "mistakes": [
    {"type": "tajweed|pronunciation|missing|extra", "word": "الكلمة", "description": "وصف الخطأ بالعربية"}
  ],
  "feedback": "نصيحة واحدة مختصرة"
}`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'audio/webm', data: base64 } }
        ]
      }],
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}