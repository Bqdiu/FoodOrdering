import { View } from 'react-native'
import React from 'react'
import { supabase } from '@/src/lib/supabase'
import Button from '@/src/components/Button'

const ProfileScreen = () => {
    return (
        <View>
            <Button text='Sign out' onPress={async () => await supabase.auth.signOut()} />
        </View>
    )
}

export default ProfileScreen