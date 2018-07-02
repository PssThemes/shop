export default function CartFactory () {

  const userCartReference = firebase.database().ref("carts").child(userId);
  const cart = $firebaseObject(userCartReference);

  const cart =
  cart.uid =

}
