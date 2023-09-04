import React, { useState } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonInput,
    IonButton,
    IonText,
    IonBackButton,
    IonButtons,
    IonItem,
    useIonToast,
    IonIcon,
    useIonViewDidEnter,
} from '@ionic/react';
import { useForm } from 'react-hook-form';
import { checkmarkCircleOutline, closeCircleOutline, eye, eyeOff } from 'ionicons/icons';

const UserRegistration: React.FC = () => {
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;

    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const loadData = async () => {
        try {
            const response = await fetch('https://randomuser.me/api');
            const data = await response.json();
            const randomUser = data.results[0];

            setFormData({
                fullName: `${randomUser.name.first} ${randomUser.name.last}`,
                username: randomUser.login.username,
                password: randomUser.login.password,
            });
        } catch (error) {
            console.error(error);
        }
    };

    useIonViewDidEnter(() => {
        loadData();
    });

    const [present] = useIonToast();

    const handleRegistration = (dataForm: any) => {
        try {
            const dataRegister = {
                fullName: dataForm.fullName,
                username: dataForm.username,
                password: dataForm.password,
                registrationDate: new Date().toLocaleDateString(),
            };
            const currentUsers = JSON.parse(localStorage.getItem('userData') || '[]');
            currentUsers.push(dataRegister);
            localStorage.setItem('userData', JSON.stringify(currentUsers));
            present({
                message: '¡Usuario registrado con éxito!',
                duration: 1500,
                color: 'success',
                icon: checkmarkCircleOutline,
            });
            setFormData({
                fullName: '',
                username: '',
                password: '',
            });
        } catch (error) {
            console.error(error);
            present({
                message: 'Error al registrar el usuario.',
                duration: 1500,
                color: 'danger',
                icon: closeCircleOutline,
            });
        }
    };

    const PasswordToggleIcon = showPassword ? eye : eyeOff;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton text="" color="dark" />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <form className="form-login" onSubmit={handleSubmit(handleRegistration)}>
                    <FormInput label="Nombre completo" name="fullName" value={formData.fullName} type="text" register={register} errors={errors.fullName} />
                    <FormInput label="Usuario" name="username" value={formData.username} type="text" register={register} errors={errors.username} />
                    <IonItem className="input-form">
                        <IonInput
                            placeholder="Contraseña"
                            label="Contraseña"
                            labelPlacement="floating"
                            value={formData.password}
                            type={showPassword ? 'text' : 'password'}
                            {...register('password', { value: formData.password, required: true })}
                        />
                        <IonButton shape="round" fill="outline" slot="end" color="dark" onClick={() => setShowPassword((prevShowPassword) => !prevShowPassword)}>
                            <IonIcon icon={PasswordToggleIcon} />
                        </IonButton>
                    </IonItem>
                    {errors.password && <IonText color="danger">Contraseña obligatoria</IonText>}
                    <IonButton className="button-form" color="dark" expand="block" type="submit">
                        Registrarse
                    </IonButton>
                </form>
            </IonContent>
        </IonPage>
    );
};

interface FormInputProps {
    label: string;
    name: string;
    value: string;
    type: string;
    register: any;
    errors: any;
}

const FormInput: React.FC<FormInputProps> = ({ label, name, value, type, register, errors }) => (
    <>
        <IonItem className="input-form">
            <IonInput placeholder={label} label={label} value={value} labelPlacement="floating" type={type} {...register(name, { value, required: true })} />
        </IonItem>
        {errors && <IonText color="danger">{`${label} obligatorio`}</IonText>}
    </>
);

export default UserRegistration;
