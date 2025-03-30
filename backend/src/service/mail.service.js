import transporter from '../config/email.config';
import fs from 'fs';
import path from 'path';

const mailService = {
    async sendEmail({emailFrom, emailTo, emailSubject, token, user, productName, productEmail}) {
        await transporter.sendMail({
            from: emailFrom,
            to: emailTo,
            subject: emailSubject,
            html: emailTemplate(token, user, productName, productEmail),
        });
    },
};

Object.freeze(mailService);

const emailTemplate = (token, user, productName, productEmail) => {
    const templatePath = path.join(__dirname, '../public/html/mailTemplate.html');
    let html = fs.readFileSync(templatePath, 'utf8');
    return html.replace('${token}', token)
               .replace('${user}', user)
               .replace('${productName}', productName)
               .replace('${productEmail}', productEmail);
};

export default mailService;