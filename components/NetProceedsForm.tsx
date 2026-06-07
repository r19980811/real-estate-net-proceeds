"use client";

import { useMemo, useState } from "react";
import { calculateNetProceeds } from "@/lib/calculate";

type FormData = {
  property_type: string;
  address: string;
  building_name: string;
  room_number: string;
  expected_price: string;
  loan_balance: string;
  registration_cost: string;
  other_cost: string;
  sale_timing: string;
  occupancy_status: string;
  reason: string;
  name: string;
  phone: string;
  email: string;
  consent: boolean;
};

const initialData: FormData = {
  property_type: "",
  address: "",
  building_name: "",
  room_number: "",
  expected_price: "",
  loan_balance: "",
  registration_cost: "",
  other_cost: "",
  sale_timing: "",
  occupancy_status: "",
  reason: "",
  name: "",
  phone: "",
  email: "",
  consent: false,
};

export default function NetProceedsForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const result = useMemo(() => {
    return calculateNetProceeds({
      expectedPrice: Number(form.expected_price) || 0,
      loanBalance: Number(form.loan_balance) || 0,
      registrationCost: Number(form.registration_cost) || undefined,
      otherCost: Number(form.other_cost) || undefined,
    });
  }, [form]);

  const update = (key: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const yen = (value: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const submit = async () => {
    if (!form.name || !form.phone || !form.email) {
      alert("お名前・電話番号・メールアドレスを入力してください。");
      return;
    }

    if (!form.consent) {
      alert("個人情報の第三者提供に同意してください。");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...form,
      expected_price: Number(form.expected_price) || 0,
      loan_balance: Number(form.loan_balance) || 0,
      brokerage_fee: result.brokerageFee,
      registration_cost: result.registrationCost,
      other_cost: result.otherCost,
      total_cost: result.totalCost,
      net_proceeds: result.netProceeds,
    };

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      alert("送信に失敗しました。時間をおいて再度お試しください。");
      return;
    }

    setCompleted(true);
  };

  if (completed) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-[#0B1F3A]">
          送信が完了しました
        </h2>
        <p className="mt-4 text-slate-600">
          内容を確認のうえ、担当者よりご連絡いたします。
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold text-[#C9A24A]">STEP {step} / 5</p>
        <h2 className="mt-2 text-2xl font-bold text-[#0B1F3A]">
          売却後の手残りをかんたん診断
        </h2>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <Select
            label="物件種別"
            value={form.property_type}
            onChange={(v) => update("property_type", v)}
            options={["区分マンション", "一棟マンション", "戸建て", "土地", "その他"]}
          />
          <Input label="所在地" value={form.address} onChange={(v) => update("address", v)} />
          <Input label="マンション名" value={form.building_name} onChange={(v) => update("building_name", v)} />
          <Input label="号室" value={form.room_number} onChange={(v) => update("room_number", v)} />
          <Select
            label="居住状況"
            value={form.occupancy_status}
            onChange={(v) => update("occupancy_status", v)}
            options={["居住中", "空室", "賃貸中"]}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Input
            label="売却希望価格または想定査定価格"
            type="number"
            value={form.expected_price}
            onChange={(v) => update("expected_price", v)}
          />
          <Input
            label="ローン残債"
            type="number"
            value={form.loan_balance}
            onChange={(v) => update("loan_balance", v)}
          />
          <Input
            label="登記費用"
            type="number"
            value={form.registration_cost}
            placeholder="未入力の場合は50,000円で計算"
            onChange={(v) => update("registration_cost", v)}
          />
          <Input
            label="その他諸費用"
            type="number"
            value={form.other_cost}
            placeholder="未入力の場合は100,000円で計算"
            onChange={(v) => update("other_cost", v)}
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Select
            label="売却希望時期"
            value={form.sale_timing}
            onChange={(v) => update("sale_timing", v)}
            options={["すぐに売却したい", "3ヶ月以内", "6ヶ月以内", "1年以内", "未定"]}
          />
          <Select
            label="売却理由"
            value={form.reason}
            onChange={(v) => update("reason", v)}
            options={["住み替え", "離婚", "相続", "投資用物件の売却", "ローン返済が厳しい", "その他"]}
          />
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <ResultRow label="想定売却価格" value={yen(result.expectedPrice)} />
          <ResultRow label="ローン残債" value={yen(result.loanBalance)} />
          <ResultRow label="仲介手数料概算" value={yen(result.brokerageFee)} />
          <ResultRow label="登記費用概算" value={yen(result.registrationCost)} />
          <ResultRow label="その他諸費用概算" value={yen(result.otherCost)} />

          <div className="rounded-2xl bg-[#0B1F3A] p-5 text-white">
            <p className="text-sm text-slate-200">概算手残り額</p>
            <p className="mt-2 text-3xl font-bold">{yen(result.netProceeds)}</p>
          </div>

          <p className="text-xs leading-6 text-slate-500">
            ※本診断は概算です。譲渡税は取得費、所有期間、居住用・投資用、特例適用可否などにより変動するため、個別確認が必要です。
          </p>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <Input label="お名前" value={form.name} onChange={(v) => update("name", v)} />
          <Input label="電話番号" value={form.phone} onChange={(v) => update("phone", v)} />
          <Input label="メールアドレス" type="email" value={form.email} onChange={(v) => update("email", v)} />

          <label className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => update("consent", e.target.checked)}
              className="mt-1"
            />
            <span>入力内容を不動産会社・提携事業者等へ提供することに同意します。</span>
          </label>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="w-full rounded-full border border-slate-300 px-6 py-3 font-semibold"
          >
            戻る
          </button>
        )}

        {step < 5 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="w-full rounded-full bg-[#0B1F3A] px-6 py-3 font-semibold text-white"
          >
            次へ
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#C9A24A] px-6 py-3 font-semibold text-[#0B1F3A] disabled:opacity-60"
          >
            {isSubmitting ? "送信中..." : "診断結果を送信する"}
          </button>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none focus:border-[#C9A24A]"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#0B1F3A]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none focus:border-[#C9A24A]"
      >
        <option value="">選択してください</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="font-bold text-[#0B1F3A]">{value}</span>
    </div>
  );
}