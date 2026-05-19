import { FC, useEffect, useState } from "react";
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from "react-native";
import { DOMAIN } from "@/models/domain";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "./styles";
import { useAssets } from "expo-asset";
import { fetchJson } from "@/utils/fetch";

export const ASYNC_STORAGE_DOMAIN_KEY = 'fact-drop-my-domains';

const Domains: FC = () => {
    const [domains, setDomains] = useState<Array<DOMAIN>>([]);
    const [assets] = useAssets([require('../../assets/images/background_0.jpg')]);

    const sortId = ((a: DOMAIN, b: DOMAIN) => {
        if (a.id > b.id) { return 1; }
        else if (a.id < b.id) { return - 1; }
        return 0; 
    })

    const storeData = async (domain: DOMAIN) => {
        try {
            const storedDomains = await AsyncStorage.getItem(ASYNC_STORAGE_DOMAIN_KEY);
            let parsedStoredDomains: Record<string, DOMAIN> = {};
            if (storedDomains) {
                parsedStoredDomains = JSON.parse(storedDomains);
            }
            parsedStoredDomains[domain.id] = domain;
            const jsonValue = JSON.stringify(parsedStoredDomains);
            await AsyncStorage.setItem(ASYNC_STORAGE_DOMAIN_KEY, jsonValue);
            setDomains((prev) => [...prev.filter((d) => d.id !== domain.id), {...domain, selected: true}].sort(sortId))
        } catch (e) {}
    };

    const removeData = async (domain: DOMAIN) => {
         try {
            const storedDomains = await AsyncStorage.getItem(ASYNC_STORAGE_DOMAIN_KEY);
            let parsedStoredDomains: Record<string, DOMAIN> = {};
            if (storedDomains) {
                parsedStoredDomains = JSON.parse(storedDomains);
            }
            if (parsedStoredDomains[domain.id]) {
                delete parsedStoredDomains[domain.id];
            }
            const jsonValue = JSON.stringify(parsedStoredDomains);
            await AsyncStorage.setItem(ASYNC_STORAGE_DOMAIN_KEY, jsonValue);
            setDomains((prev) => [...prev.filter((d) => d.id !== domain.id), {...domain, selected: false}].sort(sortId))
        } catch (e) {}
    }

    useEffect(() => {
        fetchJson(`${process.env.EXPO_PUBLIC_API_DOMAIN}/domains`).then((response) => {
            AsyncStorage.getItem(ASYNC_STORAGE_DOMAIN_KEY).then((storedDomains) => {
                let parsedStoredDomains: Array<DOMAIN> = [];
                if (storedDomains) {
                    parsedStoredDomains = Object.values(JSON.parse(storedDomains));
                    setDomains([...response.filter((domain: DOMAIN) => !parsedStoredDomains.some((d) => d.id === domain.id)), ...parsedStoredDomains.map((domain) => {
                        return {...domain, selected: true };
                    })].sort(sortId));
                }
                else {
                    setDomains(response.sort(sortId));
                }
            })
        });
    }, []);

    return <View style={styles.outerView}>
        <Image
            style={styles.background}
            source={assets?.[0] ? { uri: assets[0].uri } : undefined}
        />
        <View style={styles.overlay} />
        <View style={styles.innerView}>
            {domains.map((domain) => <TouchableOpacity style={styles.touchable} key={domain.id} onPress={() => {
                if (domain.selected) {
                    removeData(domain);
                } else {
                    storeData(domain);
                }
            }}><Text style={[styles.domain, domain.selected ? styles.selected : {}]}>{domain.name}</Text></TouchableOpacity>)}
            {domains.length > 0 && <TouchableOpacity onPress={() => router.push("/Home")}><Text style={styles.goTouchable}>Défiler</Text></TouchableOpacity>}
        </View>
    </View>;
}

export default Domains;