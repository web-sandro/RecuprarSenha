const UserModel = require('../models/userModel');
const passwordService = require('../services/passwordService');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

class AuthController {
    static loginForm(req, res) {
        res.render('auth/login');
    }
    static async login(req, res) {
        try {
            const { usernameOrEmail, password } = req.body;

            const user = await UserModel.findByUsernameOrEmail(usernameOrEmail);

            if (!user) {
                res.redirect('/usuarios/cadastrar')
            }

            const isValidPassword = await passwordService.comparePasswords(password, user.password);

            if (!isValidPassword) {
                res.redirect('/usuarios/cadastrar')
            }

            req.session.user = user;
           
            return res.redirect('/');

        } catch (error) {
            console.log(error);
            return res.status(500).render('error.ejs', { error });
        }

    }
    static logout(req, res) {
        try {
            req.session.destroy();
            return res.render('auth/logout');
        } catch (error) {
            console.log(error);
            return res.status(500).render('error.ejs', { error });
        }
    }
    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.render('auth/forgot-password', { errorMessage: 'E-mail não encontrado.' });
            }

            const token = crypto.randomBytes(20).toString('hex');
            const tokenExpiration = new Date(Date.now() +  5 * 60 * 1000); 
            await UserModel.updatePasswordResetToken(user.id, token, tokenExpiration);
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                port: process.env.EMAIL_PORT,
                tls: {
                    rejectUnauthorized: true,
                    minVersion: "TLSv1.2",
                },
            });

            const mailOptions = {
                to: email,
                from: 'litoralnortesoftware@gmail.com',
                subject: 'Recuperação de Senha',
                text: `Você solicitou a redefinição de sua senha. Clique no link abaixo para redefinir:
                http://localhost:3000/autenticacao/reset-password?token=${token}`,
            };

            await transporter.sendMail(mailOptions);
            res.redirect("http://gmail.com");
        } catch (error) {
            console.error('Erro ao enviar o e-mail:', error);
            res.status(500).render('error.ejs', { error });
        }
    }
    static async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;

            if (!newPassword || newPassword.trim() === "") {
                console.error('Erro na redefinição de senha:');
                return res.render('auth/reset-password', { errorMessage: 'A nova senha é obrigatória.', token });
            }
    
            const user = await UserModel.findByPasswordResetToken(token);
            if (!user || user.passwordResetExpires < Date.now()) {
                return res.render('auth/reset-password', { errorMessage: 'Token inválido ou expirado.', token });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await UserModel.updatePassword(user.id, hashedPassword);

            res.redirect('/autenticacao/login');
        } catch (error) {
            console.error('Erro ao redefinir a senha:', error);
            res.status(500).render('error.ejs', { error });
        }
    }
    
}

module.exports = AuthController;