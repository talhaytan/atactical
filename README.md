# ATAC Tactical Accessories Design Lab

ATAC, savunma sanayii standartlarında, milimetrik hassasiyet ve fütüristik mühendislik bütünlüğüyle çalışan, üst düzey taktik aksesuar ve özelleştirilebilir tabanca aksesuarları üreten bir ileri teknoloji tasarım atölyesidir. Bu depo, ATAC'ın geliştirdiği 3D interaktif ürün inceleme ve özelleştirme web uygulamasını barındırır.

---

## 🚀 Özellikler (Features)

*   **Real-time 3D Tabanca İnceleyici (WebGL/Three.js):** 3D WebGL ortamında, milimetrik detaylarla ve dinamik ışıklandırmayla tabanca modellerini inceleme imkanı.
*   **3D Taktik Şarjör Kapak Uygulaması:** Şarjör kapaklarının (MP-FLOWER.9) 3D detaylarını döndürerek ve yakınlaştırarak inceleyebileceğiniz etkileşimli WebGL alanı.
*   **Siber-Taktiksel Tasarım & Glassmorphism:** Derin siyah cam dokular, siber-mavi ışık vurguları ve modern tipografi (Cinzel, Outfit) ile donatılmış premium arayüz.
*   **3D Tilt & Sheen Hover Efektleri:** Fare imlecini takip eden 3D eğilme ve neon parlama efektleriyle zenginleştirilmiş etkileşimli kartlar.
*   **GSAP ScrollTrigger Animasyonları:** Sayfa aşağı kaydırıldığında metinlerin ve kartların yumuşak bir dikey süzülme ve opaklık geçişiyle (staggered) belirmesi.
*   **Akıllı "Başa Dön" Yüzen Butonu:** Sayfa en üstteyken gizlenen, aşağı kaydırıldığında ise siber-mavi neon hover efektleriyle beliren akıcı baştan başlatma butonu.
*   **Yerel Ağ (LAN) Test Desteği:** Güvenlik duvarı engellerini aşan `allowedDevOrigins` ve `0.0.0.0` host yapılandırması sayesinde mobil cihazlardan anında test imkanı.

---

## 🛠️ Kullanılan Teknolojiler (Tech Stack)

*   **Core:** [Next.js](https://nextjs.org/) (v16.2.6 - Turbopack) & [React](https://react.dev/) (v19)
*   **3D Grafik:** [Three.js](https://threejs.org/) (WebGL)
*   **Animasyon:** [GSAP](https://gsap.com/) & [ScrollTrigger](https://gsap.com/scrolltrigger/)
*   **Stil & Arayüz:** [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
*   **Dil:** [TypeScript](https://www.typescriptlang.org/)

---

## 📦 Kurulum ve Çalıştırma (Installation & Running)

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

1.  **Depoyu Klonlayın:**
    ```bash
    git clone https://github.com/KULLANICI_ADINIZ/PROJE_ADINIZ.git
    cd PROJE_ADINIZ
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Geliştirme Sunucusunu Başlatın (Local):**
    ```bash
    npm run dev
    ```
    *Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek uygulamayı açabilirsiniz.*

4.  **Yerel Ağda Çalıştırma (Mobil Testler için):**
    Yerel ağınızdaki diğer cihazlardan ve telefonlardan erişim sağlamak için sunucuyu tüm arayüzlerde başlatın:
    ```bash
    npx next dev -H 0.0.0.0
    ```
    *Daha sonra mobil tarayıcınızdan `http://BILGISAYAR_IP_ADRESINIZ:3000` (Örn: `http://192.168.1.134:3000`) adresine girerek test edebilirsiniz.*

---

## 🏗️ Üretim Derlemesi (Production Build)

Uygulamanın optimize edilmiş statik çıktısını almak için:

```bash
npm run build
```

Derleme işlemi tamamlandığında, `out/` klasörü altında deploy edilmeye hazır statik dosyalar oluşturulacaktır. Bu dosyaları GitHub Pages, Vercel, Netlify veya kendi sunucunuzda doğrudan barındırabilirsiniz.

---

## 📜 Lisans (License)

Bu proje **ATAC** kurumsal kimliğine ve **Emir Talha Aytan** tasarım haklarına tabidir. Tüm hakları saklıdir.
