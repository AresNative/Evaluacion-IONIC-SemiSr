import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    IonBackButton,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonSearchbar,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import '../General.css'
import UseModal from "../../components/UseModal";
import { useHistory } from "react-router";
import { logOutOutline } from "ionicons/icons";

function Movis() {
    const [varsearch, setvsearch] = useState<string>("");
    const [movis, setMovis] = useState<any[]>([]);
    const [dataModal, setDataModal] = useState([])
    const [dataIndex, setDataIndex] = useState(0);
    const batchSize = 10;
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const getAllDataMovis = async () => {
        try {
            const response = await axios.get("https://api.tvmaze.com/schedule/full"); // Cambio a HTTPS
            const newData = response.data.slice(dataIndex, dataIndex + batchSize);
            setMovis([...movis, ...newData]);
            setDataIndex(dataIndex + batchSize);
            return newData;
        } catch (error: any) {
            console.error("¡Oh, una sorpresa! Error al buscar datos:", error.message);
            throw error;
        }
    };

    const searchMovis = async (q: string) => {
        try {
            const response = await axios.get("https://api.tvmaze.com/search/shows", { // Cambio a HTTPS
                params: { q },
            });
            const newData = response.data.map((d: any) => d.show);
            setMovis(newData);
            setDataIndex(0); // Reset dataIndex for search results
            return newData;
        } catch (error: any) {
            console.error("¡Otra vez un error! La optimización es un mito:", error.message);
            throw error;
        }
    };

    const loadData = async (ev?: any) => {
        try {
            if (varsearch.length > 0) {
                await searchMovis(varsearch);
            } else {
                await getAllDataMovis();
            }
        } catch (err) {
            console.error("Error loading data:", err);
        } finally {
            ev?.target.complete();
        }
    };

    async function clearData() {
        await setMovis([]);
        await setvsearch("");
        await setDataIndex(0);
    }
    const history = useHistory();

    const handleLogout = () => {
        history.push('/home');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton color={'dark'} onClick={handleLogout}>
                            <IonIcon icon={logOutOutline} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Peliculas!</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        animated={true}
                        placeholder="Buscar"
                        onIonClear={async () => {
                            await clearData()
                            await getAllDataMovis();
                        }}
                        onIonChange={async (e: any) => {
                            const vSearch = e.detail.value;
                            if (vSearch.length) {
                                await clearData()
                                setvsearch(vSearch);
                                await searchMovis(vSearch);
                            } else {
                                clearData()
                                await getAllDataMovis();
                            }
                        }}
                    ></IonSearchbar>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {movis.map((dMovis: any, key: any) => {
                        const imageUrl =
                            dMovis.image?.medium ||
                            "https://ionicframework.com/docs/img/demos/card-media.png";
                        const name = dMovis.name || dMovis.show.name;
                        return (
                            <IonCard key={key} onClick={() => {
                                setDataModal(dMovis)
                                setIsOpen(true);
                            }}>
                                <img src={imageUrl} alt={name} />
                                <IonCardHeader>
                                    <IonCardTitle>{name}</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent></IonCardContent>
                            </IonCard>
                        );
                    })}
                    <IonInfiniteScroll onIonInfinite={loadData} threshold="100px">
                        <IonInfiniteScrollContent
                            loadingSpinner="bubbles"
                            loadingText="Cargando mas peliculas..."
                        ></IonInfiniteScrollContent>
                    </IonInfiniteScroll>
                </IonList>
                <UseModal data={dataModal} isOpen={isOpen} setIsOpen={setIsOpen} />
            </IonContent>
        </IonPage>
    );
}

export default Movis;
