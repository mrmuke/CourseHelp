import React from 'react'
import { StyleSheet, TouchableOpacity, Text, FlatList, View } from 'react-native'

const CategoryPicker = ({ selectedCategory, onClick, setFieldValue, ...props }) => {
    //const { colors } = useTheme()
    const categories = ['Science', 'Math', 'History', 'English', 'Art', 'Language', 'Technology']
    return (
        <View {...props}>
            <FlatList
                data={['all', ...categories]}
                horizontal
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => onClick(item)}>
                        <Text
                            style={[
                                styles.category,
                                {
                                    fontWeight: item === selectedCategory ? 'bold' : 'normal',
                                    borderBottomColor: item === selectedCategory ? '#4293f5' : 'transparent',
                                    color: item === selectedCategory ? '#4293f5' : 'black',
                                }
                            ]}>{item}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    category: {
        padding: 5,
        marginLeft: 5,
        marginRight: 5,
        borderBottomWidth: 1,
    }
})

export default CategoryPicker