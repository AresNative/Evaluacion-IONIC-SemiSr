import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  useIonToast,
  IonText,
  IonList,
  IonRouterLink,
  IonItem,
  IonLabel,
  IonFooter,
  IonIcon,
} from '@ionic/react';
import { useForm } from 'react-hook-form';
import { closeCircleOutline, checkmarkCircleOutline, eye, eyeOff } from 'ionicons/icons';
import './General.css'
import { useHistory } from 'react-router';

const UserLogin: React.FC = () => {
  const [present] = useIonToast();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = (data: any) => {
    try {
      const storedUserData: any = localStorage.getItem('userData') ?? [];
      if (storedUserData) {
        const users = JSON.parse(storedUserData);
        const user = users.find((u: any) => u.username === data.username && u.password === data.password);
        if (user) {
          present({
            message: '¡Has iniciado sesión con éxito!',
            duration: 1500,
            color: 'success',
            icon: checkmarkCircleOutline,
          });
          setLoggedIn(true);
        } else {
          present({
            message: 'Credenciales incorrectas. Por favor, inténtalo de nuevo.',
            duration: 1500,
            color: 'danger',
            icon: closeCircleOutline,
          });
        }
      } else {
        present({
          message: 'No se encontró un usuario registrado. Regístrate primero.',
          duration: 1500,
          color: 'danger',
          icon: closeCircleOutline,
        });
      }
    } catch (error) {
      console.warn(error)
      present({
        message: 'No se encontró un usuario registrado. Regístrate primero.',
        duration: 1500,
        color: 'danger',
        icon: closeCircleOutline,
      });
    }
  };

  const history = useHistory();
  useEffect(() => {
    if (loggedIn) {
      history.push('/movis')
    }
  }, [loggedIn])

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const PasswordToggleIcon = showPassword ? eye : eyeOff;
  return (
    <IonPage>
      <IonContent>
        <IonList className='form-login'>
          <form onSubmit={handleSubmit(handleLogin)}>
            <IonItem className='input-form'>
              <IonInput
                placeholder="Usuario"
                label="Usuario"
                labelPlacement="floating"
                {...register('username', { required: true })}
              />
            </IonItem>
            {errors.username && <IonText color="danger">Nombre obligatorio</IonText>}
            <IonItem className="input-form">
              <IonInput
                placeholder="Contraseña"
                label="Contraseña"
                labelPlacement="floating"
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: true })}
              />
              <IonButton
                shape="round"
                fill="outline"
                slot="end"
                color="dark"
                onClick={() => setShowPassword((prevShowPassword) => !prevShowPassword)}
              >
                <IonIcon icon={PasswordToggleIcon} />
              </IonButton>
            </IonItem>
            {errors.password && <IonText color="danger">Contraseña obligatoria</IonText>}
            <IonButton className='button-form' color={'dark'} expand="block" type="submit">
              Inicia sesión
            </IonButton>
          </form>

        </IonList>


      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonItem className='item-redirect' routerLink='register'>
            <IonLabel>Registrar nuevo usuario</IonLabel>
          </IonItem>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default UserLogin;
