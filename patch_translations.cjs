const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n/translations.ts', 'utf-8');

content = content.replace("about: 'Tentang',", "about: 'Tentang',\n      pricing: 'Harga',");
content = content.replace("about: 'About',", "about: 'About',\n      pricing: 'Pricing',");

const idNew = `    notfound: {
      title: '404',
      desc: 'Halaman yang Anda cari tidak ada.',
    },
    aboutPage: {
      title: 'Tentang Kami',
      heroTitle: 'Tempat rilisan musikmu menemukan jalannya.',
      heroDesc: 'Habis Rilis membantu artis membuat halaman rilisan yang sederhana, mudah dibagikan, dan tetap menjadi rumah untuk musik mereka.',
      whatTitle: 'Apa itu Habis Rilis?',
      whatDesc: 'Habis Rilis adalah platform untuk membuat halaman rilisan musik yang bisa dibagikan dengan mudah. Satu tempat untuk memperkenalkan lagu, artwork, cerita di baliknya, dan berbagai platform tempat musikmu bisa didengarkan.',
      whyTitle: 'Kenapa Habis Rilis?',
      whyDesc1: 'Karena setelah sebuah lagu dirilis, perjalanan musiknya belum selesai.',
      whyDesc2: 'Habis Rilis dibuat supaya artis tidak hanya punya link untuk membagikan lagu, tetapi juga punya ruang yang terasa seperti milik mereka sendiri.',
      howTitle: 'Bagaimana cara kerjanya?',
      step1: '01 — Buat',
      step1Desc: 'Buat halaman artis dan rilisanmu.',
      step2: '02 — Bagikan',
      step2Desc: 'Bagikan satu link ke teman, pendengar, dan media sosial.',
      step3: '03 — Temukan',
      step3Desc: 'Biarkan pendengar menemukan artis dan rilisanmu.',
      forArtistTitle: 'Dibuat untuk artis.',
      forArtistDesc: 'Fokus pada musikmu. Habis Rilis menangani ruang digital untuk setiap rilisan.',
      forListenerTitle: 'Dan untuk pendengar.',
      forListenerDesc: 'Temukan artis, ikuti rilisan mereka, dan simpan apa yang ingin kamu dengarkan lagi.',
      ctaTitle: 'Siap memperkenalkan rilisanmu?',
      createBtn: 'Buat halamanmu',
      exploreBtn: 'Jelajahi artis'
    },
    pricingPage: {
      title: 'Harga',
      heroTitle: 'Harga sederhana. Lebih banyak ruang untuk musikmu.',
      heroDesc: 'Pilih cara kamu menggunakan Habis Rilis.',
      artistTitle: 'ARTIST',
      artistDesc: 'Untuk artis yang ingin mengelola rilisan musiknya sendiri.',
      artistCta: 'Buat halamanmu',
      fanTitle: 'FAN',
      fanDesc: 'Untuk pendengar yang ingin menemukan dan mengikuti musik.',
      fanCta: 'Bergabung sebagai Fan',
      managerTitle: 'MANAGER',
      managerDesc: 'Untuk manager yang mengelola beberapa artis.',
      managerCta: 'Mulai Gratis',
      proTitle: 'MANAGER PRO',
      proDesc: 'Untuk manager yang membutuhkan ruang tanpa batas.',
      proHighlight: 'Terbaik untuk manager',
      proCta: 'Aktifkan Pro Gratis',
      promo: '🎁 GRATIS sampai 31 Desember 2026',
      promoDesc: 'Selama periode peluncuran, Manager Pro dapat diaktifkan tanpa biaya.',
      monthly: 'bulan',
      yearly: 'tahun',
      faq: {
        title: 'Pertanyaan yang Sering Diajukan',
        q1: 'Apakah Artist bisa membuat banyak artist?',
        a1: 'Tidak. Akun Artist digunakan untuk mengelola satu identitas artist. Namun, artist dapat membuat unlimited releases untuk artist tersebut.',
        q2: 'Apakah Manager Free bisa mengelola lebih dari 2 artist?',
        a2: 'Belum. Manager Free dapat mengelola maksimal 2 artist. Manager Pro memberikan unlimited artist.',
        q3: 'Apakah Fan bisa membuat halaman artist?',
        a3: 'Tidak. Fan hanya dapat browse, search, follow, dan share artist serta rilisan yang sudah tersedia.',
        q4: 'Apakah Manager Pro langsung berbayar?',
        a4: 'Selama periode launch, Manager Pro dapat diaktifkan gratis sampai 31 Desember 2026.'
      },
      comparison: {
        title: 'Perbandingan Fitur',
        features: 'Fitur',
        artistProfile: 'Profil Artist',
        releases: 'Rilisan',
        manageArtists: 'Kelola Artis',
        followers: 'Followers',
        search: 'Pencarian',
        followArtists: 'Ikuti Artis',
        fanDashboard: 'Fan Dashboard',
        socialShare: 'Social Sharing',
        oneProfile: '1 profil',
        twoArtists: '2 artis',
        unlimited: 'Unlimited'
      }
    }
  },`;

const enNew = `    notfound: {
      title: '404',
      desc: 'The page you\\'re looking for doesn\\'t exist.',
    },
    aboutPage: {
      title: 'About Us',
      heroTitle: 'Where your releases find their way.',
      heroDesc: 'Habis Rilis helps artists create simple, shareable release pages that give their music a place to live.',
      whatTitle: 'What is Habis Rilis?',
      whatDesc: 'Habis Rilis is a platform for creating simple, shareable music release pages. One place to introduce your song, artwork, the story behind it, and the platforms where people can listen.',
      whyTitle: 'Why Habis Rilis?',
      whyDesc1: 'Because a song\\'s journey doesn\\'t end when it is released.',
      whyDesc2: 'Habis Rilis was created so artists have more than just a link to share. They have a space that feels like their own.',
      howTitle: 'How does it work?',
      step1: '01 — Create',
      step1Desc: 'Create your artist and release page.',
      step2: '02 — Share',
      step2Desc: 'Share one link with listeners, friends, and social media.',
      step3: '03 — Discover',
      step3Desc: 'Let listeners discover your artists and releases.',
      forArtistTitle: 'Built for artists.',
      forArtistDesc: 'Focus on your music. Habis Rilis gives every release a simple digital home.',
      forListenerTitle: 'And for listeners.',
      forListenerDesc: 'Discover artists, follow their releases, and save what you want to listen to again.',
      ctaTitle: 'Ready to share your release?',
      createBtn: 'Create your page',
      exploreBtn: 'Explore artists'
    },
    pricingPage: {
      title: 'Pricing',
      heroTitle: 'Simple pricing. More room for your music.',
      heroDesc: 'Choose how you use Habis Rilis.',
      artistTitle: 'ARTIST',
      artistDesc: 'For artists who want to manage their own releases.',
      artistCta: 'Create your page',
      fanTitle: 'FAN',
      fanDesc: 'For listeners who want to discover and follow music.',
      fanCta: 'Join as Fan',
      managerTitle: 'MANAGER',
      managerDesc: 'For managers managing multiple artists.',
      managerCta: 'Start Free',
      proTitle: 'MANAGER PRO',
      proDesc: 'For managers who need unlimited room to grow.',
      proHighlight: 'Best for managers',
      proCta: 'Activate Pro Free',
      promo: '🎁 FREE until December 31, 2026',
      promoDesc: 'During the launch period, Manager Pro can be activated at no cost.',
      monthly: 'month',
      yearly: 'year',
      faq: {
        title: 'Frequently Asked Questions',
        q1: 'Can an Artist account create multiple artists?',
        a1: 'No. An Artist account is used to manage a single artist identity. However, the artist can create unlimited releases for that identity.',
        q2: 'Can Manager Free manage more than 2 artists?',
        a2: 'No. Manager Free can manage a maximum of 2 artists. Manager Pro provides unlimited artists.',
        q3: 'Can Fans create artist pages?',
        a3: 'No. Fans can only browse, search, follow, and share available artists and releases.',
        q4: 'Is Manager Pro immediately paid?',
        a4: 'During the launch period, Manager Pro can be activated for free until December 31, 2026.'
      },
      comparison: {
        title: 'Feature Comparison',
        features: 'Feature',
        artistProfile: 'Artist profile',
        releases: 'Releases',
        manageArtists: 'Manage artists',
        followers: 'Followers',
        search: 'Search',
        followArtists: 'Follow artists',
        fanDashboard: 'Fan Dashboard',
        socialShare: 'Social sharing',
        oneProfile: '1 profile',
        twoArtists: '2 artists',
        unlimited: 'Unlimited'
      }
    }
  }
};`;

content = content.replace(/    notfound: {[\s\S]*?},/, "    notfound: {\n      title: '404',\n      desc: 'Halaman yang Anda cari tidak ada.',\n    },");
content = content.replace(/    notfound: {[\s\S]*?}\n  },\n  en:/, idNew + "\n  en:");
content = content.replace(/    notfound: {[\s\S]*?}\n  }\n};/, enNew);

fs.writeFileSync('src/lib/i18n/translations.ts', content);
