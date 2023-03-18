const nodemailer = require('nodemailer'); // need this package to send emails
const router = require('express').Router();

router.get('/', (req, res) => {
    return res.send('send code here');
});

router.post('/', async (req, res) => {
    // first need to generate a random 5-digit code.
    const code = Math.floor(10000 + Math.random() * 90000);
    console.log(code);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'syt921905095@gmail.com', //maybe next time in process.env
            pass: 'isbcptuaevqacnfg' //maybe next time in process.env
        }
    });
    const mailOptions = {
        from: 'syt921905095@gmail.com',
        to: req.body.email,
        subject: 'Verification Code',
        text: `Your verification code is ${code}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            message: 'Verification code has been sent to your email',
            code: code 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

module.exports = router;