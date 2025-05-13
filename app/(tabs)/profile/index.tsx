import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { deleteSecurely, fetchSecurely } from '@/utils/storage';

const ProfileScreen = () => {
    const router = useRouter();

    const [userName, setUserName] = React.useState<string>("khanh");
    
    React.useEffect(() => {
        const fetchUser = async () => {
            const storedName = await fetchSecurely('name');


            if (storedName) {
                setUserName(storedName);
            }

        };

        fetchUser();
    }, []);
    

    const handleLogout = async () => {
        await deleteSecurely('token');
        router.replace('/');
    };

    const handleChangePassword = () => {
        // router.push('/settings/change-password');
    };

    const handleModifyEmail = () => {
        // router.push('/settings/modify-email');
    };

    const handleModifyInfo = () => {
        // router.push('/settings/personal-info');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView className="flex-grow p-4 pb-24">
                {/* Profile Header */}
                <View className="items-center mb-8">
                    <View className="w-24 h-24 rounded-full overflow-hidden mb-2 bg-gray-300 justify-center items-center">
                        {/* Replace with actual user avatar */}
                        <Image
                            source={{ uri: 'https://via.placeholder.com/100' }}
                            className="w-full h-full"
                        />
                    </View>
                    <Text className="text-xl font-bold text-gray-800">{userName}</Text>
                </View>

                {/* Account Section */}
                <View className="mb-5 bg-white rounded-md p-4 border border-gray-200">
                    <Text className="text-lg font-semibold text-gray-700 mb-2">Account</Text>
                    <TouchableOpacity className="py-3 border-b border-gray-200" onPress={handleChangePassword}>
                        <Text className="text-base text-gray-800">Change Password</Text>
                    </TouchableOpacity>
                </View>

                {/* Personal Information Section */}
                <View className="mb-5 bg-white rounded-md p-4 border border-gray-200">
                    <Text className="text-lg font-semibold text-gray-700 mb-2">Personal Information</Text>
                    <TouchableOpacity className="py-3 border-b border-gray-200" onPress={handleModifyEmail}>
                        <Text className="text-base text-gray-800">Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-3" onPress={handleModifyInfo}>
                        <Text className="text-base text-gray-800">Other Info</Text>
                    </TouchableOpacity>
                </View>

                {/* Settings Section */}
                <View className="mb-5 bg-white rounded-md p-4 border border-gray-200">
                    <Text className="text-lg font-semibold text-gray-700 mb-2">Settings</Text>
                    <TouchableOpacity className="py-3 border-b border-gray-200" onPress={() => console.log('Notification Settings')}>
                        <Text className="text-base text-gray-800">Notifications</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-3" onPress={() => console.log('Privacy Policy')}>
                        <Text className="text-base text-gray-800">Privacy Policy</Text>
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    className="bg-[#0D3B66] py-4 rounded-md mt-6"
                    onPress={handleLogout}
                >
                    <Text className="text-white text-lg font-bold text-center">Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;