import Reply from "./Reply.js"

export default class Review {

  constructor(reviewData) {
    if(!reviewData){
      throw new Error("Invalid value passed to Review constructor");
    }

    if (!reviewData.id || reviewData.id == "") {
      throw new Error("invalid Review id", reviewData.id);
    } else if (!reviewData.clientId || reviewData.clientId == "") {
      throw new Error("invalid client id", reviewData.clientId);
    }

    let replies = {};
    if(reviewData.replies){

      replies = Object.keys(reviewData.replies).reduce((acc, key) =>{
        const replyData = reviewData.replies[key];
        replyData.id = key;
        acc[key] = new Reply(replyData);
        return acc;
      }, {});
    }

    this.id = reviewData.id;
    this.value = reviewData.value || 0;
    this.messsage = reviewData.messsage || "";
    this.clientId = reviewData.clientId;
    this.replies = replies;
  }

  getData() {
    return {
      value: this.value,
      messsage: this.messsage,
      clientId: this.clientId,
      replies: this.replies
    }
  }
}
