<template>
    <div class="signInComponent">

        <v-sheet width="500" class="mx-auto">
            <v-btn variant="text" color="primary" type="button" @click="goBack">
                &lt; Back
            </v-btn>
            <Title content="SIGN UP Form"></Title>
            <v-form @submit.prevent="submitForm">
                <div class="form-control">

                    <v-text-field label="Username" v-model.trim="username.val" id="username-input"
                        @blur="clearValidity('username')"></v-text-field>
                    <v-alert v-if="!username.isValid && !formIsValid" text="UserName must have a valid value!"
                        color="error"></v-alert>
                    <v-alert v-if="username.alreadyExists && !formIsValid"
                        text="This username already have been chosen, please pick another one!" color="error"></v-alert>

                </div>
                <div class="form-control">
                    <v-text-field type="email" label="Login" v-model.trim="login.val" id="login-input"
                        @blur="clearValidity('login')"></v-text-field>
                    <v-alert v-if="!login.isValid && !formIsValid" text="E-mail must have a valid value!"
                        color="error"></v-alert>
                    <v-alert v-if="login.alreadyExists && !formIsValid"
                        text="This e-mail already have been chosen, please pick another one!" color="error"></v-alert>

                </div>
                <div class="form-control">
                    <v-text-field type="password" label="Password" v-model.trim="password.val" id="password-input"
                        @blur="clearValidity('password')"></v-text-field>
                    <v-alert v-if="!password.isValid && !formIsValid" text="Password must have 6 or more characters!"
                        color="error"></v-alert>
                </div>
                <div class="form-control">

                    <v-text-field type="password" label="Password Confirmation" v-model.trim="passwordConfirmation.val"
                        id="passwordConfirmation-input" @blur="clearValidity('password')"></v-text-field>
                    <v-alert v-if="!passwordConfirmation.isValid && !formIsValid" text="Passwords doesn't match each other!"
                        color="error"></v-alert>
                </div>

                <div class="form-control">
                    <v-btn :disabled="isLoading" variant="flat" color="primary" type="submit" style="width: 100%;">
                        Sign up
                    </v-btn>
                </div>

            </v-form>

            <Overlay v-model="isLoading" :loading="isLoading"></Overlay>
        </v-sheet>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import Overlay from "@/components/overlay/Overlay.vue";
import Title from "../components/Title.vue";
import { validateEmail } from './EmailValidation';

export default defineComponent({
    components: {
        Title,
        Overlay
    },
    props: {
        content: { type: String, required: true, default: '' },
        shouldShowFilters: { type: Boolean, required: false, default: false },
    },

    setup() {
        const router = useRouter();

        const username: Ref<{ val: string, isValid: boolean, alreadyExists: boolean }> = ref({ val: 'user', isValid: true, alreadyExists: false });
        const password: Ref<{ val: string, isValid: boolean }> = ref({ val: 'romulo123', isValid: true });
        const login: Ref<{ val: string, isValid: boolean, alreadyExists: boolean }> = ref({ val: 'asdasd.36', isValid: true, alreadyExists: false });
        const passwordConfirmation: Ref<{ val: string, isValid: boolean }> = ref({ val: 'romulo123', isValid: true });
        const formIsValid: Ref<boolean> = ref(true);
        const isLoading: Ref<boolean> = ref(false);

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
                isLoading.value = false;
            }

            if (login.value.val.length === 0 || !validateEmail(login.value.val)) {
                login.value.isValid = false;
                formIsValid.value = false;
                isLoading.value = false;
            }

            const list = await userNamesListAlreadyExists();
            if (list.usernameList.includes(username.value.val)) {
                username.value.alreadyExists = true;
                formIsValid.value = false;
                isLoading.value = false;
            }

            if (list.emailList.includes(login.value.val)) {
                login.value.alreadyExists = true;
                formIsValid.value = false;
                isLoading.value = false;
            }

            if (password.value.val.length < 6) {
                password.value.isValid = false;
                formIsValid.value = false;
                isLoading.value = false;
            }

            if (password.value.val !== passwordConfirmation.value.val) {
                passwordConfirmation.value.isValid = false;
                formIsValid.value = false;
                isLoading.value = false;
            }
        }

        const clearValidity = (input: string): void => {
            eval(input).value.isValid = true;
            eval(input).value.alreadyExists = false;
        }

        const submitForm = async (): Promise<void> => {
            isLoading.value = true;
            await validateForm();

            try {
                if (formIsValid.value === true) {

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
                    isLoading.value = false;
                    router.replace('/discovery');
                }
            } catch (error) {
                isLoading.value = false;
                console.error("It not possible logged you in.", error);
                alert("It not possible logged you in.");
            }

        }

        function goBack(): void {
            router.back();
        }

        return {
            username,
            password,
            passwordConfirmation,
            login,
            formIsValid,
            isLoading,
            submitForm,
            clearValidity,
            goBack,
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
