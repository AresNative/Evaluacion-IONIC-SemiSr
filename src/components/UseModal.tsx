import React from "react";
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
} from "@ionic/react";

interface UseModalProps {
    data: any;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const UseModal: React.FC<UseModalProps> = ({ data, isOpen, setIsOpen }) => {

    return (
        <IonModal isOpen={isOpen}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{data.name}</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <img src={data.image?.original ?? "https://ionicframework.com/docs/img/demos/card-media.png"} />
                <div
                    dangerouslySetInnerHTML={{ __html: data.summary }}
                    style={{ whiteSpace: "pre-wrap" }}
                ></div>

                <br />
                <IonButton target="_blank" href={data.url}>view</IonButton>
            </IonContent>
        </IonModal>
    );
};

export default UseModal;
