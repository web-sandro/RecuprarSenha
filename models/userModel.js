const pool = require('../config/dbConfig');
const passwordService = require('../services/passwordService');

class UserModel {
    constructor({
        id,
        name,
        username,
        birthDate,
        password,
        email,
        sex,
        status = 'Ativado',
        createdAt = new Date(),
        updatedAt,
    }) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.birthDate = birthDate;
        this.password = password;
        this.email = email;
        this.sex = sex;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    async create() {
        try {
            const hashedPassword = await passwordService.hashPassword(this.password);

            const sql = 'INSERT INTO user (name, username, birthDate, password, email, sex, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [this.name, this.username, this.birthDate, hashedPassword, this.email, this.sex, this.status, this.createdAt, this.updatedAt];
            const [rows, fields] = await pool.query(sql, values);

            return rows.insertId;
        } catch {
            
            return ('create')
        }
    }

    async update() {
        try {
            const hashedPassword = await passwordService.hashPassword(this.password);
            const updatedAt = new Date();
            
            const sql = 'UPDATE user SET name = ?, username = ?, birthDate = ?, password = ?, email = ?, sex = ?, status = ?, createdAt = ?, updatedAt = ? WHERE id = ?';
            const values = [this.name, this.username, this.birthDate, hashedPassword, this.email, this.sex, this.status, this.createdAt, updatedAt, this.id];
            const [rows, fields] = await pool.query(sql, values);

            return rows.affectedRows > 0;
        } catch (error) {
            console.error(error);
            throw new Error('Ocorreu um erro ao atualizar o usuário.');
        }
    }

    async delete() {
        try {
            const sql = 'DELETE FROM user WHERE id = ?';
            const [rows, fields] = await pool.query(sql, [this.id]);

            return rows.affectedRows > 0;
        } catch (error) {
            console.error(error);
            throw new Error('Ocorreu um erro ao excluir o usuário.');
        }
    }

    static async findById(id) {
        try {
            const sql = 'SELECT * FROM user WHERE id = ?';
            const [rows, fields] = await pool.query(sql, [id]);

            if (rows.length === 0) {
                return null;
            }

            const userData = rows[0];
            const user = new UserModel(userData);
            return user;
        } catch (error) {
            console.error(error);
            throw new Error('Ocorreu um erro ao buscar o usuário por ID.');
        }
    }

    static async findAll() {
        try {
            const sql = 'SELECT * FROM user';
            const [rows, fields] = await pool.query(sql);

            const users = rows.map(userData => {
                const user = new UserModel(userData);
                return user;
            });

            return users;
        } catch (error) {
            console.error(error);
            throw new Error('Ocorreu um erro ao buscar todos os usuários.');
        }
    }

    static async findByUsernameOrEmail(usernameOrEmail) {
        try {
            const sql = 'SELECT * FROM user WHERE email = ? OR username = ?';
            const [rows, fields] = await pool.query(sql, [usernameOrEmail, usernameOrEmail]);

            if (rows.length === 0) {
                return null;
            }

            const userData = rows[0];
            const user = new UserModel(userData);

            return user;
        } catch (error) {
            console.error(error);
            throw new Error('Ocorreu um erro ao buscar o usuário por nome de usuário ou email.');
        }
    }

   static async findByEmail(email) {
           const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
           return rows[0];
    }
   
    static async updatePasswordResetToken(id, token, expiration) {
        await pool.query('UPDATE user SET passwordResetToken = ?, passwordResetExpiration = ? WHERE id = ?', [
            token,
            expiration,
            id,
        ]);
    }

    static async updatePasswordResetToken(userId, token, expiration) {
            const query = `
                UPDATE user 
                SET passwordResetToken = ?, passwordResetExpires = ?
                WHERE id = ?
            `;
            const values = [token, new Date(expiration), userId];

            try {
                const [rows, fields] = await pool.query(query, values);
                if (rows.affectedRows === 0) {
                    throw new Error('Usuário não encontrado para atualizar o token de redefinição de senha.');
                }
            } catch (error) {
                console.error(error);
                throw new Error('Erro ao atualizar o token de redefinição de senha: ' + error.message);
            }
    }

    static async findByToken(token) {
        const [rows] = await pool.query(
            'SELECT * FROM user WHERE passwordResetToken = ? AND passwordResetExpiration > NOW()',
            [token]
        );
        return rows[0];
    }

    static async findByPasswordResetToken(token) {
            try {
                const sql = `
                    SELECT * FROM user 
                    WHERE passwordResetToken = ? 
                    AND passwordResetExpires > NOW()
                `;
                const [rows] = await pool.query(sql, [token]);
                if (rows.length === 0) return null;
                return rows[0];
            } catch (error) {
                console.error('Erro ao buscar token:', error);
                throw new Error('Erro ao buscar token de redefinição de senha.');
            }
    }

    static async updatePassword(id, newPassword) {
        await pool.query('UPDATE user SET password = ?, passwordResetToken = NULL, passwordResetExpiration = NULL WHERE id = ?', [
            newPassword,
            id,
        ]);
    }

    static async updatePassword(userId, hashedPassword) {
        try {
            const updatedAt = new Date(); // Data atual para atualização
            const sql = 'UPDATE user SET password = ?, updatedAt = ? WHERE id = ?';
            const values = [hashedPassword, updatedAt, userId];
            const [rows] = await pool.query(sql, values);
    
            if (rows.affectedRows === 0) {
                throw new Error('Usuário não encontrado ou senha não atualizada.');
            }
    
            return true;
        } catch (error) {
            console.error('Erro ao atualizar a senha:', error);
            throw new Error('Erro ao atualizar a senha do usuário.');
        }
    }
   
}

module.exports = UserModel;