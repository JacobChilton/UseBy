import { View } from 'react-native';
import { Text } from 'react-native-paper';
import HouseCard from './HouseCard';
import { AggHouse } from '~/app/lib/api/aggregated';

interface Props
{
    houses: Array<AggHouse>,
    reload?: () => void,
    user: string,
    title?: string,
    invite: (p_house: string) => void
}

const HouseList: React.FC<Props> = ({ houses, reload, user, title, invite }) =>
{
    if (!user) return <Text>Loading</Text>

    if (houses.length === 0) return <></>

    return (
        <View>
            <Text className='text-xl'>{title}</Text>
            <View className="mt-4 gap-4">
                {houses.map((h) =>
                    <HouseCard
                        invite={invite}
                        house={h}
                        user={user}
                        key={h._id}
                        removed={() => { if (reload) reload() }}
                    />)}
                {houses.length === 0 && <Text>No houses here!</Text>}
            </View>
        </View>)
}

export default HouseList;