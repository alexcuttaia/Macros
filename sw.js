/* Service worker di MACRO'S (versione pubblicata su GitHub Pages).

   Strategie, una per tipo di file:
   - App (pagina, CSS, codice, librerie, caratteri, manifest, icone): cache della versione, scaricata all'installazione.
     Si apre subito e anche senza rete. I file con l'impronta nel nome (app.3f2a….js) non cambiano mai:
     a una nuova versione si riscaricano solo quelli nuovi, gli altri si copiano dalla cache precedente.
     Poi l'app propone «Aggiorna» (js/app/pwa.js): niente ricariche a sorpresa.
   - Foto (photos/*.webp, anche loro con l'impronta): dalla cache se ci sono, altrimenti dalla rete e
     salvate. Logo e icone delle categorie arrivano con l'app; le altre quando una schermata le mostra o,
     con wi-fi e senza risparmio dati, in sottofondo (messaggio 'warm-photos'). La cache contiene solo le
     foto della versione attuale: non cresce senza limite. Senza rete una foto mai vista dà errore e l'app
     mostra al suo posto il disegno del piatto (js/core/food-art.js).
   - Librerie da CDN (Leaflet, lettori QR): dalla cache, aggiornati in sottofondo,
     con un numero massimo di file.
   - Mappe, indirizzi, percorsi, pagamenti, salvataggio online: sempre dalla rete, mai in cache.
   - Notifiche dell'ordine: toccandone una si apre (o si porta davanti) l'app su quell'ordine.
   - Notifiche push (curiosità, dal server anche ad app chiusa): si mostrano all'arrivo, e la curiosità si salva in
     cache così si apre anche senza rete; toccandone una si apre l'app su quella curiosità e il tocco si segnala al
     server senza mai ritardare l'apertura. Curiosità (curiosita/<id>.json): dalla rete, senza rete dalla cache.

   VERSION e gli elenchi qui sotto li scrive tools/build_artifact.py a ogni build. */
'use strict';

const VERSION = "7cb3badef5";
const APP_CACHE = 'macros-app-' + VERSION;
const PHOTO_CACHE = 'macros-photos';
const LIB_CACHE = 'macros-lib-v1';
const LIB_MAX = 40;
const CURIOSITY_CACHE = 'macros-curiosita';
const CURIOSITY_MAX = 60;
const PUSH_CACHE = 'macros-push';   // configurazione per i rinnovi della subscription (dalla pagina), separata dalle curiosità
const PUSH_CONFIG_URL = 'push-config';
const APP_FILES = ["./","./app.3853b4b351.css","./app.657aa05439.js","./lottie_light.min.0b26510b44.js","./fonts/inter-latin.1dc044f482.woff2","./fonts/poppins-500-latin.bba020c0fd.woff2","./fonts/poppins-600-latin.fffe793f52.woff2","./fonts/poppins-700-latin.6af69d307c.woff2","./fonts/poppins-800-latin.4fe5f87dec.woff2","./manifest.webmanifest","./icons/icon-192.png?v=8a72ef3b","./icons/icon-512.png?v=8a72ef3b","./icons/icon-maskable-512.png?v=8a72ef3b","./icons/apple-touch-icon.png?v=8a72ef3b","./icons/favicon-32.png?v=8a72ef3b","./icons/favicon-192.png?v=8a72ef3b","./icons/favicon.ico?v=8a72ef3b"];
const SHELL_PHOTOS = ["./photos/cat-carb.d6aafd03bc.webp","./photos/cat-drink.dd133261d2.webp","./photos/cat-fat.527f1a9e1e.webp","./photos/cat-fruit.33cf301d8e.webp","./photos/cat-meal.8e742f804a.webp","./photos/cat-protein.1e7fd87c86.webp","./photos/cat-sauce.9c40793f10.webp","./photos/cat-supplement.2558bb77df.webp","./photos/cat-veg.cee4224480.webp","./photos/elevate-black.7ebf8b8889.webp","./photos/elevate-white.f1cf701fd0.webp","./photos/fam-affett.61b18d13b3.webp","./photos/fam-carne.bb56d778c7.webp","./photos/fam-cereali.bc68124eb9.webp","./photos/fam-latt.81c6c389ae.webp","./photos/fam-pane.833cef53d5.webp","./photos/fam-pasta.307e7f6ce1.webp","./photos/fam-patate.308191299c.webp","./photos/fam-pesce.fcad2d2229.webp","./photos/fam-pollo.7a880c5141.webp","./photos/fam-riso.7bfb702b25.webp","./photos/fam-smoothie.c4343143b2.webp","./photos/fam-uova.128b6f242a.webp","./photos/fam-veg.10e46c4cdf.webp","./photos/logo-dark.9d31087c56.webp","./photos/logo-full-dark.317f6ea02b.webp","./photos/logo-full-light.b544c2ebba.webp","./photos/logo-light.3633b877c7.webp","./photos/logo-mark-dark.8eaa3fb51a.webp","./photos/logo-mark-light.95ed028148.webp"];
const PHOTOS = ["./photos/b1.4f5013ab17.s.webp","./photos/b1.4f5013ab17.webp","./photos/b10.5bd526c431.s.webp","./photos/b10.5bd526c431.webp","./photos/b2.488da469dc.s.webp","./photos/b2.488da469dc.webp","./photos/b3.70993a308c.s.webp","./photos/b3.70993a308c.webp","./photos/b5.4debabf779.s.webp","./photos/b5.4debabf779.webp","./photos/b6.f5297cf2f5.s.webp","./photos/b6.f5297cf2f5.webp","./photos/b7.2ba51e06ab.s.webp","./photos/b7.2ba51e06ab.webp","./photos/b8.e7949a86e6.s.webp","./photos/b8.e7949a86e6.webp","./photos/b9-green.4faba7dedc.s.webp","./photos/b9-green.4faba7dedc.webp","./photos/b9-mango.9304c5afd8.s.webp","./photos/b9-mango.9304c5afd8.webp","./photos/b9-paradise.0bad236374.s.webp","./photos/b9-paradise.0bad236374.webp","./photos/b9-rubyred.e33b406b16.s.webp","./photos/b9-rubyred.e33b406b16.webp","./photos/b9-strawberry.feff769d4b.s.webp","./photos/b9-strawberry.feff769d4b.webp","./photos/b9-watermelon.d9f14fe9c1.s.webp","./photos/b9-watermelon.d9f14fe9c1.webp","./photos/b9-white.0a3d8c3c58.s.webp","./photos/b9-white.0a3d8c3c58.webp","./photos/c1.d2821b9229.s.webp","./photos/c1.d2821b9229.webp","./photos/c10.0d321bf44c.s.webp","./photos/c10.0d321bf44c.webp","./photos/c11.9bf87ad256.s.webp","./photos/c11.9bf87ad256.webp","./photos/c12.03e916e18c.s.webp","./photos/c12.03e916e18c.webp","./photos/c13.25e37d1c0b.s.webp","./photos/c13.25e37d1c0b.webp","./photos/c14.e439b8740a.s.webp","./photos/c14.e439b8740a.webp","./photos/c15-penne.4a414ea345.s.webp","./photos/c15-penne.4a414ea345.webp","./photos/c15-rigatoni.94d522ce99.s.webp","./photos/c15-rigatoni.94d522ce99.webp","./photos/c15-spaghetti.7cb62a070c.s.webp","./photos/c15-spaghetti.7cb62a070c.webp","./photos/c16.9f865ebb07.s.webp","./photos/c16.9f865ebb07.webp","./photos/c17.7d0985fb7c.s.webp","./photos/c17.7d0985fb7c.webp","./photos/c18.800fcc94c5.s.webp","./photos/c18.800fcc94c5.webp","./photos/c19.c403bb8ea1.s.webp","./photos/c19.c403bb8ea1.webp","./photos/c2.bff544edf0.s.webp","./photos/c2.bff544edf0.webp","./photos/c20.e85d6524a9.s.webp","./photos/c20.e85d6524a9.webp","./photos/c21.6667c39980.s.webp","./photos/c21.6667c39980.webp","./photos/c22.ce85873978.s.webp","./photos/c22.ce85873978.webp","./photos/c23.5888b74e77.s.webp","./photos/c23.5888b74e77.webp","./photos/c24.dd223b3280.s.webp","./photos/c24.dd223b3280.webp","./photos/c25.d60b89434f.s.webp","./photos/c25.d60b89434f.webp","./photos/c3.c68cfd0312.s.webp","./photos/c3.c68cfd0312.webp","./photos/c4-penne.a6b90f2646.s.webp","./photos/c4-penne.a6b90f2646.webp","./photos/c4-rigatoni.f089a00c25.s.webp","./photos/c4-rigatoni.f089a00c25.webp","./photos/c4-spaghetti.6e4f017ee3.s.webp","./photos/c4-spaghetti.6e4f017ee3.webp","./photos/c5.6964193467.s.webp","./photos/c5.6964193467.webp","./photos/c7.2c22c307c9.s.webp","./photos/c7.2c22c307c9.webp","./photos/cat-carb.d6aafd03bc.s.webp","./photos/cat-carb.d6aafd03bc.webp","./photos/cat-drink.dd133261d2.s.webp","./photos/cat-drink.dd133261d2.webp","./photos/cat-fat.527f1a9e1e.s.webp","./photos/cat-fat.527f1a9e1e.webp","./photos/cat-fruit.33cf301d8e.s.webp","./photos/cat-fruit.33cf301d8e.webp","./photos/cat-meal.8e742f804a.s.webp","./photos/cat-meal.8e742f804a.webp","./photos/cat-protein.1e7fd87c86.s.webp","./photos/cat-protein.1e7fd87c86.webp","./photos/cat-sauce.9c40793f10.s.webp","./photos/cat-sauce.9c40793f10.webp","./photos/cat-supplement.2558bb77df.s.webp","./photos/cat-supplement.2558bb77df.webp","./photos/cat-veg.cee4224480.s.webp","./photos/cat-veg.cee4224480.webp","./photos/cd1.ac9da26746.s.webp","./photos/cd1.ac9da26746.webp","./photos/cd10.15398112f1.s.webp","./photos/cd10.15398112f1.webp","./photos/cd2.551be3615b.s.webp","./photos/cd2.551be3615b.webp","./photos/cd3.d334ec2541.s.webp","./photos/cd3.d334ec2541.webp","./photos/cd4.6e60cbcf94.s.webp","./photos/cd4.6e60cbcf94.webp","./photos/cd5.b3ff29d095.s.webp","./photos/cd5.b3ff29d095.webp","./photos/cd6.941308cafb.s.webp","./photos/cd6.941308cafb.webp","./photos/cd7.8353ca863e.s.webp","./photos/cd7.8353ca863e.webp","./photos/cd8.c56f0fc6c6.s.webp","./photos/cd8.c56f0fc6c6.webp","./photos/cd9.8444bf8000.s.webp","./photos/cd9.8444bf8000.webp","./photos/coppetta.df546e0f4f.s.webp","./photos/coppetta.df546e0f4f.webp","./photos/d1.8a3baae9a2.s.webp","./photos/d1.8a3baae9a2.webp","./photos/d2-caffe.b05e488dac.s.webp","./photos/d2-caffe.b05e488dac.webp","./photos/d2-cioccolato.5934359acb.s.webp","./photos/d2-cioccolato.5934359acb.webp","./photos/d2-fragola.cff5ecfb00.s.webp","./photos/d2-fragola.cff5ecfb00.webp","./photos/d2-nocciola.d803ff1cc9.s.webp","./photos/d2-nocciola.d803ff1cc9.webp","./photos/d2-pistacchio.7ebb09aa0c.s.webp","./photos/d2-pistacchio.7ebb09aa0c.webp","./photos/d2-vaniglia.afcee3dcc4.s.webp","./photos/d2-vaniglia.afcee3dcc4.webp","./photos/d2.5934359acb.s.webp","./photos/d2.5934359acb.webp","./photos/d3.48d6468485.s.webp","./photos/d3.48d6468485.webp","./photos/d4.85b14627f9.s.webp","./photos/d4.85b14627f9.webp","./photos/d5-carota.450bb4b81c.s.webp","./photos/d5-carota.450bb4b81c.webp","./photos/d5-chocnoc.f936492bb6.s.webp","./photos/d5-chocnoc.f936492bb6.webp","./photos/d5-classico.3e0e103cec.s.webp","./photos/d5-classico.3e0e103cec.webp","./photos/d5-vanchoc.686545a430.s.webp","./photos/d5-vanchoc.686545a430.webp","./photos/elevate-black.7ebf8b8889.s.webp","./photos/elevate-black.7ebf8b8889.webp","./photos/elevate-white.f1cf701fd0.s.webp","./photos/elevate-white.f1cf701fd0.webp","./photos/f1.73296bf93e.s.webp","./photos/f1.73296bf93e.webp","./photos/f10.8096ef161e.s.webp","./photos/f10.8096ef161e.webp","./photos/f11.d0b95bef8f.s.webp","./photos/f11.d0b95bef8f.webp","./photos/f12.3255e8d202.s.webp","./photos/f12.3255e8d202.webp","./photos/f13.321eb6db4f.s.webp","./photos/f13.321eb6db4f.webp","./photos/f14.44e921ac3f.s.webp","./photos/f14.44e921ac3f.webp","./photos/f15.77be4596d9.s.webp","./photos/f15.77be4596d9.webp","./photos/f2.8d05a1d3ea.s.webp","./photos/f2.8d05a1d3ea.webp","./photos/f3.63518d554c.s.webp","./photos/f3.63518d554c.webp","./photos/f4.f4a5f2fd99.s.webp","./photos/f4.f4a5f2fd99.webp","./photos/f6.3e43c984cf.s.webp","./photos/f6.3e43c984cf.webp","./photos/f8.ab8bea5a76.s.webp","./photos/f8.ab8bea5a76.webp","./photos/f9.5625d35eb0.s.webp","./photos/f9.5625d35eb0.webp","./photos/fam-affett.61b18d13b3.s.webp","./photos/fam-affett.61b18d13b3.webp","./photos/fam-carne.bb56d778c7.s.webp","./photos/fam-carne.bb56d778c7.webp","./photos/fam-cereali.bc68124eb9.s.webp","./photos/fam-cereali.bc68124eb9.webp","./photos/fam-latt.81c6c389ae.s.webp","./photos/fam-latt.81c6c389ae.webp","./photos/fam-pane.833cef53d5.s.webp","./photos/fam-pane.833cef53d5.webp","./photos/fam-pasta.307e7f6ce1.s.webp","./photos/fam-pasta.307e7f6ce1.webp","./photos/fam-patate.308191299c.s.webp","./photos/fam-patate.308191299c.webp","./photos/fam-pesce.fcad2d2229.s.webp","./photos/fam-pesce.fcad2d2229.webp","./photos/fam-pollo.7a880c5141.s.webp","./photos/fam-pollo.7a880c5141.webp","./photos/fam-riso.7bfb702b25.s.webp","./photos/fam-riso.7bfb702b25.webp","./photos/fam-smoothie.c4343143b2.s.webp","./photos/fam-smoothie.c4343143b2.webp","./photos/fam-uova.128b6f242a.s.webp","./photos/fam-uova.128b6f242a.webp","./photos/fam-veg.10e46c4cdf.s.webp","./photos/fam-veg.10e46c4cdf.webp","./photos/fr1.ef6ee7a275.s.webp","./photos/fr1.ef6ee7a275.webp","./photos/fr2.b79f9107d9.s.webp","./photos/fr2.b79f9107d9.webp","./photos/fr4.76dc849d61.s.webp","./photos/fr4.76dc849d61.webp","./photos/fr5.d7596fcad1.s.webp","./photos/fr5.d7596fcad1.webp","./photos/fr6.dcf1836ba0.s.webp","./photos/fr6.dcf1836ba0.webp","./photos/fr7.ad91b5c644.s.webp","./photos/fr7.ad91b5c644.webp","./photos/fr8.dde01fd903.s.webp","./photos/fr8.dde01fd903.webp","./photos/gusto-jbisc.1c6da87b3d.s.webp","./photos/gusto-jbisc.1c6da87b3d.webp","./photos/gusto-jcar.a8e2e4d1ed.s.webp","./photos/gusto-jcar.a8e2e4d1ed.webp","./photos/gusto-jchoc.b957ff9040.s.webp","./photos/gusto-jchoc.b957ff9040.webp","./photos/gusto-jcoco.d1ff722349.s.webp","./photos/gusto-jcoco.d1ff722349.webp","./photos/gusto-jfrag.5462eab7e8.s.webp","./photos/gusto-jfrag.5462eab7e8.webp","./photos/gusto-jnoc.aa99a4fe73.s.webp","./photos/gusto-jnoc.aa99a4fe73.webp","./photos/gusto-jpb.2ea6d18f80.s.webp","./photos/gusto-jpb.2ea6d18f80.webp","./photos/gusto-jstra.9c608ec8ce.s.webp","./photos/gusto-jstra.9c608ec8ce.webp","./photos/gusto-jvan.edab0ed4e5.s.webp","./photos/gusto-jvan.edab0ed4e5.webp","./photos/gusto-jwchoc.48256d6524.s.webp","./photos/gusto-jwchoc.48256d6524.webp","./photos/logo-dark.9d31087c56.s.webp","./photos/logo-dark.9d31087c56.webp","./photos/logo-full-dark.317f6ea02b.s.webp","./photos/logo-full-dark.317f6ea02b.webp","./photos/logo-full-light.b544c2ebba.s.webp","./photos/logo-full-light.b544c2ebba.webp","./photos/logo-light.3633b877c7.s.webp","./photos/logo-light.3633b877c7.webp","./photos/logo-mark-dark.8eaa3fb51a.s.webp","./photos/logo-mark-dark.8eaa3fb51a.webp","./photos/logo-mark-light.95ed028148.s.webp","./photos/logo-mark-light.95ed028148.webp","./photos/m1.0baeccc3bf.s.webp","./photos/m1.0baeccc3bf.webp","./photos/m10.2f5feca0c7.s.webp","./photos/m10.2f5feca0c7.webp","./photos/m11.c6204abd0c.s.webp","./photos/m11.c6204abd0c.webp","./photos/m12.c1b4bdb60f.s.webp","./photos/m12.c1b4bdb60f.webp","./photos/m13.b5d870f2b5.s.webp","./photos/m13.b5d870f2b5.webp","./photos/m14.bec9ebf435.s.webp","./photos/m14.bec9ebf435.webp","./photos/m15.c5ea3fdccf.s.webp","./photos/m15.c5ea3fdccf.webp","./photos/m16.2a9c3dfc89.s.webp","./photos/m16.2a9c3dfc89.webp","./photos/m17.2d43a4148c.s.webp","./photos/m17.2d43a4148c.webp","./photos/m2.0ef552466a.s.webp","./photos/m2.0ef552466a.webp","./photos/m3.d75445f352.s.webp","./photos/m3.d75445f352.webp","./photos/m4.5ab6cc9f3b.s.webp","./photos/m4.5ab6cc9f3b.webp","./photos/m5.ba9cf33dbe.s.webp","./photos/m5.ba9cf33dbe.webp","./photos/m7.fa18f6d9a6.s.webp","./photos/m7.fa18f6d9a6.webp","./photos/p1.ea290fecd0.s.webp","./photos/p1.ea290fecd0.webp","./photos/p10.61a26d053c.s.webp","./photos/p10.61a26d053c.webp","./photos/p11.d841fd76fd.s.webp","./photos/p11.d841fd76fd.webp","./photos/p12.83ba046b7c.s.webp","./photos/p12.83ba046b7c.webp","./photos/p14.124ade72e5.s.webp","./photos/p14.124ade72e5.webp","./photos/p15.ee8cd130a0.s.webp","./photos/p15.ee8cd130a0.webp","./photos/p16.1b51259b32.s.webp","./photos/p16.1b51259b32.webp","./photos/p17.8741eb99fa.s.webp","./photos/p17.8741eb99fa.webp","./photos/p18.453a142871.s.webp","./photos/p18.453a142871.webp","./photos/p19.e52e2e4f99.s.webp","./photos/p19.e52e2e4f99.webp","./photos/p2.90b0a0b4c8.s.webp","./photos/p2.90b0a0b4c8.webp","./photos/p20.06b6a23d39.s.webp","./photos/p20.06b6a23d39.webp","./photos/p21.b77c133992.s.webp","./photos/p21.b77c133992.webp","./photos/p22.3e212fb640.s.webp","./photos/p22.3e212fb640.webp","./photos/p23.5ff2b570f0.s.webp","./photos/p23.5ff2b570f0.webp","./photos/p24.636a5e064b.s.webp","./photos/p24.636a5e064b.webp","./photos/p25.91e305903b.s.webp","./photos/p25.91e305903b.webp","./photos/p26.162072de67.s.webp","./photos/p26.162072de67.webp","./photos/p27.62e29a15a8.s.webp","./photos/p27.62e29a15a8.webp","./photos/p30.aa60cb2153.s.webp","./photos/p30.aa60cb2153.webp","./photos/p4.01e6c95c55.s.webp","./photos/p4.01e6c95c55.webp","./photos/p5.9765eea6db.s.webp","./photos/p5.9765eea6db.webp","./photos/p6.e848f8fc94.s.webp","./photos/p6.e848f8fc94.webp","./photos/p7.3931afd0f0.s.webp","./photos/p7.3931afd0f0.webp","./photos/p8-sode.06add8e3d0.s.webp","./photos/p8-sode.06add8e3d0.webp","./photos/p8-strapazzate.718cda5731.s.webp","./photos/p8-strapazzate.718cda5731.webp","./photos/p8.daf5c7670f.s.webp","./photos/p8.daf5c7670f.webp","./photos/p9.5b85eb58c9.s.webp","./photos/p9.5b85eb58c9.webp","./photos/s1.9a17d5d403.s.webp","./photos/s1.9a17d5d403.webp","./photos/s2.79e25fbcff.s.webp","./photos/s2.79e25fbcff.webp","./photos/s3.5328590be3.s.webp","./photos/s3.5328590be3.webp","./photos/s4.a44da41b3b.s.webp","./photos/s4.a44da41b3b.webp","./photos/s5.f914e2ae5c.s.webp","./photos/s5.f914e2ae5c.webp","./photos/s7.60b4ea6932.s.webp","./photos/s7.60b4ea6932.webp","./photos/s8.afa4e7ccdb.s.webp","./photos/s8.afa4e7ccdb.webp","./photos/smoothie-cas-jbisc.ff1979d072.s.webp","./photos/smoothie-cas-jbisc.ff1979d072.webp","./photos/smoothie-cas-jfrag.7294c30cde.s.webp","./photos/smoothie-cas-jfrag.7294c30cde.webp","./photos/smoothie-cas-jstra.4a3dbc831f.s.webp","./photos/smoothie-cas-jstra.4a3dbc831f.webp","./photos/smoothie-cas-jvan.e4b9a142ac.s.webp","./photos/smoothie-cas-jvan.e4b9a142ac.webp","./photos/smoothie-iso-jbisc.ff1979d072.s.webp","./photos/smoothie-iso-jbisc.ff1979d072.webp","./photos/smoothie-iso-jcar.6136d9d150.s.webp","./photos/smoothie-iso-jcar.6136d9d150.webp","./photos/smoothie-iso-jchoc.13a4824e8e.s.webp","./photos/smoothie-iso-jchoc.13a4824e8e.webp","./photos/smoothie-iso-jcoco.420c7b80c1.s.webp","./photos/smoothie-iso-jcoco.420c7b80c1.webp","./photos/smoothie-iso-jnoc.d99fd74514.s.webp","./photos/smoothie-iso-jnoc.d99fd74514.webp","./photos/smoothie-iso-jpb.3feba97ffe.s.webp","./photos/smoothie-iso-jpb.3feba97ffe.webp","./photos/smoothie-iso-jvan.e4b9a142ac.s.webp","./photos/smoothie-iso-jvan.e4b9a142ac.webp","./photos/smoothie-iso-jwchoc.c422a9f898.s.webp","./photos/smoothie-iso-jwchoc.c422a9f898.webp","./photos/sup22-jbisc.7db64e5510.s.webp","./photos/sup22-jbisc.7db64e5510.webp","./photos/sup22-jcar.24fdf36f55.s.webp","./photos/sup22-jcar.24fdf36f55.webp","./photos/sup22-jchoc.319775d3bf.s.webp","./photos/sup22-jchoc.319775d3bf.webp","./photos/sup22-jcoco.abe4983585.s.webp","./photos/sup22-jcoco.abe4983585.webp","./photos/sup22-jnoc.a5bddcf77a.s.webp","./photos/sup22-jnoc.a5bddcf77a.webp","./photos/sup22-jpb.3926b45cf1.s.webp","./photos/sup22-jpb.3926b45cf1.webp","./photos/sup22-jvan.ff5214031d.s.webp","./photos/sup22-jvan.ff5214031d.webp","./photos/sup22-jwchoc.f567b120f7.s.webp","./photos/sup22-jwchoc.f567b120f7.webp","./photos/sup23-jbisc.702a08c7b9.s.webp","./photos/sup23-jbisc.702a08c7b9.webp","./photos/sup23-jcar.9719d0d099.s.webp","./photos/sup23-jcar.9719d0d099.webp","./photos/sup23-jchoc.d7fe6b78c2.s.webp","./photos/sup23-jchoc.d7fe6b78c2.webp","./photos/sup23-jcoco.83dac31500.s.webp","./photos/sup23-jcoco.83dac31500.webp","./photos/sup23-jnoc.bd97c27c25.s.webp","./photos/sup23-jnoc.bd97c27c25.webp","./photos/sup23-jpb.c3173c6218.s.webp","./photos/sup23-jpb.c3173c6218.webp","./photos/sup23-jvan.41ca558ddc.s.webp","./photos/sup23-jvan.41ca558ddc.webp","./photos/sup23-jwchoc.364d086333.s.webp","./photos/sup23-jwchoc.364d086333.webp","./photos/sup24-jbisc.6bf8af8730.s.webp","./photos/sup24-jbisc.6bf8af8730.webp","./photos/sup24-jfrag.ecf147271f.s.webp","./photos/sup24-jfrag.ecf147271f.webp","./photos/sup24-jstra.f31bad1d2d.s.webp","./photos/sup24-jstra.f31bad1d2d.webp","./photos/sup24-jvan.f6e0453180.s.webp","./photos/sup24-jvan.f6e0453180.webp","./photos/sup25.9ac462b280.s.webp","./photos/sup25.9ac462b280.webp","./photos/sup26.a98bcc1a8d.s.webp","./photos/sup26.a98bcc1a8d.webp","./photos/sup27.4b0ce2f5c5.s.webp","./photos/sup27.4b0ce2f5c5.webp","./photos/sup28.a3f7fc5207.s.webp","./photos/sup28.a3f7fc5207.webp","./photos/sup29.627174dc2b.s.webp","./photos/sup29.627174dc2b.webp","./photos/sup30.3220b8a3b8.s.webp","./photos/sup30.3220b8a3b8.webp","./photos/sup31.cfe45b5f4c.s.webp","./photos/sup31.cfe45b5f4c.webp","./photos/sup32.bb09a3445e.s.webp","./photos/sup32.bb09a3445e.webp","./photos/sup33.542e7ca19a.s.webp","./photos/sup33.542e7ca19a.webp","./photos/sup34.50dbca8a7d.s.webp","./photos/sup34.50dbca8a7d.webp","./photos/sup35.e33a8a97a4.s.webp","./photos/sup35.e33a8a97a4.webp","./photos/sup36.e6c6ea9641.s.webp","./photos/sup36.e6c6ea9641.webp","./photos/sup37.c939bc5632.s.webp","./photos/sup37.c939bc5632.webp","./photos/sup38.06948bdeed.s.webp","./photos/sup38.06948bdeed.webp","./photos/sup39.fcd50a3465.s.webp","./photos/sup39.fcd50a3465.webp","./photos/sup40.f627798f9b.s.webp","./photos/sup40.f627798f9b.webp","./photos/sup41.440abcfd9c.s.webp","./photos/sup41.440abcfd9c.webp","./photos/sup42.fd1c10c51c.s.webp","./photos/sup42.fd1c10c51c.webp","./photos/sup43.83db4cf3e9.s.webp","./photos/sup43.83db4cf3e9.webp","./photos/sup44.705b70a682.s.webp","./photos/sup44.705b70a682.webp","./photos/sup45.88a05efab1.s.webp","./photos/sup45.88a05efab1.webp","./photos/sup46.52d84c6149.s.webp","./photos/sup46.52d84c6149.webp","./photos/sup47.8e51896514.s.webp","./photos/sup47.8e51896514.webp","./photos/sup48.5f329ef47a.s.webp","./photos/sup48.5f329ef47a.webp","./photos/sup49.bb824090ca.s.webp","./photos/sup49.bb824090ca.webp","./photos/sup50.29b30ecbe1.s.webp","./photos/sup50.29b30ecbe1.webp","./photos/sup51.65307233e7.s.webp","./photos/sup51.65307233e7.webp","./photos/sup52.02eb496273.s.webp","./photos/sup52.02eb496273.webp","./photos/sup53.4656a23ccb.s.webp","./photos/sup53.4656a23ccb.webp","./photos/sup54.d972d52421.s.webp","./photos/sup54.d972d52421.webp","./photos/sup55.f909709b30.s.webp","./photos/sup55.f909709b30.webp","./photos/sy1.daf8d6fbad.s.webp","./photos/sy1.daf8d6fbad.webp","./photos/sy2.b8dd68506b.s.webp","./photos/sy2.b8dd68506b.webp","./photos/sy3.d16b064987.s.webp","./photos/sy3.d16b064987.webp","./photos/sy4.a14c63107a.s.webp","./photos/sy4.a14c63107a.webp","./photos/v10.41512818c2.s.webp","./photos/v10.41512818c2.webp","./photos/v11.70a80c9faf.s.webp","./photos/v11.70a80c9faf.webp","./photos/v3.1aa1e7316c.s.webp","./photos/v3.1aa1e7316c.webp","./photos/v4.202b9d51b6.s.webp","./photos/v4.202b9d51b6.webp","./photos/v5.53008f4e43.s.webp","./photos/v5.53008f4e43.webp","./photos/v6.bf59c7ff4a.s.webp","./photos/v6.bf59c7ff4a.webp","./photos/v7.bf173d450c.s.webp","./photos/v7.bf173d450c.webp","./photos/v8.88645e7261.s.webp","./photos/v8.88645e7261.webp","./photos/v9.2d4b4f8db3.s.webp","./photos/v9.2d4b4f8db3.webp"];
const LIB_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net'];
const SCOPE = new URL('./', self.location.href);
const IS_HASHED = /\.[0-9a-f]{10}\.(?:js|css|webp|woff2)$/;

const abs = rel=> new URL(rel, SCOPE).href;

/* Un file della nuova versione: se ha l'impronta nel nome ed è già in una cache, lo si riusa; altrimenti
   dalla rete, saltando la cache HTTP (GitHub Pages la tiene 10 minuti: si rischierebbe una pagina vecchia) */
async function precache(cache, rel){
  const url = abs(rel);
  if(IS_HASHED.test(new URL(url).pathname)){
    const hit = await caches.match(url);
    if(hit) return cache.put(url, hit);
  }
  const res = await fetch(url, {cache:'reload'});
  if(!res.ok) throw new Error(rel + ': ' + res.status);
  return cache.put(url, res);
}

self.addEventListener('install', event=>{
  event.waitUntil((async ()=>{
    const app = await caches.open(APP_CACHE);
    // un file che non arriva (deploy a metà, rete caduta) fa fallire l'installazione: resta la versione di prima, intera.
    // La cache appena aperta però si toglie, se no una versione a metà resterebbe sul telefono fino al prossimo aggiornamento
    try{ await Promise.all(APP_FILES.map(f=>precache(app, f))); }
    catch(e){ await caches.delete(APP_CACHE); throw e; }
    // le foto della struttura: se una manca la rete non blocca l'installazione, arriverà quando serve
    const photos = await caches.open(PHOTO_CACHE);
    await Promise.all(SHELL_PHOTOS.map(f=> caches.match(abs(f)).then(hit=> hit || precache(photos, f)).catch(()=>{})));
  })());
});

self.addEventListener('activate', event=>{
  event.waitUntil((async ()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('macros-app-') && k !== APP_CACHE).map(k=>caches.delete(k)));
    // foto di versioni precedenti (cambiate o tolte dal menu): fuori
    const keep = new Set(PHOTOS.map(abs));
    const photos = await caches.open(PHOTO_CACHE);
    const old = (await photos.keys()).filter(r=>!keep.has(r.url));
    await Promise.all(old.map(r=>photos.delete(r)));
    await self.clients.claim();
  })());
});

/* Foto in sottofondo, poche alla volta, solo quelle che mancano (le chiede pwa.js con wi-fi e senza risparmio dati) */
let warming = null;
async function warmPhotos(){
  const cache = await caches.open(PHOTO_CACHE);
  const have = new Set((await cache.keys()).map(r=>r.url));
  const todo = PHOTOS.map(abs).filter(u=>!have.has(u));
  const worker = async ()=>{
    while(todo.length){
      const url = todo.shift();
      try{ const res = await fetch(url); if(res.ok) await cache.put(url, res); }
      catch{ return; }   // rete caduta: si riprova alla prossima apertura
    }
  };
  await Promise.all([worker(), worker(), worker()]);
}

self.addEventListener('message', event=>{
  const type = event.data && event.data.type;
  if(type === 'SKIP_WAITING') self.skipWaiting();
  if(type === 'warm-photos' && !warming){
    warming = warmPhotos().finally(()=>{ warming = null; });
    event.waitUntil(warming);
  }
  // configurazione per i rinnovi della subscription (indirizzo di push-event e chiave pubblica VAPID), da curiosity.js
  const d = event.data;
  if(type === 'push-config' && isEventUrl(d.eventUrl) && typeof d.vapidKey === 'string'){
    event.waitUntil(caches.open(PUSH_CACHE).then(c=> c.put(abs(PUSH_CONFIG_URL), new Response(JSON.stringify({eventUrl:d.eventUrl, vapidKey:d.vapidKey})))));
  }
});

/* Dalla cache se c'è, altrimenti dalla rete e salvato (file con l'impronta nel nome: non cambiano mai) */
async function cacheFirst(req, cacheName){
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if(hit) return hit;
  try{
    const res = await fetch(req);
    if(res.ok) cache.put(req, res.clone());
    return res;
  }catch{
    return Response.error();
  }
}

async function fromLibCache(req, event){
  const cache = await caches.open(LIB_CACHE);
  const hit = await cache.match(req);
  const net = fetch(req).then(async res=>{
    if(res.ok){   // solo risposte leggibili: una opaca (senza CORS) occupa fino a 7 MB di quota in Chrome e non si può controllare
      await cache.put(req, res.clone());
      const keys = await cache.keys();
      await Promise.all(keys.slice(0, Math.max(0, keys.length - LIB_MAX)).map(k=>cache.delete(k)));   // i più vecchi
    }
    return res;
  });
  if(hit){ event.waitUntil(net.catch(()=>{})); return hit; }
  return net.catch(()=> Response.error());
}

self.addEventListener('fetch', event=>{
  const req = event.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);

  if(url.origin === self.location.origin){
    if(!url.pathname.startsWith(SCOPE.pathname)) return;
    const path = url.pathname.slice(SCOPE.pathname.length);
    // l'app: la pagina della versione installata (con qualunque ?view=, ?order=, ?demo)
    if(req.mode === 'navigate'){
      if(path === '' || path === 'index.html'){
        event.respondWith(caches.match(abs('./'), {cacheName:APP_CACHE}).then(r=> r || fetch(req)).catch(()=> Response.error()));
      }
      // altre pagine del sito (la landing in scarica/): dalla rete, e senza rete l'app
      else event.respondWith(fetch(req).catch(()=> caches.match(abs('./'), {cacheName:APP_CACHE}).then(r=> r || Response.error())));
      return;
    }
    if(path.startsWith('photos/')){ event.respondWith(cacheFirst(req, PHOTO_CACHE)); return; }
    if(path.startsWith('fonts/')){ event.respondWith(cacheFirst(req, APP_CACHE)); return; }
    if(path.startsWith('curiosita/')){ event.respondWith(curiosityFromNetwork(req)); return; }
    // senza rete un file mai salvato dà un errore di rete pulito, non una promise rifiutata (che il browser segnala come errore)
    event.respondWith(caches.match(req, {cacheName:APP_CACHE}).then(r=> r || caches.match(req, {ignoreSearch:true, cacheName:APP_CACHE})).then(r=> r || fetch(req)).catch(()=> Response.error()));
    return;
  }

  if(LIB_HOSTS.includes(url.hostname)) event.respondWith(fromLibCache(req, event));
  // tutto il resto (mappe, indirizzi, percorsi, API): sempre dalla rete, come senza service worker
});

/* ---- Curiosità: dalla rete (cambiano solo con una build nuova), senza rete dalla copia salvata ---- */
async function curiosityPut(url, res){
  const cache = await caches.open(CURIOSITY_CACHE);
  await cache.put(url, res);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - CURIOSITY_MAX)).map(k=>cache.delete(k)));
}
async function curiosityFromNetwork(req){
  try{
    const res = await fetch(req);
    if(res.ok) await curiosityPut(req.url, res.clone());
    return res;
  }catch{
    const hit = await caches.match(req, {cacheName:CURIOSITY_CACHE});
    return hit || Response.error();
  }
}

/* Solo indirizzi della funzione push-event su Supabase: il contenuto arriva cifrato dal nostro server, ma il service
   worker non manda comunque richieste altrove */
const isEventUrl = u=>{ try{ const x = new URL(u); return x.protocol === 'https:' && x.pathname.endsWith('/functions/v1/push-event'); }catch{ return false; } };

self.addEventListener('push', event=>{
  let d = {};
  try{ d = event.data ? event.data.json() : {}; }catch{ d = {}; }
  const url = typeof d.url === 'string' && d.url.startsWith('./') ? d.url : './';
  const title = typeof d.title === 'string' && d.title ? d.title : "MACRO'S";
  const options = {body: typeof d.body === 'string' ? d.body : '', icon:'icons/icon-192.png', badge:'icons/icon-192.png', lang:'it',
    tag: typeof d.tag === 'string' ? d.tag : 'macros', data:{url, kind:d.kind || null, log:d.log || null, token:d.token || null, track: isEventUrl(d.track) ? d.track : null}};
  const id = Number.isInteger(d.id) ? d.id : null;
  event.waitUntil(Promise.all([
    self.registration.showNotification(title, options).catch(()=>{ /* permesso tolto dalle impostazioni: niente da mostrare */ }),
    // la curiosità è già qui quando la si tocca, anche se nel frattempo la rete è sparita
    id == null ? null : fetch(abs('./curiosita/' + id + '.json')).then(res=> res.ok ? curiosityPut(abs('./curiosita/' + id + '.json'), res) : null).catch(()=>{}),
  ]));
});

self.addEventListener('notificationclick', event=>{
  event.notification.close();
  const data = event.notification.data || {};
  const target = data.url || './';
  const params = new URL(target, self.location.href).searchParams;
  const num = params.get('order'), curiosity = params.get('curiosita');
  // tocco registrato sul server (CTR): in parallelo, e un errore non cambia nulla per chi apre
  const track = data.log && data.token && isEventUrl(data.track)
    ? fetch(data.track, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({type:'click', log:data.log, token:data.token}), keepalive:true}).catch(()=>{})
    : null;
  event.waitUntil(Promise.all([track, self.clients.matchAll({type:'window', includeUncontrolled:true}).then(list=>{
    // una finestra dell'app (non la landing in scarica/, che sta sulla stessa origine)
    const isApp = c=>{ const u = new URL(c.url); return u.origin === self.location.origin && (u.pathname === SCOPE.pathname || u.pathname === SCOPE.pathname + 'index.html'); };
    const open = list.find(isApp);
    if(open){
      if(num) open.postMessage({type:'open-order', num});
      if(curiosity) open.postMessage({type:'open-curiosity', slug:curiosity});
      return open.focus();
    }
    return self.clients.openWindow(target);
  }).catch(()=> self.clients.openWindow(target))]));
});

/* Il browser ha rinnovato (o perso) la subscription: se ne fa una nuova e il server la sostituisce alla vecchia */
self.addEventListener('pushsubscriptionchange', event=>{
  event.waitUntil((async ()=>{
    const hit = await caches.match(abs(PUSH_CONFIG_URL), {cacheName:PUSH_CACHE});
    const conf = hit && await hit.json();
    const old = event.oldSubscription;
    if(!conf || !old) return;
    const key = conf.vapidKey.replace(/-/g, '+').replace(/_/g, '/');
    const sub = event.newSubscription || await self.registration.pushManager.subscribe({userVisibleOnly:true,
      applicationServerKey: Uint8Array.from(atob(key + '='.repeat((4 - key.length % 4) % 4)), c=>c.charCodeAt(0))});
    await fetch(conf.eventUrl, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({type:'resubscribe', oldEndpoint:old.endpoint, subscription:sub.toJSON()})});
  })().catch(()=>{ /* alla prossima apertura l'app controlla e rifà l'iscrizione (pushStartupCheck) */ }));
});
