// app/friends/index.tsx
import { useState } from 'react';
import { View } from 'react-native';
import FriendsHeaderTabs, { FriendSubTab } from '@/components/Friends/FriendHeaderTabs';
import FriendCard from '@/components/Friends/FriendCard';
import FriendRequests from '@/components/Friends/FriendRequests';
import Animated, {
    FadeIn,
    FadeOut,
} from 'react-native-reanimated';


export default function FriendsTabScreen() {
    const [activeTab, setActiveTab] = useState<FriendSubTab>('friends');

    return (
        <></>
        // <View className="flex-1 bg-white p-4">
        //     <FriendsHeaderTabs activeTab={activeTab} onChange={setActiveTab} />
        //     <AnimatePresence mode="wait">
        //         {activeTab === 'friends' ? (
        //             <Motion.View
        //                 key="friends"
        //                 initial={{ opacity: 0 }}
        //                 animate={{ opacity: 1 }}
        //                 exit={{ opacity: 0 }}
        //             >
        //                 {/* Map friends */}
        //                 <FriendCard name="Alice" id="u123" />
        //                 <FriendCard name="Bob" id="u124" />
        //             </Motion.View>
        //         ) : (
        //             <Motion.View
        //                 key="requests"
        //                 initial={{ opacity: 0 }}
        //                 animate={{ opacity: 1 }}
        //                 exit={{ opacity: 0 }}
        //             >
        //                 <FriendRequests />
        //             </Motion.View>
        //         )}
        //     </AnimatePresence>
        // </View>
    );
}