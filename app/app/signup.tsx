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
        text: 'black'
    },
};

const Signup: React.FC = () =>
{
    const [name, set_name] = useState("");
    const [email, set_email] = useState("");
    const [password, set_password] = useState("");
    const [password_check, set_password_check] = useState("");
    const [error, set_error] = useState("");

    // Get logged_in and login from the context
    const { logged_in, user_create, login } = useAPI();

    const try_signup = async () =>
    {
        try
        {  
            if (password != password_check) {

                throw set_error("Passwords do not match");
            }

            await user_create(email, password, name);
            await login(email, password);
        }
        catch (e)
        {
            if (e instanceof APIError) set_error(e.message);
            else console.error(e);
        }
    }

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
                    placeholder='Enter your username'
                    left={<TextInput.Icon icon="user" />}
                    mode="outlined"
                    style={{ backgroundColor: 'transparent', width: '100%' }}
                />
                <TextInput
                    onChangeText={set_email}
                    placeholder='Enter your email'
                    left={<TextInput.Icon icon="email" />}
                    mode="outlined"
                    style={{ backgroundColor: 'transparent', width: '100%', marginTop: 20 }}
                />
                <TextInput
                    onChangeText={set_password}
                    placeholder='Enter your password'
                    secureTextEntry={true}
                    left={<TextInput.Icon icon="lock" />}
                    mode="outlined"
                    style={{ backgroundColor: 'transparent', width: '100%', marginTop: 20 }}
                />
                <TextInput
                    onChangeText={set_password_check}
                    placeholder='Re-enter your password'
                    secureTextEntry={true}
                    left={<TextInput.Icon icon="lock" />}
                    mode="outlined"
                    style={{ backgroundColor: 'transparent', width: '100%', marginTop: 20 }}
                />
                <Text>
                {error}</Text>
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
                    onPress={try_signup}> Sign Up </Button>

                    <View style={{ flexDirection: 'row', marginTop: 20, alignSelf: 'flex-end' }}>
                        <Text style={{ fontSize: 16 }}>
                            Already have an account?{" "}
                        </Text>
                        <Link href="/login" asChild>
                            <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: DefaultTheme.colors.primary, 
                            }}
                            >
                            Log In
                            </Text>
                        </Link>
                    </View>

            </View>
        </PaperProvider>
    )
}
export default Signup;