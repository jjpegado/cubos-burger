import hamburgerImage from '../../assets/hamburger.png';
import drinksImage from '../../assets/coca-cola.png';
import { IProduct, ProductProps } from '../../interfaces/product.interface';
import styles from './product.module.css';
import { formatPrice } from '../../utils/formatPrice';
import { makeRequest } from '../../utils/makeRequest';
import { IProductInCart } from '../../interfaces/productCart.interface';

export function Product({item}: Readonly<ProductProps>): JSX.Element {

  async function verifyProductInCart(product: IProduct ):  Promise<IProductInCart[]> {
    const productsInCart = await makeRequest('/cart', 'GET') as IProductInCart[]
    const existProductsInCart = productsInCart.filter(item => item.idProduct == product.id)

    return existProductsInCart
  }

  async function addProductInCart(product: IProduct) {
    const productsInCart = await verifyProductInCart(product)

    if(productsInCart.length){
      //put
      await makeRequest(`/cart/${productsInCart[0].id}`, 'PUT', {
        // id: productsInCart[0].id,
        // idProduct: productsInCart[0].idProduct,
        // title: productsInCart[0].title,
        // description: productsInCart[0].description,
        // price: productsInCart[0].price,
        // category: productsInCart[0].category,
        // quantity:  productsInCart[0].quantity +1
        // ou 
        ...productsInCart[0],
        quantity:  productsInCart[0].quantity +1,
      }) 
    }else {
      //POST
      await makeRequest('/cart', 'POST',{
        ...product,
        id: crypto.randomUUID(),
        idProduct: product.id,
        quantity: 1
      })
    }
    alert('Produto atualizado com sucesso.')
  }
  
  const { title, description, price, category} = item
  return (
    <div className={styles.product}>
      {category !== 'bebidas' ?
      <img
        src={hamburgerImage}
        alt="hamburguer"
        className={styles.product__image} /> :

      <img
        src={drinksImage}
        alt="Bebidas"
        className={styles.product__image} />}

      <h3 className={styles.product__title}>
        {title}
      </h3>
      <p className={styles.product__description}>
        {description}
      </p>
      <h2 className={styles.product__price}>
        {formatPrice(price)}
      </h2>
      <button  
        onClick={() => addProductInCart(item)}    
        className={`${styles.product__button} button--primary button`}>
        add ao carrinho
      </button>
    </div>
  )
}