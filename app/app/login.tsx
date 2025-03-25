import { View } from 'react-native';
import { useAPI } from './components/APIProvider';
import { useEffect, useState } from 'react';
import { APIError } from './lib/api/APIError';
import { TextInput, Button, DefaultTheme, PaperProvider, Text } from 'react-native-paper';
import { Link } from 'expo-router';

const customTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        text: 'black',
    },
};

const Login: React.FC = () =>
{
    const [email, set_email] = useState("");
    const [password, set_password] = useState("");
    const [error, set_error] = useState("");

    // Get logged_in and login from the context
    const { logged_in, login } = useAPI();

    // Basic login form, calling login(user,pass) sends a request to the server.
    // If login is successful, the context will have a state change, causing all children to reload
    // If it is not, e.message is the error message (something like invalid creds or failed to login)
    return (
        <PaperProvider theme={customTheme}>
            <View className="flex-1 justify-center items-around p-8">
                <Text>{error}</Text>

                <Text
                    variant="displayLarge"
                    style={{ fontWeight: 'bold' }}
                >
                    LOGIN
                </Text>

                <Text className="mb-12 mt-1 text-xl"> Please sign in to continue </Text>

                {/* Input form */}
                <TextInput
                    onChangeText={set_email}
                    placeholder='Enter your Email'
                    left={<TextInput.Icon icon="email" />}
                    mode="outlined"
                    style={{ backgroundColor: 'transparent', width: '100%' }}
                />
                <TextInput
                    onChangeText={set_password}
                    placeholder='Enter your password'
                    secureTextEntry={true}
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
                        login(email, password)
                            .catch((e: APIError) =>
                            {
                                set_error(e.message);
                            });
                    }}
                >
                    Login
                </Button>

                <View style={{ flexDirection: 'row', marginTop: 20, alignSelf: 'flex-end' }}>
                    <Text style={{ fontSize: 16 }}>
                        Don't have an account?{" "}
                    </Text>
                    <Link href="/signup" asChild>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: DefaultTheme.colors.primary,
                            }}
                        >
                            Sign Up
                        </Text>
                    </Link>
                </View>
            </View>
        </PaperProvider>
    );
};

export default Login;