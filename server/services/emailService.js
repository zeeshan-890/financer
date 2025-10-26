const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter on startup
transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ Email transporter error:', error);
        console.error('SMTP Config:', {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.SMTP_USER,
            hasPassword: !!process.env.SMTP_PASS
        });
    } else {
        console.log('✅ Email server is ready to send messages');
        console.log('✅ SMTP configured with:', process.env.SMTP_USER);
    }
});

exports.sendReminderEmail = async (reminder) => {
    const to = reminder.toUser.email || reminder.toUser;
    const fromUserName = reminder.fromUser?.name || 'Someone';
    const toUserName = reminder.toUser?.name || 'there';
    const amount = reminder.amount || 0;

    const subject = `⏰ Payment Reminder: Rs${amount.toLocaleString()} Due`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">⏰ Payment Reminder</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
                <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">Hi <strong>${toUserName}</strong>,</p>
                
                <p style="font-size: 16px; color: #374151; margin: 0 0 30px 0;">
                    This is a friendly reminder about your pending payment.
                </p>

                <!-- Reminder Card -->
                <div style="background: #FEF3C7; border: 2px solid #F59E0B; border-radius: 12px; padding: 25px; margin: 20px 0;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <p style="color: #92400E; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">Amount Due</p>
                        <p style="color: #F59E0B; font-size: 36px; font-weight: bold; margin: 0;">Rs${amount.toLocaleString()}</p>
                    </div>

                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #FCD34D;">
                        <p style="color: #92400E; font-size: 14px; margin: 0 0 5px 0;">To Pay</p>
                        <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 0;">${fromUserName}</p>
                    </div>

                    ${reminder.message ? `
                    <div style="margin-top: 15px;">
                        <p style="color: #6B7280; font-size: 14px; margin: 0;">${reminder.message}</p>
                    </div>
                    ` : ''}
                </div>

                <!-- Call to Action -->
                <div style="background: #FECACA; border-left: 4px solid #EF4444; padding: 15px; border-radius: 8px; margin: 30px 0;">
                    <p style="color: #991B1B; font-size: 14px; margin: 0; font-weight: 500;">
                        ⚠️ Please settle this payment as soon as possible.
                    </p>
                </div>

                <p style="font-size: 14px; color: #6B7280; margin: 30px 0 0 0;">
                    Once you've paid, ${fromUserName} can mark your payment as complete in the app.
                </p>
            </div>

            <!-- Footer -->
            <div style="background: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="color: #6B7280; font-size: 12px; margin: 0;">
                    This is an automated reminder from Financer
                </p>
                <p style="color: #9CA3AF; font-size: 11px; margin: 10px 0 0 0;">
                    © 2025 Financer. All rights reserved.
                </p>
            </div>
        </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: `Financer <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        });
        console.log(`⏰ Reminder email sent to ${to}:`, info.messageId);
        return info;
    } catch (error) {
        console.error(`Failed to send reminder to ${to}:`, error.message);
        throw error;
    }
};

exports.sendOTPEmail = async (email, otp, name) => {
    const subject = 'Verify Your Email - Financer';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Welcome to Financer!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for signing up! Please verify your email address using the OTP below:</p>
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="color: #4F46E5; font-size: 36px; margin: 0; letter-spacing: 8px;">${otp}</h1>
            </div>
            <p>This OTP will expire in <strong>10 minutes</strong>.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 12px;">© 2025 Financer. All rights reserved.</p>
        </div>
    `;
    const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'no-reply@financer.app',
        to: email,
        subject,
        html
    });
    console.log('OTP Email sent', info.messageId);
    return info;
};

exports.sendExpenseNotification = async (friendEmail, friendName, paidByName, expenseTitle, amount, yourShare) => {
    console.log('=== SENDING EXPENSE NOTIFICATION ===');
    console.log('To:', friendEmail);
    console.log('Friend Name:', friendName);
    console.log('Paid By:', paidByName);
    console.log('Expense:', expenseTitle);
    console.log('Amount:', amount);
    console.log('Your Share:', yourShare);

    const subject = `💰 New Expense: ${expenseTitle}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">💸 New Expense Added</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
                <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">Hi <strong>${friendName}</strong>,</p>
                
                <p style="font-size: 16px; color: #374151; margin: 0 0 30px 0;">
                    <strong>${paidByName}</strong> has added you to a shared expense.
                </p>

                <!-- Expense Card -->
                <div style="background: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 12px; padding: 25px; margin: 20px 0;">
                    <div style="margin-bottom: 20px;">
                        <p style="color: #6B7280; font-size: 14px; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 0.5px;">Expense Name</p>
                        <p style="color: #111827; font-size: 20px; font-weight: bold; margin: 0;">${expenseTitle}</p>
                    </div>
                    
                    <div style="display: table; width: 100%; margin-top: 20px;">
                        <div style="display: table-row;">
                            <div style="display: table-cell; padding: 15px; background: #ffffff; border-radius: 8px; width: 50%; border-right: 10px solid #F9FAFB;">
                                <p style="color: #6B7280; font-size: 14px; margin: 0 0 5px 0;">Total Amount</p>
                                <p style="color: #111827; font-size: 24px; font-weight: bold; margin: 0;">Rs${amount.toLocaleString()}</p>
                            </div>
                            <div style="display: table-cell; padding: 15px; background: #FEF3C7; border-radius: 8px; width: 50%;">
                                <p style="color: #92400E; font-size: 14px; margin: 0 0 5px 0;">Your Share</p>
                                <p style="color: #F59E0B; font-size: 24px; font-weight: bold; margin: 0;">Rs${yourShare.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                        <p style="color: #6B7280; font-size: 14px; margin: 0 0 5px 0;">Paid By</p>
                        <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 0;">${paidByName}</p>
                    </div>
                </div>

                <!-- Call to Action -->
                <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 15px; border-radius: 8px; margin: 30px 0;">
                    <p style="color: #1E40AF; font-size: 14px; margin: 0; font-weight: 500;">
                        📌 Please settle your share of <strong>Rs${yourShare.toLocaleString()}</strong> with ${paidByName}.
                    </p>
                </div>

                <p style="font-size: 14px; color: #6B7280; margin: 30px 0 0 0;">
                    Once you've paid, ${paidByName} can mark your payment as complete in the app.
                </p>
            </div>

            <!-- Footer -->
            <div style="background: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="color: #6B7280; font-size: 12px; margin: 0;">
                    This is an automated notification from Financer
                </p>
                <p style="color: #9CA3AF; font-size: 11px; margin: 10px 0 0 0;">
                    © 2025 Financer. All rights reserved.
                </p>
            </div>
        </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: `Financer <${process.env.SMTP_USER}>`,
            to: friendEmail,
            subject,
            html
        });
        console.log(`✅ Expense notification sent successfully to ${friendEmail}`);
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        return info;
    } catch (error) {
        console.error(`❌ Failed to send expense notification to ${friendEmail}:`, error.message);
        console.error('Full error:', error);
        throw error;
    }
};

exports.sendPaymentRequestEmail = async ({ toEmail, toName, fromName, amount, reason, message, dueDate, bankAccount }) => {
    console.log('=== SENDING PAYMENT REQUEST ===');
    console.log('To:', toEmail);
    console.log('From:', fromName);
    console.log('Amount:', amount);
    console.log('Reason:', reason);

    const subject = `💰 Payment Request: Rs ${amount.toLocaleString()} - ${reason}`;

    const dueDateText = dueDate
        ? `<div style="margin-top: 15px;">
            <p style="color: #6B7280; font-size: 14px; margin: 0 0 5px 0;">Due Date</p>
            <p style="color: #DC2626; font-size: 16px; font-weight: 600; margin: 0;">${new Date(dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>`
        : '';

    const bankAccountText = bankAccount
        ? `<!-- Bank Account Details -->
        <div style="background: #DBEAFE; border: 2px solid #3B82F6; border-radius: 12px; padding: 25px; margin: 30px 0;">
            <p style="color: #1E40AF; font-size: 16px; font-weight: bold; margin: 0 0 15px 0;">💳 Payment Details</p>
            <div style="space-y: 10px;">
                <div style="margin-bottom: 10px;">
                    <p style="color: #1E3A8A; font-size: 13px; margin: 0 0 3px 0;">Account Name</p>
                    <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0;">${bankAccount.name}</p>
                </div>
                <div style="margin-bottom: 10px;">
                    <p style="color: #1E3A8A; font-size: 13px; margin: 0 0 3px 0;">Account Number</p>
                    <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0; letter-spacing: 2px;">${bankAccount.number}</p>
                </div>
                ${bankAccount.bank ? `
                <div style="margin-bottom: 10px;">
                    <p style="color: #1E3A8A; font-size: 13px; margin: 0 0 3px 0;">Bank Name</p>
                    <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0;">${bankAccount.bank}</p>
                </div>
                ` : ''}
                <div style="margin-bottom: 10px;">
                    <p style="color: #1E3A8A; font-size: 13px; margin: 0 0 3px 0;">Account Type</p>
                    <p style="color: #111827; font-size: 15px; font-weight: 600; margin: 0; text-transform: capitalize;">${bankAccount.type}</p>
                </div>
            </div>
        </div>`
        : '';

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🧾 Payment Request</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
                <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">Hi <strong>${toName}</strong>,</p>
                
                <p style="font-size: 16px; color: #374151; margin: 0 0 30px 0;">
                    <strong>${fromName}</strong> has sent you a payment request.
                </p>

                <!-- Payment Request Card -->
                <div style="background: #F0FDF4; border: 2px solid #10B981; border-radius: 12px; padding: 25px; margin: 20px 0;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <p style="color: #065F46; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">Amount Requested</p>
                        <p style="color: #10B981; font-size: 36px; font-weight: bold; margin: 0;">Rs${amount.toLocaleString()}</p>
                    </div>

                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #86EFAC;">
                        <p style="color: #065F46; font-size: 14px; margin: 0 0 5px 0;">Reason</p>
                        <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 0;">${reason}</p>
                    </div>

                    ${dueDateText}
                </div>

                ${bankAccountText}

                <!-- Custom Message -->
                ${message ? `
                <div style="background: #F9FAFB; border-left: 4px solid #6B7280; padding: 15px; border-radius: 8px; margin: 30px 0;">
                    <p style="color: #374151; font-size: 14px; margin: 0; white-space: pre-wrap;">${message}</p>
                </div>
                ` : ''}

                <!-- Call to Action -->
                <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; border-radius: 8px; margin: 30px 0;">
                    <p style="color: #92400E; font-size: 14px; margin: 0; font-weight: 500;">
                        ⚠️ Please make the payment at your earliest convenience.
                    </p>
                </div>

                <p style="font-size: 14px; color: #6B7280; margin: 30px 0 0 0;">
                    Once you've paid, please inform ${fromName} so they can mark it as complete.
                </p>
            </div>

            <!-- Footer -->
            <div style="background: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
                <p style="color: #6B7280; font-size: 12px; margin: 0;">
                    This is an automated payment request from Financer
                </p>
                <p style="color: #9CA3AF; font-size: 11px; margin: 10px 0 0 0;">
                    © 2025 Financer. All rights reserved.
                </p>
            </div>
        </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: `Financer <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject,
            html
        });
        console.log(`✅ Payment request sent successfully to ${toEmail}`);
        console.log('Message ID:', info.messageId);
        return info;
    } catch (error) {
        console.error(`❌ Failed to send payment request to ${toEmail}:`, error.message);
        console.error('Full error:', error);
        throw error;
    }
};
