import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, resetToken, login } = await request.json();

    if (!email || !resetToken) {
      return NextResponse.json(
        { error: "Email and token are required" },
        { status: 400 },
      );
    }

    // Используем тестовый домен Resend для разработки
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}`;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Сброс пароля",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { 
              display: inline-block; 
              background: #3b82f6; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0; 
            }
            .footer { margin-top: 20px; font-size: 14px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Сброс пароля</h1>
            </div>
            <div class="content">
              <p>Здравствуйте, <strong>${login}</strong>!</p>
              <p>Мы получили запрос на сброс вашего пароля. Для установки нового пароля нажмите на кнопку ниже:</p>
              
              <div style="text-align: center;">
                <a href="${resetLink}" class="button">Сбросить пароль</a>
              </div>

              <p>Или скопируйте ссылку в браузер:</p>
              <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">
                ${resetLink}
              </p>

              <p><strong>Ссылка действительна 1 час.</strong></p>
              
              <p>Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
            </div>
            <div class="footer">
              <p>С уважением,<br>Команда поддержки</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      // Более детальная обработка ошибок
      let errorMessage = "Failed to send email";
      if (error.message?.includes("domain is not verified")) {
        errorMessage =
          "Email service temporarily unavailable. Please try again later or contact support.";
      }

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    console.log("Email sent successfully to:", email);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      data,
    });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
