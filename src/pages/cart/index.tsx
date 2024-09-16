import styles from './cart.module.css';
import { ProductInCart } from '../../components/ProductInCart';
import { useLoaderData } from 'react-router-dom';
import { IProductInCart } from '../../interfaces/productCart.interface';
import { ChangeEvent, useEffect, useState } from 'react';
import { formatPrice } from '../../utils/formatPrice';
import { makeRequest } from '../../utils/makeRequest';

export function Cart(): JSX.Element { 
const productsInCartInitial = useLoaderData() as IProductInCart[]
const [productsInCart, setProductsInCart] = useState<IProductInCart[]>(productsInCartInitial)
const [total, setTotal] = useState<string>(' R$ 0')

function calcTotal(){
  const total = productsInCart.reduce(
    (acc: number, item: IProductInCart) => 
    acc += item.quantity * item.price, 0)
    
    setTotal(formatPrice(total))
}

async function deleteProduct(productInCart: IProductInCart){
  const deleteProduct = confirm("Tem certeza que deseja excluir esse produto? ")

  if(!deleteProduct) return

  await makeRequest(`/cart/${productInCart.id}`, 'DELETE')
  const newProductsInCard = productsInCart.filter(item => item.id !== productInCart.id)
  setProductsInCart(newProductsInCard)
  alert('Produto deletado com sucesso!')
}

useEffect(()=>{
  calcTotal()
}, [productsInCart])

async function updateQuantityProductInCart(
  event: ChangeEvent<HTMLSelectElement>, productInCart:IProductInCart){

    const valueQuantity = event.target.value

    await makeRequest(`/cart/${productInCart.id}`, 'PUT', {
      ...productInCart,
      quantity: Number(valueQuantity)
    })
    const newProductsInCart =  productsInCart.filter(item => {
      if(item.id === productInCart.id){
        item.quantity = Number(valueQuantity)
      }
      return item
    })
    setProductsInCart(newProductsInCart)
    // recalcular o total
    calcTotal()
}


  return (
    <main className='main__container container'>
      <section className={styles.products}>
        <h1 className={styles.products__title}>Carrinho</h1>
        <div className={styles.products__body}>  
          {productsInCart.map(item => 
          <ProductInCart 
          key={item.id} 
          item={item} 
          deleteProduct={deleteProduct}
          updateQuantityProductInCart={updateQuantityProductInCart}
          /> 
          )}  

        </div>
        <h1 className={styles.products__total}>Total:  {total}</h1>
      </section>
    </main>
  )
}