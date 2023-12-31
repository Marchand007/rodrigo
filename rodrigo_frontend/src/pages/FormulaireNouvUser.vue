<template>
    <div class="boxed-center">
        <v-sheet class="ma-2" max-width="40rem">
            <v-sheet class="ma-2" max-width="40rem">
                <v-form @submit.prevent="createUserAccount" validate-on="blur" ref="newUserForm">
                    <v-text-field v-model="userAccountEmail" label="Adresse courriel"
                        :rules="[rules.required, rules.validEmail, rules.userAccountEmailUnique]" density="compact"
                        clearable>
                    </v-text-field>
                    <v-text-field v-model="userFullName" label="Nom complet" :rules="[rules.required, rules.validFullName]"
                        clearable>
                    </v-text-field>
                    <v-text-field @input="validatePassword" v-model="password" label="Mot de passe" type="password"
                        :rules="[rules.required, rules.validPassword]" density="compact" ref="passwordInput" clearable>
                    </v-text-field>
                    <v-text-field @input="validatePasswordMatch" v-model="passwordConf" label="Confirmer le mot de passe"
                        :rules="[rules.required, rules.passwordsMatch]" type="password" density="compact"
                        ref="passwordConfirmInput" clearable>
                    </v-text-field>
                    <v-btn type="submit" :disabled="!userAccountEmail || !userFullName || !password || !passwordConf">
                        Créer un compte</v-btn>
                </v-form>
            </v-sheet>
        </v-sheet>
    </div>
</template>

<script>
import session from '../session';

export default {
    data() {
        return {
            userAccountEmail: '',
            password: '',
            passwordConf: '',
            userFullName: '',
            rules: {
                required: value => !!value || "Le champ est requis",
                validEmail: value => {
                    const validEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
                    return validEmail.test(value) || "Veuillez entrer une adresse courriel valide"
                },
                validFullName: value => {
                    const validFullName = /(^[A-Z][a-z]+)(-){0,1}([ ]{0,1})([A-Z][a-z]+)?([ ]{1})?([A-Z][a-z]+)(-{0,1})([ ]{0,1})([A-Z][a-z]+)?$/;
                    return validFullName.test(value) || "Veuillez entrer un nom complet (prénom et nom) valide, (première lettre par mot doit être une majuscule)"
                },
                validPassword: value => {
                    const validPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    return validPasswordRegex.test(value) || "Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial"
                },
                passwordsMatch: () => this.password === this.passwordConf || "Les mots de passe ne correspondent pas",
                userAccountEmailUnique: () => this.userAccountUnique || "Cette adressse courriel est déjà utilisée, veuillez en entrer une autre"
            },
            userAccountUnique: true
        };
    },
    methods: {
        async createUserAccount() {
            this.userAccountUnique = true;
            const formValid = await this.$refs.newUserForm.validate();

            if (formValid.valid) {
                session.createUserAccount(this.userAccountEmail, this.userFullName, this.password).then(
                    () => {
                        alert(`Compte créé avec succès ! Bienvenue ${this.userFullName} !`);
                        this.userAccountUnique = true;
                        session.login(this.userAccountEmail, this.password);
                        this.$router.replace('/');
                    }).catch(authError => {
                        alert(authError.message);
                        if (authError.status === 409) {
                            this.userAccountUnique = false;
                            this.$refs.newUserForm.validate();
                        }
                    });
            }
        },
        validatePassword() {
            this.$refs.passwordInput.validate();
        },
        validatePasswordMatch() {
            this.$refs.passwordConfirmInput.validate();
        }
    }
}
</script>

<style scoped>
.boxed-center {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    margin: 1rem auto;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    width: 40%;
    max-width: 80rem;
}
</style>