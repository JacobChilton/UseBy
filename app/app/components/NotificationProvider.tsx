import React, { createContext, useContext, useState } from 'react'
import { View, Text } from 'react-native';

export type NType = "error" | "info"

interface Exported
{
    notify: (p_type: NType, p_msg: string) => void
}

const context = createContext<Exported>({
    notify: () => { }
});

export const useNotifiction = () =>
{
    const c = useContext(context);
    if (!c) throw new Error("Cannot use notificaton outside a provider");
    return c;
}

interface Props
{
    children: React.ReactNode
}


// Very basic, only 1 notify bc im lazy
const NotificationProvider: React.FC<Props> = ({ children }) =>
{
    const [msg, set_msg] = useState("");
    const [type, set_type] = useState("");
    const [timeout, set_timeout] = useState<NodeJS.Timeout>();
    const [time, set_time] = useState(0);

    const notify = (p_type: NType, p_msg: string) =>
    {
        if (p_msg.length === 0) return;

        // Capitalise
        set_msg(p_msg[0].toUpperCase() + p_msg.substring(1));
        set_type(p_type);
        set_time(100);

        if (timeout) clearInterval(timeout);
        set_timeout(setInterval(() =>
        {
            set_time((old) =>
            {
                if (old <= 0)
                {
                    set_msg("");
                    clearInterval(timeout);
                    return 0;
                }
                return old - 1;
            });

        }, 20));
    }

    const color = type === "error" ? "bg-red-700" : "bg-purple-700"
    const bar_color = type === "error" ? "bg-red-950" : "bg-purple-950"

    return (
        <context.Provider value={{ notify }}>
            {msg && <View className={`absolute z-50 h-28 top-0 left-0 right-0 ${color} p-4 m-4 rounded-lg`}>
                <Text className='flex justify-center items-center text-xl text-center flex-1'>
                    {msg}
                </Text>
                <View style={{ marginRight: `${100 - time}%` }} className={`${bar_color} h-4`}></View>
            </View>
            }
            {children}
        </context.Provider>
    )
}

export default NotificationProvider;
