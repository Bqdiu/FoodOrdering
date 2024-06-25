import { ActivityIndicator, FlatList } from 'react-native';
import ProductListItem from '@/src/components/ProductListItem';
import { supabase } from '@/src/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Text } from 'react-native';
export default function MenuScreen() {
  const numColumns = 2;

  const { data: products, error, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }
  })

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


