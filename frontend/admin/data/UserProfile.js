export default class UserProfile {

  constructor(profileData) {

    if(!profileData.uid ||  profileData.uid == ""){
      throw new Error("profile data does not contain a proper uid field: ", profileData.uid);
    }
    
    this.uid = profileData.uid;
    this.name =  profileData.name ||  "anonim user";
    this.email =  profileData.email || "";

  }

  getData(){
    return {
      name: this.name,
      email: this.email
    }
  }

}
