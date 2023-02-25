<template>
    <div class="signInComponent">
        <!-- RETIRAR DEPOIS -->
        <h1>SIGN UP Form</h1>
        <form @submit.prevent="submitForm">
            <div class="form-control" :class="{ invalid: !username.isValid || username.alreadyExists }">
                <label for="username-input">Username:</label>
                <input type="text" v-model.trim="username.val" id="username-input" @blur="clearValidity('username')"
                    placeholder="Username" />
                <p v-if="!username.isValid && !formIsValid">UserName must have a valid value!</p>
                <p v-if="username.alreadyExists && !formIsValid">This username already have been chosen, please pick
                    another one!</p>
            </div>
            <div class="form-control" :class="{ invalid: !login.isValid || login.alreadyExists }">
                <label for="email-input">Login:</label>
                <input type="email" v-model.trim="login.val" id="email-input" @blur="clearValidity('login')"
                    placeholder="E-mail" />
                <p v-if="!login.isValid && !formIsValid">E-mail must have a valid value!</p>
                <p v-if="login.alreadyExists && !formIsValid">This e-mail already have been chosen, please pick
                    another one!</p>
            </div>
            <div class="form-control" :class="{ invalid: !password.isValid }">
                <label for="password-input">Password:</label>
                <input type="password" v-model.trim="password.val" id="password-input" @blur="clearValidity('password')"
                    placeholder="Password" />
                <p v-if="!password.isValid && !formIsValid">Password must have 6 or more characters!</p>
            </div>
            <div class="form-control" :class="{ invalid: !passwordConfirmation.isValid }">
                <label for="passwordConfirmation-input">Password Confirmation:</label>
                <input type="password" v-model.trim="passwordConfirmation.val" id="passwordConfirmation-input"
                    @blur="clearValidity('passwordConfirmation')" placeholder="Password" />
                <p v-if="!passwordConfirmation.isValid && !formIsValid">Password Confirmation doesn't match!</p>
            </div>
            <div class="form-control">
                <button type="submit"> Sign up </button>
            </div>

            <hr />
            <h1 v-if="loading">
                carregando...
            </h1>

        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    props: {
        content: { type: String, required: true, default: '' },
        shouldShowFilters: { type: Boolean, required: false, default: false },
    },

    setup() {
        const router = useRouter();

        const username: Ref<{ val: string, isValid: boolean, alreadyExists: boolean }> = ref({ val: 'romulo', isValid: true, alreadyExists: false });
        const password: Ref<{ val: string, isValid: boolean }> = ref({ val: 'romulo123', isValid: true });
        const login: Ref<{ val: string, isValid: boolean, alreadyExists: boolean }> = ref({ val: 'romulo@teste.com', isValid: true, alreadyExists: false });
        const passwordConfirmation: Ref<{ val: string, isValid: boolean }> = ref({ val: 'romulo123', isValid: true });
        const formIsValid: Ref<boolean> = ref(true);
        const loading: Ref<boolean> = ref(false);

        function validateEmail(): boolean {
            return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(login.value.val)) ?? false;
        }

        const userNamesListAlreadyExists = async (): Promise<{ usernameList: string[], emailList: string[] }> => {
            const url = 'https://discovery-repositories-default-rtdb.firebaseio.com/users.json';

            const response = await fetch(url);
            const responseData = await response.json();
            if (!response.ok) {
                const error = new Error(responseData.message || "Failed to fetch!");
                throw error;
            }
            const usernameList = [];
            const emailList = [];
            for (const key in responseData) {
                usernameList.push(responseData[key].username);
                emailList.push(responseData[key].email);
            }
            return { usernameList, emailList };
        };

        async function validateForm() {
            formIsValid.value = true;
            if (username.value.val.length === 0) {
                username.value.isValid = false;
                formIsValid.value = false;
            }

            const list = await userNamesListAlreadyExists();
            if (list.usernameList.includes(username.value.val)) {
                username.value.alreadyExists = true;
                formIsValid.value = false;
            }

            if (login.value.val.length === 0 && !validateEmail()) {
                login.value.isValid = false;
                formIsValid.value = false;
            }

            if (list.emailList.includes(login.value.val)) {
                login.value.alreadyExists = true;
                formIsValid.value = false;
            }

            if (password.value.val.length < 6) {
                password.value.isValid = false;
                formIsValid.value = false;
            }

            if (password.value.val !== passwordConfirmation.value.val) {
                passwordConfirmation.value.isValid = false;
                formIsValid.value = false;
            }
        }

        const clearValidity = (input: string): void => {

            eval(input).value.isValid = true;
            eval(input).value.alreadyExists = false;
        }

        const submitForm = async (): Promise<void> => {
            validateForm();

            if (formIsValid.value === true) {
                loading.value = true;
                const data = {
                    username: username.value.val,
                    email: login.value.val,
                    idUser: null
                }

                const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCoG9_oLjMpmAxVhlYRqnStbTpdWiMTS1A`;
                const response = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify({
                        returnSecureToken: true,
                        email: data.email,
                        password: password.value.val,
                    }),
                });

                const responseData = await response.json();

                if (!response.ok) {
                    console.error("Failed to login!", responseData);
                    const error = new Error(responseData.error.errors[0].message || "Failed to login!");
                    throw error;
                }

                localStorage.setItem("token", responseData.idToken);

                // Salvar o user no banco do FIREBASE
                const authUrl = `auth=${responseData.idToken}`;
                const urlSaveUser = `https://discovery-repositories-default-rtdb.firebaseio.com/users/${responseData.localId}/.json?${authUrl}`;

                data.idUser = responseData.localId;

                const responseSaveUser = await fetch(urlSaveUser, {
                    method: "PUT",
                    body: JSON.stringify(data),
                });

                const responseDataSaveUSer = await responseSaveUser.json();
                if (!responseSaveUser.ok) {
                    const error = new Error(responseDataSaveUSer.message || "Failed to send a user!");
                    throw error;
                }

                localStorage.setItem("userData", JSON.stringify(data));
                loading.value = false;
                router.replace('/discovery');
            }
        }

        return {
            username,
            password,
            passwordConfirmation,
            login,
            formIsValid,
            loading,
            submitForm,
            clearValidity
        }
    },

});
</script>

<style scoped>
.form-control {
    margin: 15px 0px;
}

label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
}

.invalid p,
.invalid label {
    color: red;
}

.invalid input {
    border: 1px solid red;
}
</style>
