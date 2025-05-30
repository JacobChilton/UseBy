import { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { Product } from '~/app/lib/api/APITypes';
import { useAPI } from '~/app/components/APIProvider';
import ItemListGroup from './ItemListGroup';


export default function ItemList(props)
{

    const products = props.passProducts;
    const setProducts = props.passSetProducts;

    const deleteItem = props.passDeleteItem;

    const [expired, setExpired] = useState<Array<Product>>([]);
    const [expiringThisWeek, setExpiringThisWeek] = useState<Array<Product>>([]);
    const [expiringThisMonth, setExpiringThisMonth] = useState<Array<Product>>([]);
    const [expiringLater, setExpiringLater] = useState<Array<Product>>([]);

    const refresh = props.passRefresh;
    const setRefresh = props.passSetRefresh;

    const api = useAPI();

    useEffect(() =>
    {

        async function refresh()
        {

            // Refresh product list
            try
            {
                const newData = await api.house_product_get_all(props.selectedHouse);

                // Sort the product list by order of expiration
                newData.sort(function (a, b)
                {
                    return (a.use_by < b.use_by) ? -1 : ((a.use_by > b.use_by) ? 1 : 0);
                });

                setProducts(newData);
            }
            catch
            {
                console.error;
            }

        }
        refresh();

    }, [refresh]);

    useEffect(() =>
    {


        // Returns date of the format yyyy-mm-dd
        function formatDate(dateToFormat: Date)
        {

            let dd = String(dateToFormat.getDate()).padStart(2, '0');
            let mm = String(dateToFormat.getMonth() + 1).padStart(2, '0');
            let yyyy = dateToFormat.getFullYear();
            let date = yyyy + '-' + mm + '-' + dd;

            return date;
        }

        function checkDates()
        {

            let newExpired: Product[] = [];
            let newExpiringThisWeek: Product[] = [];
            let newExpiringThisMonth: Product[] = [];
            let newExpiringLater: Product[] = [];

            let todayDate = new Date;
            let today = formatDate(todayDate);

            let nextWeekDate = new Date;
            nextWeekDate.setDate(new Date().getDate() + 7);
            let nextWeek = formatDate(nextWeekDate);

            let nextMonthDate = new Date;
            nextMonthDate.setDate(new Date().getDate() + 30);
            let nextMonth = formatDate(nextMonthDate);

            for (let product of products)
            { // Check when each product is expiring

                // Put product's expiry date in same form
                const productExpiry = product.use_by.split("T")[0];

                if (productExpiry < today)
                { // If product expired

                    newExpired.push(product);
                }
                else if (productExpiry < nextWeek)
                { // If product expiring this week

                    newExpiringThisWeek.push(product);
                }
                else if (productExpiry < nextMonth)
                { // If product expiring this month

                    newExpiringThisMonth.push(product);
                }
                else
                { // If product not expiring soon

                    newExpiringLater.push(product);
                }
            }

            // Set expiration groups
            setExpired(newExpired);
            setExpiringThisWeek(newExpiringThisWeek);
            setExpiringThisMonth(newExpiringThisMonth);
            setExpiringLater(newExpiringLater);
        }

        checkDates();

    }, [products]);

    return (
        <View className="mt-4"
            style={{ maxHeight: '70%' }}>

            <ScrollView
                style={{ maxHeight: '100%' }}
                contentContainerStyle={{ paddingBottom: 10 }}
            >
                {expired.length != 0 &&
                    <View style={{
                        borderRadius: 10,
                        borderWidth: 5,
                        borderColor: '#e07b7b',
                        backgroundColor: 'white',
                        padding: 10
                    }}>
                        <Text>Expired</Text>
                        <ItemListGroup group="expired" selectedHouse={props.selectedHouse} groupProducts={expired} passDeleteItem={deleteItem} passRefresh={refresh} passSetRefresh={setRefresh} passProducts={products} passSetProducts={setProducts} />
                    </View>
                }

                {
                    expiringThisWeek.length != 0 &&
                    <View style={{
                        borderRadius: 10,
                        borderWidth: 5,
                        borderColor: '#e09f7b',
                        padding: 10,
                        marginTop: 10
                    }}>
                        <Text>Expiring This Week</Text>
                        <ItemListGroup group="expiringThisWeek" selectedHouse={props.selectedHouse} groupProducts={expiringThisWeek} passDeleteItem={deleteItem} passRefresh={refresh} passSetRefresh={setRefresh} passProducts={products} passSetProducts={setProducts} />
                    </View >
                }

                {
                    expiringThisMonth.length != 0 &&
                    <View style={{
                        borderRadius: 10,
                        borderWidth: 5,
                        borderColor: '#e0c97b',
                        padding: 10,
                        marginTop: 10
                    }}>
                        <Text>Expiring This Month</Text>
                        <ItemListGroup group="expiringThisMonth" selectedHouse={props.selectedHouse} groupProducts={expiringThisMonth} passDeleteItem={deleteItem} passRefresh={refresh} passSetRefresh={setRefresh} passProducts={products} passSetProducts={setProducts} />
                    </View >
                }

                {
                    expiringLater.length != 0 &&
                    <View style={{
                        borderRadius: 10,
                        borderWidth: 5,
                        borderColor: '#95e07b',
                        padding: 10,
                        marginTop: 10
                    }}>
                        <Text>Expiring Later</Text>
                        <ItemListGroup group="expiringLater" selectedHouse={props.selectedHouse} groupProducts={expiringLater} passDeleteItem={deleteItem} passRefresh={refresh} passSetRefresh={setRefresh} passProducts={products} passSetProducts={setProducts} />
                    </View >
                }

            </ScrollView >
        </View >
    );
}