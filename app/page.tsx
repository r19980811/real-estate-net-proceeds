import NetProceedsForm from "@/components/NetProceedsForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F9FB] text-[#111827]">
      <section className="bg-[#0B1F3A] text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <p className="mb-4 inline-block rounded-full border border-[#C9A24A]/50 px-4 py-2 text-sm text-[#E8D69A]">
            不動産売却 手残り診断
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            不動産売却、査定額だけで判断していませんか？
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
            査定価格だけでなく、ローン残債・仲介手数料・諸費用・譲渡税の可能性まで含めて、
            売却後の手残りをざっくり見える化します。
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#diagnosis"
              className="rounded-full bg-[#C9A24A] px-8 py-4 text-center font-semibold text-[#0B1F3A]"
            >
              無料で手残りを診断する
            </a>
            <a
              href="#features"
              className="rounded-full border border-white/30 px-8 py-4 text-center font-semibold text-white"
            >
              診断内容を見る
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            "売却未定でも相談OK",
            "ローン残債があっても相談OK",
            "離婚・相続・住み替え・投資用物件にも対応",
          ].map((text) => (
            <div
              key={text}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-lg font-bold text-[#0B1F3A]">{text}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                すぐに売るか決まっていない段階でも、まずは手元に残る金額の目安を確認できます。
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="diagnosis" className="mx-auto max-w-4xl px-5 pb-20">
        <NetProceedsForm />
      </section>
    </main>
  );
}