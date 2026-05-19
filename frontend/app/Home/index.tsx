import { FC, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import styles from "./styles";
import { useAssets } from 'expo-asset';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DOMAIN } from "@/models/domain";
import { ASYNC_STORAGE_DOMAIN_KEY } from "../Domains";
import { FACT } from "@/models/fact";
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { fetchJson } from "@/utils/fetch";

const Home: FC = () => {
    const { width, height } = useWindowDimensions();
    const [facts, setFacts] = useState<Array<FACT>>([]);
    const [assets] = useAssets([require('../../assets/images/background_0.jpg'), require('../../assets/images/background_1.jpg'), require('../../assets/images/background_2.jpg'), require('../../assets/images/background_3.jpg'), require('../../assets/images/background_4.jpg'), require('../../assets/images/background_5.jpg'), require('../../assets/images/background_6.jpg'), require('../../assets/images/background_7.jpg'), require('../../assets/images/background_8.jpg'), require('../../assets/images/background_9.jpg'), require('../../assets/images/background_10.jpg')]);
    const [domainsQueryParams, setDomainsQueryParams] = useState<URLSearchParams>();
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef<FlatList<FACT>>(null);

    useEffect(() => {
        AsyncStorage.getItem(ASYNC_STORAGE_DOMAIN_KEY).then((storedDomains) => {
            let parsedStoredDomains: Array<DOMAIN> = [];
            if (storedDomains) {
                parsedStoredDomains = Object.values(JSON.parse(storedDomains));
                const params = new URLSearchParams();
                parsedStoredDomains.forEach((item, index) => {
                    params.append(`domains[${index}][id]`, item.id.toString());
                    params.append(`domains[${index}][name]`, item.name);
                });
                setDomainsQueryParams(params);
                fetchJson(`${process.env.EXPO_PUBLIC_API_DOMAIN}/facts?${params.toString()}`).then((response) => {
                    setFacts((response as unknown as Array<string>).map((fact, index) => {
                        return ({
                            id: index,
                            text: fact,
                        })
                    }));
                });
            }
        })
    }, []);

    const fetchFacts = () => {
        setIsLoading(true);
        fetchJson(`${process.env.EXPO_PUBLIC_API_DOMAIN}/facts?${domainsQueryParams?.toString()}`).then((response) => {
            const oldFactsLength = facts.length;
            setFacts((prev) => [...prev, ...(response as unknown as Array<string>).map((fact, index) => {
                return ({
                    id: prev.length + index,
                    text: fact,
                })
            })]);
            requestAnimationFrame(() => {
                flatListRef.current?.scrollToOffset({
                    offset: oldFactsLength * height,
                    animated: true,
                });
            });
            setIsLoading(false);
        });
    }

    return facts && facts.length > 0 ? <>
        <TouchableOpacity style={styles.settingButton} onPress={() => {
            router.push("/Domains")
        }}>
            <Ionicons name="settings-outline" size={32} color="#FFFFFF" />
        </TouchableOpacity>
        <FlatList
            ref={flatListRef}
            style={styles.container}
            data={facts}
            keyExtractor={(item: Record<string, unknown>) => item.id as string}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }: { item: Record<string, unknown>, index: number}) => (
                <View style={[styles.fact, { width, height }]}>
                    <Image
                        style={styles.background}
                        source={assets?.[index % 10] ? { uri: assets[index % 10].uri } : undefined}
                    />
                    <View style={styles.overlay} />
                    <Text style={styles.text}>
                        {(item.text as string)}
                    </Text>
                </View>
            )}
            onEndReachedThreshold={0}
            onEndReached={fetchFacts}
        />
        
        {isLoading && <View style={styles.infiniteIndicatorWrapper}>
            <ActivityIndicator size="large" color="#FFFFFF" />
        </View>}
    </> : <View style={styles.wrapper}>
            <Image
                style={styles.background}
                source={assets?.[0] ? { uri: assets[0].uri } : undefined}
            />
            <View style={styles.overlay} />
            <View style={styles.indicatorWrapper}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
    </View>;
}

export default Home;