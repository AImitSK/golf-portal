import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2022-11-15",
});

// Produkte und Preise
const predefinedProducts = {
    Scale: {
        productId: "prod_RcvoMYvEBCuoWy",
        priceId: "price_1QjfwjEKuPyZVNsC0nnlUlRz",
    },
    Growth: {
        productId: "prod_RcvnS9aoEqjYGf",
        priceId: "price_1QjfvdEKuPyZVNsCPuepp5XO",
    },
    Starter: {
        productId: "prod_RcvlKL3uGlXKji",
        priceId: "price_1QjfuHEKuPyZVNsCE2JUAYmk",
    },
};

// Funktion zum Erstellen der Checkout-Session
async function createCheckoutSession(productName: "Scale" | "Growth" | "Starter") {
    const productInfo = predefinedProducts[productName];

    if (!productInfo) {
        console.error(`Ungültiger Produktname: ${productName}`);
        throw new Error(`Ungültiger Produktname: ${productName}`);
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price: productInfo.priceId,
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });

    console.log(`Stripe Session URL erstellt: ${session.url}`); // Debugging
    return session.url;
}

// Endpunkt für die API-Route
export async function POST(request: Request) {
    try {
        const body = await request.json(); // JSON-Daten parsen
        const productName = body.productName as "Scale" | "Growth" | "Starter";

        if (!productName || !predefinedProducts[productName]) {
            return NextResponse.json(
                { error: "Produktname fehlt oder ist ungültig" },
                { status: 400 }
            );
        }

        const sessionUrl = await createCheckoutSession(productName);

        if (!sessionUrl) {
            throw new Error("Checkout-Session konnte nicht erstellt werden.");
        }

        return NextResponse.json({ url: sessionUrl });
    } catch (error: any) {
        console.error("Fehler beim Erstellen der Checkout-Session:", error);

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: "Ungültiger oder fehlender Request-Body. JSON erwartet." },
                { status: 400 }
            );
        }

        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}