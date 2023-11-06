import { reactive } from "vue";

class AuthError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const session = reactive({
    user: null,
    user_email: null,
    password: null,

    initialize() {
        if (sessionStorage.user_email) {
            this.user_email = sessionStorage.user_email;
        }
        if (sessionStorage.password) {
            this.password = sessionStorage.password;
        }
        if (this.user == null && this.user_email != null) {
            this.fetchUser().catch(err => console.error("L'authentification initiale a échouée: ", err));
        }
    },
    login(user_email, password) {
        this.setCredentials(user_email, password);
        return this.fetchUser();
    },
    setCredentials(user_email, password) {
        this.user_email = user_email;
        sessionStorage.user_email = user_email;
        this.password = password;
        sessionStorage.password = password;
    },
    clearCredentials() {
        this.user_email = null;
        sessionStorage.removeItem('user_email');
        this.password = null;
        sessionStorage.removeItem('password');
    },
    disconnect() {
        this.user = null;
        this.clearCredentials();
    },
    async fetchUser() {
        const response = await fetch("/rodrigo-rodrigo-backend/login", {
            method: "GET",
            headers: {
                ... this.getAuthHeaders()
            }
        });

        if (response.ok) {
            const user = await response.json();
            this.user = user;
            return user;
        } else {
            this.user = null;
            if (response.status === 401) {
                throw new AuthError(response.status, "Adresse courriel ou mot de passe incorrect");
            } else {
                throw new AuthError(response.status, "Erreur lors de l'authentification: " + response.status);
            }
        }
    },
    getAuthHeaders() {
        if (this.user_email) {
            return {
                "Authorization": "Basic " + btoa(this.user_email + ":" + this.password),
                "X-Requested-With": "XMLHttpRequest"
            };
        } else {
            return {};
        }
    },
    async createUserAccount(userAccountEmail, userFullName, password) {
        const response = await fetch("/rodrigo-rodrigo-backend/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                courrielUtilisateur: userAccountEmail,
                nomComplet: userFullName,
                password: password
            })
        });

        if (response.ok) {
            const user = await response.json();
            return user;
        } else {
            this.user = null;
            if (response.status === 409) {
                const respBody = await response.json();
                if (respBody && respBody.message) {
                    throw new AuthError(response.status, respBody.message);
                }
                throw new AuthError(response.status, "Erreur lors de la création du compte");
            } else {
                throw new AuthError(response.status, "Erreur lors de la création du compte: " + response.status);
            }
        }
    },
});

export default session;

session.initialize();