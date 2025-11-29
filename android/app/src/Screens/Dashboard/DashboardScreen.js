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
import { getUsers } from '../../api/usersApi';
import { getProducts } from '../../api/productsApi';
import { getStores } from '../../api/storesApi';
import { getOrders } from '../../api/ordersApi';
import { getOrderItems } from '../../api/orderItemsApi';
import { getReviews } from '../../api/reviewsApi';
import {
    Users as UsersIcon,
    ClipboardList,
    Store,
    MessageCircle,
    ShoppingBag,
    Grid2X2,
    Settings as SettingsIcon,
} from 'lucide-react-native';
const DashboardScreen = () => {
    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [totals, setTotals] = useState({
        users: 0,
        products: 0,
        orders: 0,
        stores: 0,
        reviews: 0,
        orderItems: 0,
    });

    // [{ storeId, storeName, products }]
    const [productsByStore, setProductsByStore] = useState([]);
    const [maxProducts, setMaxProducts] = useState(0);

    const loadStats = useCallback(async () => {
        try {
            if (!refreshing) setLoading(true);

            // Pedimos TODO en paralelo:
            // - Listas para cards
            // - Dashboard stats para la gráfica
            const [
                users,
                orders,
                stores,
                reviews,
                products,
                orderItems,
                dashboardStats,
            ] = await Promise.all([
                getUsers(),
                getOrders(),
                getStores(),
                getReviews(),
                getProducts(),
                getOrderItems(),
                getDashboardStats(), // 👈 /dashboard/stats
            ]);

            // Totales por entidad (los dejamos tal cual)
            const nextTotals = {
                users: users.length,
                orders: orders.length,
                stores: stores.length,
                reviews: reviews.length,
                products: products.length,
                orderItems: orderItems.length,
            };
            setTotals(nextTotals);

            // ---------- GRÁFICA: usar /dashboard/stats ----------
            const fromApi =
                dashboardStats?.productsByStore ??
                dashboardStats?.productsPerStore ??
                [];

            // Normalizamos a [{ storeId, storeName, products }]
            const normalized = fromApi.map((item, index) => ({
                storeId:
                    item.storeId ??
                    item.id ??
                    item.storeName ??
                    item.name ??
                    index,
                storeName: item.storeName || item.name || 'N/A',
                products:
                    item.productCount ??
                    item.products ??
                    0,
            }));

            // opcional: solo mostramos stores con al menos 1 producto
            const nonEmpty = normalized.filter((s) => s.products > 0);

            const max = nonEmpty.reduce(
                (acc, cur) => (cur.products > acc ? cur.products : acc),
                0
            );

            setProductsByStore(nonEmpty);
            setMaxProducts(max);
        } catch (err) {
            console.error('Error cargando dashboard:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [refreshing]);


    useEffect(() => {
        if (isFocused) {
            loadStats();
        }
    }, [isFocused, loadStats]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadStats();
    }, [loadStats]);

    if (loading && !refreshing) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Text style={styles.title}>Dashboard</Text>

            {/* Cards de resumen (mismo contenido que el front web) */}
            <View style={styles.cardsRow}>
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.cardTitle}>Users</Text>
                        <UsersIcon size={22} color="#1d4ed8" />
                    </View>
                    <Text style={styles.cardValue}>{totals.users}</Text>
                </View>
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.cardTitle}>Orders</Text>
                        <ClipboardList size={22} color="#f59e0b" />
                    </View>
                    <Text style={styles.cardValue}>{totals.orders}</Text>
                </View>
            </View>

            <View style={styles.cardsRow}>
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.cardTitle}>Stores</Text>
                        <Store size={22} color="#22c55e" />
                    </View>
                    <Text style={styles.cardValue}>{totals.stores}</Text>
                </View>
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.cardTitle}>Reviews</Text>
                        <MessageCircle size={22} color="#1d4ed8" />
                    </View>
                    <Text style={styles.cardValue}>{totals.reviews}</Text>
                </View>
            </View>

            <View style={styles.cardsRow}>
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.cardTitle}>Products</Text>
                        <ShoppingBag size={22} color="#ef4444" />
                    </View>
                    <Text style={styles.cardValue}>{totals.products}</Text>
                </View>
                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.cardTitle}>OrderItems</Text>
                        <Grid2X2 size={22} color="#a855f7" />
                    </View>
                    <Text style={styles.cardValue}>{totals.orderItems}</Text>
                </View>
            </View>

            {/* Gráfica: Products by Store */}
            <Text style={styles.sectionTitle}>Productos por tienda</Text>
            <View style={styles.chartContainer}>
                {productsByStore.length === 0 ? (
                    <Text style={styles.chartEmptyText}>
                        No hay datos de productos por tienda.
                    </Text>
                ) : (
                    <View style={styles.barsWrapper}>
                        {productsByStore.map((item) => {
                            const widthPercent =
                                maxProducts > 0
                                    ? (item.products / maxProducts) * 100
                                    : 0;

                            return (
                                <View
                                    key={item.storeId}
                                    style={styles.barRow}
                                >
                                    <Text
                                        style={styles.storeName}
                                        numberOfLines={1}
                                    >
                                        {item.storeName}
                                    </Text>

                                    <View style={styles.barBackground}>
                                        <View
                                            style={[
                                                styles.barFill,
                                                { width: `${widthPercent}%` },
                                            ]}
                                        />
                                    </View>

                                    <Text style={styles.barValue}>
                                        {item.products}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f3f4f6',
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
        backgroundColor: '#ffffff',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginHorizontal: 4,
        // sombra ligera
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },

    cardLabel: {
        fontSize: 13,
        color: '#6b7280',
        marginBottom: 6,
    },

    cardValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },

    chartContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 1,
    },

    chartEmptyText: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: 14,
    },

    barsWrapper: {
        marginTop: 8,
    },

    barRow: {
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

export default DashboardScreen;
