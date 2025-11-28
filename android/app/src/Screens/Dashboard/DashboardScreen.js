// android/app/src/Screens/Dashboard/DashboardScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { getDashboardStats } from '../../api/dashboardApi';

const DashboardScreen = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const isFocused = useIsFocused();

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.log('Error dashboard:', error?.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) loadStats();
    }, [isFocused]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadStats();
        setRefreshing(false);
    }, []);

    if (loading && !refreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Cargando estadísticas...</Text>
            </View>
        );
    }

    const totalUsers = stats?.totalUsers ?? 0;
    const totalProducts = stats?.totalProducts ?? 0;
    const totalOrders = stats?.totalOrders ?? 0;
    const totalReviews = stats?.totalReviews ?? 0;

    const productsByStore = stats?.productsByStore ?? [];

    // Para escalar las barras
    const maxCount = productsByStore.reduce(
        (max, s) => (s.productCount > max ? s.productCount : max),
        0
    ) || 1;

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 24 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Text style={styles.title}>Dashboard</Text>

            {/* Tarjetas de resumen */}
            <View style={styles.cardsRow}>
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Users</Text>
                    <Text style={styles.cardValue}>{totalUsers}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Products</Text>
                    <Text style={styles.cardValue}>{totalProducts}</Text>
                </View>
            </View>

            <View style={styles.cardsRow}>
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Orders</Text>
                    <Text style={styles.cardValue}>{totalOrders}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Reviews</Text>
                    <Text style={styles.cardValue}>{totalReviews}</Text>
                </View>
            </View>

            {/* Gráfico de productos por tienda */}
            <Text style={styles.sectionTitle}>Productos por tienda</Text>

            {productsByStore.length === 0 ? (
                <Text style={styles.emptyText}>
                    No hay datos de productos por tienda.
                </Text>
            ) : (
                <View style={styles.chartContainer}>
                    {productsByStore.map((store) => {
                        const widthPercent = (store.productCount / maxCount) * 100;
                        return (
                            <View key={store.storeId} style={styles.chartRow}>
                                <Text style={styles.storeName} numberOfLines={1}>
                                    {store.storeName}
                                </Text>
                                <View style={styles.barBackground}>
                                    <View
                                        style={[
                                            styles.barFill,
                                            { width: `${widthPercent}%` },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.barValue}>{store.productCount}</Text>
                            </View>
                        );
                    })}
                </View>
            )}
        </ScrollView>
    );
};

export default DashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },

    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },

    cardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    card: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 4,
    },

    cardLabel: {
        fontSize: 14,
        color: '#555',
    },

    cardValue: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 4,
    },

    sectionTitle: {
        marginTop: 24,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        color: '#777',
    },

    chartContainer: {
        marginTop: 4,
    },

    chartRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },

    storeName: {
        flex: 1,
        fontSize: 13,
    },

    barBackground: {
        flex: 3,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#e5e7eb',
        overflow: 'hidden',
        marginHorizontal: 8,
    },

    barFill: {
        height: '100%',
        borderRadius: 7,
        backgroundColor: '#3b82f6',
    },

    barValue: {
        width: 30,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '600',
    },
});
