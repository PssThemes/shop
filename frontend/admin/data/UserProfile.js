export default class UserProfile {

  constructor(profileData) {

    if(!profileData.uid ||  profileData.uid == ""){
      throw new Error("uid is empty or missing: ", profileData.uid);
    }

    if(!profileData.address){
      throw new Error("address is missing: ", profileData.address);
    }

    const address = {
      street: profileData.address.street || "",
      more: profileData.address.more || "",
      city: profileData.address.city || "",
      country: profileData.address.country || "",
      postalCode: profileData.address.postalCode || "",
    }

    this.uid = profileData.uid;
    this.name =  profileData.name || "anonim user";
    this.email =  profileData.email || "";
    this.address =  address;
    this.phone = profileData.phone || "";
    this.isBlocked = profileData.isBlocked || false; 
  }

  getData(){
    return {
      name: this.name,
      email: this.email,
      address :  this.address,
      phone : this.phone,
      isBlocked : this.isBlocked
    }
  }

}
//
//
// #### UserProfile
// ```
// { uid: String
// , name : String
// , email : String
// , address : Address
// , phone: String
// , address: Address
// , isBlocked: Bool
// }
// ```
//
// #### Address
// ```
// { street: String
// , more: String
// , city: String
// , country: String
// , postalCode: String
// }
// ```
