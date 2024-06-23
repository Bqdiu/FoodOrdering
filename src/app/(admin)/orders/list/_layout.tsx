import { Tabs, withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function OrderListNavigator() {
    return (
        <SafeAreaView
            style={{flex: 1, backgroundColor: 'white'}} edges={['top']}
        >
            <TopTabs />
        </SafeAreaView>
    )
}