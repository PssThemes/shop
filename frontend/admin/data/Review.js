export default class Review {

  constructor(id, value, messsage, clientId, replies) {

    if (!id || id == "") {
      throw new Error("invalid Review id", id);

    } else if (!clientId || clientId == "") {
      throw new Error("invalid client id", clientId);
    }

    this.id = id;
    this.value = value || null;
    this.messsage = messsage || "";
    this.clientId = clientId;
    this.replies = replies || {};
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