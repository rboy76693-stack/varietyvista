import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { pincode } = await req.json();

    if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode)) {
      return NextResponse.json({ error: "Invalid Pincode" }, { status: 400 });
    }

    // Mock Logistics Logic
    let isServiceable = true;
    let codAvailable = true;
    let estimatedDeliveryDays = 5; // Default

    // Unserviceable Zones (Mock)
    if (pincode.startsWith('9')) {
      isServiceable = false;
    }

    // Remote areas: No COD
    if (pincode.startsWith('79') || pincode.startsWith('78')) {
      codAvailable = false;
      estimatedDeliveryDays = 7;
    }

    // Metro / Fast Delivery Zones
    if (pincode.startsWith('4')) {
      // Mumbai / MH
      estimatedDeliveryDays = 2;
    } else if (pincode.startsWith('1') || pincode.startsWith('5')) {
      // Delhi / South
      estimatedDeliveryDays = 4;
    }

    return NextResponse.json({
      pincode,
      isServiceable,
      codAvailable,
      estimatedDeliveryDays
    });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
