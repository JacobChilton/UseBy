import { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Product } from '~/app/lib/api/APITypes';
import { useAPI } from '~/app/components/APIProvider';
import ItemListGroup from './ItemListGroup';


export default function ItemList(props) {

    const products = props.passProducts;
    const setProducts = props.passSetProducts;

    const [expired, setExpired] = useState<Product[]>([]);
    const [expiringThisWeek, setExpiringThisWeek] = useState<Product[]>([]);
    const [expiringThisMonth, setExpiringThisMonth] = useState<Product[]>([]);
    const [expiringLater, setExpiringLater] = useState<Product[]>([]);

    const [visibleProducts, setVisibleProducts] = useState<boolean[]>([]);
    const [productList, setProductList] = useState<Product[]>([]);

    const api = useAPI();

    useEffect(() => {

        // Refresh product list
        api.house_product_get_all("6803011913572dd35b206ef9").then((products) => {

            // Sort the product list by order of expiration
            products.sort(function(a, b) {
                return (a.use_by < b.use_by) ? -1 : ((a.use_by > b.use_by) ? 1 : 0);
            });

            setProducts(products);
        })
        .catch(console.error);

    }, []);

    useEffect(() => {

        function ownersLookup() {

            for (const productIndex in products) {

                (api.user_get(products[productIndex].owner_id)).then((userData) => {
    
                    if (userData) {

                        const newProductList = products.map(product => {

                            if ((product.owner_id === products[productIndex].owner_id)) {
                                
                                return {

                                    ...product,
                                    owner_id: userData.name
                                };
                            }
                            else {
                                
                                return product;
                            }
                        });
                        setProductList(newProductList);
                    }
                });
            }
        }

        // Returns date of the format yyyy-mm-dd
        function formatDate(dateToFormat: Date) {

            let dd = String(dateToFormat.getDate()).padStart(2, '0');
            let mm = String(dateToFormat.getMonth() + 1).padStart(2, '0');
            let yyyy = dateToFormat.getFullYear();
            let date = yyyy + '-' + mm + '-' + dd;

            return date;
        }

        function checkDates() {

            let newExpiring: Product[] = [];
            let newExpiringThisWeek: Product[] = [];
            let newExpiringThisMonth: Product[] = [];
            let newExpiringLater: Product[] = [];

            let todayDate = new Date;
            let today = formatDate(todayDate);

            let nextWeekDate = new Date;
            nextWeekDate.setDate(new Date().getDate() + 7);
            let nextWeek = formatDate(nextWeekDate);

            let nextMonthDate = new Date;
            nextMonthDate.setDate(new Date().getDate() + 28);
            let nextMonth = formatDate(nextMonthDate);

            for (let product of products) { // Check when each product is expiring

                // Put product's expiry date in same form
                const productExpiry = product.use_by.split("T")[0];
    
                if (productExpiry < today) { // If product expired

                    newExpiring.push(product);
                }
                else if (productExpiry < nextWeek) { // If product expiring this week

                    newExpiringThisWeek.push(product);
                }
                else if (productExpiry < nextMonth) { // If product expiring this month

                    newExpiringThisMonth.push(product);
                }
                else { // If product not expiring soon
                    
                    newExpiringLater.push(product);
                }
            }

            // Set expiration groups
            setExpired(newExpiring);
            setExpiringThisWeek(newExpiringThisWeek);
            setExpiringThisMonth(newExpiringThisMonth);
            setExpiringLater(newExpiringLater);
        }

        setVisibleProducts(new Array(products.length).fill(false));
        ownersLookup();
        checkDates();

        console.log("setting products");
        console.log(products);

    }, [products]);
    

    return (
        <View className="mt-4"
            style={{ maxHeight: '80%'}}>

            <ScrollView
                style={{ maxHeight: '100%' }}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                <div style={{ borderRadius: 10,
                    borderWidth: 1,
                    borderColor: 'red',
                    backgroundColor: "rgba(255, 0, 0, 0.6)",
                    padding: 10
                    }}>
                    <h1>Expired</h1>
                    <ItemListGroup passProducts={expired}/>
                </div>

                <div style={{ borderRadius: 10,
                    borderWidth: 1,
                    borderColor: 'grey',
                    padding: 10,
                    marginTop: 10
                    }}>
                    <h1>Expiring This Week</h1>
                    <ItemListGroup passProducts={expiringThisWeek}/>
                </div>
                
                <div style={{ borderRadius: 10,
                    borderWidth: 1,
                    borderColor: 'grey',
                    padding: 10,
                    marginTop: 10
                    }}>
                    <h1>Expiring This Month</h1>
                    <ItemListGroup passProducts={expiringThisMonth}/>
                </div>

                <div style={{ borderRadius: 10,
                    borderWidth: 1,
                    borderColor: 'grey',
                    padding: 10,
                    marginTop: 10
                    }}>
                    <h1>Expiring Later</h1>
                    <ItemListGroup passProducts={expiringLater}/>
                </div>
                
            </ScrollView>
        </View>
  );
}