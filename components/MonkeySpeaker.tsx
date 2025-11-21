/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

const presetPhrases = [
  "مرحباً يا صديقي! أنا القرد حكيم وأحب الموز أكثر من أي شيء.",
  "هل تعلم أنني أستطيع تقليد أصوات أكثر من عشرين طائر مختلف؟ صدق أو لا تصدق!",
  "هيا بنا نقفز من شجرة إلى شجرة، لكن انتبه لكي لا تسقط من الضحك.",
  "أحب قراءة الشعر العربي تحت ضوء القمر. ما رأيك أن نقرأ قصيدة معاً؟",
  "عندما أكون سعيداً أردد: يا سلام، يا سلام، الجو رائع كأحلى الأحلام!",
  "في الغابة نحتفل كل مساء برقصة موزية لا يعرفها سوى الأصدقاء المقرّبين.",
  "هل ترغب بكوب من عصير جوز الهند؟ إنه منعش مثل نسيم الصباح.",
  "أحلم بحديقة مليئة بالموز الذهبي، لكل من يبتسم نصيب وفير.",
  "لنحكِ قصة عن مغامراتي في سوق المدينة حين اشتريت قبعة حمراء.",
  "أنت الآن رفيقي في الرحلة، فلنصنع لحناً جديداً ونغنيه بصوت عالٍ."
];

const randomItem = (options: string[], exclude?: string) => {
  const pool = exclude ? options.filter((item) => item !== exclude) : options;
  if (pool.length === 0) {
    return exclude ?? options[0] ?? "";
  }

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
};

export function MonkeySpeaker() {
  const [currentPhrase, setCurrentPhrase] = useState(
    randomItem(presetPhrases)
  );
  const [customPhrases, setCustomPhrases] = useState<string[]>([]);
  const [pendingPhrase, setPendingPhrase] = useState("");
  const [canSpeak, setCanSpeak] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const allPhrases = useMemo(
    () => [...presetPhrases, ...customPhrases],
    [customPhrases]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const synth = window.speechSynthesis;
    if (!synth) {
      return;
    }

    const handleVoicesChanged = () => {
      const hasArabicVoice = synth
        .getVoices()
        .some((voice) => voice.lang.toLowerCase().startsWith("ar"));
      setCanSpeak(hasArabicVoice);
    };

    handleVoicesChanged();
    synth.addEventListener("voiceschanged", handleVoicesChanged);

    return () => {
      synth.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (phrase: string) => {
    if (typeof window === "undefined" || !canSpeak) {
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    const arabicVoice = synth
      .getVoices()
      .find((voice) => voice.lang.toLowerCase().startsWith("ar"));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }
    utterance.rate = 1.05;
    utterance.pitch = 1.1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const handleNextPhrase = () => {
    const phrase = randomItem(allPhrases, currentPhrase);
    setCurrentPhrase(phrase);
    speak(phrase);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = pendingPhrase.trim();
    if (!trimmed) {
      return;
    }

    setCustomPhrases((previous) => {
      if (previous.includes(trimmed)) {
        return previous;
      }
      return [...previous, trimmed];
    });
    setCurrentPhrase(trimmed);
    setPendingPhrase("");
    speak(trimmed);
  };

  return (
    <div className="w-full max-w-4xl px-6 py-12 sm:py-20">
      <div className="relative rounded-3xl bg-white/90 shadow-2xl ring-1 ring-sand-200/80 backdrop-blur-md">
        <div className="absolute inset-x-0 top-0 flex justify-center -translate-y-1/2">
          <motion.div
            initial={{ y: -10, rotate: -2, opacity: 0 }}
            animate={{ y: 0, rotate: 2, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-sand-300 to-sand-500 shadow-lg"
          >
            <span className="text-5xl" role="img" aria-label="قرد مرح">
              🐵
            </span>
          </motion.div>
        </div>
        <div className="grid gap-10 pt-20 pb-12 px-6 sm:px-12">
          <header className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-sand-100 px-4 py-1 text-sm font-semibold text-sand-800">
              <span role="img" aria-label="موز">
                🍌
              </span>
              صديقك القرد يتحدث العربية بطلاقة
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold text-sand-900 sm:text-5xl">
              مغامرات القرد حكيم المتكلم بالعربية
            </h1>
            <p className="mt-4 text-lg leading-loose text-sand-800">
              دع القرد حكيم يشاركك قصصه وعباراته العربية المحببة. اضغط على
              الأزرار، أضف جملك الخاصة، واستمع إلى صوته الممتع بكل فصاحة.
            </p>
          </header>
          <section className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <motion.div
              layout
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl border border-sand-100 bg-gradient-to-br from-sand-50 to-white p-6 shadow-inner"
            >
              <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-sand-100 opacity-60 blur-3xl" />
              <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-sand-200 opacity-60 blur-3xl" />
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={currentPhrase}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.45 }}
                    className={clsx(
                      "rounded-2xl border border-sand-200 bg-white/80 p-6 text-xl leading-9 text-sand-900 shadow-lg",
                      "font-body"
                    )}
                  >
                    {currentPhrase}
                  </motion.blockquote>
                </AnimatePresence>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleNextPhrase}
                    className="rounded-full bg-sand-500 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-sand-300/60 transition hover:-translate-y-0.5 hover:bg-sand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-700"
                  >
                    عبارة جديدة
                  </button>
                  <button
                    type="button"
                    onClick={() => speak(currentPhrase)}
                    disabled={!canSpeak}
                    className={clsx(
                      "rounded-full px-5 py-3 text-base font-semibold shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-500",
                      canSpeak
                        ? "bg-white text-sand-700 hover:-translate-y-0.5 hover:bg-sand-100"
                        : "cursor-not-allowed bg-white/60 text-sand-400"
                    )}
                  >
                    {isSpeaking ? "يتحدث الآن..." : "استمع لحديثه"}
                  </button>
                </div>
                {!canSpeak ? (
                  <p className="mt-3 text-sm text-sand-600">
                    يبدو أن متصفحك لا يدعم الأصوات العربية حالياً. لا تقلق، يمكنك
                    الاستمتاع بالقراءة ومشاركة العبارات بنفسك!
                  </p>
                ) : null}
              </div>
            </motion.div>
            <motion.aside
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col gap-6"
            >
              <div className="rounded-2xl border border-sand-100 bg-white/80 p-6 shadow-lg">
                <h2 className="font-display text-2xl font-semibold text-sand-900">
                  أضف كلماتك الخاصة
                </h2>
                <p className="mt-2 text-sm leading-7 text-sand-700">
                  اكتب عبارة جديدة وسيحفظها حكيم في مذكّرته السرية ويقرؤها لك
                  بصوت عربي واضح.
                </p>
                <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
                  <textarea
                    value={pendingPhrase}
                    onChange={(event) => setPendingPhrase(event.target.value)}
                    placeholder="اكتب جملة عربية مرحة..."
                    className="h-28 w-full rounded-2xl border border-sand-200 bg-white/70 p-3 text-base text-sand-900 shadow-inner focus:border-sand-400 focus:outline-none focus:ring-2 focus:ring-sand-300"
                    dir="rtl"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-sand-400 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sand-200/70 transition hover:bg-sand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-700"
                  >
                    احفظ العبارة الجديدة
                  </button>
                </form>
              </div>
              <div className="rounded-2xl border border-sand-100 bg-gradient-to-br from-white to-sand-50 p-6 shadow-inner">
                <h3 className="font-display text-xl font-semibold text-sand-900">
                  حكاية اليوم السريعة
                </h3>
                <p className="mt-3 text-sm leading-7 text-sand-700">
                  استيقظ حكيم باكراً، وقرر أن يعلّم أصدقاءه في الغابة أغنية عربية
                  جديدة. جمع الطيور، الغزلان، وحتى الفيل الصغير. بعد دقائق من
                  التدريب صار الجميع ينشدون بتناسق جميل:{" "}
                  <strong>يا شمس أشرقي علينا، وامنحي الغابة حلّة جديدة!</strong>
                </p>
                <p className="mt-3 text-sm leading-7 text-sand-700">
                  في المساء سجّل الأغنية على قوقعة بحرية، وأهداها لكل من ينضم
                  إلى مجلسه. اضغط على زر الاستماع ودع حكيم يهمس لك بلحنه السعيد.
                </p>
              </div>
            </motion.aside>
          </section>
          <footer className="rounded-3xl border border-dashed border-sand-200 bg-white/70 p-6 text-center text-sm leading-7 text-sand-600">
            <p>
              هل تود مشاركة المغامرة؟ انسخ أجمل العبارات وأرسلها لأصدقائك، أو
              ادعهم لزيارة حكيم هنا والاستماع إلى صوته العربي الدافئ.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
