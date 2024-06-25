import { ActivityIndicator, FlatList } from 'react-native';
import ProductListItem from '@/src/components/ProductListItem';
import { Text } from 'react-native';
import { useProductList } from '@/src/api/products';
export default function MenuScreen() {
  const numColumns = 2;

  const { data: products, error, isLoading } = useProductList();

  if(isLoading){
    return <ActivityIndicator />
  }

  if(error){
    return <Text>Failed to fetch products</Text>
  }
  
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductListItem product={item} />}
      numColumns={numColumns}
      key={numColumns}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
    />
  );
}


