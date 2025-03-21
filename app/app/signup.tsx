import { View } from 'react-native';
import { useAPI } from './components/APIProvider';
import { useEffect, useState } from 'react';
import { APIError } from './lib/api/APIError';
import { TextInput, Button, DefaultTheme, PaperProvider, Text } from 'react-native-paper';

const customTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        text: 'black'
    },
};

const Signup: React.FC = () =>
{
    const [name, set_name] = useState("");
    const [email, set_email] = useState("");
    const [password, set_password] = useState("");
    const [error, set_error] = useState("");

    // Get logged_in and login from the context
    const { logged_in, user_create, login } = useAPI();

    // This would go in root layout, if the user is logged in, it should just continue as normal
    // If not logged in, it should route them to the login page
    if (logged_in) return (
        <Text>YOU ARE LOGGED IN</Text>
    );

    // Basic login form, calling login(user,pass) sends a request to the server.
    // If login is sucessful, the context will have a state change, causing all children to reload
    // If it is not, e.message is the error message (something like invalid creds or failed to login)
    return (
        <PaperProvider theme={customTheme}>
            <View className="flex-1 justify-center items-around p-8">
                <Text>{error}</Text>

                <Text
                    variant="displayLarge"
                    style={{ fontWeight: 'bold' }}
                >
                    SIGN UP
                </Text>

                <Text className="mb-12 mt-1 text-xl "> Please sign up to continue. </Text>

                {/* Input form */}
                <TextInput
                    onChangeText={set_name}
                    placeholder='Enter your name'
                    left={<TextInput.Icon icon="user" />}
                    mode="outlined"
                    style={{ backgroundColor: 'transparent', width: '100%' }}
                />
                <TextInput
                    onChangeText={set_email}
                    placeholder='Enter your Email'
                    left={<TextInput.Icon icon="email" />}
                    mode="outlined"
                    style={{ backgroundColor: 'transparent', width: '100%', marginTop: 20 }}
                />
                <TextInput
                    onChangeText={set_password}
                    placeholder='Enter your password'
                    left={<TextInput.Icon icon="lock" />}
                    mode="outlined"
                    style={{ backgroundColor: 'transparent', width: '100%', marginTop: 20 }}
                />
                <Button
                    icon="arrow-right"
                    mode="contained"
                    contentStyle={{ flexDirection: 'row-reverse' }}
                    labelStyle={{ fontSize: 16 }}
                    style={{
                        width: 150,
                        alignSelf: 'flex-end',
                        marginTop: 20,
                    }}
                    onPress={() => 
                    {
                        user_create(email, password)
                            .then(() =>
                            {
                                login(email, password)
                                    .catch((e) => set_error(e.message))
                            })
                            .catch((e: APIError) =>
                            {
                                set_error(e.message)
                            })
                    }} > Sign Up </Button>

            </View>
        </PaperProvider>
    )
}
export default Signup;