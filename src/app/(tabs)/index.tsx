import { View, FlatList } from 'react-native';
import products from 'assets/data/products';
import ProductListItem from '@/src/components/ProductListItem';

export default function MenuScreen() {
  const numColumns = 2;
  return (
    <View>
      <FlatList 
        data = {products}
        renderItem={({item}) => <ProductListItem product={item} />}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={{ gap: 10 , padding: 10 }}
        columnWrapperStyle={{ gap: 10 }}
      />
    </View>
  );
}


