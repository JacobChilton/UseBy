import { TextInput, Button, Text } from 'react-native';
import { useAPI } from './components/APIProvider';
import { useEffect, useState } from 'react';
import { APIError } from './lib/api/APIError';

const Login = () =>
{
    const [name, set_name] = useState("");
    const [email, set_email] = useState("");
    const [password, set_password] = useState("");
    const [error, set_error] = useState("");

    // Get logged_in and login from the context
    const { logged_in, login } = useAPI();

    // This would go in root layout, if the user is logged in, it should just continue as normal
    // If not logged in, it should route them to the login page
    if (logged_in) return (
        <Text>YOU ARE LOGGED IN</Text>
    );

    // Basic login form, calling login(user,pass) sends a request to the server.
    // If login is sucessful, the context will have a state change, causing all children to reload
    // If it is not, e.message is the error message (something like invalid creds or failed to login)
    return (
        <>
            <Text>{error}</Text>

            {/* Input form */}
            <TextInput onChangeText={set_email} placeholder='email' />
            <TextInput onChangeText={set_password} placeholder='password' />
            <Button onPress={() => 
            {
                login(email, password)
                    .catch((e: APIError) =>
                    {
                        set_error(e.message)
                    })
            }} title='Login' />
        </>
    )
}
export default Login;