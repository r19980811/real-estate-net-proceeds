import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone || !body.email || !body.consent) {
      return NextResponse.json(
        { message: "必須項目が不足しています。" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("leads").insert({
      property_type: body.property_type,
      address: body.address,
      building_name: body.building_name,
      room_number: body.room_number,
      expected_price: body.expected_price,
      loan_balance: body.loan_balance,
      brokerage_fee: body.brokerage_fee,
      registration_cost: body.registration_cost,
      other_cost: body.other_cost,
      total_cost: body.total_cost,
      net_proceeds: body.net_proceeds,
      sale_timing: body.sale_timing,
      occupancy_status: body.occupancy_status,
      reason: body.reason,
      name: body.name,
      phone: body.phone,
      email: body.email,
      consent: body.consent,
    });

    if (error) {
      console.error("Supabase insert error:", error);

      return NextResponse.json(
        {
          message: "保存に失敗しました。",
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "送信が完了しました。" });
  } catch (error) {
    console.error("API route error:", error);

    return NextResponse.json(
      { message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}