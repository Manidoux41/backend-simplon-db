/**
 * Service Supabase
 * Gère toutes les interactions avec l'API Supabase
 */

const { createClient } = require('@supabase/supabase-js');

class SupabaseService {
    constructor() {
        this.url = process.env.SUPABASE_URL;
        this.anonKey = process.env.SUPABASE_ANON_KEY;
        this.serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!this.url || !this.anonKey) {
            throw new Error('Variables d\'environnement Supabase manquantes');
        }

        // Client admin avec service role
        this.adminClient = createClient(this.url, this.serviceKey || this.anonKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // Client public
        this.publicClient = createClient(this.url, this.anonKey);
    }

    /**
     * Récupérer le client admin
     */
    getAdminClient() {
        return this.adminClient;
    }

    /**
     * Récupérer le client public
     */
    getPublicClient() {
        return this.publicClient;
    }

    /**
     * Créer un utilisateur avec rôle
     */
    async createUser(email, password, role = 'USER') {
        return await this.adminClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { role }
        });
    }

    /**
     * Connecter un utilisateur
     */
    async signInUser(email, password) {
        return await this.publicClient.auth.signInWithPassword({
            email,
            password
        });
    }

    /**
     * Récupérer un utilisateur par token
     */
    async getUser(token) {
        return await this.adminClient.auth.getUser(token);
    }

    /**
     * Lister tous les utilisateurs (admin)
     */
    async listUsers() {
        return await this.adminClient.auth.admin.listUsers();
    }

    /**
     * Renouveler une session
     */
    async refreshSession(refreshToken) {
        return await this.publicClient.auth.refreshSession({
            refresh_token: refreshToken
        });
    }

    /**
     * Déconnecter un utilisateur
     */
    async signOut(token) {
        return await this.adminClient.auth.admin.signOut(token);
    }

    /**
     * Supprimer un utilisateur
     */
    async deleteUser(userId) {
        return await this.adminClient.auth.admin.deleteUser(userId);
    }

    /**
     * Mettre à jour les métadonnées d'un utilisateur
     */
    async updateUserMetadata(userId, metadata) {
        return await this.adminClient.auth.admin.updateUserById(userId, {
            user_metadata: metadata
        });
    }
}

// Instance singleton
const supabaseService = new SupabaseService();

module.exports = {
    supabaseService,
    SupabaseService
};
